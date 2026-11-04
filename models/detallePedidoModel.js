const db = require('../config/knex');

const DetallePedidoModel = {
    obtenerTodos: async () => {
        return await db('DetallePedido').select('*');
    },

    obtenerPorId: async (id) => {
        return await db('DetallePedido')
            .where({ IdDetalle: id })
            .first();
    },

    crear: async (detalle) => {
        return await db('DetallePedido').insert({
            IdPedido: detalle.IdPedido,
            IdProducto: detalle.IdProducto,
            Cantidad: detalle.Cantidad,
            PrecioUnitario: detalle.PrecioUnitario
        });
    },

    actualizar: async (id, detalle) => {
        return await db('DetallePedido')
            .where({ IdDetalle: id })
            .update({
                IdPedido: detalle.IdPedido,
                IdProducto: detalle.IdProducto,
                Cantidad: detalle.Cantidad,
                PrecioUnitario: detalle.PrecioUnitario
            });
    },

    eliminar: async (id) => {
        return await db('DetallePedido')
            .where({ IdDetalle: id })
            .del();
    }
};

module.exports = DetallePedidoModel;
