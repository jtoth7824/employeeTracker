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

// function that displays initial CLI menu
const runTracker = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: ['Add Data','View Data','Update Data','Delete Data'],
    })
    .then((answer) => {
      // switch statement to launch correct function based upon user selection
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

// function to display Add CLI menu options
const addData = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to create?',
      choices: ['Department','Role','Employee'],
    })
    .then((answer) => {
      // switch statement to call correct function based upon user inputs
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

// function to add a department to database table
const addDepartment = () => {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Please enter name of Department: ',
      // validate user input
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
      // SQL query to insert the department name into department table
      const query = 'INSERT INTO Department SET ?';
      connection.query(query, {name: answer.name}, (err, res) => {
        // call main menu function again
        runTracker();
      });
    });
};

// function to add a Role to the database table
const addRole = () => {
  inquirer
    .prompt([{
        name: 'title',
        type: 'input',
        message: 'Please enter title of Role: ',
        // validate user input
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
        // ask user for the Role's salary
        name: 'salary',
        type: 'input',
        message: 'Please enter salary for the Role',
        // validate user input
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
      // save title and salary to variables as another SQL query is about to be made
      let deptID, title, salary;
      title = answer.title;
      salary = answer.salary;
      // SQL query to display department names to display at CLI in list
      connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        // once you have the items, prompt the user for which department
        inquirer
          .prompt([{
            name: 'department',
            type: 'rawlist',
            choices() {
              // present list of department names returned from SQL SELECT query
              const choiceArray = [];
              results.forEach(({ name}) => {
                choiceArray.push(name);
              });
              return choiceArray;
            },
            message: 'Which department does the role belong to?',
          }, ])
          .then((answer) => {
            // get the information of the chosen department
            results.forEach((item) => {
              if (item.name === answer.department) {
                // save off the department ID for department name user chose
                deptID = item.id;
              }
            });
            // SQL query to save the new role/salary/department ID to the Role table
            const query = 'INSERT INTO Role SET ?';
            connection.query(query, {title: title, salary: salary, dept_id: deptID}, (err, res) => {
            if(err) throw err;
              // call main menu function again
              runTracker();
            });
          });
      });
    });
}

// function to add employee
const addEmployee = () => {
  let mgr, firstname, lastname, role;
  inquirer
  .prompt([{
      name: 'first_name',
      type: 'input',
      message: 'Please enter first name of Employee: ',
      // validation to ensure user entered a string
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
      // validation to ensure user entered a string
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
    // save the user entered first and last names
    firstname = answer.first_name;
    lastname = answer.last_name;
    // SQL query to select all data from  role table
    connection.query('SELECT * FROM role', (err, results) => {
      if (err) throw err;
      // once you have the roles, prompt user for which one
      inquirer
        .prompt([{
          name: 'role',
          type: 'rawlist',
          // display available roles in list to user based upon SELECT query
          choices() {
            const choiceArray = [];
            results.forEach(({title}) => {
              // save all role titles to array
              choiceArray.push(title);
            });
            return choiceArray;
          },
          message: 'What is the new Role for the selected employee?',
        }])
        .then((answer) => {
          // find specific role row based upon user role selection
          results.forEach((item) => {
            if (item.title === answer.role) {
              // save the role id that matched the user role selection
              role = item.id;
            }
          });
          // SQL query to select all data from employee table
          connection.query('SELECT * FROM employee', (err, results) => {
            if (err) throw err;
            // once you have the items, prompt the user for the manager name
            inquirer
              .prompt([{
                  name: 'manager',
                  type: 'rawlist',
                  // function to display employee names that could be selected as employee's manager
                  choices() {
                    const choiceArray = [];
                    // loop through SQL query results to find all employee names
                    results.forEach(({first_name,last_name}) => {
                      // push concatenated employee name to array
                      choiceArray.push(first_name + ' ' + last_name);
                    });
                    // return array of names to display to user
                    return choiceArray;
                  },
                  message: 'What is the new manager for the employee?',
                }])
              .then((answer) => {
                // loop over SQL query results to find record that matches user selected employee name for manager
                results.forEach((item) => {
                  if (item.last_name === answer.manager.split(" ")[1]) {
                    // save the employee id of the name selected as manager
                    mgr = item.id;
                  }
                });
                // SQL query to add employee data to the employee table
                const query = 'INSERT INTO Employee SET ?'
                  connection.query(query, {first_name: firstname, last_name: lastname, manager_id: mgr, role_id: role}, (err, res) => {
                    if(err) throw err;
                    // call main menu function again
                    runTracker();
                  });
              });
          });
      });
    });
  });
}

// function to display view data menu options
const viewData = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to View?',
      choices: ['Department','Role','Employee','View All Employees','Employee by Manager','Total Utilized Budget'],
    })
    .then((answer) => {
      // switch statement to call appropriate function based upon user choice
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

// function to view data in deparment table
const viewDepartment = () => {
  // SQL query to select all data from department table
  connection.query('SELECT * FROM Department', (err, res) => {
    // display data in table format using npm package
    console.table(res);
    // call main menu function again
    runTracker();
  });
};

// function to view data in role table
const viewRole = () => {
  // SQL query to select all data from role table
  connection.query('SELECT * FROM Role', (err, res) => {
    // display data in table format using npm package
    console.table(res);
    // call main menu function again
    runTracker();
  });
};

// function to view data in employee table
const viewEmployee = () => {
  // SQL query to select all data from employee table
  connection.query('SELECT * FROM Employee', (err, res) => {
    // display data in table format using npm package
    console.table(res);
    // call main menu function again
    runTracker();
  });
};

// function to view employees by manager
const viewEmpByMgr = () => {
  // SQL query doing self join on employee table to display employees by their manager
  let query =
    'SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS name, IFNULL(CONCAT(m.first_name, " ", m.last_name), "(No Manager)") AS manager ';
  query +=
    'FROM employee e LEFT JOIN employee m on m.id = e.manager_id ';
  connection.query(query, (err, res) => {
    if (err) throw err;
    // display data in table format using npm package
    console.table(res);
    // call main menu function again
    runTracker();
  });
};

// function to view all employee data from all tables
const viewAllEmployees = () => {
  // SQL query joining all the data from employee, role and department tables for display
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
    // display data in table format using npm package
    console.table(res);
    // call main menu function again
    runTracker();
  });
};

