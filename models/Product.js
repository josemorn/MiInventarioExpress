const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  imagen: {
    type: String,
    default: '/images/default-product.png'
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  categoria: {
    type: String,
    enum: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Otros'],
    default: 'Otros'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
