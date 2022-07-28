///const mysql2 = require("mysql2");
//const inquirer = require("inquirer");
import mysql2 from 'mysql2';
import inquirer from 'inquirer';
import cTable from 'console.table';
//const cTable = require('console.table');
//const sql = require("./sql");

const connection = mysql2.createConnection({
    host: 'localhost',
    //port: 3301,
    user: 'root',
    password: '',
    database: 'employeesDB'
});

connection.connect(function (err) {
    if (err) {
        console.log(err);
        throw err;
    } else {
        console.log("connected db");
        Questions();
    }
});

// function which prompts the user for what action they should take
function Questions() {

    inquirer
        .prompt([
            {
                type: "list",
                name: "Options",
                message: "How would you like to proceed?",
                choices: [
                    "View Employee(s)",
                    "View Role",
                    "View Department(s)",
                    "Add Employee",
                    "Add Role",
                    "Add Department",
                    "Update Employee",
                    "Exit"]
            }
        ])
        // we want answers.options 
        .then(answers => {
            switch (answers.Options) {
                case "View Employee(s)":
                    viewEmployee();
                    break;

                case "View Role(s)":
                    viewRole();
                    break;

                case "View Department":
                    viewDepartment();
                    break;

                case "Add Employee":
                    //console.log("add employee section");
                    addEmployee();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Update Employee":
                    updateEmployee();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function viewEmployee() {
    console.log("Viewing employees\n");

    var query =
        `SELECT * FROM employee`
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE');
        console.log('\n');
        console.table(res);
        Questions();
    });

}

function viewRole() {
    const query =
        `SELECT * FROM roles`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY ROLE');
        console.log('\n');
        console.table(res);
        Questions();
    });
}

function viewDepartment() {

    var query =
        `SELECT * FROM department`
    connection.query(query, function (err, res) {
        if (err) {
            throw err;
        } else {

            const deptChoice = res.map(data => ({
                value: data.id, name: data.name
            }));
            Department(deptChoice);
        }
    });
}

function Department(deptChoice) {

    inquirer
        .prompt([
            {
                type: "list",
                name: "deptId",
                message: "Select a Department?",
                choices: deptChoice
            }
        ])
        .then(function (answer) {
            console.log("answer ", answer.deptId);

            var query =
                `SELECT * FROM department`

            connection.query(query, answer.deptId, function (err, res) {
                if (err) throw err;

                console.table("response ", res);
                console.log(res.affectedRows + "Employees are viewed!\n");

                Questions();
            });
        });
}

function addEmployee() {

    var query =
        `SELECT roles.id, roles.title, roles.salary 
        FROM roles`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const positionChoices = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        console.log("RoleToInsert");

        promptAddEmployee(positionChoices);
    });
}

function promptAddEmployee(positionChoices) {

    inquirer
        .prompt([
            {
                type: "input",
                name: "first",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "positionId",
                message: "What is the employee's role?",
                choices: positionChoices
            },
        ])
        .then(function (answer) {
            console.log(answer);

            var query = `INSERT INTO employee SET ?`
            connection.query(query,
                {
                    firstname: answer.first,
                    lastname: answer.last,
                    role_id: answer.positionId,
                    manager_id: answer.managerId,
                },
                function (err, res) {
                    if (err) throw err;

                    console.table(res);
                    console.log(res.insertedRows + "Inserted successfully!\n");

                    Questions();
                });
        });
}


function addRole() {

    var query =
        `SELECT department.id, department.name, roles.salary FROM department`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const departmentChoices = res.map(({ id, name }) => ({
            value: id, name: `${id} ${name}`
        }));

        console.table(res);
        console.log("Department array!");

        promptAddRole(departmentChoices);
    });
}

function promptAddRole(departmentChoices) {

    inquirer
        .prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "Please input Role title"
            },
            {
                type: "input",
                name: "roleSalary",
                message: "Please input role salary"
            },
            {
                type: "list",
                name: "departmentId",
                message: "What is the Department name",
                choices: departmentChoices
            },
        ])
        .then(function (answer) {

            var query = `INSERT INTO role SET ?`

            connection.query(query, {
                title: answer.roletitle,
                salary: answer.rolesalary,
                department_id: answer.departmentId
            },
                function (err, res) {
                    if (err) throw err;

                    console.table(res);
                    console.log("Role Inserted!");

                    Questions();
                });

        });
}

function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "addDepartment",
        message: "What is the name of your department?"

    }).then(function (answer) {

        connection.query('INSERT INTO department SET ?', { department_name: answer.addDepartment }, function (err) {
            if (err) throw err;
        });

        console.log("\n Department added to database... \n");

        Questions();
    });
    var query = `SELECT d.department_id, d.department_name, d.manager_id, e.first_name 
                FROM departments d 
                INNER JOIN employees e 
                ON (d.manager_id = e.employee_id);`
}

function updateEmployee() {
    employeeArray();
}

function employeeArray() {
    console.log("Updating an employee");

    var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  JOIN role r
    ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  JOIN employee m
    ON m.id = e.manager_id`

    connection.query(query, function (err, res) {
        if (err) {
            throw err;
        } else {
            const employeeChoices = res.map(({ id, first_name, last_name }) => ({
                value: id, name: `${first_name} ${last_name}`
            }));
            console.table(res);
            console.log("employeeArray To Update!\n")

            roleArray(employeeChoices);
        }
    });
}

