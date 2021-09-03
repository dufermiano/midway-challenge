CREATE TABLE IF NOT EXISTS PRODUCTS(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value DECIMAL(5,2) NOT NULL,
    inventory INT(50),
    size VARCHAR(3),
    type VARCHAR(30),
    description VARCHAR(255),
    registrationDate DATETIME NOT NULL,
    updateDate DATETIME
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS PURCHASE(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoiceId VARCHAR(255) NOT NULL,
    customerCPF VARCHAR(255) NOT NULL,
    dateOfPurchase DATETIME NOT NULL,
    productId INT(6) UNSIGNED NOT NULL,
    isActive BIT(1) NOT NULL,
    FOREIGN KEY (productId) REFERENCES PRODUCTS(id)

) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

INSERT INTO PRODUCTS(name, value, inventory, size, type, description, registrationDate) VALUES ("Calça", "100.00", 5, "M", "Jeans", "Calça Jeans", now());
INSERT INTO PRODUCTS(name, value, inventory, size, type, description, registrationDate) VALUES ("Calça", "100.00", 3, "m", "Jeans", "Calça Jeans m", now());
INSERT INTO PRODUCTS(name, value, inventory, size, type, description, registrationDate) VALUES ("Camiseta", "50.00", 3, "m", "Algodão", "Camiseta de algodão", now());

INSERT INTO PRODUCTS(name, value, inventory, size, type, description, registrationDate) VALUES ("Camiseta", "50.00", 2, "m", "Algodão", "Camiseta de algodão", now());
INSERT INTO PRODUCTS(name, value, inventory, size, type, description, registrationDate) VALUES ("Camiseta", "50.00", 1, "m", "Algodão", "Camiseta de algodão", now());
