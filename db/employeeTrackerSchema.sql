DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE Department (
	id INTEGER AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
    );
    
CREATE TABLE Role (
	id INTEGER AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    dept_id INTEGER,
    PRIMARY KEY (id)
    );
    
CREATE TABLE Employee (
	id INTEGER AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id)
    );