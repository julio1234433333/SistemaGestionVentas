const db = require('../config/knex');

const ProductoModel = {
    
obtenerTodos: async (limit, offset) => {
    const resultado = await db('Productos')
        .count({ total: 'IdProducto' })
        .first();

    const productos = await db('Productos')
        .select('*')
        .orderBy('IdProducto', 'asc')
        .limit(limit)
        .offset(offset);

    return {
        data: productos,
        total: Number(resultado.total)
    };
},


    actualizar: async (id, producto) => {
        return await db('Productos')
            .where({ IdProducto: id })
            .update({
                Nombre: producto.Nombre,
                Descripcion: producto.Descripcion,
                Precio: producto.Precio,
                Existencia: producto.Existencia
            });
    },

    consultarInventario: async () => {
        return await db('Productos')
            .select('IdProducto', 'Nombre', 'Existencia');
    },

    actualizarExistencia: async (id, cantidad) => {
        return await db('Productos')
            .where({ IdProducto: id })
            .update({
                Existencia: cantidad
            });
    },

    eliminar: async (id) => {
        return await db('Productos')
            .where({ IdProducto: id })
            .del();
    }
};

module.exports = ProductoModel;
