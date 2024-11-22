const mysql = require('mysql2');
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'You1234',
    database: 'GestionVoley'
  });
  
  module.exports = database;