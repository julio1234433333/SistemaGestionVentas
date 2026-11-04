
const ProductoModel = require('../models/productoModel');

const ProductoController = {
    obtenerTodos: async (req, res) => {
        try {
            const productos = await ProductoModel.obtenerTodos();
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerPorId: async (req, res) => {
        try {
            const producto = await ProductoModel.obtenerPorId(req.params.id);

            if (!producto) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado'
                });
            }

            res.json(producto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crear: async (req, res) => {
        try {
            const { Nombre, Descripcion, Precio, Existencia } = req.body;

            if (!Nombre || Precio === undefined || Existencia === undefined) {
                return res.status(400).json({
                    mensaje: 'Nombre, precio y existencia son obligatorios'
                });
            }

            await ProductoModel.crear({
                Nombre,
                Descripcion,
                Precio,
                Existencia
            });

            res.status(201).json({
                mensaje: 'Producto registrado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizar: async (req, res) => {
        try {
            const id = req.params.id;
            const { Nombre, Descripcion, Precio, Existencia } = req.body;

            const producto = await ProductoModel.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado'
                });
            }

            await ProductoModel.actualizar(id, {
                Nombre,
                Descripcion,
                Precio,
                Existencia
            });

            res.json({
                mensaje: 'Producto actualizado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminar: async (req, res) => {
        try {
            const id = req.params.id;
            const producto = await ProductoModel.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado'
                });
            }

            await ProductoModel.eliminar(id);

            res.json({
                mensaje: 'Producto eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ProductoController;
