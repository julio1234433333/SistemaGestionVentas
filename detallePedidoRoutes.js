
const express = require('express');
const router = express.Router();

const DetallePedidoController = require('../controllers/detallePedidoController');

router.get('/', DetallePedidoController.obtenerTodos);
router.get('/:id', DetallePedidoController.obtenerPorId);
router.post('/', DetallePedidoController.crear);
router.put('/:id', DetallePedidoController.actualizar);
router.delete('/:id', DetallePedidoController.eliminar);

module.exports = router;
