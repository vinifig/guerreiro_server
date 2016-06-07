CREATE DATABASE IF NOT EXISTS guerreiro_app;
use guerreiro_app;

-- CREATE USER IF NOT EXISTS "guerreiro_app"@"localhost" IDENTIFIED BY "guerreiro123";
--
-- GRANT ALL PRIVILEGES ON guerreiro_app.* TO "guerreiro_app"@"localhost";
--
-- REVOKE CREATE ON guerreiro_app.* to "guerreiro_app"@"localhost";
-- REVOKE DROP ON guerreiro_app.* to "guerreiro_app"@"localhost";

CREATE TABLE IF NOT EXISTS Cliente(
  num_celular varchar(20) primary key,
  nome_cliente varchar(50) not null,
  senha varchar(32) not null,
  email varchar(100) not null,
  status_cliente int default 1
);

CREATE TABLE IF NOT EXISTS Funcionario(
  cpf_funcionario varchar(14) primary key,
  nome_funcionario varchar(50) not null,
  senha_funcionario varchar(50) not null,
  nivel_funcionario int default 1
);

CREATE TABLE IF NOT EXISTS Ingrediente(
  codigo_ingrediente int primary key auto_increment,
  nome_ingrediente varchar(50) not null
);

CREATE TABLE IF NOT EXISTS ItemMenu(
  codigo_item int primary key auto_increment,
  nome_item varchar(50) not null,
  preco_item float(2,2) not null,
  descricao_item TINYTEXT not null
);


CREATE TABLE IF NOT EXISTS FormaPagamento(
  codigo_forma_pagamento int primary key auto_increment,
  nome_forma_pagamento varchar(20) not null
);

CREATE TABLE IF NOT EXISTS Pedido(
  codigo_pedido int primary key auto_increment,
  status int not null,
  observacoes_pedido TINYTEXT,
  datahora_pedido DATETIME not null DEFAULT NOW(),
  datahora_entrega DATETIME null,

  forma_pagamento_fk int not null,
  cliente_fk varchar(20) not null,
  funcionario_fk varchar(14) not null,

  Constraint fk_Pedido_FormaPagamento foreign key(forma_pagamento_fk) references FormaPagamento(codigo_forma_pagamento),
  Constraint fk_Pedido_Cliente foreign key(cliente_fk) references Cliente(num_celular),
  Constraint fk_Pedido_Funcionario foreign key(funcionario_fk) references Funcionario(cpf_funcionario)
);

-- RELACIONAMENTOS NxN

CREATE TABLE IF NOT EXISTS ItemIngrediente(
  codigo_item int not null,
  codigo_ingrediente int not null,
  quantidade int not null,
  Constraint pk_ItemIngrediente primary key(codigo_item, codigo_ingrediente),
  Constraint fk_ItemIngrediente_Item foreign key(codigo_item) references ItemMenu(codigo_item),
  Constraint fk_ItemIngrediente_Ingrediente foreign key(codigo_ingrediente) references Ingrediente(codigo_ingrediente)
);

CREATE TABLE IF NOT EXISTS PedidoItem(
  codigo_pedido int not null,
  codigo_item int not null,
  quantidade int not null,
  Constraint pk_PedidoItem primary key(codigo_pedido, codigo_item),
  Constraint fk_PedidoItem_Pedido foreign key(codigo_pedido) references Pedido(codigo_pedido),
  Constraint fk_PedidoItem_Item foreign key(codigo_item) references ItemMenu(codigo_item)
);

CREATE TABLE IF NOT EXISTS IngredienteGasto(
  codigo_ingrediente int not null,
  quantidade_gasta int not null,
  datahora_gasto DATETIME not null,
  Constraint fk_IngredienteGasto_Ingrediente foreign key(codigo_ingrediente) references Ingrediente(codigo_ingrediente)
);

-- FUNCTIONS GERAIS

DELIMITER $$

CREATE FUNCTION precoPedido(codigo_pedido int) RETURNS float
  BEGIN
    DECLARE preco_pedido float DEFAULT '0.0';

    SELECT sum(ItemMenu.preco_item) into preco_pedido
      FROM PedidoItem
      INNER JOIN ItemMenu
        ON ItemMenu.codigo_item=PedidoItem.codigo_item
      WHERE PedidoItem.codigo_pedido = codigo_pedido;

    RETURN preco_pedido;
  END $$

