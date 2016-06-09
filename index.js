'use strict';

const express = require('express');
const cors = require('cors');

const mysql = require('./lib/db');
const bodyParser = require('body-parser')
const Log = require('./lib/log');

const modules = {};

modules.clientes = require('./lib/modules/clientes');
modules.funcionarios = require('./lib/modules/funcionarios');
modules.itemsmenu = require('./lib/modules/items_menu');
modules.pedidos = require('./lib/modules/pedidos');


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

    app.get('/guerreiro/cliente', modules.clientes.getAll);
    app.get('/guerreiro/cliente/:celular', modules.clientes.getOne);
    app.get('/guerreiro/clienteAtivo', modules.clientes.getAllAtivo);
    app.get('/guerreiro/clienteAtivo/:celular', modules.clientes.getOneAtivo);
    app.get('/guerreiro/clientePendente', modules.clientes.getAllPendente);
    app.get('/guerreiro/clientePendente/:celular', modules.clientes.getOnePendente);

    // POST
    app.post('/guerreiro/cliente', modules.clientes.addCliente);
    app.post('/guerreiro/cliente/auth', modules.clientes.auth);

    // PUT
    app.put('/guerreiro/cliente/autoriza', modules.clientes.autorizaCliente);


    // DELETE
    app.delete('/guerreiro/cliente', modules.clientes.removeCliente);

  // FUNCIONARIOS
    // GET

    app.get('/guerreiro/funcionario', modules.funcionarios.getAll);
    app.get('/guerreiro/funcionario/:cpf', modules.funcionarios.getOne);

    // POST
    app.post('/guerreiro/funcionario', modules.funcionarios.addFuncionario);
    app.post('/guerreiro/gerente', modules.funcionarios.addGerente);
    app.post('/guerreiro/funcionario/auth', modules.funcionarios.auth);

    // PUT

    // DELETE
    app.delete('/guerreiro/funcionario', modules.funcionarios.removeFuncionario);

  // INGREDIENTES
    // GET

    app.get('/guerreiro/ingrediente', modules.itemsmenu.getAllIngredientes);
    app.get('/guerreiro/ingrediente/:codigo', modules.itemsmenu.getOneIngrediente);
    app.get('/guerreiro/itemmenu', modules.itemsmenu.getAllItensMenu);
    app.get('/guerreiro/itemmenu/:codigo', modules.itemsmenu.getOneItemMenu);

    // POST
    app.post('/guerreiro/ingrediente', modules.itemsmenu.addIngrediente);
    app.post('/guerreiro/itemmenu', modules.itemsmenu.addItemMenu);

    // PUT
    app.put('/guerreiro/ingredientemenu/add', modules.itemsmenu.adicionaIngredienteItemMenu);
    app.put('/guerreiro/ingredientemenu/remove', modules.itemsmenu.removeIngredienteItemMenu);

    // DELETE
    app.delete('/guerreiro/ingrediente', modules.itemsmenu.removeIngrediente);
    app.delete('/guerreiro/itemmenu', modules.itemsmenu.removeItemMenu);

// PEDIDOS
  // GET

  app.get('/guerreiro/pedido', modules.pedidos.getAll);
  app.get('/guerreiro/pedido/:codigo', modules.pedidos.getOne);

  // POST
  app.post('/guerreiro/pedido', modules.pedidos.addPedido);

  // PUT
  app.put('/guerreiro/pedidoitem/add', modules.pedidos.adicionaIngredientePedido);
  app.put('/guerreiro/pedidoitem/remove', modules.pedidos.removeIngredientePedido);
  app.put('/guerreiro/pedidoitem/update', modules.pedidos.atualizaIngredientePedido);
  app.put('/guerreiro/pedido/confirma', modules.pedidos.fechaPedido);
  app.put('/guerreiro/pedido/entrega', modules.pedidos.entregaPedido);

  // DELETE

app.listen(8080);
