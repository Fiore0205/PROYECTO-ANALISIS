-- SP --
USE GestionVoley;
DELIMITER //
-- SP de usuario
CREATE PROCEDURE sp_usuario(
    IN p_id_usuario INT,
    IN p_nombre_usuario VARCHAR(100),
    IN p_contrasena_usuario VARCHAR(100)
)
BEGIN
    -- verificar si el usuario existe
    IF EXISTS (SELECT 1 FROM Usuario WHERE nombre_usuario = p_nombre_usuario) THEN
        SELECT 'El nombre de usuario ya existe';
    ELSE
    -- se agrega nuevo usuario
        INSERT INTO Usuario (id_Usuario, nombre_Usuario, contraseña_Usuario)
        VALUES (p_id_Usuario, p_nombre_usuario, funcion_encriptar_contrasena(p_contrasena_usuario,'Gestion1234'));
        SELECT 'Usuario agregado correctamente';
    END IF;
END //
DELIMITER ;

-- funcion para encriptar contraseña
DELIMITER //
CREATE FUNCTION funcion_encriptar_contrasena(
    p_contrasena VARCHAR(100),
    p_clave VARCHAR(100)
) 
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
	IF(p_clave = 'Gestion1234') THEN
    -- encripta la contraseña usando AES_ENCRYPT y convertir a BASE64 para guardar de tipo varchar
		RETURN LEFT(TO_BASE64(AES_ENCRYPT(p_contraseña, p_clave)), 100);
    ELSE
		RETURN 'Clave para encriptar incorrecta';
    END IF;
END //
DELIMITER ;

-- funcion para desencriptar contraseña de usuario
DELIMITER //
CREATE FUNCTION funcion_desencriptar_contrasena(
    p_contrasena_encriptada VARCHAR(100),
    p_clave VARCHAR(100)
) 
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
    DECLARE desencriptado VARCHAR(100);
    
    IF(p_clave = 'Gestion1234') THEN
        -- desencripta la contraseña usando AES_DECRYPT y convertir de BASE64 a texto
        SET desencriptado = AES_DECRYPT(FROM_BASE64(p_contrasena_encriptada), p_clave);
        RETURN desencriptado;
    ELSE
        RETURN 'Clave para desencriptar incorrecta';
    END IF;
END //
DELIMITER ;

-- ejemplo para desencriptar una contrasena de un usuarios
SELECT 
    nombre_Usuario,
    funcion_desencriptar_contrasena(contraseña_Usuario, 'Gestion1234')
FROM 
    Usuario
WHERE 
    nombre_Usuario = 'usuario1';

-- SP para insercion de tabla Entrenador
DELIMITER //
CREATE PROCEDURE sp_insertar_entrenador(
    IN p_id_entrenador INT,
    IN p_nombre_entrenador VARCHAR(100),
    IN p_id_usuario INT
)
BEGIN
    -- verificar existencia de usuario
    IF EXISTS (SELECT 1 FROM Usuario WHERE id_Usuario = p_id_usuario) THEN
		INSERT INTO Entrenador (id_Entrenador, nombre_Entrenador, id_Usuario)
        VALUES (p_id_entrenador, p_nombre_entrenador, p_id_usuario);
		SELECT 'Entrenador agregado correctamente';
    ELSE
		SELECT 'El id de usuario no existe';
    END IF;
END //
DELIMITER ;

-- SP para insercion de tabla Partido
DELIMITER //
CREATE PROCEDURE sp_insertar_partido(
    IN p_notas_partido TEXT,
    IN p_resultado VARCHAR(100),
    IN p_nombre_equipo1 VARCHAR(100),
    IN p_nombre_equipo2 VARCHAR(100)
)
BEGIN
    INSERT INTO Partido (notas_Partido, resultado, nombre_equipo1, nombre_equipo2)
    VALUES (p_notas_partido, p_resultado, p_nombre_equipo1, p_nombre_equipo2);
    SELECT LAST_INSERT_ID() AS id_Partido;
    SELECT 'Partido agregado correctamente';
END //
DELIMITER ;

-- SP para insercion de tabla Torneo
DELIMITER //
CREATE PROCEDURE sp_insertar_torneo(
    IN p_nombre_torneo VARCHAR(100),
    IN p_posicion_torneo INT,
    IN p_id_entrenador INT
)
BEGIN
    -- verificar existencia de entrenador y partido
    IF EXISTS (SELECT 1 FROM Entrenador WHERE id_Entrenador = p_id_entrenador) THEN
			INSERT INTO Torneo (nombre_Torneo, posicion_Torneo, id_Entrenador)
			VALUES (p_nombre_torneo, p_posicion_torneo, p_id_entrenador);
			SELECT 'Torneo agregado correctamente';
    ELSE
		SELECT 'El id del entrenador no existe';
    END IF;
END //
DELIMITER ;

