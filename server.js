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
                    "View Role(s)",
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

                case "View Department(s)":
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
    connection.query(query, (err, res) => {
        if (err) {
            throw err;
        } else {

            const deptChoice = res.map(data => ({
                value: data.id, name: data.department_name
            }));

            Department(deptChoice);
        }
    });
}

function Department(deptChoice) {
    console.log(deptChoice);
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
    let positionChoices = [];
    let managerChoices = [];

    var query =
        `SELECT roles.id, roles.title, roles.salary
        FROM roles`
    connection.query(query, function (err, res) {
        if (err) throw err;

        positionChoices = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        var query =
            `SELECT * FROM employee`
        connection.query(query, function (err, res) {
            if (err) throw err;
            managerChoices = res.map(({ id, first_name, last_name }) => ({
                value: id, first_name: `${first_name}`, last_name: `${last_name}`
            }))
            console.table(res);
            promptAddEmployee(positionChoices, managerChoices);
        });
    });
}

function promptAddEmployee(positionChoices, managerChoices) {
    console.log('working');
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
            {
                type: "list",
                name: "managerSelection",
                message: "Who's the manager?",
                choices: managerChoices
            },
        ])
        .then(function (answer) {
            console.log(answer);

            var query = `INSERT INTO employee SET ?`
            connection.query(query,
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: answer.positionId,
                    manager_id: answer.managerSelection,
                },
                function (err, res) {
                    if (err) throw err;

                    console.table(res);
                    console.log("Inserted successfully!\n");

                    Questions();
                });
        });
}


function addRole() {

    var query =
        `SELECT id, department_name FROM department`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const departmentChoices = res.map(({ id, department_name }) => ({
            value: id, name: `${id} ${department_name}`
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

            var query = `INSERT INTO roles SET ?`

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
        `SELECT id, first_name, last_name, CONCAT(first_name, ' ', last_name) AS employee
  FROM employee
  JOIN roles
    ON role_id = id
  JOIN department
  ON id = department_id
  JOIN employee
    ON id = manager_id`

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

