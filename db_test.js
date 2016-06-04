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

var count = 1;

const callbacks = {
  connection_callback : function(err){
    if(err)
      return console.log(err);
    console.log("conectado");
    flags.db_conn = true;
  },
  insert_callback : function(err, rows){
    if(err)
      return console.log(err);
    console.log(rows);
  },
  select_callback : function(err, rows){
    if(err)
      return console.log(err);
    console.log(rows);
  },
  interval_insert: function(){
    if(!flags.db_conn)
      return;
    conn.query(`INSERT INTO test(name) values('test${count++}')`, callbacks.insert_callback)
  },
  interval_select: function(){
    if(!flags.db_conn)
      return;
    conn.query('SELECT * FROM test', callbacks.select_callback)
  }
}

conn.connect(callbacks.connection_callback);

setInterval(callbacks.interval_insert, 5000);
setInterval(callbacks.interval_select, 3000);

// conn.
