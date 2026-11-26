
const PedidoModel = require('../models/pedidoModel');
const { obtenerPaginacion } = require('../utils/paginacion');
const PedidoController = {
    obtenerTodos: async (req, res) => {
    try {
        const { page, limit, offset } = obtenerPaginacion(req.query);
        const resultado = await PedidoModel.obtenerTodos(limit, offset);

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
            mensaje: 'Error al obtener pedidos',
            error: error.message
        });
    }
},

    obtenerPorId: async (req, res) => {
        try {
            const pedido = await PedidoModel.obtenerPorId(req.params.id);

            if (!pedido) {
                return res.status(404).json({
                    mensaje: 'Pedido no encontrado'
                });
            }

            res.json(pedido);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crear: async (req, res) => {
        try {
            const { IdCliente, IdVendedor, Fecha, Total } = req.body;

            if (!IdCliente || !IdVendedor || !Fecha || Total === undefined) {
                return res.status(400).json({
                    mensaje: 'Todos los campos del pedido son obligatorios'
                });
            }

            await PedidoModel.crear({
                IdCliente,
                IdVendedor,
                Fecha,
                Total
            });

            res.status(201).json({
                mensaje: 'Pedido registrado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    procesar: async (req, res) => {
        try {
            const { IdCliente, IdVendedor, Fecha, Productos } = req.body;

            if (!IdCliente || !IdVendedor ||
                !Array.isArray(Productos) || Productos.length === 0) {
                return res.status(400).json({
                    mensaje: 'Debe indicar cliente, vendedor y al menos un producto'
                });
            }

            const resultado = await PedidoModel.procesarPedido({
                IdCliente,
                IdVendedor,
                Fecha,
                Productos
            });

            res.status(201).json(resultado);

        } catch (error) {
            res.status(error.status || 500).json({
                error: error.message
            });
        }
    },


    actualizar: async (req, res) => {
        try {
            const id = req.params.id;
            const { IdCliente, IdVendedor, Fecha, Total } = req.body;

            const pedido = await PedidoModel.obtenerPorId(id);

            if (!pedido) {
                return res.status(404).json({
                    mensaje: 'Pedido no encontrado'
                });
            }

            await PedidoModel.actualizar(id, {
                IdCliente,
                IdVendedor,
                Fecha,
                Total
            });

            res.json({
                mensaje: 'Pedido actualizado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminar: async (req, res) => {
        try {
            const id = req.params.id;
            const pedido = await PedidoModel.obtenerPorId(id);

            if (!pedido) {
                return res.status(404).json({
                    mensaje: 'Pedido no encontrado'
                });
            }

            await PedidoModel.eliminar(id);

            res.json({
                mensaje: 'Pedido eliminado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = PedidoController;
