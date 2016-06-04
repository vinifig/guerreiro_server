'use strict';

const Promise = require('promise');
const mysql  = require('mysql');
const config = require('./config');

module.exports = function(password){
  return new Promise(function(resolve, reject){
    let pass = {password: password};
    let conn = mysql.createConnection(Object.assign(config,pass));
    conn.connect(function(err){
      if(err){
        return reject(err);
      }
      console.log("conectado");
      return resolve(conn);
    })
  })
}
