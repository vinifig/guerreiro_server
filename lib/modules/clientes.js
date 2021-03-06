'use strict';
const Log = require('../log');
const md5 = require('MD5');
module.exports = {
  searchClient: function(celular, callback){
    let sql = `SELECT * FROM Cliente WHERE num_celular like ${req.dbEntity.escape(req.params.celular)} AND status_cliente <> 3;`
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return callback(err);
      return callback(null, result);
    });
  },

  // GET
  getOne : function(req, res){
    let sql = `SELECT * FROM Cliente WHERE num_celular like ${req.dbEntity.escape(req.params.celular)} AND status_cliente <> 3;`
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  getAll : function(req, res){
    req.dbEntity.query(`SELECT * FROM Cliente WHERE status_cliente <> 3;`, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },

  getOneAtivo : function(req, res){
    let sql = `SELECT * FROM ClientesAtivos WHERE num_celular like ${req.dbEntity.escape(req.params.celular)};`
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result[0]);
    });
  },

  getAllAtivo : function(req, res){
    req.dbEntity.query(`SELECT * FROM ClientesAtivos;`, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result[0]);
    });
  },

  getOnePendente : function(req, res){
    let sql = `SELECT * FROM ClientesPendentes WHERE num_celular like ${req.dbEntity.escape(req.params.celular)};`
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result[0]);
    });
  },

  getAllPendente : function(req, res){
    req.dbEntity.query(`SELECT * FROM ClientesPendentes;`, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },

  auth : function( req, res ){
    req.dbEntity.query(`SELECT * FROM ClientesAtivos WHERE num_celular like ${req.dbEntity.escape(req.body.celular)};`, function(err, result){
      if(err)
        return res.json(err);
      if(result[0] == undefined)
        return res.json([]);
      return res.json({
        result: (md5(req.body.senha) == result[0].senha)
      });
    });
  },

  // POST
  addCliente : function(req, res){
    let sql = `call cria_cliente(${req.dbEntity.escape(req.body.nome)}, ${req.dbEntity.escape(req.body.celular)}, '${md5(req.body.senha)}', ${req.dbEntity.escape(req.body.email)});`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },

  // PUT
  autorizaCliente:function(req, res){
    req.dbEntity.query(`call autoriza_cliente(${req.dbEntity.escape(req.body.celular)});`,function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    })
  },

  // DELETE
  removeCliente:function(req, res){
    req.dbEntity.query(`call remove_cliente(${req.dbEntity.escape(req.body.celular)});`,function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    })
  }
}
