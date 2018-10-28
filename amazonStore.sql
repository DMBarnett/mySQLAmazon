DROP DATABASE bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT(9) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price INT(9) NOT NULL,
    stock_quantity INT(9),
    PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Comb", "Hair Care", 10, 25);
 
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Air Jordan", "Shoes", 250, 12);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Blow Dyer", "Hair Care", 50, 5);
 
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Reebok", "Shoes", 50, 75);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Hair Spray", "Hair Care", 12, 205);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Bobby pins", "Hair Care", 1, 2000);
 
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Sketchers", "Shoes", 10, 4);
  
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Socks", "Shoes", 1, 40);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Red Hat", "Hair Care", 12, 40);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Penny Loafers", "Shoes", 15, 12);