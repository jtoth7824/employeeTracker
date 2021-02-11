const inquirer = require('inquirer');

const cTable = require('console.table');
const eTracker = require('./employeeTracker');

class UpdateData {

  // function to Update an employee's manager
  updateEmpMgr() {
    let empID;
    let newMgr;
    // SQL query to return all data from employee table
    eTracker.connection.query('SELECT * FROM employee', (err, results) => {
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
          eTracker.connection.query('SELECT * FROM employee', (err, results) => {
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
                eTracker.connection.query(query, [{manager_id: newMgr}, {id: empID}], (error) => {
                    if (error) throw err;
                    // call main menu function again
                    eTracker.runTracker();
                  }
                );
              });
        });
    });
  });
  }
  
  // function to Update an employee's role
  updateEmpRole() {
    let empId;
    let newRole;
    // SQL query to select all data from employee table
    eTracker.connection.query('SELECT * FROM employee', (err, results) => {
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
          eTracker.connection.query('SELECT * FROM role', (err, results) => {
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
                eTracker.connection.query(query, [{role_id: newRole},{id: empId}], (error) => {
                    if (error) throw err;
                    // call main menu function again
                    eTracker.runTracker();
                  }
                );
              });
          });
        });
    });
  };
}

module.exports = UpdateData;