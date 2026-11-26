const ClienteModel = require('../models/clienteModel');
const { obtenerPaginacion } = require('../utils/paginacion');

const ClienteController = {
    obtenerTodos: async (req, res) => {
    try {
        const { page, limit, offset } = obtenerPaginacion(req.query);
        const resultado = await ClienteModel.obtenerTodos(limit, offset);

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
        res.status(500).json({
            mensaje: 'Error al obtener clientes',
            error: error.message
        });
    }
},

    obtenerPorId: async (req, res) => {
        try {
            const cliente = await ClienteModel.obtenerPorId(req.params.id);

            if (!cliente) {
                return res.status(404).json({
                    mensaje: 'Cliente no encontrado'
                });
            }

            res.json(cliente);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crear: async (req, res) => {
        try {
            const { Nombre, Correo, Telefono } = req.body;

            if (!Nombre || !Correo || !Telefono) {
                return res.status(400).json({
                    mensaje: 'Todos los campos son obligatorios'
                });
            }

            await ClienteModel.crear({ Nombre, Correo, Telefono });

            res.status(201).json({
                mensaje: 'Cliente registrado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    
actualizar: async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { Nombre, Correo, Telefono } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de cliente no válido.'
            });
        }

        if (!Nombre || !Correo || !Telefono) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios.'
            });
        }

        const cliente = await ClienteModel.obtenerPorId(id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado.'
            });
        }

        await ClienteModel.actualizar(id, {
            Nombre,
            Correo,
            Telefono
        });

        res.json({
            mensaje: 'Cliente actualizado correctamente.'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el cliente.',
            error: error.message
        });
    }
},

    eliminar: async (req, res) => {
        try {
            const id = req.params.id;
            const cliente = await ClienteModel.obtenerPorId(id);

            if (!cliente) {
                return res.status(404).json({
                    mensaje: 'Cliente no encontrado'
                });
            }

            await ClienteModel.eliminar(id);

            res.json({
                mensaje: 'Cliente eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ClienteController;
