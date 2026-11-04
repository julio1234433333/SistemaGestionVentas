
const db = require('../config/knex');

const PedidoModel = {
    obtenerTodos: async () => {
        return await db('Pedidos').select('*');
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
    }
};

module.exports = PedidoModel;
