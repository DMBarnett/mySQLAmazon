DROP DATABASE amazonStore;
CREATE DATABASE amazonStore;

USE amazonStore;

CREATE TABLE products(
    item_id INT(9) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price INT(9) NOT NULL,
    stock_quantity INT(9),
    PRIMARY KEY(id)
)

--Short users, not worried about address or full CC's info
CREATE TABLE users(
    id INT(9) NOT NULL AUTO_INCREMENT,
    userName VARCHAR(30) NOT NULL,
    age INT(3),
    credit INT(16),
    PRIMARY KEY(id)
)

--Orders table, tracks purchases
CREATE TABLE orders(
    userID INT(9),
    itemID INT(9),
    quantity INT(9),
)