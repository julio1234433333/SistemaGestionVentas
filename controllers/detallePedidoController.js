
const DetallePedidoModel = require('../models/detallePedidoModel');

const DetallePedidoController = {
    obtenerTodos: async (req, res) => {
        try {
            const detalles = await DetallePedidoModel.obtenerTodos();
            res.json(detalles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerPorId: async (req, res) => {
        try {
            const detalle = await DetallePedidoModel.obtenerPorId(req.params.id);

            if (!detalle) {
                return res.status(404).json({
                    mensaje: 'Detalle de pedido no encontrado'
                });
            }

            res.json(detalle);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crear: async (req, res) => {
        try {
            const { IdPedido, IdProducto, Cantidad, PrecioUnitario } = req.body;

            if (!IdPedido || !IdProducto || !Cantidad || PrecioUnitario === undefined) {
                return res.status(400).json({
                    mensaje: 'Todos los campos son obligatorios'
                });
            }

            await DetallePedidoModel.crear({
                IdPedido,
                IdProducto,
                Cantidad,
                PrecioUnitario
            });

            res.status(201).json({
                mensaje: 'Detalle de pedido registrado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizar: async (req, res) => {
        try {
            const id = req.params.id;
            const { IdPedido, IdProducto, Cantidad, PrecioUnitario } = req.body;

            const detalle = await DetallePedidoModel.obtenerPorId(id);

            if (!detalle) {
                return res.status(404).json({
                    mensaje: 'Detalle de pedido no encontrado'
                });
            }

            await DetallePedidoModel.actualizar(id, {
                IdPedido,
                IdProducto,
                Cantidad,
                PrecioUnitario
            });

            res.json({
                mensaje: 'Detalle de pedido actualizado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminar: async (req, res) => {
        try {
            const id = req.params.id;
            const detalle = await DetallePedidoModel.obtenerPorId(id);

            if (!detalle) {
                return res.status(404).json({
                    mensaje: 'Detalle de pedido no encontrado'
                });
            }

            await DetallePedidoModel.eliminar(id);

            res.json({
                mensaje: 'Detalle de pedido eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = DetallePedidoController;
