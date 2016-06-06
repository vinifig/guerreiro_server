'use strict';

const express = require('express');
const cors = require('cors');

const mysql = require('./lib/db');
const bodyParser = require('body-parser')
const Log = require('./lib/log');

const modules = {};
modules.users = require('./lib/modules/users');


const app = express();


// DB config/init
  var db = false;
  mysql(process.argv[2]).then(
    function(data){
      db = data;
    }, function(error){
      Log.error(error);
    }
  );


// Server req config

  // frescuras de requisição
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:false}));

  // resposta default em caso de não haver conexão com o db
  app.use(function(req,res,next){
    if(!db)
      return res.json({error: "Error stablishing database connection"});
    return res.json({success: "Database connected"});
    req.dbEntity = db;
    next();
  });


// ENDPOINTS
// Aqui começa a programação de verdade

  // GET
  app.get('/users', modules.users.getAll);
  app.get('/users/:id', modules.users.getOne);

  // POST
  // app.post('/endpoint', callback);

  // PUT
  // app.put('/endpoint', callback);

  // DELETE
  // app.delete('/endpoint', callback);

app.listen(8080);
