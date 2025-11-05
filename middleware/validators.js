const { body } = require('express-validator');

exports.registerValidation = [
  body('username').trim().isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres'),
  body('email').trim().isEmail().withMessage('Ingresa un email válido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  })
];

exports.loginValidation = [
  body('email').trim().isEmail().withMessage('Ingresa un email válido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
];

exports.productValidation = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 100 }),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('descripcion').trim().notEmpty().withMessage('La descripción es obligatoria').isLength({ max: 500 }),
  body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un número positivo'),
  body('categoria').notEmpty().withMessage('La categoría es obligatoria')
];
