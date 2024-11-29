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

//crea partido de una liga
router.post('/crear_partido_liga', (req, res) => {
  const { comentario, puntos_ganador, puntos_perdedor, equipo_ganador, equipo_perdedor, nombreLiga } = req.body;
  const resultadoPartido = puntos_ganador + "-" + puntos_perdedor;

  database.query('SELECT id_Liga FROM Liga WHERE nombre_Liga = ?', [nombreLiga], (error, result) => {
    if (error) {
      console.error('Error al buscar la liga:', error);
      return res.status(500).json({ message: 'Error al buscar la liga' });
    }

    if (result.length === 0) {
      console.error('Liga no encontrada');
      return res.status(404).json({ message: 'Liga no encontrada' });
    }

    const id_Liga = result[0].id_Liga;

    database.query('CALL sp_insertar_partido(?, ?, ?, ?)', [comentario, resultadoPartido, equipo_ganador, equipo_perdedor], (error, result) => {
      if (error) {
        console.error('Error al insertar el partido:', error);
        return res.status(500).json({ message: 'Error en el servidor al insertar el partido' });
      }

      console.log('Resultado de sp_insertar_partido:', result);

      const id_Partido = result[0][0]?.id_Partido;

      if (!id_Partido) {
        console.error('ID del partido no encontrado en el resultado del SP');
        return res.status(500).json({ message: 'Error al obtener el ID del partido' });
      }

      database.query('CALL sp_insertar_partido_liga(?, ?)', [id_Liga, id_Partido], (error, result) => {
        if (error) {
          console.error('Error al asociar partido con la liga:', error);
          return res.status(500).json({ message: 'Error al asociar partido con la liga' });
        }

        console.log('Resultado de sp_insertar_partido_liga:', result);
        res.json({ message: 'Partido creado y asociado a la liga correctamente' });
      });
    });
  });
});

//crea partido de un torneo
router.post('/crear_partido_torneo', (req, res) => {
  const { comentario, puntos_ganador, puntos_perdedor, equipo_ganador, equipo_perdedor, nombreTorneo } = req.body;
  const resultadoPartido = puntos_ganador + "-" + puntos_perdedor;

  database.query('SELECT id_Torneo FROM Torneo WHERE nombre_Torneo = ?', [nombreTorneo], (error, result) => {
    if (error) {
      console.error('Error al buscar el torneo:', error);
      return res.status(500).json({ message: 'Error al buscar el torneo' });
    }

    if (result.length === 0) {
      console.error('Torneo no encontrado');
      return res.status(404).json({ message: 'Torneo no encontrada' });
    }

    const id_Torneo = result[0].id_Torneo;

    database.query('CALL sp_insertar_partido(?, ?, ?, ?)', [comentario, resultadoPartido, equipo_ganador, equipo_perdedor], (error, result) => {
      if (error) {
        console.error('Error al insertar el partido:', error);
        return res.status(500).json({ message: 'Error en el servidor al insertar el partido' });
      }

      const id_Partido = result[0][0]?.id_Partido;

      if (!id_Partido) {
        console.error('ID del partido no encontrado en el resultado del SP');
        return res.status(500).json({ message: 'Error al obtener el ID del partido' });
      }

      database.query('CALL sp_insertar_partido_torneo(?, ?)', [id_Torneo, id_Partido], (error, result) => {
        if (error) {
          console.error('Error al asociar partido con el torneo:', error);
          return res.status(500).json({ message: 'Error al asociar partido con el torneo' });
        }

        res.json({ message: 'Partido creado y asociado a el torneo correctamente' });
      });
    });
  });
});


// Ruta para obtener las ligas
router.get('/obtener_ligas', (req, res) => {

  database.query('SELECT nombre_Liga, posicion_Liga FROM Liga ORDER BY posicion_Liga', (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    res.json(results);
  });
});

// Ruta para obtener los torneos
router.get('/obtener_torneos', (req, res) => {

  database.query('SELECT nombre_Torneo, posicion_Torneo FROM Torneo ORDER BY posicion_Torneo', (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    res.json(results);
  });
});

// Ruta para obtener los amistosos
router.get('/obtener_amistosos', (req, res) => {

  database.query('SELECT nombre_Amistoso FROM Amistoso', (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    res.json(results);
  });
});

