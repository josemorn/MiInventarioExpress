# MiInventarioExpress

Sistema de gestión de inventario con autenticación y chat en tiempo real.

##  Información del Estudiante

- **Nombre:** [Tu Nombre Completo]
- **Carrera:** [Tu Carrera]
- **Universidad:** Universidad Politécnica Salesiana
- **Materia:** Aplicaciones Web

##  Funcionalidades Implementadas

###  Autenticación de Usuarios
- Registro de nuevos usuarios con validación
- Inicio de sesión seguro
- Contraseñas encriptadas con bcrypt
- Sesiones persistentes con express-session
- Middleware de autenticación para rutas protegidas

###  Gestión de Productos (CRUD Completo)
- **Crear:** Formulario para agregar nuevos productos con imagen
- **Leer:** Lista de todos los productos con diseño de tarjetas
- **Actualizar:** Edición de productos existentes
- **Eliminar:** Eliminación de productos con confirmación

###  Carga de Imágenes
- Subida de imágenes con Multer
- Validación de tipo de archivo (JPEG, PNG, GIF, WEBP)
- Límite de tamaño de 5MB
- Vista previa antes de subir
- Imagen por defecto si no se proporciona
### Validaciones
- Validación de formularios con express-validator
- Validación del lado del cliente y servidor
- Mensajes de error claros y específicos
- Sanitización de datos de entrada

###  Chat en Tiempo Real
- Chat grupal con Socket.io
- Notificaciones de usuarios conectados/desconectados
- Indicador de "escribiendo..."
- Lista de usuarios activos
- Mensajes en tiempo real

###  Arquitectura MVC
- Separación clara de modelos, vistas y controladores
- Rutas organizadas por funcionalidad
- Middleware reutilizable

##  Tecnologías Utilizadas

- **Backend:** Node.js, Express.js
- **Base de Datos:** MongoDB con Mongoose
- **Vistas:** Handlebars (express-handlebars)
- **Autenticación:** bcryptjs, express-session
- **Validaciones:** express-validator
- **Carga de Archivos:** Multer
- **Chat en Tiempo Real:** Socket.io
- **Frontend:** Bootstrap 5, Bootstrap Icons
- **Variables de Entorno:** dotenv

##  Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DE_TU_REPOSITORIO]
   cd MiInventarioExpress
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la raíz del proyecto:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/miinventario
   SESSION_SECRET=tu_secreto_super_seguro_cambialo
   ```

4. **Crear carpeta de uploads**
   ```bash
   mkdir uploads
   ```

5. **Iniciar MongoDB**
   
   Si usas MongoDB local:
   ```bash
   mongod
   ```
   
   Si usas MongoDB Atlas, actualiza el `MONGODB_URI` en `.env`

6. **Iniciar la aplicación**
   
   Modo desarrollo (con nodemon):
   ```bash
   npm run dev
   ```
   
   Modo producción:
   ```bash
   npm start
   ```

7. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

##  Estructura del Proyecto

```
MiInventarioExpress/
├── config/
│   ├── database.js          # Configuración de MongoDB
│   └── multer.js             # Configuración de Multer
├── controllers/
│   ├── authController.js     # Controlador de autenticación
│   └── productController.js  # Controlador de productos
├── middleware/
│   ├── auth.js               # Middleware de autenticación
│   └── validators.js         # Validadores
├── models/
│   ├── User.js               # Modelo de Usuario
│   └── Product.js            # Modelo de Producto
├── public/
│   ├── css/
│   │   └── style.css         # Estilos personalizados
│   ├── js/
│   │   └── main.js           # JavaScript del cliente
│   └── images/               # Imágenes estáticas
├── routes/
│   ├── authRoutes.js         # Rutas de autenticación
│   └── productRoutes.js      # Rutas de productos
├── uploads/                  # Imágenes subidas
├── views/
│   ├── layouts/
│   │   └── main.hbs          # Layout principal
│   ├── auth/
│   │   ├── login.hbs         # Vista de login
│   │   └── register.hbs      # Vista de registro
│   ├── products/
│   │   ├── list.hbs          # Lista de productos
│   │   ├── create.hbs        # Crear producto
│   │   └── edit.hbs          # Editar producto
│   ├── chat.hbs              # Chat en tiempo real
│   └── error.hbs             # Página de error
├── .env                      # Variables de entorno
├── .gitignore                # Archivos ignorados por Git
├── package.json              # Dependencias y scripts
├── server.js                 # Archivo principal
└── README.md                 # Este archivo
```

##  Pruebas

### Pruebas con Postman

1. **Registro de Usuario**
   - POST: `http://localhost:3000/auth/register`
   - Body (form-data):
     ```
     username: testuser
     email: test@example.com
     password: 123456
     confirmPassword: 123456
     ```

2. **Login**
   - POST: `http://localhost:3000/auth/login`
   - Body (form-data):
     ```
     email: test@example.com
     password: 123456
     ```

3. **Crear Producto** (requiere sesión activa)
   - POST: `http://localhost:3000/productos/crear`
   - Body (form-data):
     ```
     nombre: Laptop HP
     precio: 899.99
     descripcion: Laptop de alta gama
     stock: 10
     categoria: Electrónica
     imagen: [archivo de imagen]
     ```

4. **Listar Productos**
   - GET: `http://localhost:3000/productos`

5. **Eliminar Producto**
   - DELETE: `http://localhost:3000/productos/[ID_DEL_PRODUCTO]`

### Pruebas Manuales

1. **Registro e Inicio de Sesión**
   - Registra un nuevo usuario
   - Verifica que las contraseñas se validen
   - Inicia sesión con las credenciales

2. **CRUD de Productos**
   - Crea varios productos con diferentes categorías
   - Edita un producto existente
   - Elimina un producto
   - Verifica que las imágenes se suban correctamente

3. **Chat en Tiempo Real**
   - Abre dos navegadores/pestañas diferentes
   - Inicia sesión con diferentes usuarios
   - Envía mensajes entre usuarios
   - Verifica las notificaciones de conexión/desconexión

##  Seguridad

- Contraseñas encriptadas con bcrypt
- Validación y sanitización de entradas
- Protección contra inyección SQL (NoSQL)
- Sesiones seguras con express-session
- Middleware de autenticación en rutas protegidas

##  Notas Adicionales

- Las imágenes se almacenan en la carpeta `uploads/`
- La sesión expira después de 24 horas de inactividad
- El chat funciona solo cuando hay usuarios conectados
- Se recomienda usar MongoDB Atlas para producción

##  Autor

[Tu Nombre] - Universidad Politécnica Salesiana

##  Licencia

Este proyecto fue desarrollado con fines educativos para la materia de Aplicaciones Web.

---

**Universidad Politécnica Salesiana - 2025**