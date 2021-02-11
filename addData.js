const inquirer = require('inquirer');
const cTable = require('console.table');
const eTracker = require('./employeeTracker');

// function to add a department to database table
class CreateData {
    addDepartment() {
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
          eTracker.connection.query(query, {name: answer.name}, (err, res) => {
            // call main menu function again
            eTracker.runTracker();
          });
        });
    }

// function to add a Role to the database table
  addRole() {
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
        eTracker.connection.query('SELECT * FROM department', (err, results) => {
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
              eTracker.connection.query(query, {title: title, salary: salary, dept_id: deptID}, (err, res) => {
              if(err) throw err;
                // call main menu function again
                eTracker.runTracker();
              });
            });
        });
      });
  }
  // function to add employee
  addEmployee = () => {
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
      eTracker.connection.query('SELECT * FROM role', (err, results) => {
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
            eTracker.connection.query('SELECT * FROM employee', (err, results) => {
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
                      choiceArray.push('None');
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
                    else if(answer.manager === 'None') {
                      // employee has no manager
                     mgr = null;
                    };
                  });
                  // SQL query to add employee data to the employee table
                  const query = 'INSERT INTO Employee SET ?'
                    eTracker.connection.query(query, {first_name: firstname, last_name: lastname, manager_id: mgr, role_id: role}, (err, res) => {
                      if(err) throw err;
                      // call main menu function again
                      eTracker.runTracker();
                    });
                });
            });
        });
      });
    });
  }
 }

module.exports = CreateData;