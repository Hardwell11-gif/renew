const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'Localhost',
  user: 'root',
  password: 'Admin123',
  database: 'renew_BD'
});

const uploadDir = path.join(__dirname, 'uploads');

// ✅ Función mejorada para parsear imágenes secundarias
function parseImagenes(value) {
  if (!value || value === 'null' || value === '[]' || value === '') return [];

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(img => img && img.trim());
    } catch {
      // Falló como JSON: asumir CSV
      return value.split(',').map(v => v.trim()).filter(Boolean);
    }
  }

  if (Array.isArray(value)) return value.filter(img => img && img.trim());
  return [];
}

db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    return;
  }

  const sql = 'SELECT imagen, imagenes_secundarias FROM productos';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al consultar productos:', err);
      db.end();
      return;
    }

    const usadas = new Set();

    for (const row of results) {
      if (row.imagen) usadas.add(row.imagen.trim());

      const secundarias = parseImagenes(row.imagenes_secundarias);
      secundarias.forEach(img => usadas.add(img.trim()));
    }

    fs.readdir(uploadDir, (err, archivos) => {
      if (err) {
        console.error('❌ Error al leer carpeta uploads:', err);
        db.end();
        return;
      }

      const huerfanas = archivos.filter(file => !usadas.has(file));
      if (huerfanas.length === 0) {
        console.log('✅ No hay imágenes huérfanas 🎉');
        db.end();
        return;
      }

      console.log(`⚠️ Se encontraron ${huerfanas.length} imágenes huérfanas:`);
      console.log(huerfanas);

      // ⚠️ DESCOMENTA SOLO SI CONFIRMAS
      /*
      huerfanas.forEach(file => {
        const ruta = path.join(uploadDir, file);
        fs.unlink(ruta, err => {
          if (err) console.error(`❌ Error al eliminar ${file}:`, err);
          else console.log(`✅ Eliminada: ${file}`);
        });
      });
      */

      db.end();
    });
  });
});
