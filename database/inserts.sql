use GestionVoley;

INSERT INTO Usuario (id_Usuario, nombre_Usuario, contraseña_Usuario)
VALUES 
(5, 'MariaGomez', 'clave789');

CALL sp_insertar_entrenador(5, 'Joaquin Morales', 5);
CALL sp_insertar_entrenador(3, 'Carlos López', 3); 
CALL sp_insertar_entrenador(4, 'Ana Martínez', 4);

SELECT * FROM Entrenador;

CALL sp_insertar_amistoso('Amistoso UCR-UNA', 3, 5);
CALL sp_insertar_partido('Partido emocionante.','2-1','UCR Occidente','UCR Caribe');
CALL sp_insertar_partido('El equipo visitante dominó completamente.','0-3', 'UCR Caribe', 'UCR Siquirres');
CALL sp_insertar_amistoso('Amistoso UCR', 3, 6);

UPDATE Usuario
SET nombre_Usuario = 'Andy Fuller'
WHERE id_Usuario = 2;

UPDATE Usuario
SET nombre_Usuario = 'Felipe Jenkins'
WHERE id_Usuario = 3;

UPDATE Usuario
SET nombre_Usuario = 'Patrick Lisby'
WHERE id_Usuario = 4;