// function to view a department's budget
const viewBudget = () => {
  // SQL query to select all data from department table to generate choice list for CLI
  let query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    let deptID;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: 'department',
        type: 'rawlist',
        // display list of department choices for user to select from
        choices() {
          const choiceArray = [];
          res.forEach(({name}) => {
            // push department name to array
            choiceArray.push(name);
          });
          // return array to display as choices
          return choiceArray;
        },
        message: 'Which department do you want to view budget for?',
      }])
      .then((answer) => {
        // loop over department data to find the dept name user selected
        res.forEach((item) => {
          if (item.name === answer.department) {
            // save department id that matched the dept name selected by user
            deptID = item.id;
          }
        })
        // SQL query to select department name and sum the salaries for every role belonging to that department to get total budget for department
        let query = 'SELECT department.name AS Department, SUM(role.salary) AS "Total Budget" ';
        query +=
          'FROM role INNER JOIN department on department.id = ? ';
        query +=
          'INNER JOIN employee ON role.id = employee.role_id ';
        query +=
          'WHERE role.dept_id = ?';
        connection.query(query, [ deptID, deptID ], (err, res) => {
          if(err) throw err;
          // display data in table format using npm package
          console.table(res);
          // call main menu function again
          runTracker();
         });
      });
  })
}

// function to display Update menu options
const updateData = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to Update?',
      choices: ['Employee Role','Employee Manager'],
    })
    .then((answer) => {
      // switch on user selected action to call appropriate function
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

// function to Update an employee's manager
const updateEmpMgr = () => {
  let empID;
  let newMgr;
  // SQL query to return all data from employee table
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    // prompt user for employee to update
    inquirer
      .prompt([{
          name: 'employee',
          type: 'rawlist',
          // function to display employee names to user for selection
          choices() {
            const choiceArray = [];
            // loop through SQL query results
            results.forEach(({first_name,last_name  }) => {
              // push employee name to array
              choiceArray.push(first_name + ' ' + last_name);
            });
            // return array to display choices for employees
            return choiceArray;
          },
          message: 'Which employee would you like to update manager for?',
        },
      ])
      .then((answer) => {
        // loop through SQl query results to find record that matches last name of employee
        results.forEach((item) => {
          if (item.last_name === answer.employee.split(" ")[1]) {
            // save the employee id that matched the user selected last name
            empID = item.id;
          }
        });
        // SQL query to select all data from employee table
        connection.query('SELECT * FROM employee', (err, results) => {
          if (err) throw err;
          // prompt user for new employee manager name
          inquirer
            .prompt([{
                name: 'manager',
                type: 'rawlist',
                // function to display list of employee names to user
                choices() {
                  const choiceArray = [];
                  // loop through SQL query results
                  results.forEach(({first_name,last_name}) => {
                    // push employee name to array
                    choiceArray.push(first_name + ' ' + last_name);
                  });
                  // return array of choices to display list for user
                  return choiceArray;
                },
                message: 'Whhat is the new manager for the selected employee?',
              },
            ])
            .then((answer) => {
              // loop through SQL query records to find record that matches user selected name
              results.forEach((item) => {
                if (item.last_name === answer.manager.split(" ")[1]) {
                  // save the new manager employee id
                  newMgr = item.id;
                }
              });
              // SQL query to update employee record with new manager id
              var query = 'UPDATE employee SET ? WHERE ?';
              connection.query(query, [{manager_id: newMgr}, {id: empID}], (error) => {
                  if (error) throw err;
                  // call main menu function again
                  runTracker();
                }
              );
            });
      });
  });
});
}

