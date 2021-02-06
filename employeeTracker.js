const mysql = require('mysql');
const inquirer = require('inquirer');

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
      choices: ['Add Data','View Data','Update Data','Delete Data'],
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
      choices: ['Department','Role','Employee'],
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
      };
    });
};

const addDepartment = () => {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Please enter name of Department: ',
      validate: deptEntry => {
        // Check that user entered a string for department
        if (deptEntry) {
            return true;
        } else {
            console.log("Please enter a Department name!");
        }
      }
    })
    .then((answer) => {
      const query = 'INSERT INTO Department SET ?';
      connection.query(query, {name: answer.name}, (err, res) => {
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
        validate: roleEntry => {
          // Check that user entered a string for role
          if (roleEntry) {
              var re = /^[A-Za-z]+$/;
              if(re.test(roleEntry))
                 return true;
              else
                console.log('Role name must be alpha characters only.');
          } else {
              console.log("Please enter a Role name!");
          }
        }
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Please enter salary for the Role',
        validate: salaryEntry => {
          // Check that entry is a number
          if (!isNaN(salaryEntry)) {
              // Check that entry is not an empty string
              if (!(salaryEntry === "")) {
                  return true;
              }
              console.log("You must enter a salary.");
          } else {
              console.log("Please enter a number for the salary!");
          }
        }
      }
    ])
    .then((answer) => {
      let deptID, title, salary;
      title = answer.title;
      salary = answer.salary;
      // query the database for all items being auctioned
      connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
          .prompt([{
            name: 'department',
            type: 'rawlist',
            choices() {
              const choiceArray = [];
              results.forEach(({ name}) => {
                choiceArray.push(name);
              });
              return choiceArray;
            },
            message: 'Which department does the role belong to?',
          }, ])
          .then((answer) => {
            // get the information of the chosen item
            results.forEach((item) => {
              if (item.name === answer.department) {
                deptID = item.id;
              }
            });
            const query = 'INSERT INTO Role SET ?';
            connection.query(query, {title: title, salary: salary, dept_id: deptID}, (err, res) => {
            if(err) throw err;
            runTracker();
            });
          });
      });
    });
}

const addEmployee = () => {
  let mgr, firstname, lastname, role;
  inquirer
  .prompt([{
      name: 'first_name',
      type: 'input',
      message: 'Please enter first name of Employee: ',
      validate: nameEntry => {
        // Check that user entered a string for name
        if (nameEntry) {
            return true;
        } else {
            console.log("Please enter employee first name!");
        }
     }
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Please enter last name of Employee: ',
      validate: nameEntry => {
        // Check that user entered a string for name
        if (nameEntry) {
            return true;
        } else {
            console.log("Please enter employee last name!");
        }
      }
    }
  ])
  .then((answer) => {
    firstname = answer.first_name;
    lastname = answer.last_name;
    connection.query('SELECT * FROM role', (err, results) => {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([{
          name: 'role',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({title}) => {
              choiceArray.push(title);
            });
            return choiceArray;
          },
          message: 'What is the new Role for the selected employee?',
        }])
        .then((answer) => {
          results.forEach((item) => {
            if (item.title === answer.role) {
              role = item.id;
            }
          });
          connection.query('SELECT * FROM employee', (err, results) => {
            if (err) throw err;
            // once you have the items, prompt the user for which they'd like to bid on
            inquirer
              .prompt([{
                  name: 'manager',
                  type: 'rawlist',
                  choices() {
                    const choiceArray = [];
                    results.forEach(({first_name,last_name}) => {
                      choiceArray.push(first_name + ' ' + last_name);
                    });
                    return choiceArray;
                  },
                  message: 'What is the new manager for the employee?',
                }])
              .then((answer) => {
                // get the information of the chosen item
                results.forEach((item) => {
                  if (item.last_name === answer.manager.split(" ")[1]) {
                    mgr = item.id;
                  }
                });
                const query = 'INSERT INTO Employee SET ?'
                  connection.query(query, {first_name: firstname, last_name: lastname, manager_id: mgr, role_id: role}, (err, res) => {
                    if(err) throw err;
                    runTracker();
                  });
              });
          });
      });
    });
  });
}

