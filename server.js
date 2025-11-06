require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
   runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
  
 helpers: {
  eq: (a, b) => a === b,
  formatPrice: (price) => {
    if (!price || isNaN(price)) return '$0.00';
    return `$${parseFloat(price).toFixed(2)}`;
  },
  formatDate: (date) => {
    if (!date) return 'Fecha inválida';
    return new Date(date).toLocaleDateString('es-EC');
  },
  json: (context) => JSON.stringify(context)
}

}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.userId;
  res.locals.username = req.session.username;
  res.locals.userRole = req.session.userRole;
  next();
});

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/productos');
  } else {
    res.redirect('/auth/login');
  }
});

app.use('/auth', authRoutes);
app.use('/productos', productRoutes);

app.get('/chat', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  res.render('chat', {
    title: 'Chat en Tiempo Real',
    user: req.session.userId,
    username: req.session.username
  });
});

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join', (username) => {
    activeUsers.set(socket.id, username);
    socket.broadcast.emit('user-joined', username);
    io.emit('active-users', Array.from(activeUsers.values()));
  });

  socket.on('chat-message', (data) => {
    io.emit('chat-message', {
      username: data.username,
      message: data.message,
      timestamp: new Date().toLocaleTimeString('es-EC')
    });
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('stop-typing', () => {
    socket.broadcast.emit('stop-typing');
  });

  socket.on('disconnect', () => {
    const username = activeUsers.get(socket.id);
    if (username) {
      activeUsers.delete(socket.id);
      socket.broadcast.emit('user-left', username);
      io.emit('active-users', Array.from(activeUsers.values()));
    }
    console.log('Usuario desconectado:', socket.id);
  });
});

app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página no encontrada',
    message: 'La página que buscas no existe',
    user: req.session.userId
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Error del servidor',
    message: 'Ocurrió un error en el servidor',
    user: req.session.userId
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