// function to Update an employee's role
const updateEmpRole = () => {
  let empId;
  let newRole;
  // SQL query to select all data from employee table
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    // prompt user to employee to update
    inquirer
      .prompt([{
        name: 'employee',
        type: 'rawlist',
        // function to display employee name choices
        choices() {
          const choiceArray = [];
          // loop through SQL query results
          results.forEach(({first_name, last_name}) => {
            // push employee name to array
            choiceArray.push(first_name + ' ' + last_name);
          });
          // return array to display choices list to user
          return choiceArray;
        },
        message: 'Which employee would you like to update Role for?',
      }])
      .then((answer) => {
        // loop through SQL query results to find record that matches employee name selected by user
        results.forEach((item) => {
          if (item.last_name === answer.employee.split(" ")[1]) {
            // save employee id
            empId = item.id;
          }
        });
        // SQL query to select all data from role table
        connection.query('SELECT * FROM role', (err, results) => {
          if (err) throw err;
          // prompt user for new role for the selected employee
          inquirer
            .prompt([{
              name: 'updatedRole',
              type: 'rawlist',
              // function to display choices list to user
              choices() {
                const choiceArray = [];
                // loop through SQL query results
                results.forEach(({title}) => {
                  // push role title to array
                  choiceArray.push(title);
                });
                // return array to display choice list to user
                return choiceArray;
              },
              message: 'What is the new Role for the selected employee?',
            }])
            .then((answer) => {
              // loop through SQL query results to find record that matches role title selected
              results.forEach((role) => {
                if (role.title === answer.updatedRole) {
                  // save role id that matches title the user selected
                  newRole = role.id;
                }
              });
              // SQL query to update employee record in employee table with new role id
              var query = 'UPDATE employee SET ? WHERE ?';
              connection.query(query, [{role_id: newRole},{id: empId}], (error) => {
                  if (error) throw err;
                  // call main menu function again
                  runTracker();
                }
              );
            });
        });
      });
  });
};

