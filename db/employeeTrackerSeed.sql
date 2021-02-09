USE employee_tracker;

INSERT INTO Department (name) values ('Sales');
INSERT INTO Department (name) values ('Engineering');
INSERT INTO Department (name) values ('Finance');
INSERT INTO Department (name) values ('Legal');
INSERT INTO Department (name) values ('Administration');
INSERT INTO Department (name) values ('IT');

INSERT INTO role (title, salary, dept_id) values ('Sales Lead', 100000, 1);
INSERT INTO role (title, salary, dept_id) values ('Sales Person', 80000, 1);
INSERT INTO role (title, salary, dept_id) values ('Lead Engineer', 150000, 2);
INSERT INTO role (title, salary, dept_id) values ('Software Engineer', 120000, 2);
INSERT INTO role (title, salary, dept_id) values ('Accountant', 125000, 3);
INSERT INTO role (title, salary, dept_id) values ('Legal Team Lead', 250000, 4);
INSERT INTO role (title, salary, dept_id) values ('Lawyer', 190000, 4);
INSERT INTO role (title, salary, dept_id) values ('Assistant', 30000, 5);
INSERT INTO role (title, salary, dept_id) values ('Cybersecurity', 115000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('John', 'Doe', 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Mike', 'Chan', 2, 1);
INSERT INTO employee (first_name, last_name, role_id) values ('Ashley', 'Rodriguez', 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Kevin', 'Tupik', 4, 3);
INSERT INTO employee (first_name, last_name, role_id) values ('Malia', 'Brown', 5);
INSERT INTO employee (first_name, last_name, role_id) values ('Sarah', 'Lourd', 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Tom', 'Allen', 7, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Christian', 'Eckenrode', 3, 2);