-- SP para insercion en la tabla de Partido_Torneo
DELIMITER //
CREATE PROCEDURE sp_insertar_partido_torneo(
    IN p_id_torneo INT,
    IN p_id_partido INT
)
BEGIN
    -- verificar si el torneo y partido existen
    IF EXISTS (SELECT 1 FROM Torneo WHERE id_Torneo = p_id_torneo) THEN
		IF EXISTS (SELECT 1 FROM Partido WHERE id_Partido = p_id_partido) THEN
			INSERT INTO Partido_Torneo (id_Torneo, id_Partido)
			VALUES (p_id_torneo, p_id_partido);
            SELECT 'Partido_Torneo se agregó correctamente';
        ELSE
			SELECT 'El id del partido no existe';
		END IF;	
    ELSE
        SELECT 'El id del torneo no existe';   
    END IF;
END //
DELIMITER ;

-- SP insercion de datos para la tabla Liga
DELIMITER //
CREATE PROCEDURE sp_insertar_liga(
    IN p_nombre_liga VARCHAR(100),
    IN p_posicion_liga INT,
    IN p_id_entrenador INT
)
BEGIN
    -- verificar si existe el entrenador
    IF EXISTS (SELECT 1 FROM Entrenador WHERE id_Entrenador = p_id_entrenador) THEN
        INSERT INTO Liga (nombre_Liga, posicion_Liga, id_Entrenador)
        VALUES (p_nombre_liga, p_posicion_liga, p_id_entrenador);
        SELECT 'Liga agregada correctamente';
    ELSE
        SELECT 'El id del entrenador no existe' ;
    END IF;
END //
DELIMITER ;

-- SP insercion de datos para la tabla Partido_Liga
DELIMITER //
CREATE PROCEDURE sp_insertar_partido_liga(
    IN p_id_liga INT,
    IN p_id_partido INT
)
BEGIN
    -- verificar si la liga y partido existen
    IF EXISTS (SELECT 1 FROM Liga WHERE id_Liga = p_id_liga) THEN
		IF EXISTS (SELECT 1 FROM Partido WHERE id_Partido = p_id_partido) THEN
			INSERT INTO Partido_Liga (id_Liga, id_Partido)
			VALUES (p_id_liga, p_id_partido);
            SELECT 'Partido_Liga se agregó correctamente';
        ELSE
			SELECT 'El id del partido no existe';
        END IF;  
    ELSE
		SELECT 'El id de la liga no existe';
    END IF;
END //
DELIMITER ;

-- SP insercion de datos para la tabla Amistoso
DELIMITER //
CREATE PROCEDURE sp_insertar_amistoso(
    IN p_nombre_amistoso VARCHAR(100),
    IN p_id_entrenador INT,
    IN p_id_partido INT
)
BEGIN
    -- verificar si el entrenador y partido existen
    IF EXISTS (SELECT 1 FROM Entrenador WHERE id_Entrenador = p_id_entrenador) THEN
		IF EXISTS (SELECT 1 FROM Partido WHERE id_Partido = p_id_partido) THEN
			INSERT INTO Amistoso (nombre_Amistoso, id_Entrenador, id_Partido)
			VALUES (p_nombre_amistoso, p_id_entrenador, p_id_partido);
			SELECT 'Amistoso se agregó correctamente';
		ELSE
			SELECT 'El id del partido no existe';
		END IF;   
    ELSE
		SELECT 'El id del entrenador no existe';			
    END IF;
END //
DELIMITER ;

-- SP insercion de datos para la tabla Partido_Amistoso
DELIMITER //
CREATE PROCEDURE sp_insertar_partido_amistoso(
    IN p_id_amistoso INT,
    IN p_id_partido INT
)
BEGIN
    -- verificar si amistoso y partido existen
    IF EXISTS (SELECT 1 FROM Amistoso WHERE id_Amistoso = p_id_amistoso) THEN
		IF EXISTS (SELECT 1 FROM Partido WHERE id_Partido = p_id_partido) THEN
			INSERT INTO Partido_Amistoso (id_Amistoso, id_Partido)
			VALUES (p_id_amistoso, p_id_partido);
			SELECT 'Partido_Amistoso se agregó correctamente';
		ELSE
			SELECT 'El id del partido no existe';
		END IF;
    ELSE
		SELECT 'El id del amistoso no existe';
    END IF;
END //
DELIMITER ;

-- SP insercion de datos para la tabla Marcador
DELIMITER //
CREATE PROCEDURE sp_insertar_marcador(
    IN p_num_set INT,
    IN p_marcador_equipo1 INT,
    IN p_marcador_equipo2 INT,
    IN p_id_partido INT
)
BEGIN
    -- verifica si el partido existe
    IF EXISTS (SELECT 1 FROM Partido WHERE id_Partido = p_id_partido) THEN
        INSERT INTO Marcador (num_Set, marcador_Equipo1, marcador_Equipo2, id_Partido)
        VALUES (p_num_set, p_marcador_equipo1, p_marcador_equipo2, p_id_partido);
        SELECT 'Marcador se agregó correctamente';
    ELSE
		SELECT 'El id del partido no existe';
    END IF;
END //
DELIMITER ;