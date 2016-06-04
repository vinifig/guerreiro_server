'use strict';

const mysql = require('mysql');

const mysql_host = process.argv[2];
const mysql_user = process.argv[3];
const mysql_pass = process.argv[4];

const conn = mysql.createConnection({
  host: mysql_host,
  user: mysql_user,
  password: mysql_pass,
  database: 'guerreiro_app'
});

const callbacks = {
  connection_callback : (err) => {
    if(err)
      return console.log(err);
    console.log("conectado");
  }
}


conn.connect(callbacks.connection_callback);


// conn.