// function to display Delete menu options
const deleteData = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to Delete?',
      choices: ['Department','Role','Employee'],
    })
    .then((answer) => {
      // switch on user choice to call appropriate function
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

// function to delete department (along with corresponding data from role and employee table)
const deleteDept = () => {
  let deptID;
  // SQL query to select all data from department table
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    // prompt user for department selection
    inquirer
      .prompt([{
        name: 'department',
        type: 'rawlist',
        // function to display choice list to user
        choices() {
          const choiceArray = [];
          // loop through SQL query results
          results.forEach(({ name}) => {
            // push department name to array
            choiceArray.push(name);
          });
          // return array to display list of choices for user
          return choiceArray;
        },
        message: 'Which department would you like to delete?',
      }, ])
      .then((answer) => {
        // loop through SQL query results to find department name that matches user selection
        results.forEach((item) => {
          if (item.name === answer.department) {
            // savce the department id
            deptID = item.id;
          }
        });
        let roles = [];
        // SQL query to find all the employees who match the role selected
        connection.query('SELECT * FROM employee INNER JOIN role ON role.id = employee.role_id WHERE role.dept_id = ?', [deptID], (err, results) => {
          if(err) throw err;
          // loop to find sql query results for employees who belong to department selected by user
          results.forEach((index) => {
            // push results to array
            roles.push(index.id);
          });
          // check if the department selected had any employees with actual roles in that department
          if(roles.length > 0) {
            // SQL query to delete department and roles from tables where department ids match
            var query = 'DELETE department, role FROM department LEFT JOIN role ON department.id = role.dept_id WHERE department.id = ?';
            connection.query(query,[deptID],(error, results) => {
                if (error) throw error;
                // SQL query to delete the employees in array that were part of the department being deleted
                var query = 'DELETE FROM employee WHERE ';
                // reduce array to be unique values for the role for the delete employees query
                let uniqueRoles = [...new Set(roles)];
                // continue building the SQL query for each role id
                for(let i = 0; i<uniqueRoles.length; i++) {
                  query += 'employee.role_id = ' + uniqueRoles[i];
                  if(!(i === uniqueRoles.length-1)) {
                  query+= ' OR ';
                }
              };
              connection.query(query, (error, results) => {
                if (error) throw error;
                // call main menu function again
                runTracker();
              });
            }); 
          } else {
            // SQL query to select all roles where department matches user selection
            connection.query('SELECT * FROM role WHERE role.dept_id = ?', [deptID], (err, results) => {
              if(err) throw err;
              // loop over SQL results and save role ids
              results.forEach((index) => {
                // push role id to array
                roles.push(index.id);
              })
              // check if any roles were found for the department selected by user
              if(roles.length >0) {
                // SQL query to delete department user selected and delete associated roles assigned to that department
                var query = 'DELETE department, role FROM department INNER JOIN role ON department.id = role.dept_id WHERE department.id = ?';
                connection.query(query,[deptID],(error, results) => {
                    if (error) throw error;
                });
                // if there were no roles found for the department, then only delete the department
              } else {
                // SQL query to delete the department the user selected
                var query = 'DELETE department FROM department WHERE department.id = ?'
                connection.query(query, [deptID], (error, results) => {
                    if(error) throw error;
                });
              };
              // call main menu function again
              runTracker();
            });
          };
        });
      });
  });
}

// function to delete role and associated employees with that role
const deleteRole = () => {
  let roleID;
  // SQL query to retrieve all data in role table
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    // prompt user for role to delete
    inquirer
      .prompt([{
        name: 'role',
        type: 'rawlist',
        // function to display role choices to user
        choices() {
          const choiceArray = [];
          // loop through SQL results for role titles
          results.forEach(({title}) => {
            // push role title to array
            choiceArray.push(title);
          });
          // return array to display list of choices for user
          return choiceArray;
        },
        message: 'Which role would you like to delete?',
      }, ])
      .then((answer) => {
        // loop over SQL results to find role id for the role the user selected
        results.forEach((item) => {
          if (item.title === answer.role) {
            // save the role id for the role the user selected
            roleID = item.id;
          }
        });
        // SQL query to delete any roles from role table and employees that have that role from employee table
        var query = 'DELETE role, employee FROM role LEFT JOIN employee ON role.id = employee.role_id WHERE role.id = ?';
        connection.query(query, [roleID], (error, results) => {
            if (error) throw error;
            // call main menu function again
            runTracker();
          });
      });
  });
};

// function to delete employee
const deleteEmp = () => {
  let empID;
  // SQL query to select all data from employee table
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    // prompt user for employee to delete
    inquirer
      .prompt([{
        name: 'employee',
        type: 'rawlist',
        // function to display employee name choices to user
        choices() {
          const choiceArray = [];
          results.forEach(({first_name, last_name}) => {
            // push employee name to array
            choiceArray.push(first_name + ' ' + last_name);
          });
          // return array to display list of choices for user
          return choiceArray;
        },
        message: 'Which employee would you like to delete?',
      }, ])
      .then((answer) => {
        // loop through SQL results to find the employee id that matches user selection
        results.forEach((item) => {
          if (item.last_name === answer.employee.split(" ")[1]) {
            // save the employee id to delete
            empID = item.id;
          }
        });
        // SQL query to delete the specific employee id of employee selected by user
        var query = 'DELETE FROM employee WHERE employee.id = ?';
        connection.query(query, [empID], (error) => {
            if (error) throw error;
            // call main menu function again
            runTracker();
          }
        );
      });
  });
};