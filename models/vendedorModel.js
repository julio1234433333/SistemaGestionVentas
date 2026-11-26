const db = require('../config/knex');

const VendedorModel = {
    
obtenerTodos: async (limit, offset) => {
    const resultado = await db('Vendedores')
        .count({ total: 'IdVendedor' })
        .first();

    const vendedores = await db('Vendedores')
        .select('*')
        .orderBy('IdVendedor', 'asc')
        .limit(limit)
        .offset(offset);

    return {
        data: vendedores,
        total: Number(resultado.total)
    };
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
