'use strict';
const Log = require('../log');
const md5 = require('MD5');
module.exports = {
  // GET
  getOneIngrediente : function(req, res){
    req.dbEntity.query(`SELECT * FROM Ingrediente WHERE codigo_ingrediente = ${req.dbEntity.escape(req.params.codigo)};`, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  getAllIngredientes : function(req, res){
    req.dbEntity.query(`SELECT * FROM Ingrediente`, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  getOneItemMenu : function(req, res){
    req.dbEntity.query(`SELECT * FROM ItemMenuIngrediente WHERE codigo_item = ${req.dbEntity.escape(req.params.codigo)};`, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  getAllItensMenu : function(req, res){
    req.dbEntity.query(`SELECT * FROM ItemMenuIngrediente`, function(err, result){
      if(err)
      return res.json(err);
      return res.json(result);
    });
  },

  // POST
  addIngrediente : function(req, res){
    let sql = `call adiciona_ingrediente(${req.dbEntity.escape(req.body.nome)});`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },

  addItemMenu : function(req, res){
    let sql = `call adiciona_item_menu(${req.dbEntity.escape(req.body.preco)}, ${req.dbEntity.escape(req.body.nome)}, ${req.dbEntity.escape(req.body.descricao)});`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },

  // PUT
  adicionaIngredienteItemMenu: function(req, res){
    req.dbEntity.query(`call adiciona_ingrediente_item(${req.dbEntity.escape(req.body.ingrediente)}, ${req.dbEntity.escape(req.body.item)}, ${req.dbEntity.escape(req.body.quantidade)});`,function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    })
  },

  removeIngredienteItemMenu: function(req, res){
    req.dbEntity.query(`call remove_ingrediente_item(${req.dbEntity.escape(req.body.ingrediente)}, ${req.dbEntity.escape(req.body.item)});`,function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    })
  },


  // DELETE
  removeIngrediente: function(req, res){
    req.dbEntity.query(`call remove_ingrediente(${req.dbEntity.escape(req.body.codigo)});`,function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    })
  },

  removeItemMenu: function(req, res){
    req.dbEntity.query(`call remove_item_menu(${req.dbEntity.escape(req.body.codigo)});`,function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    })
  }
}
