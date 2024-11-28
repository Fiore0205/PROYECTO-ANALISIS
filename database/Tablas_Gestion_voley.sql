-- create database GestionVoley;
use GestionVoley;
CREATE TABLE Usuario (
    id_Usuario INT PRIMARY KEY,
    nombre_Usuario VARCHAR(100) NOT NULL,
    contraseña_Usuario VARCHAR(100) NOT NULL
);

-- Tabla Entrenador
CREATE TABLE Entrenador (
    id_Entrenador INT PRIMARY KEY,
    nombre_Entrenador VARCHAR(100) NOT NULL,
	id_Usuario INT  REFERENCES Usuario(id_Usuario)

);
-- Tabla partido 
CREATE TABLE Partido (
    id_Partido INT AUTO_INCREMENT PRIMARY KEY,
    notas_Partido TEXT,
    resultado VARCHAR(100) NOT NULL,
    nombre_equipo1 VARCHAR(100) NOT NULL,
    nombre_equipo2 VARCHAR(100) NOT NULL
);
-- Tabla torneo 
CREATE TABLE Torneo (
    id_Torneo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_Torneo VARCHAR(100) NOT NULL,
    posicion_Torneo INT,
    id_Entrenador INT REFERENCES Entrenador(id_Entrenador)
);

-- Tabla Partido_Torneo
CREATE TABLE Partido_Torneo (
	id_Torneo INT REFERENCES Torneo(id_Torneo),
	id_Partido INT REFERENCES Partido(id_Partido)
);

-- Tabla liga 
CREATE TABLE Liga (
    id_Liga INT AUTO_INCREMENT PRIMARY KEY,
    nombre_Liga VARCHAR(100) NOT NULL,
    posicion_Liga INT,
	id_Entrenador INT REFERENCES Entrenador(id_Entrenador)
);
-- Tabla Partido_Liga
CREATE TABLE Partido_Liga (
	id_Liga INT REFERENCES Liga(id_Liga),
	id_Partido INT REFERENCES Partido(id_Partido)
);

-- Tabla Amistoso 
CREATE TABLE Amistoso (
    id_Amistoso INT AUTO_INCREMENT PRIMARY KEY,
    nombre_Amistoso VARCHAR(100) NOT NULL,
	id_Entrenador INT REFERENCES Entrenador(id_Entrenador),
    id_Partido INT REFERENCES Partido(id_Partido)
);

-- Tabla Partido_Amistoso
CREATE TABLE Partido_Amistoso (
	id_Amistoso INT REFERENCES Amistoso(id_Amistoso),
	id_Partido INT REFERENCES Partido(id_Partido)
);

CREATE TABLE Marcador (
    id_Set INT AUTO_INCREMENT PRIMARY KEY,
    num_Set INT NOT NULL, -- (SET 1, SET 2 O SET 3 O SI ES UN PARTIDO A 5 SETS)
    marcador_Equipo1 INT NOT NULL,
    marcador_Equipo2 INT NOT NULL,
    id_Partido INT REFERENCES Partido(id_Partido)
);