'use strict';

const mysql = require('mysql');

const mysql_host = 'localhost';
const mysql_db   = 'guerreiro_app';
const mysql_user = 'guerreiro_app';
const mysql_pass = process.argv[2];

const conn = mysql.createConnection({
  host: mysql_host,
  user: mysql_user,
  password: mysql_pass,
  database: mysql_db
});

const flags = {
  db_conn : false
}

const callbacks = {
  connection_callback : function(err){
    if(err)
      return console.log(err);
    console.log("conectado");
    flags.db_conn = true;
  }
}

conn.connect(callbacks.connection_callback);
