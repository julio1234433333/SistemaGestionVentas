
const db = require('../config/knex');

const VendedorModel = {
    obtenerTodos: async () => {
        return await db('Vendedores').select('*');
    },

    obtenerPorId: async (id) => {
        return await db('Vendedores')
            .where({ IdVendedor: id })
            .first();
    },

    crear: async (vendedor) => {
        return await db('Vendedores')
            .insert({
                Nombre: vendedor.Nombre,
                Correo: vendedor.Correo,
                Telefono: vendedor.Telefono
            });
    },

    actualizar: async (id, vendedor) => {
        return await db('Vendedores')
            .where({ IdVendedor: id })
            .update({
                Nombre: vendedor.Nombre,
                Correo: vendedor.Correo,
                Telefono: vendedor.Telefono
            });
    },

    eliminar: async (id) => {
        return await db('Vendedores')
            .where({ IdVendedor: id })
            .del();
    }
};

module.exports = VendedorModel;
