const ProductoModel = require('../models/productoModel');
const { obtenerPaginacion } = require('../utils/paginacion');

const ProductoController = {
    
obtenerTodos: async (req, res) => {
    try {
        const { page, limit, offset } =
            obtenerPaginacion(req.query);

        const resultado = await ProductoModel.obtenerTodos(
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
        console.error('Error al consultar productos:', error);

        res.status(500).json({
            mensaje: 'Error al consultar los productos.'
        });
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

        if (
            typeof Nombre !== 'string' ||
            !Nombre.trim() ||
            typeof Precio !== 'number' ||
            !Number.isFinite(Precio) ||
            Precio < 0 ||
            !Number.isInteger(Existencia) ||
            Existencia < 0
        ) {
            return res.status(400).json({
                mensaje: 'Verifica el nombre, precio y existencia del producto.'
            });
        }

        const producto = await ProductoModel.crear({
            Nombre: Nombre.trim(),
            Descripcion: Descripcion ?? null,
            Precio,
            Existencia
        });

        res.status(201).json({
            mensaje: 'Producto registrado correctamente.',
            producto
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar el producto.',
            error: error.message
        });
    }
},

    actualizar: async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { Nombre, Descripcion, Precio, Existencia } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de producto no válido.'
            });
        }

        if (
            typeof Nombre !== 'string' ||
            !Nombre.trim() ||
            typeof Precio !== 'number' ||
            !Number.isFinite(Precio) ||
            Precio < 0 ||
            !Number.isInteger(Existencia) ||
            Existencia < 0
        ) {
            return res.status(400).json({
                mensaje: 'Verifica los datos del producto.'
            });
        }

        const producto = await ProductoModel.obtenerPorId(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado.'
            });
        }

        await ProductoModel.actualizar(id, {
            Nombre: Nombre.trim(),
            Descripcion: Descripcion ?? null,
            Precio,
            Existencia
        });

        res.json({
            mensaje: 'Producto actualizado correctamente.'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el producto.',
            error: error.message
        });
    }
},

    consultarInventario: async (req, res) => {
        try {
            const inventario = await ProductoModel.consultarInventario();
            res.json(inventario);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizarInventario: async (req, res) => {
        try {
            const id = req.params.id;
            const { Existencia } = req.body;

            if (!Number.isInteger(Existencia) || Existencia < 0) {
                return res.status(400).json({
                    mensaje: 'La existencia debe ser un número entero mayor o igual a cero'
                });
            }

            const producto = await ProductoModel.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado'
                });
            }

            await ProductoModel.actualizarExistencia(id, Existencia);

            res.json({
                mensaje: 'Inventario actualizado correctamente'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    eliminar: async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: 'ID de producto no válido.'
            });
        }

        const producto = await ProductoModel.obtenerPorId(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado.'
            });
        }

        await ProductoModel.eliminar(id);

        res.json({
            mensaje: 'Producto eliminado correctamente.'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'No se pudo eliminar el producto. Puede estar relacionado con un pedido.',
            error: error.message
         });
        }
    }
};

module.exports = ProductoController;

