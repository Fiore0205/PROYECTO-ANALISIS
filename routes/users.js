var express = require('express');
var router = express.Router();
const database = require('../database/conexion');

// Ruta de autenticación
router.post('/auth', (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).send('Por favor, completa todos los campos');
  }

  const query = 'SELECT * FROM Usuario WHERE nombre_Usuario = ? AND contraseña_Usuario = ?';
  
  database.query(query, [usuario, contrasena], (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).send('Error en el servidor');
    }

    if (results.length > 0) {
      // Usuario autenticado correctamente
      res.redirect('/botones0.html'); // Cambia a la página deseada
    } else {
      // Usuario o contraseña incorrectos
      res.status(401).send('Usuario o contraseña incorrectos');
    }
  });
});

module.exports = router;
