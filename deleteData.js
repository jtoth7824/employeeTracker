const inquirer = require('inquirer');
const cTable = require('console.table');
const eTracker = require('./employeeTracker');

class DeleteData {

  // function to delete department (along with corresponding data from role and employee table)
  deleteDept() {
      let deptID;
      // SQL query to select all data from department table
      eTracker.connection.query('SELECT * FROM department', (err, results) => {
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
            eTracker.connection.query('SELECT * FROM employee INNER JOIN role ON role.id = employee.role_id WHERE role.dept_id = ?', [deptID], (err, results) => {
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
                eTracker.connection.query(query,[deptID],(error, results) => {
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
                  eTracker.connection.query(query, (error, results) => {
                    if (error) throw error;
                    // call main menu function again
                    eTracker.runTracker();
                  });
                }); 
              } else {
                // SQL query to select all roles where department matches user selection
                eTracker.connection.query('SELECT * FROM role WHERE role.dept_id = ?', [deptID], (err, results) => {
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
                    eTracker.connection.query(query,[deptID],(error, results) => {
                        if (error) throw error;
                    });
                    // if there were no roles found for the department, then only delete the department
                  } else {
                    // SQL query to delete the department the user selected
                    var query = 'DELETE department FROM department WHERE department.id = ?'
                    eTracker.connection.query(query, [deptID], (error, results) => {
                        if(error) throw error;
                    });
                  };
                  // call main menu function again
                  eTracker.runTracker();
                });
              };
            });
          });
      });
    }
  
    // function to delete role and associated employees with that role
    deleteRole() {
      let roleID;
      // SQL query to retrieve all data in role table
      eTracker.connection.query('SELECT * FROM role', (err, results) => {
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
            eTracker.connection.query(query, [roleID], (error, results) => {
                if (error) throw error;
                // call main menu function again
                eTracker.runTracker();
              });
          });
      });
    };
  
    // function to delete employee
    deleteEmp() {
      let empID;
      // SQL query to select all data from employee table
      eTracker.connection.query('SELECT * FROM employee', (err, results) => {
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
            eTracker.connection.query(query, [empID], (error) => {
                if (error) throw error;
                // call main menu function again
                eTracker.runTracker();
              }
            );
          });
      });
    };
}

module.exports = DeleteData;