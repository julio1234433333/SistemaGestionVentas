
const db = require('../config/knex');

const ProductoModel = {
    obtenerTodos: async () => {
        return await db('Productos').select('*');
    },

    obtenerPorId: async (id) => {
        return await db('Productos')
            .where({ IdProducto: id })
            .first();
    },

    crear: async (producto) => {
        return await db('Productos')
            .insert({
                Nombre: producto.Nombre,
                Descripcion: producto.Descripcion,
                Precio: producto.Precio,
                Existencia: producto.Existencia
            });
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

    eliminar: async (id) => {
        return await db('Productos')
            .where({ IdProducto: id })
            .del();
    }
};

module.exports = ProductoModel;
