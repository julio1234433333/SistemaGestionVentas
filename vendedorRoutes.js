const express = require('express');
const router = express.Router();

const VendedorController = require('../controllers/vendedorController');

router.get('/', VendedorController.obtenerTodos);
router.get('/:id', VendedorController.obtenerPorId);
router.post('/', VendedorController.crear);
router.put('/:id', VendedorController.actualizar);
router.delete('/:id', VendedorController.eliminar);

module.exports = router;