const viewData = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to View?',
      choices: ['Department','Role','Employee','View All Employees','Employee by Manager','Total Utilized Budget'],
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
  connection.query('SELECT * FROM Department', (err, res) => {
    console.table(res);
    runTracker();
  });
};

const viewRole = () => {
  connection.query('SELECT * FROM Role', (err, res) => {
    console.table(res);
    runTracker();
  });
};

const viewEmployee = () => {
  connection.query('SELECT * FROM Employee', (err, res) => {
    console.table(res);
    runTracker();
  });
};

const viewEmpByMgr = () => {
  let query =
    'SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS name, IFNULL(CONCAT(m.first_name, " ", m.last_name), "(No Manager)") AS manager ';
  query +=
    'FROM employee e LEFT JOIN employee m on m.id = e.manager_id ';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runTracker();
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

const viewBudget = () => {
  let query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    let deptID;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: 'department',
        type: 'rawlist',
        choices() {
          const choiceArray = [];
          res.forEach(({name}) => {
            choiceArray.push(name);
          });
          return choiceArray;
        },
        message: 'Which department do you want to view budget for?',
      }])
      .then((answer) => {
        // get the information of the chosen item
        res.forEach((item) => {
          if (item.name === answer.department) {
            deptID = item.id;
          }
        })
        let query = 'SELECT department.name AS Department, SUM(role.salary) AS "Total Budget" ';
        query +=
          'FROM role INNER JOIN department on department.id = ? ';
        query +=
          'INNER JOIN employee ON role.id = employee.role_id ';
        query +=
          'WHERE role.dept_id = ?';
        connection.query(query, [ deptID, deptID ], (err, res) => {
          if(err) throw err;
          console.table(res);
          runTracker();
         });
      });
  })
}

