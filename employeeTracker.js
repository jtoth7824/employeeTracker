const mysql = require('mysql');
const inquirer = require('inquirer');

var employeeNames = [];
var deptNames = [];
var roleNames = [];

// console.table package to display sql data in table format at command line
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'password',
  database: 'employee_tracker',
});

connection.connect((err) => {
  if (err) throw err;
  runTracker();
});

const runTracker = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: [
        'Add Data',
        'View Data',
        'Update Data',
        'Delete Data'
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Add Data':
          addData();
          break;

        case 'View Data':
          viewData();
          break;

        case 'Update Data':
          updateData();
          break;

        case 'Delete Data':
          deleteData();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const addData = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to create?',
      choices: [
        'Department',
        'Role',
        'Employee'
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Department':
          addDepartment();
          break;

        case 'Role':
          addRole();
          break;

        case 'Employee':
          addEmployee();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const addDepartment = () => {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Please enter name of Department: ',
    })
    .then((answer) => {
      const query = 'INSERT INTO Department SET ?';
      connection.query(query, {
        name: answer.name
      }, (err, res) => {
        runTracker();
      });
    });
};

const addRole = () => {
  inquirer
    .prompt([{
        name: 'title',
        type: 'input',
        message: 'Please enter title of Role: ',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Please enter salary for the Role',
      },
      {
        name: 'deptID',
        type: 'input',
        message: 'Please enter department id for this Role',
      }
    ])
    .then((answer) => {
      const query = 'INSERT INTO Role SET ?';
      connection.query(query, {
        title: answer.title,
        salary: answer.salary,
        dept_id: answer.deptID
      }, (err, res) => {
        runTracker();
      });
    });
};

const addEmployee = () => {
  inquirer
    .prompt([{
        name: 'first_name',
        type: 'input',
        message: 'Please enter first name of Employee: ',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Please enter last name of Employee: '
      },
      {
        name: 'manager_id',
        type: 'input',
        message: 'Please enter manager id of Employee'
      },
      {
        name: 'role_id',
        type: 'input',
        message: 'Please enter role id of Employee'
      }
    ])
    .then((answer) => {
      const query = 'INSERT INTO Employee SET ?'
      connection.query(query, {
        first_name: answer.first_name,
        last_name: answer.last_name,
        manager_id: answer.manager_id,
        role_id: answer.role_id
      }, (err, res) => {
        runTracker();
      });
    });
};

const viewData = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to View?',
      choices: [
        'Department',
        'Role',
        'Employee',
        'View All Employees',
        'Employee By Manager',
        'Total Utilized Budget',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Department':
          viewDepartment();
          break;

        case 'Role':
          viewRole();
          break;

        case 'Employee':
          viewEmployee();
          break;

        case 'View All Employees':
          viewAllEmployees();
          break;

        case 'Employee by Manager':
          viewEmpByMgr();
          break;

        case 'Total Utilized Budget':
          viewBudget();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const viewDepartment = () => {
  const query =
    'SELECT * FROM Department';
  connection.query(query, (err, res) => {
    console.table(res);
    deptNames = [];
    for (let i = 0; i < res.length; i++) {
      deptNames.push(res[i]);
    }
    runTracker();
  });
};

const viewRole = () => {
  const query =
    'SELECT * FROM Role';
  connection.query(query, (err, res) => {
    console.table(res);
    roleNames = [];
    for (let i = 0; i < res.length; i++) {
      roleNames.push(res[i]);
    }
    runTracker();
  });
};

const viewEmployee = () => {
  const query =
    'SELECT * FROM Employee';
  connection.query(query, (err, res) => {
    console.table(res);
    employeeNames = [];
    for (let i = 0; i < res.length; i++) {
      employeeNames.push(res[i]);
    }
    runTracker();
  });
};

const viewEmpByMgr = () => {
  const query =
    'SELECT * FROM Employee';
  connection.query(query, (err, res) => {
    console.table(res);
    employeeNames = [];
    for (let i = 0; i < res.length; i++) {
      employeeNames.push(res[i]);
    }
    runTracker();
  });
};

const viewBudget = () => {
  const query =
    'SELECT * FROM Employee';
  connection.query(query, (err, res) => {
    console.table(res);
    employeeNames = [];
    for (let i = 0; i < res.length; i++) {
      employeeNames.push(res[i]);
    }
    runTracker();
  });
};

const updateData = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to Update?',
      choices: [
        'Employee Role',
        'Employee Manager'
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Employee Role':
          const query = 'SELECT * FROM Employee';
          connection.query(query, (err, res) => {
            employeeNames = [];
            for (let i = 0; i < res.length; i++) {
              employeeNames.push(res[i]);
            }
          });
          updateEmpRole();
          break;

        case 'Employee Manager':
          updateEmpMgr();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const updateEmpMgr = () => {
  let empID;
  let newMgr;
  // query the database for all items being auctioned
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({first_name,last_name  }) => {
              temp = first_name + ' ' + last_name;
              choiceArray.push(temp);
            });
            return choiceArray;
          },
          message: 'Which employee would you like to update manager for?',
        },
      ])
      .then((answer) => {
        // get the information of the chosen item
        results.forEach((name) => {
//          var temp1 = john[0].split(" ");
          if (name.last_name === answer.choice.split(" ")[1]) {
            empID = name.id;
          }
        });
        connection.query('SELECT * FROM employee', (err, results) => {
          if (err) throw err;
          // once you have the items, prompt the user for which they'd like to bid on
          inquirer
            .prompt([{
                name: 'choice',
                type: 'rawlist',
                choices() {
                  const choiceArray = [];
                  results.forEach(({ first_name,last_name}) => {
                    temp = first_name + ' ' + last_name;
                    choiceArray.push(temp);
                  });
                  return choiceArray;
                },
                message: 'Whhat is the new manager for the selected employee?',
              },
            ])
            .then((answer) => {
              // get the information of the chosen item
              results.forEach((name) => {
      //          var temp1 = john[0].split(" ");
                if (name.last_name === answer.choice.split(" ")[1]) {
                  newMgr = name.id;
                }
              });
              var query = 'UPDATE employee SET ? WHERE ?';
              connection.query(
                query,
                [{
                    manager_id: newMgr,
                  },
                  {
                    id: empID,
                  },
                ],
                (error) => {
                  if (error) throw err;
                  runTracker();
                }
              );
            });
      });
  });
});
}

