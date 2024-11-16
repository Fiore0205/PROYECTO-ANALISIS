const mysql = require('mysql2');

// conexion con la base de datos
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'You1234',
    database: 'GestionVoley'
  });

// verificacion de conexion de la base de datos
database.connect((err) => {
    if(err){
        throw err;
    }
    console.log("Base de datos conectada");
})

module.exports = database;