// Ruta para obtener los partidos amistosos
router.post('/obtener_partidos_amistosos', (req, res) => {
  const { nombreAmistoso } = req.body;

  if (!nombreAmistoso) {
    return res.status(400).json({ message: 'Se requiere el nombre del amistoso' });
  }

  database.query('SELECT id_Amistoso FROM Amistoso WHERE nombre_Amistoso = ?', [nombreAmistoso], (error, result) => {
    if (error) {
      console.error('Error al buscar el amistoso:', error);
      return res.status(500).json({ message: 'Error al buscar el amistoso' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Amistoso no encontrado' });
    }

    const id_Amistoso = result[0].id_Amistoso;

    const query = `
          SELECT
              P.resultado,
              P.nombre_equipo1,
              P.nombre_equipo2
          FROM 
              Partido_Amistoso PA
          INNER JOIN 
              Partido P ON PA.id_Partido = P.id_Partido
          WHERE 
              PA.id_Amistoso = ?;
      `;

    database.query(query, [id_Amistoso], (error, results) => {
      if (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      console.log('Partidos encontrados:', results);
      res.json(results);
    });
  });
});

// Ruta para modificar un torneo
router.put('/modificar_torneo', (req, res) => {
  const { nombreAntes, nombreNuevo, posicion } = req.body;

  if (!nombreAntes || !nombreNuevo || !posicion) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const query = `
      UPDATE Torneo
      SET nombre_Torneo = ?, posicion_Torneo = ?
      WHERE nombre_Torneo = ?;
  `;

  database.query(query, [nombreNuevo, posicion, nombreAntes], (error, result) => {
    if (error) {
      console.error('Error al modificar el torneo:', error);
      return res.status(500).json({ message: 'Error al modificar el torneo' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }

    res.json({ message: 'Torneo modificado exitosamente' });
  });
});

// Ruta para modificar un torneo
router.put('/modificar_liga', (req, res) => {
  const { nombreAntes, nombreNuevo, posicion } = req.body;

  if (!nombreAntes || !nombreNuevo || !posicion) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const query = `
      UPDATE Liga
      SET nombre_Liga = ?, posicion_Liga = ?
      WHERE nombre_Liga = ?;
  `;

  database.query(query, [nombreNuevo, posicion, nombreAntes], (error, result) => {
    if (error) {
      console.error('Error al modificar el torneo:', error);
      return res.status(500).json({ message: 'Error al modificar la liga' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Liga no encontrada' });
    }

    res.json({ message: 'Liga modificada exitosamente' });
  });
});

// Ruta para modificar un amistoso
router.put('/modificar_amistoso', (req, res) => {
  const { nombreAntes, nombreNuevo } = req.body;

  if (!nombreAntes || !nombreNuevo) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const query = `
      UPDATE Amistoso
      SET nombre_Amistoso = ?
      WHERE nombre_Amistoso = ?;
  `;

  database.query(query, [nombreNuevo, nombreAntes], (error, result) => {
    if (error) {
      console.error('Error al modificar el amistoso:', error);
      return res.status(500).json({ message: 'Error al modificar el amistoso' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Amistoso no encontrado' });
    }

    res.json({ message: 'Amistoso modificado exitosamente' });
  });
});

// Ruta para modificar un amistoso
// Ruta para modificar un partido
router.put('/modificar_partido', (req, res) => {
  const { ganador, comentario, perdedor } = req.body;

  // Validación de los campos
  if (!ganador || !comentario || !perdedor) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Consulta para actualizar el partido
  const query = `
      UPDATE Partido
      SET notas_Partido = ?
      WHERE nombre_equipo1 = ? AND nombre_equipo2 = ?;
  `;

  // Ejecutar la consulta
  database.query(query, [comentario, ganador, perdedor], (error, result) => {
    if (error) {
      console.error('Error al modificar el partido:', error);
      return res.status(500).json({ message: 'Error al modificar el partido' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    res.json({ message: 'Partido modificado exitosamente' });
  });
});

// Obtener partidos en una liga
router.post('/partidos_liga', async (req, res) => {
  const { nombreLiga } = req.body;
  const idUsuario = req.session.userId;

  if (!idUsuario) {
    return res.status(401).json({ message: 'No has iniciado sesión' });
  }

  try {
    const idLiga = await obtenerIdRelacion(nombreLiga, 'liga', idUsuario);

    if (!idLiga) {
      return res.status(404).json({ message: 'Liga no encontrada o no asociada al usuario' });
    }

    const query = `
      SELECT
          P.resultado,
          P.nombre_equipo1,
          P.nombre_equipo2
      FROM 
          Partido_Liga PL
      INNER JOIN 
          Partido P ON PL.id_Partido = P.id_Partido
      WHERE 
          PL.id_Liga = ?;
    `;

    database.query(query, [idLiga], (error, results) => {
      if (error) {
        console.error('Error al obtener partidos de liga:', error);
        return res.status(500).json({ message: 'Error al obtener los partidos de liga' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error('Error en /partidos_liga:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Eliminar una liga por ID
router.delete('/eliminar_liga/:id', (req, res) => {
  const id = req.params.id;

  database.query('DELETE FROM Liga WHERE id_Liga = ?', [id], (error, result) => {
    if (error) {
      console.error('Error al eliminar la liga:', error);
      return res.status(500).json({ message: 'Error al eliminar la liga' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Liga no encontrada' });
    }

    res.json({ message: 'Liga eliminada exitosamente' });
  });
});

// Eliminar un torneo por ID
router.delete('/eliminar_torneo/:id', (req, res) => {
  const id = req.params.id;

  database.query('DELETE FROM Torneo WHERE id_Torneo = ?', [id], (error, result) => {
    if (error) {
      console.error('Error al eliminar el torneo:', error);
      return res.status(500).json({ message: 'Error al eliminar el torneo' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }

    res.json({ message: 'Torneo eliminado exitosamente' });
  });
});

// Eliminar un partido por ID
router.delete('/eliminar_partido/:id', (req, res) => {
  const id = req.params.id;

  database.query('DELETE FROM Partido WHERE id_Partido = ?', [id], (error, result) => {
    if (error) {
      console.error('Error al eliminar el partido:', error);
      return res.status(500).json({ message: 'Error al eliminar el partido' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    res.json({ message: 'Partido eliminado exitosamente' });
  });
});

// Eliminar un amistoso por ID
router.delete('/eliminar_amistoso/:id', (req, res) => {
  const id = req.params.id;

  database.query('DELETE FROM Amistoso WHERE id_Amistoso = ?', [id], (error, result) => {
    if (error) {
      console.error('Error al eliminar el amistoso:', error);
      return res.status(500).json({ message: 'Error al eliminar el amistoso' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Amistoso no encontrado' });
    }

    res.json({ message: 'Amistoso eliminado exitosamente' });
  });
});



module.exports = router;
