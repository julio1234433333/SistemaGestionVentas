
const VendedorModel = require('../models/vendedorModel');

const VendedorController = {
    obtenerTodos: async (req, res) => {
        try {
            const vendedores = await VendedorModel.obtenerTodos();
            res.json(vendedores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerPorId: async (req, res) => {
        try {
            const vendedor = await VendedorModel.obtenerPorId(req.params.id);

            if (!vendedor) {
                return res.status(404).json({
                    mensaje: 'Vendedor no encontrado'
                });
            }

            res.json(vendedor);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crear: async (req, res) => {
        try {
            const { Nombre, Correo, Telefono } = req.body;

            if (!Nombre) {
                return res.status(400).json({
                    mensaje: 'El nombre del vendedor es obligatorio'
                });
            }

            await VendedorModel.crear({
                Nombre,
                Correo,
                Telefono
            });

            res.status(201).json({
                mensaje: 'Vendedor registrado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizar: async (req, res) => {
        try {
            const { Nombre, Correo, Telefono } = req.body;
            const id = req.params.id;

            const vendedor = await VendedorModel.obtenerPorId(id);

            if (!vendedor) {
                return res.status(404).json({
                    mensaje: 'Vendedor no encontrado'
                });
            }

            await VendedorModel.actualizar(id, {
                Nombre,
                Correo,
                Telefono
            });

            res.json({
                mensaje: 'Vendedor actualizado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminar: async (req, res) => {
        try {
            const id = req.params.id;

            const vendedor = await VendedorModel.obtenerPorId(id);

            if (!vendedor) {
                return res.status(404).json({
                    mensaje: 'Vendedor no encontrado'
                });
            }

            await VendedorModel.eliminar(id);

            res.json({
                mensaje: 'Vendedor eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = VendedorController;
