
const db = require('../config/knex');

const ClienteModel = {
    obtenerTodos: async (limit, offset) => {
    const resultado = await db('Clientes')
        .count({ total: 'IdCliente' })
        .first();

    const clientes = await db('Clientes')
        .select('*')
        .orderBy('IdCliente', 'asc')
        .limit(limit)
        .offset(offset);

    return {
        data: clientes,
        total: Number(resultado.total)
    };
},

    obtenerPorId: async (id) => {
        return await db('Clientes')
            .where({ IdCliente: id })
            .first();
    },

    crear: async (cliente) => {
        return await db('Clientes').insert({
            Nombre: cliente.Nombre,
            Correo: cliente.Correo,
            Telefono: cliente.Telefono
        });
    },

    actualizar: async (id, cliente) => {
        return await db('Clientes')
            .where({ IdCliente: id })
            .update({
                Nombre: cliente.Nombre,
                Correo: cliente.Correo,
                Telefono: cliente.Telefono
            });
    },

    eliminar: async (id) => {
        return await db('Clientes')
            .where({ IdCliente: id })
            .del();
    }
};

module.exports = ClienteModel;
