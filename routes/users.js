var express = require('express');
var router = express.Router();
const database = require('../database/conexion');

// Ruta de autenticación
router.post('/auth', (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    alert("Por favor, llenar todos los campos");
  }

  const query = 'SELECT * FROM Usuario WHERE nombre_Usuario = ? AND contraseña_Usuario = ?';
  
  database.query(query, [usuario, contrasena], (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).send('Error en el servidor');
    }

    if (results.length > 0) {
      // Guardar el ID del usuario en la sesión
      req.session.userId = results[0].id_Usuario;
      res.redirect('/botones0.html'); // Cambia a la página deseada
    } else {
      // Usuario o contraseña incorrectos
      res.status(401).send('Usuario o contraseña incorrectos');
    }
  });
});

router.post('/crear_liga', (req, res) => {
  const { nombre_liga, posicion_liga } = req.body;
  const id_usuario = req.session.userId; // Obtener el id del usuario desde la sesión

  if (!id_usuario) {
      return res.status(401).json({ message: 'No has iniciado sesión' });
  }

  // Buscar el id_Entrenador asociado al id_Usuario
  const queryEntrenador = 'SELECT id_Entrenador FROM Entrenador WHERE id_Usuario = ?';
  database.query(queryEntrenador, [id_usuario], (error, results) => {
      if (error) {
          console.error('Error al buscar el entrenador:', error);
          return res.status(500).json({ message: 'Error en el servidor al buscar el entrenador' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No se encontró un entrenador asociado al usuario' });
      }

      const id_entrenador = results[0].id_Entrenador;

      // Llamar al procedimiento almacenado para insertar la liga
      const queryLiga = 'CALL sp_insertar_liga(?, ?, ?)';
      database.query(queryLiga, [nombre_liga, posicion_liga, id_entrenador], (error, result) => {
          if (error) {
              console.error('Error al insertar la liga:', error);
              return res.status(500).json({ message: 'Error en el servidor al insertar la liga' });
          }

          const message = result[0]?.['El id del entrenador no existe'] || 'Liga agregada correctamente';
          res.json({ message });
      });
  });
});



module.exports = router;