CREATE FUNCTION numeroPedidosFuncionario(cpfFuncionario varchar(14)) RETURNS int
  BEGIN
    DECLARE countPedidos int DEFAULT 0;

    SELECT count(ItemMenu.preco_item) into countPedidos
      FROM Pedido
      WHERE Pedido.funcionario_fk like cpfFuncionario;

    RETURN countPedidos;
  END $$

CREATE FUNCTION numeroPedidosOnline() RETURNS int
  BEGIN
    DECLARE countPedidos int DEFAULT 0;

    SELECT numeroPedidosFuncionario("none") into countPedidos;

    RETURN countPedidos;
  END $$

DELIMITER ;

-- VIEWS - PEDIDOS STATUS

CREATE OR REPLACE VIEW PedidosEmAberto as
  SELECT *, precoPedido(Pedido.codigo_pedido)
    FROM Pedido
    WHERE Pedido.status=1;

CREATE OR REPLACE VIEW PedidosConfirmados as
  SELECT *, precoPedido(Pedido.codigo_pedido)
    FROM Pedido
    WHERE Pedido.status=2;

CREATE OR REPLACE VIEW PedidosEntregues as
  SELECT *, precoPedido(Pedido.codigo_pedido)
    FROM Pedido
    WHERE Pedido.status=3;

-- FUNCTIONS USANDO PEDIDOS STATUS

DELIMITER $$
CREATE FUNCTION codigoPedidoAbertoCliente(telefone varchar(20)) RETURNS int
  BEGIN
    DECLARE cpa int DEFAULT -1;

    SELECT Pedido.codigo_pedido into cpa
      FROM PedidosEmAberto
      WHERE
        cliente_fk like telefone;

    RETURN cpa;

  END $$
DELIMITER ;

-- VIEWS - CLIENTES TIPOS

CREATE OR REPLACE VIEW ClientesPendentes as
  SELECT *
    FROM Cliente
    WHERE Cliente.status_cliente = 1;

CREATE OR REPLACE VIEW ClientesAtivos as
  SELECT *
    FROM Cliente
    WHERE Cliente.status_cliente = 2;

CREATE OR REPLACE VIEW ClientesApagados as
  SELECT *
    FROM Cliente
    WHERE Cliente.status_cliente = 3;

-- VIEWS - FUNCIONARIOS TIPOS

CREATE OR REPLACE VIEW FuncionariosAtendentes as
  SELECT *
    FROM Funcionario
    WHERE Funcionario.nivel_funcionario = 1;

CREATE OR REPLACE VIEW FuncionariosGerentes as
  SELECT *
    FROM Funcionario
    WHERE Funcionario.nivel_funcionario = 2;

-- VIEWS - ITEM MENU

CREATE OR REPLACE VIEW ItemMenuIngrediente as
  SELECT ItemMenu.codigo_item, ItemMenu.nome_item, ItemMenu.preco_item, ItemMenu.descricao_item,
      ItemIngrediente.quantidade, Ingrediente.nome_ingrediente
    FROM ItemMenu
    INNER JOIN ItemIngrediente ON ItemMenu.codigo_item = ItemIngrediente.codigo_item
    INNER JOIN Ingrediente ON ItemIngrediente.codigo_ingrediente = Ingrediente.codigo_ingrediente;

-- PROCEDURES

DELIMITER $$

DELIMITER ;


-- PROCEDURES

DELIMITER $$

-- PROC DE CLIENTES

CREATE PROCEDURE cria_cliente(IN nome VARCHAR(50), IN celular VARCHAR(20), IN senha VARCHAR(32), IN email VARCHAR(100) )
  BEGIN
    INSERT INTO Cliente values(celular, nome, senha, email, 1);
  END $$

CREATE PROCEDURE autoriza_cliente(IN celular VARCHAR(20))
  BEGIN
    UPDATE ClientesPendentes
    SET status_cliente = 2
    WHERE num_celular like celular;
  END $$

CREATE PROCEDURE remove_cliente(IN celular VARCHAR(20))
  BEGIN
    UPDATE Cliente
    SET status_cliente = 3
    WHERE num_celular like celular;
  END $$

-- PROC DE PEDIDOS

CREATE PROCEDURE cria_pedido( IN telefone_cliente varchar(20), IN cpf_funcionario varchar(14), IN codigo_forma_pagamento int)
  BEGIN
    INSERT INTO
      Pedido(status, forma_pagamento_fk, cliente_fk, funcionario_fk )
      VALUES
        (1, codigo_forma_pagamento, telefone_cliente, cpf_funcionario);
  END $$