const updateData = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to Update?',
      choices: ['Employee Role','Employee Manager'],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Employee Role':
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
          name: 'employee',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({first_name,last_name  }) => {
              choiceArray.push(first_name + ' ' + last_name);
            });
            return choiceArray;
          },
          message: 'Which employee would you like to update manager for?',
        },
      ])
      .then((answer) => {
        // get the information of the chosen item
        results.forEach((item) => {
          if (item.last_name === answer.employee.split(" ")[1]) {
            empID = item.id;
          }
        });
        connection.query('SELECT * FROM employee', (err, results) => {
          if (err) throw err;
          // once you have the items, prompt the user for which they'd like to bid on
          inquirer
            .prompt([{
                name: 'manager',
                type: 'rawlist',
                choices() {
                  const choiceArray = [];
                  results.forEach(({first_name,last_name}) => {
                    choiceArray.push(first_name + ' ' + last_name);
                  });
                  return choiceArray;
                },
                message: 'Whhat is the new manager for the selected employee?',
              },
            ])
            .then((answer) => {
              // get the information of the chosen item
              results.forEach((item) => {
                if (item.last_name === answer.manager.split(" ")[1]) {
                  newMgr = item.id;
                }
              });
              var query = 'UPDATE employee SET ? WHERE ?';
              connection.query(query, [{manager_id: newMgr}, {id: empID}], (error) => {
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
  let empId;
  let newRole;
  // query the database for all items being auctioned
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: 'employee',
        type: 'rawlist',
        choices() {
          const choiceArray = [];
          results.forEach(({
            first_name,
            last_name
          }) => {
            choiceArray.push(first_name + ' ' + last_name);
          });
          return choiceArray;
        },
        message: 'Which employee would you like to update Role for?',
      }])
      .then((answer) => {
        // get the information of the chosen item
        results.forEach((item) => {
          if (item.last_name === answer.employee.split(" ")[1]) {
            empId = item.id;
          }
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
                results.forEach(({title}) => {
                  choiceArray.push(title);
                });
                return choiceArray;
              },
              message: 'What is the new Role for the selected employee?',
            }])
            .then((answer) => {
              // get the information of the chosen item
              results.forEach((role) => {
                if (role.title === answer.updatedRole) {
                  newRole = role.id;
                }
              });
              var query = 'UPDATE employee SET ? WHERE ?';
              connection.query(query, [{role_id: newRole},{id: empId}], (error) => {
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
      choices: ['Department','Role','Employee'],
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
  let deptID;
  // query the database for all items being auctioned
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: 'department',
        type: 'rawlist',
        choices() {
          const choiceArray = [];
          results.forEach(({ name}) => {
            choiceArray.push(name);
          });
          return choiceArray;
        },
        message: 'Which department would you like to delete?',
      }, ])
      .then((answer) => {
        // get the information of the chosen item
        results.forEach((item) => {
          if (item.name === answer.department) {
            deptID = item.id;
          }
        });
        let roles = [];

        connection.query('SELECT * FROM employee INNER JOIN role ON role.id = employee.role_id WHERE role.dept_id = ?', [deptID], (err, results) => {
          if(err) throw err;
          console.table(results);
          results.forEach((index) => {
            roles.push(index.id);
          });
          if(roles.length > 0) {
            var query = 'DELETE department, role FROM department LEFT JOIN role ON department.id = role.dept_id WHERE department.id = ?';
            connection.query(query,[deptID],(error, results) => {
                if (error) throw error;
                var query = 'DELETE FROM employee WHERE ';
                let uniqueRoles = [...new Set(roles)];
  
                for(let i = 0; i<uniqueRoles.length; i++) {
                  query += 'employee.role_id = ' + uniqueRoles[i];
                  if(!(i === uniqueRoles.length-1)) {
                  query+= ' OR ';
                }
              };
              connection.query(query, (error, results) => {
                if (error) throw error;
                runTracker();
              });
            }); 
          } else {
            connection.query('SELECT * FROM role WHERE role.dept_id = ?', [deptID], (err, results) => {
              if(err) throw err;
              console.table(results);
              results.forEach((index) => {
                roles.push(index.id);
              })
              if(roles.length >0) {
                var query = 'DELETE department, role FROM department INNER JOIN role ON department.id = role.dept_id WHERE department.id = ?';
                connection.query(query,[deptID],(error, results) => {
                    if (error) throw error;
                });
              } else {
                var query = 'DELETE department FROM department WHERE department.id = ?'
                connection.query(query, [deptID], (error, results) => {
                    if(error) throw error;
                });
              };
              runTracker();
            });

          };
        });
      });
  });
}

const deleteRole = () => {
  let roleID;
  // query the database for all items being auctioned
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: 'role',
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
        message: 'Which role would you like to delete?',
      }, ])
      .then((answer) => {
        // get the information of the chosen item
        results.forEach((item) => {
          if (item.title === answer.role) {
            roleID = item.id;
          }
        });
        var query = 'DELETE role, employee FROM role LEFT JOIN employee ON role.id = employee.role_id WHERE role.id = ?';
        connection.query(query, [roleID], (error, results) => {
            if (error) throw error;
            runTracker();
          });
      });
  });
};

const deleteEmp = () => {
  let empID;
  // query the database for all items being auctioned
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: 'employee',
        type: 'rawlist',
        choices() {
          const choiceArray = [];
          results.forEach(({
            first_name,
            last_name
          }) => {
            choiceArray.push(first_name + ' ' + last_name);
          });
          return choiceArray;
        },
        message: 'Which employee would you like to delete?',
      }, ])
      .then((answer) => {
        // get the information of the chosen item
        results.forEach((item) => {
          if (item.last_name === answer.employee.split(" ")[1]) {
            empID = item.id;
          }
        });

        var query = 'DELETE FROM employee WHERE employee.id = ?';
        connection.query(query, [empID], (error) => {
            if (error) throw error;
            runTracker();
          }
        );
      });
  });
};