const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const fs = require('fs').promises;
const path = require('path');

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'username').sort({ createdAt: -1 });
    res.render('products/list', {
      title: 'Lista de Productos',
      products,
      user: req.session.userId,
      username: req.session.username,
      userRole: req.session.userRole
    });
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.render('error', {
      title: 'Error',
      message: 'Error al cargar los productos',
      user: req.session.userId
    });
  }
};

exports.showCreateForm = (req, res) => {
  res.render('products/create', {
    title: 'Crear Producto',
    errors: [],
    formData: {},
    user: req.session.userId,
    username: req.session.username
  });
};

exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('products/create', {
      title: 'Crear Producto',
      errors: errors.array(),
      formData: req.body,
      user: req.session.userId,
      username: req.session.username
    });
  }

  try {
    const { nombre, precio, descripcion, stock, categoria } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : '/images/default-product.png';

    const product = new Product({
      nombre,
      precio,
      descripcion,
      imagen,
      stock: stock || 0,
      categoria,
      createdBy: req.session.userId
    });

    await product.save();
    res.redirect('/productos?created=true');
  } catch (error) {
    console.error('Error al crear producto:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.render('products/create', {
      title: 'Crear Producto',
      errors: [{ msg: 'Error al crear el producto' }],
      formData: req.body,
      user: req.session.userId,
      username: req.session.username
    });
  }
};

exports.showEditForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.render('error', {
        title: 'Error',
        message: 'Producto no encontrado',
        user: req.session.userId
      });
    }
    res.render('products/edit', {
      title: 'Editar Producto',
      product,
      errors: [],
      user: req.session.userId,
      username: req.session.username
    });
  } catch (error) {
    console.error('Error al cargar producto:', error);
    res.render('error', {
      title: 'Error',
      message: 'Error al cargar el producto',
      user: req.session.userId
    });
  }
};

exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const product = await Product.findById(req.params.id);
    return res.render('products/edit', {
      title: 'Editar Producto',
      product: { ...product.toObject(), ...req.body },
      errors: errors.array(),
      user: req.session.userId,
      username: req.session.username
    });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.render('error', {
        title: 'Error',
        message: 'Producto no encontrado',
        user: req.session.userId
      });
    }

    const { nombre, precio, descripcion, stock, categoria } = req.body;
    product.nombre = nombre;
    product.precio = precio;
    product.descripcion = descripcion;
    product.stock = stock || 0;
    product.categoria = categoria;

    if (req.file) {
      if (product.imagen && product.imagen !== '/images/default-product.png') {
        const oldImagePath = path.join(__dirname, '..', product.imagen);
        await fs.unlink(oldImagePath).catch(console.error);
      }
      product.imagen = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.redirect('/productos?updated=true');
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.render('products/edit', {
      title: 'Editar Producto',
      product: req.body,
      errors: [{ msg: 'Error al actualizar el producto' }],
      user: req.session.userId,
      username: req.session.username
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    if (product.imagen && product.imagen !== '/images/default-product.png') {
      const imagePath = path.join(__dirname, '..', product.imagen);
      await fs.unlink(imagePath).catch(console.error);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
  }
};