const updateEmpRole = () => {
  //  john = [];
  let empId;
  let newRole;
  // query the database for all items being auctioned
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: 'choice',
        type: 'rawlist',
        choices() {
          const choiceArray = [];
          results.forEach(({
            first_name,
            last_name
          }) => {
            temp = first_name + ' ' + last_name;
            choiceArray.push(temp);
          });
          return choiceArray;
        },
        message: 'Which employee would you like to update Role for?',
      }, ])
      .then((answer) => {
        // get the information of the chosen item
        results.forEach((name) => {
          var temp1 = answer.choice.split(" ");
          if (name.last_name === temp1[1]) {
            empId = name.id;
          }
          console.log('empId ' + empId);

        });
        connection.query('SELECT * FROM role', (err, results) => {
          if (err) throw err;
          // once you have the items, prompt the user for which they'd like to bid on
          inquirer
            .prompt([{
              name: 'updatedRole',
              type: 'rawlist',
              choices() {
                const choiceArray = [];
                results.forEach(({
                  title
                }) => {
                  choiceArray.push(title);
                });
                return choiceArray;
              },
              message: 'What is the new Role for the selected employee?',
            }, ])
            .then((answer) => {
              // get the information of the chosen item
              results.forEach((role) => {
                if (role.title === answer.updatedRole) {
                  newRole = role.id;
                }
                console.log('newMgr ' + newRole);
              });
              var query = 'UPDATE employee SET ? WHERE ?';
              connection.query(
                query,
                [{
                    role_id: newRole,
                  },
                  {
                    id: empId,
                  },
                ],
                (error) => {
                  if (error) throw err;
                  runTracker();
                }
              );
            });
        });
      });
  });
};

const deleteData = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to Delete?',
      choices: [
        'Department',
        'Role',
        'Employee'
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Department':
          deleteDept();
          break;

        case 'Role':
          deleteRole();
          break;

        case 'Employee':
          deleteEmp();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const deleteDept = () => {
  john = [];
  // query the database for all items being auctioned
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: 'choice',
        type: 'rawlist',
        choices() {
          const choiceArray = [];
          results.forEach(({
            name
          }) => {
            choiceArray.push(name);
          });
          return john = choiceArray;
        },
        message: 'Which department would you like to delete?',
      }, ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenName;
        console.log(john);
        john.forEach((name, index) => {
          console.log(name);
          if (name === answer.choice) {
            chosenName = index;
          }
        });

        var query = 'DELETE FROM department WHERE ?';
        connection.query(
          query,
          [{
            id: chosenName + 1,
          }, ],
          (error) => {
            if (error) throw err;
            runTracker();
          }
        );
      });
  });
};

const deleteRole = () => {
  john = [];
  // query the database for all items being auctioned
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: 'choice',
        type: 'rawlist',
        choices() {
          const choiceArray = [];
          results.forEach(({
            title
          }) => {
            choiceArray.push(title);
          });
          return john = choiceArray;
        },
        message: 'Which role would you like to delete?',
      }, ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenName;
        console.log(john);
        john.forEach((name, index) => {
          console.log(name);
          if (name === answer.choice) {
            chosenName = index;
          }
        });

        var query = 'DELETE FROM role WHERE ?';
        connection.query(
          query,
          [{
            id: chosenName + 1,
          }, ],
          (error) => {
            if (error) throw err;
            runTracker();
          }
        );
      });
  });
};

const deleteEmp = () => {
  john = [];
  // query the database for all items being auctioned
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: 'choice',
        type: 'rawlist',
        choices() {
          const choiceArray = [];
          results.forEach(({
            first_name,
            last_name
          }) => {
            temp = first_name + ' ' + last_name;
            choiceArray.push(temp);
          });
          return john = choiceArray;
        },
        message: 'Which employee would you like to delete?',
      }, ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenName;
        john.forEach((name, index) => {
          var temp1 = john[0].split(" ");
          console.log(name);
          if (john[index].split(" ")[1] === temp1[1]) {
            chosenName = index;
          }
        });

        var query = 'DELETE FROM employee WHERE ?';
        connection.query(
          query,
          [{
            id: chosenName + 1,
          }, ],
          (error) => {
            if (error) throw err;
            runTracker();
          }
        );
      });
  });
};

const viewAllEmployees = () => {
  let query =
    'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, IFNULL(CONCAT(m.first_name, " ", m.last_name), "null") AS manager ';
  query +=
    'FROM employee e LEFT JOIN employee m on m.id = e.manager_id ';
  query +=
    'INNER JOIN role ON e.role_id = role.id ';
  query +=
    'INNER JOIN department ON department.id = role.dept_id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runTracker();
  });
};