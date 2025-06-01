const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

function parseImagenes(value) {
  if (!value) return [];
  
  if (typeof value === 'string') {
    try {
      // Intenta parsear JSON (si se guardó como JSON string)
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
      // Si no es array, sigue con split
    } catch {
      // No es JSON, continuar
    }
    // Si no es JSON, asume que es string separado por comas
    return value.split(',');
  }

  // Si ya es array, devolver directamente
  if (Array.isArray(value)) return value;

  // En cualquier otro caso, devolver arreglo vacío
  return [];
}

// Middleware para parsear JSON en rutas que no usen archivos
app.use(express.json());

// Carpeta para guardar uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración multer para guardar archivos en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Servir archivos estáticos
app.use('/uploads', express.static(uploadDir));

// Conexión a MySQL 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin123',
  database: 'renew_BD'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error de conexión:', err);
  } else {
    console.log('✅ Conectado a la BD');
  }
});

// ----------------- RUTAS -----------------

// Registrar usuario
app.post('/usuarios', (req, res) => {
  const { nombres, apellidos, direccion, distrito, dni, email, celular, password } = req.body;

  const sql = `
    INSERT INTO usuarios 
      (nombres, apellidos, direccion, distrito, dni, email, celular, contrasena) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nombres, apellidos, direccion, distrito, dni, email, celular, password], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Correo electrónico ya registrado' });
      }
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'Usuario registrado correctamente', id: results.insertId });
  });
});

// Iniciar sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error de servidor' });

    if (results.length === 0) return res.status(404).json({ error: 'Correo no registrado' });

    const user = results[0];
    if (user.contrasena !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        direccion: user.direccion,
        distrito: user.distrito
      }
    });
  });
});

// Crear producto con subida de imágenes
app.post('/productos', upload.fields([
  { name: 'imagen', maxCount: 1 },
  { name: 'imagenesSecundarias', maxCount: 3 }
]), (req, res) => {
  try {
    const {
      nombre,
      categoria,
      estado,
      genero,
      precioFinal,
      descripcion,
      vendedor_id
    } = req.body;

    const imagen = req.files['imagen'] ? req.files['imagen'][0].filename : null;
    const imagenesSecundarias = req.files['imagenesSecundarias'] 
      ? req.files['imagenesSecundarias'].map(file => file.filename) 
      : [];

    if (!nombre || !categoria || !estado || !genero || !precioFinal || !descripcion || !imagen || imagenesSecundarias.length !== 3) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o imágenes.' });
    }

    const sql = `
      INSERT INTO productos 
      (nombre, categoria, estado, genero, precio, descripcion, imagen, imagenes_secundarias, vendedor_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      nombre,
      categoria,
      estado,
      genero,
      precioFinal,
      descripcion,
      imagen,
      JSON.stringify(imagenesSecundarias),
      vendedor_id
    ], (err, result) => {
      if (err) {
        console.error("Error al guardar el producto:", err);
        return res.status(500).json({ error: "Error al guardar el producto" });
      }
      res.status(201).json({ message: "Producto guardado exitosamente" });
    });
  } catch (error) {
    console.error("Error en /productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener todos los productos
app.get('/productos', (req, res) => {
  const sql = `
    SELECT productos.*, usuarios.nombres, usuarios.apellidos 
    FROM productos 
    JOIN usuarios ON productos.vendedor_id = usuarios.id
    ORDER BY productos.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos' });

    const productos = results.map(prod => ({
      ...prod,
      imagenes_secundarias: parseImagenes(prod.imagenes_secundarias),
      vendedor: prod.nombres + ' ' + prod.apellidos
    }));

    res.json(productos);
  });
});

// Obtener producto por ID
app.get('/productos/:id', (req, res) => {
  const productoId = req.params.id;

  const sql = `
    SELECT productos.*, usuarios.nombres, usuarios.apellidos 
    FROM productos 
    JOIN usuarios ON productos.vendedor_id = usuarios.id
    WHERE productos.id = ?
  `;

  db.query(sql, [productoId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la consulta' });

    if (results.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    const producto = results[0];
    producto.imagenes_secundarias = parseImagenes(producto.imagenes_secundarias);
    producto.vendedor = producto.nombres + ' ' + producto.apellidos;

    res.json(producto);
  });
});

// Obtener productos por vendedor
app.get('/productos/vendedor/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT p.id, p.nombre, p.precio, p.estado, p.categoria, p.genero, p.imagen, u.nombres, u.apellidos
    FROM productos p
    JOIN usuarios u ON p.vendedor_id = u.id
    WHERE p.vendedor_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos' });
    const productos = results.map(prod => ({
      ...prod,
      vendedor: prod.nombres + " " + prod.apellidos
    }));
    res.json(productos);
  });
});

// Obtener productos recientes
app.get('/productos/ultimos', (req, res) => {
  const sql = `
    SELECT 
    p.id, p.nombre, p.precio, p.estado, p.categoria, p.genero, p.imagen, u.nombres, u.apellidos
    FROM productos p
    JOIN usuarios u ON p.vendedor_id = u.id
    ORDER BY p.fecha_creacion DESC
    LIMIT 4
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos recientes' });

    const productos = results.map(prod => ({
      ...prod,
      precioFinal: prod.precio,
      imagen: prod.imagen ? `http://localhost:3000/uploads/${prod.imagen}` : null,
      vendedor: `${prod.nombres} ${prod.apellidos}`
    }));

    res.json(productos);
  });
});

// Obtener usuario por ID
app.get('/usuarios/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT id, nombres, apellidos, direccion, distrito, celular, email FROM usuarios WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuario' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(results[0]);
  });
});

// Actualizar perfil
app.put('/usuarios/:id', (req, res) => {
  const userId = req.params.id;
  const { direccion, distrito, celular } = req.body;
  const sql = 'UPDATE usuarios SET direccion = ?, distrito = ?, celular = ? WHERE id = ?';
  db.query(sql, [direccion, distrito, celular, userId], (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar usuario' });
    res.json({ message: 'Datos actualizados correctamente' });
  });
});

// Cambiar contraseña
app.put('/usuarios/:id/password', (req, res) => {
  const userId = req.params.id;
  const { actual, nueva } = req.body;

  const sqlGet = 'SELECT contrasena FROM usuarios WHERE id = ?';
  db.query(sqlGet, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en servidor' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const contrasenaActual = results[0].contrasena;
    if (contrasenaActual !== actual) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }

    const sqlUpdate = 'UPDATE usuarios SET contrasena = ? WHERE id = ?';
    db.query(sqlUpdate, [nueva, userId], (err2) => {
      if (err2) return res.status(500).json({ error: 'Error al actualizar contraseña' });
      res.json({ message: 'Contraseña actualizada correctamente' });
    });
  });
});

// Datos de usuario para resumen de compra
app.get('/usuario/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT nombres, apellidos, direccion, distrito, email FROM usuarios WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuario' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(results[0]);
  });
});

// ------------------ INICIO ------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
