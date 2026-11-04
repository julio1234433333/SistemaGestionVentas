require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { conectarDB, sql } = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

const vendedorRoutes = require('./routes/vendedorRoutes.js');
const productoRoutes = require('./routes/productoRoutes.js');
const pedidoRoutes = require('./routes/pedidoRoutes.js');
const detallePedidoRoutes = require('./routes/detallePedidoRoutes.js');

app.use('/api/vendedores-knex', vendedorRoutes);
app.use('/api/productos-knex', productoRoutes);
app.use('/api/pedidos-knex', pedidoRoutes);
app.use('/api/detalle-pedidos-knex', detallePedidoRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API del Sistema de Gestion de ventas funcionando'
    });
});

app.get('/api/vendedores', async (req, res) => {
    try {
        const pool = await conectarDB();
        const resultado = await pool.request().query(
            'SELECT * FROM Vendedores'
        );
        res.json(resultado.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/clientes', async (req, res) => {
    try {
        const pool = await conectarDB();
        const resultado = await pool.request().query(
            'SELECT * FROM Clientes'
        );
        res.json(resultado.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/productos', async (req, res) => {
    try {
        const pool = await conectarDB();
        const resultado = await pool.request().query(
            'SELECT * FROM Productos'
        );
        res.json(resultado.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

app.post('/api/clientes', async (req, res) => {
    try {
        const { Nombre, Correo, Telefono } = req.body;

        if (!Nombre || !Correo || !Telefono) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios.'
            });
        }

        const pool = await conectarDB();

        const resultado = await pool.request()
            .input('Nombre', sql.NVarChar, Nombre)
            .input('Correo', sql.NVarChar, Correo)
            .input('Telefono', sql.NVarChar, Telefono)
            .query(`
                INSERT INTO Clientes (Nombre, Correo, Telefono)
                OUTPUT INSERTED.*
                VALUES (@Nombre, @Correo, @Telefono)
            `);

        res.status(201).json({
            mensaje: 'Cliente registrado correctamente.',
            cliente: resultado.recordset[0]
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar el cliente.',
            error: error.message
        });
    }
});

app.put('/api/clientes/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { Nombre, Correo, Telefono } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de cliente no válido.'
            });
        }

        if (!Nombre || !Correo || !Telefono) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios.'
            });
        }

        const pool = await conectarDB();

        const resultado = await pool.request()
            .input('IdCliente', sql.Int, id)
            .input('Nombre', sql.NVarChar, Nombre)
            .input('Correo', sql.NVarChar, Correo)
            .input('Telefono', sql.NVarChar, Telefono)
            .query(`
                UPDATE Clientes
                SET Nombre = @Nombre,
                    Correo = @Correo,
                    Telefono = @Telefono
                WHERE IdCliente = @IdCliente;

                SELECT @@ROWCOUNT AS FilasAfectadas;
            `);

        if (resultado.recordset[0].FilasAfectadas === 0) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado.'
            });
        }

        res.json({
            mensaje: 'Cliente actualizado correctamente.'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el cliente.',
            error: error.message
        });
    }
});

app.delete('/api/clientes/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de cliente no válido.'
            });
        }

        const pool = await conectarDB();

        const resultado = await pool.request()
            .input('IdCliente', sql.Int, id)
            .query(`
                DELETE FROM Clientes
                WHERE IdCliente = @IdCliente;

                SELECT @@ROWCOUNT AS FilasAfectadas;
            `);

        if (resultado.recordset[0].FilasAfectadas === 0) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado.'
            });
        }

        res.json({
            mensaje: 'Cliente eliminado correctamente.'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el cliente. Puede estar relacionado con un pedido.',
            error: error.message
        });
    }
});

app.post('/api/productos', async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, Existencia } = req.body;

        if (
            typeof Nombre !== 'string' ||
            !Nombre.trim() ||
            typeof Precio !== 'number' ||
            !Number.isFinite(Precio) ||
            Precio < 0 ||
            !Number.isInteger(Existencia) ||
            Existencia < 0
        ) {
            return res.status(400).json({
                mensaje: 'Verifica el nombre, precio y existencia del producto.'
            });
        }

        const pool = await conectarDB();

        const resultado = await pool.request()
            .input('Nombre', sql.NVarChar(100), Nombre.trim())
            .input('Descripcion', sql.NVarChar(250), Descripcion ?? null)
            .input('Precio', sql.Decimal(10, 2), Precio)
            .input('Existencia', sql.Int, Existencia)
            .query(`
                INSERT INTO Productos
                (Nombre, Descripcion, Precio, Existencia)
                OUTPUT INSERTED.*
                VALUES
                (@Nombre, @Descripcion, @Precio, @Existencia)
            `);

        res.status(201).json({
            mensaje: 'Producto registrado correctamente.',
            producto: resultado.recordset[0]
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar el producto.',
            error: error.message
        });
    }
});

