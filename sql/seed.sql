USE employeesDB;

INSERT INTO department (department_name)
VALUES ("Product");
INSERT INTO department (department_name)
VALUES ("Engineering");
INSERT INTO department (department_name)
VALUES ("Quality Assurance");
INSERT INTO department (department_name)
VALUES ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Product Lead", 100000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("QA", 125000, 3);
INSERT INTO roles (title, salary, department_id)
VALUES ("Supervisor", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jane", "Doe", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kate", "Mellor", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Shiv", "Betts", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leen", "Hurst", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gary", "Leer", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Cruise", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Daisy", "Hooper", 1, 2);