'use strict';
const Log = require('../log');
const Utils = require('../utils');

function parsePedidos(rawPedidos){
  let pedidos = rawPedidos.reduce(function(last, now){
    let index = Utils.propertyInArray(last,'codigo_pedido', now.codigo_pedido);
    if(index != -1){
      last[index].itemsMenu.push({
        codigo_item : now.codigo_item,
        nome : now.nome_item,
        quantidade : now.quantidade,
        preco : now.preco_item,
        descricao : now.descricao_item
      })
    }
    else{
      now.itemsMenu = [{
        codigo_item : now.codigo_item,
        nome : now.nome_item,
        quantidade : now.quantidade,
        preco : now.preco_item,
        descricao : now.descricao_item
      }];
      delete now.quantidade;
      delete now.nome_item;
      delete now.descricao_item;
      delete now.preco_item;
      delete now.codigo_item;
      delete now.forma_pagamento_fk;
      last.push(now);
    }
    return last;
  },[]);
  return pedidos;
}

module.exports = {
  searchPedido: function(codigo, callback){
    let sql = `SELECT * FROM PedidosComItens WHERE codigo_pedido = ${req.dbEntity.escape(codigo)}`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return callback(err);
      return callback(null, parsePedidos([0]));
    });
  },

  // GET
  getOne : function(req, res){
    let sql = `SELECT * FROM PedidosComItens WHERE codigo_pedido = ${req.dbEntity.escape(req.params.codigo)}`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      let parsedPedidos = parsePedidos(result);
      if(parsedPedidos.length == 0)
        return res.json([])
	console.log("aff")
      return res.json(parsedPedidos[0]);
    });
  },
  getAll : function(req, res){
    req.dbEntity.query(`SELECT * FROM PedidosComItens;`, function(err, result){
      if(err)
        return res.json(err);
      return res.json(parsePedidos(result));
    });
  },
  getAllSimple : function(req, res){
    req.dbEntity.query(`SELECT * FROM PedidosComPreco;`, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  // POST
  addPedido : function(req, res){
    let sql = `call cria_pedido(${req.dbEntity.escape(req.body.cliente)}, ${req.dbEntity.escape(req.body.funcionario)});`;
    console.log(sql);
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },

  // PUT
  adicionaIngredientePedido : function(req, res){
    let sql = `call adiciona_item_menu_pedido(${req.dbEntity.escape(req.body.pedido)}, ${req.dbEntity.escape(req.body.item)}, ${req.dbEntity.escape(req.body.quantidade)});`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  removeIngredientePedido : function(req, res){
    let sql = `call remove_item_menu_pedido(${req.dbEntity.escape(req.body.pedido)}, ${req.dbEntity.escape(req.body.item)});`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  atualizaIngredientePedido : function(req, res){
    let sql = `call atualiza_item_menu_pedido(${req.dbEntity.escape(req.body.pedido)}, ${req.dbEntity.escape(req.body.item)}, ${req.dbEntity.escape(req.body.quantidade)});`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  fechaPedido : function(req, res){
    let sql = `call fecha_pedido(${req.dbEntity.escape(req.body.pedido)}, ${req.dbEntity.escape(req.body.data_entrega)},  ${req.dbEntity.escape(req.body.descricao)}, ${req.dbEntity.escape(req.body.pagamento)});`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  entregaPedido : function(req, res){
    let sql = `call entrega_pedido(${req.dbEntity.escape(req.body.pedido)});`;
    req.dbEntity.query(sql, function(err, result){
      if(err)
        return res.json(err);
      return res.json(result);
    });
  },
  // DELETE

}
