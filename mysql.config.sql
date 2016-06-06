CREATE DATABASE IF NOT EXISTS guerreiro_app;
use guerreiro_app;

CREATE USER IF NOT EXISTS "guerreiro_app"@"localhost" IDENTIFIED BY "guerreiro123";

GRANT ALL PRIVILEGES ON guerreiro_app.* TO "guerreiro_app"@"localhost";

REVOKE CREATE ON guerreiro_app.* to "guerreiro_app"@"localhost";
REVOKE DROP ON guerreiro_app.* to "guerreiro_app"@"localhost";

CREATE TABLE IF NOT EXISTS Cliente(
  num_celular varchar(20) primary key,
  nome_cliente varchar(50) not null,
  senha varchar(32) not null,
  email varchar(100) not null,
  status_cliente int default 1
);

CREATE TABLE IF NOT EXISTS Funcionario(
  cpf_funcionario varchar(14) primary key,
  nivel_funcionario int default 1,
  nome_funcionario varchar(50) not null
);

CREATE TABLE IF NOT EXISTS Ingrediente(
  codigo_ingrediente int primary key auto_increment,
  nome_ingrediente varchar(50) not null,
  quantidadeGasta int default 0
);

CREATE TABLE IF NOT EXISTS ItemMenu(
  codigo_item int primary key auto_increment,
  nome_item varchar(50) not null,
  preco_item float(2,2) not null,
  descricao_item varchar(50) not null
);


CREATE TABLE IF NOT EXISTS FormaPagamento(
  codigo_forma_pagamento int primary key auto_increment,
  nome_forma_pagamento varchar(20) not null
);

CREATE TABLE IF NOT EXISTS Pedido(
  codigo_pedido int primary key auto_increment,
  status int not null,
  observacoes_pedido TINYTEXT,
  datahora_pedido DATETIME not null,
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
      FROM [PedidosEmAberto]
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

-- PROCEDURES

DELIMITER $$

DELIMITER ;

-- TRIGGERS

DELIMITER $$

-- CREATE OR REPLACE TRIGGER  entrega_pedido
--   AFTER UPDATE ON Pedido
--   FOREACH row
--   BEGIN
--     IF(new.status = 3 AND old.status <> 3) THEN
--
--
--   END $$


DELIMITER ;
-- INSERTS

INSERT INTO Funcionario values("none", "Pedido Online")
