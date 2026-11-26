const VendedorModel = require('../models/vendedorModel');
const { obtenerPaginacion } = require('../utils/paginacion');
const VendedorController = {
    
obtenerTodos: async (req, res) => {
    try {
        const { page, limit, offset } =
            obtenerPaginacion(req.query);

        const resultado = await VendedorModel.obtenerTodos(
            limit,
            offset
        );

        res.json({
            data: resultado.data,
            pagination: {
                page,
                limit,
                total: resultado.total,
                totalPages: Math.ceil(resultado.total / limit)
            }
        });

    } catch (error) {
        console.error('Error al consultar vendedores:', error);

        res.status(500).json({
            mensaje: 'Error al consultar los vendedores.'
        });
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

        if (!Nombre || !Correo || !Telefono) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios.'
            });
        }

        const vendedor = await VendedorModel.crear({
            Nombre,
            Correo,
            Telefono
        });

        res.status(201).json({
            mensaje: 'Vendedor registrado correctamente.',
            vendedor
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar el vendedor.',
            error: error.message
        });
    }
},
    actualizar: async (req, res) => {
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

        const vendedor = await VendedorModel.obtenerPorId(id);

        if (!vendedor) {
            return res.status(404).json({
                mensaje: 'No se encontró el vendedor.'
            });
        }

        await VendedorModel.actualizar(id, {
            Nombre,
            Correo,
            Telefono
        });

        res.json({
            mensaje: 'Vendedor actualizado correctamente.'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el vendedor.',
            error: error.message
        });
    }
},

        eliminar: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    mensaje: 'El ID del vendedor no es válido.'
                });
            }

            const vendedor = await VendedorModel.obtenerPorId(id);

            if (!vendedor) {
                return res.status(404).json({
                    mensaje: 'No se encontró el vendedor.'
                });
            }

            await VendedorModel.eliminar(id);

            res.json({
                mensaje: 'Vendedor eliminado correctamente.'
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'No se pudo eliminar el vendedor. Puede estar relacionado con un pedido.',
                error: error.message
            });
        }
    }
};

module.exports = VendedorController;
