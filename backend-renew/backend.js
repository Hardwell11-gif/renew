const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

// Función para parsear las imágenes secundarias almacenadas en la base (JSON o CSV)
function parseImagenes(value) {
  if (!value) return [];

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // No es JSON, asumir CSV
      return value.split(',').map(v => v.trim()).filter(Boolean);
    }
  }
  if (Array.isArray(value)) return value;

  return [];
}

// Middleware para parsear JSON en cuerpos de petición
app.use(express.json());

// Carpeta uploads para imágenes
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer configuración para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Servir archivos estáticos en /uploads
app.use('/uploads', express.static(uploadDir));

// Configuración MySQL
 const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'Admin123',
   database: 'renew_BD'
 });

 db.connect(err => {
   if (err) console.error('❌ Error de conexión:', err);
   else console.log('✅ Conectado a la BD');
});

// --- RUTAS ---

// Registrar usuario
app.post('/usuarios', (req, res) => {
  const { nombres, apellidos, direccion, distrito, dni, email, celular, password } = req.body;
  const sql = `INSERT INTO usuarios (nombres, apellidos, direccion, distrito, dni, email, celular, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [nombres, apellidos, direccion, distrito, dni, email, celular, password], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Correo electrónico ya registrado' });
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Usuario registrado correctamente', id: results.insertId });
  });
});

// Login usuario
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error de servidor' });
    if (results.length === 0) return res.status(404).json({ error: 'Correo no registrado' });

    const user = results[0];
    if (user.contrasena !== password) return res.status(401).json({ error: 'Contraseña incorrecta' });

    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        direccion: user.direccion,
        distrito: user.distrito,
        celular: user.celular
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
    const { nombre, categoria, estado, genero, precioFinal, descripcion, vendedor_id } = req.body;

    const imagen = req.files['imagen'] ? req.files['imagen'][0].filename : null;
    const imagenesSecundarias = req.files['imagenesSecundarias'] 
      ? req.files['imagenesSecundarias'].map(file => file.filename) 
      : [];

    if (!nombre || !categoria || !estado || !genero || !precioFinal || !descripcion || !imagen) {
      return res.status(400).json({ error: 'Faltan campos obligatorios o imagen principal.' });
    }
    if (imagenesSecundarias.length !== 3) {
      return res.status(400).json({ error: 'Debe subir exactamente 3 imágenes secundarias.' });
    }

    const sql = `INSERT INTO productos (nombre, categoria, estado, genero, precio, descripcion, imagen, imagenes_secundarias, vendedor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
    ], (err) => {
      if (err) {
        console.error('Error al guardar producto:', err);
        return res.status(500).json({ error: 'Error al guardar el producto' });
      }
      res.status(201).json({ message: 'Producto guardado exitosamente' });
    });
  } catch (error) {
    console.error('Error en /productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
      vendedor: `${prod.nombres} ${prod.apellidos}`,
      imagen: prod.imagen ? `http://localhost:3000/uploads/${prod.imagen}` : null
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
    producto.vendedor = `${producto.nombres} ${producto.apellidos}`;
    producto.imagen = producto.imagen ? `http://localhost:3000/uploads/${producto.imagen}` : null;

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
      vendedor: `${prod.nombres} ${prod.apellidos}`,
      imagen: prod.imagen ? `http://localhost:3000/uploads/${prod.imagen}` : null
    }));
    res.json(productos);
  });
});

// Obtener productos recientes (los últimos 4)
app.get('/productos/ultimos', (req, res) => {
  const sql = `
    SELECT p.id, p.nombre, p.precio, p.estado, p.categoria, p.genero, p.imagen, u.nombres, u.apellidos
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

// Actualizar perfil de usuario
app.put('/usuarios/:id', (req, res) => {
  const userId = req.params.id;
  const { direccion, distrito, celular } = req.body;
  const sql = 'UPDATE usuarios SET direccion = ?, distrito = ?, celular = ? WHERE id = ?';
  db.query(sql, [direccion, distrito, celular, userId], (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar usuario' });
    res.json({ message: 'Datos actualizados correctamente' });
  });
});

// Cambiar contraseña de usuario
app.put('/usuarios/:id/password', (req, res) => {
  const userId = req.params.id;
  const { actual, nueva } = req.body;

  const sqlGet = 'SELECT contrasena FROM usuarios WHERE id = ?';
  db.query(sqlGet, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en servidor' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const contrasenaActual = results[0].contrasena;
    if (contrasenaActual !== actual) return res.status(400).json({ error: 'Contraseña actual incorrecta' });

    const sqlUpdate = 'UPDATE usuarios SET contrasena = ? WHERE id = ?';
    db.query(sqlUpdate, [nueva, userId], (err2) => {
      if (err2) return res.status(500).json({ error: 'Error al actualizar contraseña' });
      res.json({ message: 'Contraseña actualizada correctamente' });
    });
  });
});

// Datos usuario para resumen de compra
app.get('/usuario/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT nombres, apellidos, direccion, distrito, email FROM usuarios WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuario' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(results[0]);
  });
});

// Eliminar producto por ID y sus imágenes asociadas
app.delete('/productos/:id', (req, res) => {
  const productoId = req.params.id;

  const selectSql = 'SELECT imagen, imagenes_secundarias FROM productos WHERE id = ?';
  db.query(selectSql, [productoId], (err, results) => {
    if (err) {
      console.error('Error al obtener imágenes del producto:', err);
      return res.status(500).json({ error: 'Error al obtener imágenes' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const { imagen, imagenes_secundarias } = results[0];
    const secundarias = parseImagenes(imagenes_secundarias);

    const eliminarArchivo = (filename) => {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    };

    if (imagen) eliminarArchivo(imagen);
    secundarias.forEach(eliminarArchivo);

    const deleteSql = 'DELETE FROM productos WHERE id = ?';
    db.query(deleteSql, [productoId], (err2) => {
      if (err2) {
        console.error('Error al eliminar producto:', err2);
        return res.status(500).json({ error: 'Error al eliminar producto' });
      }

      res.json({ message: 'Producto e imágenes eliminados correctamente' });
    });
  });
  
});

// --- INICIO SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
