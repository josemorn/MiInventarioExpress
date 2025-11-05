const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productValidation } = require('../middleware/validators');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../config/multer');

router.use(isAuthenticated);

router.get('/', productController.listProducts);
router.get('/crear', productController.showCreateForm);
router.post('/crear', upload.single('imagen'), productValidation, productController.createProduct);
router.get('/editar/:id', productController.showEditForm);
router.post('/editar/:id', upload.single('imagen'), productValidation, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
