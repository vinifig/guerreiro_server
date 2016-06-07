'use strict';

const express = require('express');
const cors = require('cors');

const mysql = require('./lib/db');
const bodyParser = require('body-parser')
const Log = require('./lib/log');

const modules = {};
modules.clientes = require('./lib/modules/clientes');


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
  app.use(bodyParser.urlencoded({extended:true}));

  // resposta default em caso de não haver conexão com o db
  app.use(function(req,res,next){
    if(!db)
      return res.json({error: "Error stablishing database connection"});
    // return res.json({success: "Database connected"});
    req.dbEntity = db;
    next();
  });


// ENDPOINTS
// Aqui começa a programação de verdade

  // CLIENTES
    // GET

    app.get('/cliente', modules.clientes.getAll);
    app.get('/cliente/:celular', modules.clientes.getOne);
    app.get('/clienteAtivo', modules.clientes.getAllAtivo);
    app.get('/clienteAtivo/:celular', modules.clientes.getOneAtivo);
    app.get('/clientePendente', modules.clientes.getAllPendente);
    app.get('/clientePendente/:celular', modules.clientes.getOnePendente);

    // POST
    app.post('/cliente', modules.clientes.addCliente);
    app.post('/cliente/auth', modules.clientes.auth);

    // app.post('/endpoint', callback);

    // PUT
    app.put('/cliente/autoriza', modules.clientes.autorizaCliente);
    // app.put('/endpoint', callback);

    // DELETE
    app.delete('/cliente', modules.clientes.removeCliente);
    // app.delete('/endpoint', callback);

app.listen(8080);
