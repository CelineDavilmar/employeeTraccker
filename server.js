const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
//const sql = require("./sql");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3301,
    user: 'root',
    password: '',
    database: 'employeesDB'
});

connection.connect(function (err) {
    if (err) throw err;
    Questions();
});

// function which prompts the user for what action they should take
function Questions() {

    inquirer
        .prompt({
            type: "list",
            name: "Options",
            message: "How would you like to proceed?",
            choices: [
                "View Employee(s)",
                "View Role",
                "View Department",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update Employee",
                "Exit"]
        })
        .then(function ({ options }) {
            switch (options) {
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
        /* `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
    ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
    ON m.id = e.manager_id` */

        connection.query(query, function (err, res) {
            if (err) throw err;
            Questions();
        });

}

function viewRole() {

}

function viewDepartment() {

    var query =
        /* `SELECT d.id, d.name, r.salary AS budget
  FROM employee e
  LEFT JOIN role r
    ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  GROUP BY d.id, d.name` */

        connection.query(query, function (err, res) {
            if (err) throw err;

            const deptChoice = res.map(data => ({
                value: data.id, name: data.name
            }));

            Department(deptChoice);
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
                /* `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
  FROM employee e
  JOIN role r
    ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  WHERE d.id = ?` */

                connection.query(query, answer.deptId, function (err, res) {
                    if (err) throw err;

                    //console.table("response ", res);
                    //console.log(res.affectedRows + "Employees are viewed!\n");

                    Questions();
                });
        });
}

function addEmployee() {
    //console.log("Inserting an employee!")

    var query =
        /* `SELECT r.id, r.title, r.salary 
      FROM role r` */

        connection.query(query, function (err, res) {
            if (err) throw err;

            const positionChoices = res.map(({ id, title, salary }) => ({
                value: id, title: `${title}`, salary: `${salary}`
            }));

            //console.table(res);
            //console.log("RoleToInsert!");

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

            //var query = `INSERT INTO employee SET ?`
            connection.query(query,
                {
                    firstname: answer.first,
                    lastname: answer.last,
                    role_id: answer.positionId,
                    manager_id: answer.managerId,
                },
                function (err, res) {
                    if (err) throw err;

                    //console.table(res);
                    //console.log(res.insertedRows + "Inserted successfully!\n");

                    Questions();
                });
        });
}


function addRole() {

    var query =
        /* `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name` */

        connection.query(query, function (err, res) {
            if (err) throw err;

            const departmentChoices = res.map(({ id, name }) => ({
                value: id, name: `${id} ${name}`
            }));

            //console.table(res);
            //console.log("Department array!");

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

                    //console.table(res);
                    //console.log("Role Inserted!");

                    Questions();
                });

        });
}

function addDepartment() {

}

function updateEmployee() {

}






















/* function removeEmployees() {
    console.log("Deleting an employee");

    var query =
        `SELECT e.id, e.first_name, e.last_name
      FROM employee e`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));

        console.table(res);
        console.log("ArrayToDelete!\n");

        promptDelete(deleteEmployeeChoices);
    });
}

// User choose the employee list, then employee is deleted
function promptDelete(deleteEmployeeChoices) {

    inquirer
        .prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee do you want to remove?",
                choices: deleteEmployeeChoices
            }
        ])
        .then(function (answer) {

            var query = `DELETE FROM employee WHERE ?`;
            // when finished prompting, insert a new item into the db with that info
            connection.query(query, { id: answer.employeeId }, function (err, res) {
                if (err) throw err;

                console.table(res);
                console.log(res.affectedRows + "Deleted!\n");

                firstPrompt();
            });
        });
}

//"Update Employee Role" / UPDATE,
function updateEmployeeRole() {
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
        if (err) throw err;

        const employeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${first_name} ${last_name}`
        }));

        console.table(res);
        console.log("employeeArray To Update!\n")

        roleArray(employeeChoices);
    });
}

function roleArray(employeeChoices) {
    console.log("Updating an role");

    var query =
        `SELECT r.id, r.title, r.salary 
  FROM role r`
    let roleChoices;

    connection.query(query, function (err, res) {
        if (err) throw err;

        roleChoices = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`
        }));

        console.table(res);
        console.log("roleArray to Update!\n")

        promptEmployeeRole(employeeChoices, roleChoices);
    });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

    inquirer
        .prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee do you want to set with the role?",
                choices: employeeChoices
            },
            {
                type: "list",
                name: "roleId",
                message: "Which role do you want to update?",
                choices: roleChoices
            },
        ])
        .then(function (answer) {

            var query = `UPDATE employee SET role_id = ? WHERE id = ?`
            // when finished prompting, insert a new item into the db with that info
            connection.query(query,
                [answer.roleId,
                answer.employeeId
                ],
                function (err, res) {
                    if (err) throw err;

                    console.table(res);
                    console.log(res.affectedRows + "Updated successfully!");

                    firstPrompt();
                });
        });
} */
