'use strict';
const Log = require('../log');
const Utils = require('../utils');
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
      if(result.length == 0)
        return res.json({});
      let itemMenu = result[0];
      itemMenu.ingredientes = [{
        nome : result[0].nome_ingrediente,
        quantidade : result[0].quantidade
      }];
      for(let i = 1; i < result.length; i++)
        itemMenu.ingredientes.push({
          nome : result[i].nome_ingrediente,
          quantidade : result[i].quantidade
        });
      delete itemMenu.nome_ingrediente;
      delete itemMenu.quantidade;
      return res.json(itemMenu);
    });
  },
  getAllItensMenu : function(req, res){
    req.dbEntity.query(`SELECT * FROM ItemMenuIngrediente`, function(err, result){
      if(err)
        return res.json(err);
      let itensMenu = result.reduce(function(last, now){
        let index = Utils.propertyInArray(last,'codigo_item', now.codigo_item);
        if(index != -1){
          last[index].ingredientes.push({
            nome : now.nome_ingrediente,
            quantidade : now.quantidade
          })
        }
        else{
          now.ingredientes = [{
            nome : now.nome_ingrediente,
            quantidade : now.quantidade
          }];
          delete now.nome_ingrediente;
          delete now.quantidade;
          last.push(now);
        }
        return last;
      },[]);

      return res.json(itensMenu);
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
