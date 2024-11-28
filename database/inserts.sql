use GestionVoley;

INSERT INTO Usuario (id_Usuario, nombre_Usuario, contraseña_Usuario)
VALUES 
(2, 'MariaGomez', 'clave456'),
(3, 'CarlosLopez', 'pass789'),
(4, 'AnaMartinez', 'segura321');


CALL sp_insertar_entrenador(2, 'María Gómez', 2);
CALL sp_insertar_entrenador(3, 'Carlos López', 3); 
CALL sp_insertar_entrenador(4, 'Ana Martínez', 4);

SELECT * FROM Entrenador;

SELECT nombre_Torneo, posicion_Torneo FROM Torneo ORDER BY posicion_Torneo
