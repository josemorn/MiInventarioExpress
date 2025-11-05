const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');
};

const isNotAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/productos');
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === 'admin') {
    return next();
  }
  res.status(403).render('error', {
    title: 'Acceso Denegado',
    message: 'No tienes permisos',
    user: req.session.userId
  });
};

module.exports = { isAuthenticated, isNotAuthenticated, isAdmin };