app.put('/api/productos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { Nombre, Descripcion, Precio, Existencia } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de producto no válido.'
            });
        }

        if (
            typeof Nombre !== 'string' ||
            !Nombre.trim() ||
            typeof Precio !== 'number' ||
            !Number.isFinite(Precio) ||
            Precio < 0 ||
            !Number.isInteger(Existencia) ||
            Existencia < 0
        ) {
            return res.status(400).json({
                mensaje: 'Verifica los datos del producto.'
            });
        }

        const pool = await conectarDB();

        const resultado = await pool.request()
            .input('IdProducto', sql.Int, id)
            .input('Nombre', sql.NVarChar(100), Nombre.trim())
            .input('Descripcion', sql.NVarChar(250), Descripcion ?? null)
            .input('Precio', sql.Decimal(10, 2), Precio)
            .input('Existencia', sql.Int, Existencia)
            .query(`
                UPDATE Productos
                SET Nombre = @Nombre,
                    Descripcion = @Descripcion,
                    Precio = @Precio,
                    Existencia = @Existencia
                WHERE IdProducto = @IdProducto;

                SELECT @@ROWCOUNT AS FilasAfectadas;
            `);

        if (resultado.recordset[0].FilasAfectadas === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado.'
            });
        }

        res.json({
            mensaje: 'Producto actualizado correctamente.'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el producto.',
            error: error.message
        });
    }
});

app.delete('/api/productos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de producto no válido.'
            });
        }

        const pool = await conectarDB();

        const resultado = await pool.request()
            .input('IdProducto', sql.Int, id)
            .query(`
                DELETE FROM Productos
                WHERE IdProducto = @IdProducto;

                SELECT @@ROWCOUNT AS FilasAfectadas;
            `);

        if (resultado.recordset[0].FilasAfectadas === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado.'
            });
        }

        res.json({
            mensaje: 'Producto eliminado correctamente.'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'No se pudo eliminar el producto. Puede estar relacionado con un pedido.',
            error: error.message
        });
    }
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const pool = await conectarDB();

        const resultado = await pool.request().query(`
            SELECT
                p.IdPedido,
                p.Fecha,
                c.Nombre AS Cliente,
                v.Nombre AS Vendedor,
                p.Total
            FROM Pedidos p
            INNER JOIN Clientes c
                ON p.IdCliente = c.IdCliente
            INNER JOIN Vendedores v
                ON p.IdVendedor = v.IdVendedor
            ORDER BY p.IdPedido DESC
        `);

        res.json(resultado.recordset);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar los pedidos.',
            error: error.message
        });
    }
});

app.post('/api/pedidos', async (req, res) => {
    let transaction;
    let iniciada = false;

    try {
        const { IdCliente, IdVendedor, Productos } = req.body;

        if (
            !Number.isInteger(IdCliente) || IdCliente <= 0 ||
            !Number.isInteger(IdVendedor) || IdVendedor <= 0 ||
            !Array.isArray(Productos) || Productos.length === 0
        ) {
            return res.status(400).json({
                mensaje: 'Debes indicar un cliente, un vendedor y al menos un producto.'
            });
        }

        for (const producto of Productos) {
            if (
                !Number.isInteger(producto.IdProducto) ||
                producto.IdProducto <= 0 ||
                !Number.isInteger(producto.Cantidad) ||
                producto.Cantidad <= 0
            ) {
                return res.status(400).json({
                    mensaje: 'Los productos y cantidades deben ser válidos.'
                });
            }
        }

        const ids = Productos.map(p => p.IdProducto);

        if (new Set(ids).size !== ids.length) {
            return res.status(400).json({
                mensaje: 'No puedes repetir el mismo producto en un pedido.'
            });
        }

        const pool = await conectarDB();

        transaction = new sql.Transaction(pool);
        await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
        iniciada = true;

        const cliente = await new sql.Request(transaction)
            .input('IdCliente', sql.Int, IdCliente)
            .query(`
                SELECT IdCliente
                FROM Clientes
                WHERE IdCliente = @IdCliente
            `);

        if (cliente.recordset.length === 0) {
            throw new Error('El cliente no existe.');
        }

        const vendedor = await new sql.Request(transaction)
            .input('IdVendedor', sql.Int, IdVendedor)
            .query(`
                SELECT IdVendedor
                FROM Vendedores
                WHERE IdVendedor = @IdVendedor
            `);

        if (vendedor.recordset.length === 0) {
            throw new Error('El vendedor no existe.');
        }

        let totalCentavos = 0;
        const detalles = [];

        for (const item of Productos) {
            const resultado = await new sql.Request(transaction)
                .input('IdProducto', sql.Int, item.IdProducto)
                .query(`
                    SELECT IdProducto, Nombre, Precio, Existencia
                    FROM Productos WITH (UPDLOCK, HOLDLOCK)
                    WHERE IdProducto = @IdProducto
                `);

            if (resultado.recordset.length === 0) {
                throw new Error(
                    `El producto ${item.IdProducto} no existe.`
                );
            }

            const producto = resultado.recordset[0];

            if (producto.Existencia < item.Cantidad) {
                throw new Error(
                    `No hay suficiente existencia de ${producto.Nombre}.`
                );
            }

            const precioCentavos = Math.round(
                Number(producto.Precio) * 100
            );

            const subtotalCentavos = precioCentavos * item.Cantidad;
            totalCentavos += subtotalCentavos;

            if (!Number.isSafeInteger(totalCentavos)) {
                throw new Error('El total del pedido es demasiado grande.');
            }

            detalles.push({
                IdProducto: item.IdProducto,
                Cantidad: item.Cantidad,
                PrecioUnitario: precioCentavos / 100
            });
        }

        const total = totalCentavos / 100;

        if (total > 9999999999.99) {
            throw new Error('El total supera el límite permitido.');
        }

        const pedido = await new sql.Request(transaction)
            .input('IdCliente', sql.Int, IdCliente)
            .input('IdVendedor', sql.Int, IdVendedor)
            .input('Total', sql.Decimal(12, 2), total)
            .query(`
                INSERT INTO Pedidos (IdCliente, IdVendedor, Total)
                OUTPUT INSERTED.IdPedido
                VALUES (@IdCliente, @IdVendedor, @Total)
            `);

        const IdPedido = pedido.recordset[0].IdPedido

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

        res.status(201).json({
            mensaje: 'Pedido registrado correctamente.',
            IdPedido,
            Total: total,
            Productos: detalles
        });

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

        res.status(400).json({
            mensaje: 'No se pudo registrar el pedido.',
            error: error.message
        });
    }
});

