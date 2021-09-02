CREATE TABLE IF NOT EXISTS Produtos(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    valor DECIMAL(5,2) NOT NULL,
    estoque INT(50),
    tamanho VARCHAR(3),
    tipo VARCHAR(30),
    descricao VARCHAR(255),
    dataCadastro DATETIME,
    dataAtualizacao DATETIME
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

INSERT INTO Produtos(nome, valor, estoque, tamanho, tipo, descricao, dataCadastro) VALUES ("Calça", "100.00", 5, "M", "Jeans", "Calça Jeans", now());
INSERT INTO Produtos(nome, valor, estoque, tamanho, tipo, descricao, dataCadastro) VALUES ("Calça", "100.00", 3, "m", "Jeans", "Calça Jeans m", now());
INSERT INTO Produtos(nome, valor, estoque, tamanho, tipo, descricao, dataCadastro) VALUES ("Camiseta", "50.00", 3, "m", "Algodão", "Camiseta de algodão", now());
