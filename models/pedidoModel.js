
const db = require('../config/knex');
const { conectarDB, sql } = require('../db');

const PedidoModel = {
    obtenerTodos: async (limit, offset) => {
    const resultado = await db('Pedidos')
        .count({ total: 'IdPedido' })
        .first();

    const pedidos = await db('Pedidos')
        .select('*')
        .orderBy('IdPedido', 'asc')
        .limit(limit)
        .offset(offset);

    return {
        data: pedidos,
        total: Number(resultado.total)
    };
},

    obtenerPorId: async (id) => {
        return await db('Pedidos')
            .where({ IdPedido: id })
            .first();
    },

    crear: async (pedido) => {
        return await db('Pedidos')
            .insert({
                IdCliente: pedido.IdCliente,
                IdVendedor: pedido.IdVendedor,
                Fecha: pedido.Fecha,
                Total: pedido.Total
            });
    },

    actualizar: async (id, pedido) => {
        return await db('Pedidos')
            .where({ IdPedido: id })
            .update({
                IdCliente: pedido.IdCliente,
                IdVendedor: pedido.IdVendedor,
                Fecha: pedido.Fecha,
                Total: pedido.Total
            });
    },

    eliminar: async (id) => {
        return await db('Pedidos')
            .where({ IdPedido: id })
            .del();
    },

    procesarPedido: async (pedido) => {
        let transaction;
        let iniciada = false;

        try {
            const { IdCliente, IdVendedor, Productos } = pedido;

            // Validar datos principales
            if (
                !Number.isInteger(IdCliente) || IdCliente <= 0 ||
                !Number.isInteger(IdVendedor) || IdVendedor <= 0 ||
                !Array.isArray(Productos) || Productos.length === 0
            ) {
                const error = new Error(
                    'Debes indicar un cliente, un vendedor y al menos un producto.'
                );
                error.status = 400;
                throw error;
            }

            // Validar productos y cantidades
            for (const producto of Productos) {
                if (
                    !producto ||
                    !Number.isInteger(producto.IdProducto) ||
                    producto.IdProducto <= 0 ||
                    !Number.isInteger(producto.Cantidad) ||
                    producto.Cantidad <= 0
                ) {
                    const error = new Error(
                        'Los productos y cantidades deben ser válidos.'
                    );
                    error.status = 400;
                    throw error;
                }
            }

            // Evitar productos repetidos
            const ids = Productos.map(p => p.IdProducto);

            if (new Set(ids).size !== ids.length) {
                const error = new Error(
                    'No puedes repetir el mismo producto en un pedido.'
                );
                error.status = 400;
                throw error;
            }

            const pool = await conectarDB();

            transaction = new sql.Transaction(pool);
            await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
            iniciada = true;

            // Comprobar que exista el cliente
            const cliente = await new sql.Request(transaction)
                .input('IdCliente', sql.Int, IdCliente)
                .query(`
                    SELECT IdCliente
                    FROM Clientes
                    WHERE IdCliente = @IdCliente
                `);

            if (cliente.recordset.length === 0) {
                const error = new Error('El cliente no existe.');
                error.status = 400;
                throw error;
            }

            // Comprobar que exista el vendedor
            const vendedor = await new sql.Request(transaction)
                .input('IdVendedor', sql.Int, IdVendedor)
                .query(`
                    SELECT IdVendedor
                    FROM Vendedores
                    WHERE IdVendedor = @IdVendedor
                `);

            if (vendedor.recordset.length === 0) {
                const error = new Error('El vendedor no existe.');
                error.status = 400;
                throw error;
            }

            let totalCentavos = 0;
            const detalles = [];

            // Validar inventario y calcular total
            for (const item of Productos) {
                const resultado = await new sql.Request(transaction)
                    .input('IdProducto', sql.Int, item.IdProducto)
                    .query(`
                        SELECT IdProducto, Nombre, Precio, Existencia
                        FROM Productos WITH (UPDLOCK, HOLDLOCK)
                        WHERE IdProducto = @IdProducto
                    `);

                if (resultado.recordset.length === 0) {
                    const error = new Error(
                        `El producto ${item.IdProducto} no existe.`
                    );
                    error.status = 400;
                    throw error;
                }

                const producto = resultado.recordset[0];

                if (producto.Existencia < item.Cantidad) {
                    const error = new Error(
                        `No hay suficiente existencia de ${producto.Nombre}.`
                    );
                    error.status = 400;
                    throw error;
                }

                const precioCentavos = Math.round(
                    Number(producto.Precio) * 100
                );

                const subtotalCentavos = precioCentavos * item.Cantidad;
                totalCentavos += subtotalCentavos;

                if (!Number.isSafeInteger(totalCentavos)) {
                    const error = new Error(
                        'El total del pedido es demasiado grande.'
                    );
                    error.status = 400;
                    throw error;
                }

                detalles.push({
                    IdProducto: item.IdProducto,
                    Cantidad: item.Cantidad,
                    PrecioUnitario: precioCentavos / 100
                });
            }

            const total = totalCentavos / 100;

            if (total > 9999999999.99) {
                const error = new Error(
                    'El total supera el límite permitido.'
                );
                error.status = 400;
                throw error;
            }

            // Registrar pedido
            const pedidoRegistrado = await new sql.Request(transaction)
                .input('IdCliente', sql.Int, IdCliente)
                .input('IdVendedor', sql.Int, IdVendedor)
                .input(
                    'Fecha',
                    sql.DateTime,
                    pedido.Fecha ? new Date(pedido.Fecha) : new Date()
                )
                .input('Total', sql.Decimal(12, 2), total)
                .query(`
                    INSERT INTO Pedidos (IdCliente, IdVendedor, Fecha, Total)
                    OUTPUT INSERTED.IdPedido
                    VALUES (@IdCliente, @IdVendedor, @Fecha, @Total)
                `);

            const IdPedido = pedidoRegistrado.recordset[0].IdPedido;

            // Registrar detalles y descontar inventario
            for (const detalle of detalles) {
                await new sql.Request(transaction)
                    .input('IdPedido', sql.Int, IdPedido)
                    .input('IdProducto', sql.Int, detalle.IdProducto)
                    .input('Cantidad', sql.Int, detalle.Cantidad)
                    .input(
                        'PrecioUnitario',
                        sql.Decimal(10, 2),
                        detalle.PrecioUnitario
                    )
                    .query(`
                        INSERT INTO DetallePedido
                        (IdPedido, IdProducto, Cantidad, PrecioUnitario)
                        VALUES
                        (@IdPedido, @IdProducto, @Cantidad, @PrecioUnitario)
                    `);

                await new sql.Request(transaction)
                    .input('IdProducto', sql.Int, detalle.IdProducto)
                    .input('Cantidad', sql.Int, detalle.Cantidad)
                    .query(`
                        UPDATE Productos
                        SET Existencia = Existencia - @Cantidad
                        WHERE IdProducto = @IdProducto
                    `);
            }

            await transaction.commit();
            iniciada = false;

            return {
                mensaje: 'Pedido registrado correctamente.',
                IdPedido,
                Total: total,
                Productos: detalles
            };

        } catch (error) {
            if (transaction && iniciada) {
                try {
                    await transaction.rollback();
                } catch (rollbackError) {
                    console.error(
                        'Error al revertir la transacción:',
                        rollbackError.message
                    );
                }
            }

            throw error;
        }
    }
};

module.exports = PedidoModel;

