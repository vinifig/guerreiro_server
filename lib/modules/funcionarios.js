'use strict';
const Log = require('../log');
const md5 = require('MD5');
module.exports = {
  searchFuncionario: function(cpf, callback){
    let sql = `SELECT * FROM Funcionario WHERE cpf_funcionario like ${req.dbEntity.escape(cpf)};`
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return callback(err);
      return callback(null, result[0]);
    });
  },

  // GET
  getOne : function(req, res){
    let sql = `SELECT * FROM Funcionario WHERE cpf_funcionario like ${req.dbEntity.escape(req.params.cpf)};`
    console.log(sql);
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result[0]);
    });
  },
  getAll : function(req, res){
    req.dbEntity.query(`SELECT * FROM Funcionario;`, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },

  auth : function( req, res ){
    let sql =`SELECT * FROM Funcionario WHERE cpf_funcionario like ${req.dbEntity.escape(req.body.cpf)};`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      if(result[0] != undefined)
        return res.json([]);
      return res.json({
        result: (md5(req.body.senha) == result[0].senha_funcionario)
      });
    });
  },

  // POST
  addFuncionario : function(req, res){
    let sql = `call cadastra_funcionario(${req.dbEntity.escape(req.body.cpf)}, ${req.dbEntity.escape(req.body.nome)}, '${md5(req.body.senha)}');`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  addGerente : function(req, res){
    let sql = `call cadastra_gerente(${req.dbEntity.escape(req.body.cpf)}, ${req.dbEntity.escape(req.body.nome)}, '${md5(req.body.senha)}');`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },

  // PUT

  // DELETE
  removeFuncionario:function(req, res){
    if(req.body.cpf == "none")
      return res.json({error: "Operação não autorizada"});
    req.dbEntity.query(`call apaga_funcionario_gerente(${req.dbEntity.escape(req.body.cpf)});`,function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    })
  }
}
