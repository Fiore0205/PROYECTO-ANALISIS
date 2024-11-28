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
      // guarda id de dicho usuario
      req.session.userId = results[0].id_Usuario;
      res.redirect('/botones0.html'); // Cambia a la página deseada
    } else {
      res.status(401).send('Usuario o contraseña incorrectos');
    }
  });
});

// Ruta para crear liga
router.post('/crear_liga', (req, res) => {
  const { nombre_liga, posicion_liga } = req.body;
  const id_usuario = req.session.userId; // Obtener el id del usuario desde la sesión

  if (!id_usuario) {
      return res.status(401).json({ message: 'No has iniciado sesión' });
  }

  // Buscar el id_Entrenador por medio del id_Usuario
  database.query('SELECT id_Entrenador FROM Entrenador WHERE id_Usuario = ?', [id_usuario], (error, results) => {
      if (error) {
          console.error('Error al buscar el entrenador:', error);
          return res.status(500).json({ message: 'Error en el servidor al buscar el entrenador' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No se encontró un entrenador asociado al usuario' });
      }

      const id_entrenador = results[0].id_Entrenador;

      // Llamar al SP para insertar la liga
      database.query('CALL sp_insertar_liga(?, ?, ?)', [nombre_liga, posicion_liga, id_entrenador], (error, result) => {
          if (error) {
              console.error('Error al insertar la liga:', error);
              return res.status(500).json({ message: 'Error en el servidor al insertar la liga' });
          }

          const message = result[0]?.['El id del entrenador no existe'] || 'Liga agregada correctamente';
          res.json({ message });
      });
  });
});

// Ruta para crear torneo
router.post('/crear_torneo', (req, res) => {
  const { nombre_torneo, posicion_torneo } = req.body;
  const id_usuario = req.session.userId; // Obtener el id del usuario desde la sesión

  if (!id_usuario) {
      return res.status(401).json({ message: 'No has iniciado sesión' });
  }

  // Buscar el id_Entrenador por medio del id_Usuario
  database.query('SELECT id_Entrenador FROM Entrenador WHERE id_Usuario = ?', [id_usuario], (error, results) => {
      if (error) {
          console.error('Error al buscar el entrenador:', error);
          return res.status(500).json({ message: 'Error en el servidor al buscar el entrenador' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No se encontró un entrenador asociado al usuario' });
      }

      const id_entrenador = results[0].id_Entrenador;

      // Llamar al SP para insertar la liga
      database.query('CALL sp_insertar_torneo(?, ?, ?)', [nombre_torneo, posicion_torneo, id_entrenador], (error, result) => {
          if (error) {
              console.error('Error al insertar el torneo:', error);
              return res.status(500).json({ message: 'Error en el servidor al insertar el torneo' });
          }

          const message = result[0]?.['El id del entrenador no existe'] || 'Torneo agregado correctamente';
          res.json({ message });
      });
  });
});

router.post('/crear_partido', (req, res) => {
  const { comentario, puntos_ganador, puntos_perdedor, equipo_ganador, equipo_perdedor, } = req.body;
  var resultadoPartido = puntos_ganador + "-" + puntos_perdedor;

      // Llamar al SP para insertar la liga
      database.query('CALL sp_insertar_partido(?, ?, ?, ?)', [comentario, resultadoPartido, equipo_ganador, equipo_perdedor], (error, result) => {
          if (error) {
              console.error('Error al insertar el partido:', error);
              return res.status(500).json({ message: 'Error en el servidor al insertar el partido' });
          }

          const message = 'Partido agregado correctamente';
          res.json({ message });
      });
});

// Ruta para obtener las ligas
router.get('/obtener_ligas', (req, res) => {
  const query = 'SELECT nombre_Liga, posicion_Liga FROM Liga ORDER BY posicion_Liga';

  database.query(query, (error, results) => {
      if (error) {
          console.error('Error en la consulta:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      res.json(results);
  });
});

// Ruta para obtener las ligas
router.get('/obtener_torneos', (req, res) => {
  const query = 'SELECT nombre_Torneo, posicion_Torneo FROM Torneo ORDER BY posicion_Torneo';

  database.query(query, (error, results) => {
      if (error) {
          console.error('Error en la consulta:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      res.json(results);
  });
});




module.exports = router;
