const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.showRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Registro',
    errors: [],
    formData: {}
  });
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('auth/register', {
      title: 'Registro',
      errors: errors.array(),
      formData: req.body
    });
  }

  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Registro',
        errors: [{ msg: 'El usuario o email ya existe' }],
        formData: req.body
      });
    }

    const user = new User({ username, email, password });
    await user.save();
    res.redirect('/auth/login?registered=true');
  } catch (error) {
    console.error('Error en registro:', error);
    res.render('auth/register', {
      title: 'Registro',
      errors: [{ msg: 'Error al registrar usuario' }],
      formData: req.body
    });
  }
};

exports.showLogin = (req, res) => {
  const registered = req.query.registered === 'true';
  res.render('auth/login', {
    title: 'Iniciar Sesión',
    errors: [],
    successMessage: registered ? 'Registro exitoso. Ahora puedes iniciar sesión.' : null,
    formData: {}
  });
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'Iniciar Sesión',
      errors: errors.array(),
      formData: req.body,
      successMessage: null
    });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión',
        errors: [{ msg: 'Credenciales inválidas' }],
        formData: req.body,
        successMessage: null
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión',
        errors: [{ msg: 'Credenciales inválidas' }],
        formData: req.body,
        successMessage: null
      });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.userRole = user.role;

    const returnTo = req.session.returnTo || '/productos';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (error) {
    console.error('Error en login:', error);
    res.render('auth/login', {
      title: 'Iniciar Sesión',
      errors: [{ msg: 'Error al iniciar sesión' }],
      formData: req.body,
      successMessage: null
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Error al cerrar sesión:', err);
    res.redirect('/auth/login');
  });
};