CREATE PROCEDURE fecha_pedido( IN c_pedido int, IN dh_entrega DATETIME, IN obs TINYTEXT)
  BEGIN
    UPDATE PedidosEmAberto
      SET status = 2, datahora_entrega=dh_entrega, observacoes_pedido = obs
      WHERE codigo_pedido = c_pedido;
  END $$

CREATE PROCEDURE entrega_pedido( IN c_pedido int )
  BEGIN
    UPDATE PedidosConfirmados
      SET status = 3
      WHERE codigo_pedido = c_pedido;
  END $$

-- PROCs ItemMenu

CREATE PROCEDURE adiciona_item_menu( IN preco float(2,2), IN nome VARCHAR(50), IN descricao TINYTEXT )
  BEGIN
    INSERT INTO ItemMenu(nome_item, preco_item, descricao_item)
      VALUES(nome, preco, descricao);
  END $$

CREATE PROCEDURE remove_item_menu( IN codigo int )
  BEGIN
    DELETE FROM ItemMenu
      WHERE codigo_item=codigo;
  END $$

-- PROCs Ingrediente

CREATE PROCEDURE adiciona_ingrediente( IN nome varchar(50) )
  BEGIN
    INSERT INTO Ingrediente(nome_ingrediente)
      VALUES(nome);
  END $$

CREATE PROCEDURE remove_ingrediente( IN codigo int )
  BEGIN
    DELETE FROM Ingrediente
      Where codigo_ingrediente = codigo;
  END $$

-- PROCs ItemIngrediente

CREATE PROCEDURE adiciona_ingrediente_item( IN ing_codigo int, IN item_codigo int, IN qtd int )
  BEGIN
    INSERT INTO ItemIngrediente
      VALUES(item_codigo, ing_codigo, qtd);
  END $$

CREATE PROCEDURE remove_ingrediente_item( IN ing_codigo int, IN item_codigo int)
  BEGIN
    DELETE FROM ItemIngrediente
      WHERE codigo_ingrediente = ing_codigo AND codigo_item = item_codigo;
  END $$

CREATE PROCEDURE atualiza_qtd_ingrediente_item( IN ing_codigo int, IN item_codigo int, IN qtd int )
  BEGIN
    UPDATE ItemIngrediente
      SET quantidade = qtd
      WHERE codigo_ingrediente = ing_codigo AND codigo_item = item_codigo;
  END$$

-- PROCs Funcionario

CREATE PROCEDURE cadastra_funcionario(IN cpf VARCHAR(14), IN nome VARCHAR(50), IN senha VARCHAR(32))
  BEGIN
    INSERT INTO Funcionario
      VALUES(cpf, nome, senha, 1);
  END$$

CREATE PROCEDURE cadastra_gerente(IN cpf VARCHAR(14), IN nome VARCHAR(50), IN senha VARCHAR(32))
  BEGIN
    INSERT INTO Funcionario
      VALUES(cpf, nome, senha, 2);
  END$$

CREATE PROCEDURE apaga_funcionario_gerente(IN cpf varchar(14))
  BEGIN
    REMOVE FROM Funcionario
      WHERE cpf_funcionario like cpf;
  END$$

DELIMITER ;
-- TRIGGERS

DELIMITER $$

CREATE OR REPLACE TRIGGER item_menu_adicionado
  BEFORE INSERT ON PedidoItem
  FOR EACH ROW
  BEGIN
    DECLARE pedido_status int;
    SELECT Pedido.status INTO pedido_status
      FROM Pedido
      WHERE Pedido.codigo_pedido = new.codigo_pedido;
    IF(pedido_status <> 1) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = "DIE: Pedidos fechados ou entregues não podem ter seus itens alterados";
    END IF;
  END $$

CREATE OR REPLACE TRIGGER ingrediente_removido
  BEFORE Delete ON Ingrediente
  FOR EACH ROW
  BEGIN
    DELETE FROM ItemIngrediente
      WHERE ItemIngrediente.codigo_ingrediente = old.codigo_ingrediente;
  END $$

DELIMITER ;

-- INSERTS

INSERT INTO Funcionario(cpf_funcionario, nome_funcionario) values("none", "Pedido Online");