app.get('/api/pedidos/:id/detalles', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de pedido no válido.'
            });
        }

        const pool = await conectarDB();

        const pedido = await pool.request()
            .input('IdPedido', sql.Int, id)
            .query(`
                SELECT IdPedido, IdCliente, IdVendedor, Fecha, Total
                FROM Pedidos
                WHERE IdPedido = @IdPedido
            `);

        if (pedido.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Pedido no encontrado.'
            });
        }

        const resultado = await pool.request()
            .input('IdPedido', sql.Int, id)
            .query(`
                SELECT
                    d.IdDetalle,
                    d.IdPedido,
                    p.Nombre AS Producto,
                    d.Cantidad,
                    d.PrecioUnitario,
                    d.Cantidad * d.PrecioUnitario AS Subtotal
                FROM DetallePedido d
                INNER JOIN Productos p
                    ON d.IdProducto = p.IdProducto
                WHERE d.IdPedido = @IdPedido
            `);

        res.json({
            pedido: pedido.recordset[0],
            detalles: resultado.recordset
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar los detalles del pedido.',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});


app.post('/api/vendedores', async (req, res) => {
    try {
        const { Nombre, Correo, Telefono } = req.body;

        if (!Nombre || !Correo || !Telefono) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios.'
            });
        }

        const pool = await conectarDB();

        const resultado = await pool.request()
            .input('Nombre', sql.NVarChar, Nombre)
            .input('Correo', sql.NVarChar, Correo)
            .input('Telefono', sql.NVarChar, Telefono)
            .query(`
                INSERT INTO Vendedores (Nombre, Correo, Telefono)
                OUTPUT INSERTED.*
                VALUES (@Nombre, @Correo, @Telefono)
            `);

        res.status(201).json({
            mensaje: 'Vendedor registrado correctamente.',
            vendedor: resultado.recordset[0]
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar el vendedor.',
            error: error.message
        });
    }
});


app.put('/api/vendedores/:id', async (req, res) => {
    try {
        const { Nombre, Correo, Telefono } = req.body;
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del vendedor no es válido.'
            });
        }

        if (!Nombre || !Correo || !Telefono) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios.'
            });
        }

        const pool = await conectarDB();

        const resultado = await pool.request()
            .input('IdVendedor', sql.Int, id)
            .input('Nombre', sql.NVarChar, Nombre)
            .input('Correo', sql.NVarChar, Correo)
            .input('Telefono', sql.NVarChar, Telefono)
            .query(`
                UPDATE Vendedores
                SET Nombre = @Nombre,
                    Correo = @Correo,
                    Telefono = @Telefono
                WHERE IdVendedor = @IdVendedor;

                SELECT @@ROWCOUNT AS FilasAfectadas;
            `);

        if (resultado.recordset[0].FilasAfectadas === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el vendedor.'
            });
        }

        res.json({
            mensaje: 'Vendedor actualizado correctamente.'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el vendedor.',
            error: error.message
        });
    }
});

app.delete('/api/vendedores/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'El ID del vendedor no es válido.'
            });
        }

        const pool = await conectarDB();

        const resultado = await pool.request()
            .input('IdVendedor', sql.Int, id)
            .query(`
                DELETE FROM Vendedores
                WHERE IdVendedor = @IdVendedor;

                SELECT @@ROWCOUNT AS FilasAfectadas;
            `);

        if (resultado.recordset[0].FilasAfectadas === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el vendedor.'
            });
        }

        res.json({
            mensaje: 'Vendedor eliminado correctamente.'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'No se pudo eliminar el vendedor. Puede estar relacionado con un pedido.',
            error: error.message
        });
    }
});
