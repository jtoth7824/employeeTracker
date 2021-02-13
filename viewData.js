const inquirer = require('inquirer');
const cTable = require('console.table');
const eTracker = require('./employeeTracker');

class ViewData {

// function to view data in deparment table
viewDepartment() {
    // SQL query to select all data from department table
    eTracker.connection.query('SELECT * FROM Department', (err, res) => {
      // display data in table format using npm package
      console.table(res);
      // call main menu function again
      eTracker.runTracker();
    });
  };
  
  // function to view data in role table
  viewRole() {
    // SQL query to select all data from role table
    eTracker.connection.query('SELECT * FROM Role', (err, res) => {
      // display data in table format using npm package
      console.table(res);
      // call main menu function again
      eTracker.runTracker();
    });
  };
  
  // function to view data in employee table
  viewEmployee() {
    // SQL query to select all data from employee table
    eTracker.connection.query('SELECT * FROM Employee', (err, res) => {
      // display data in table format using npm package
      console.table(res);
      // call main menu function again
      eTracker.runTracker();
    });
  };
  
  // function to view employees by manager
  viewEmpByMgr() {
    // SQL query doing self join on employee table to display employees by their manager
    let query =
      'SELECT CONCAT(m.first_name, " ", m.last_name) AS name, IFNULL(CONCAT(e.first_name, " ", e.last_name), "(No Manager)") AS manager ';
    query +=
      'FROM employee m LEFT JOIN employee e on e.id = m.manager_id ORDER BY m.manager_id';
    eTracker.connection.query(query, (err, res) => {
      if (err) throw err;
      // display data in table format using npm package
      console.table(res);
      // call main menu function again
      eTracker.runTracker();
    });
  };
  
  // function to view all employee data from all tables
  viewAllEmployees() {
    // SQL query joining all the data from employee, role and department tables for display
    let query =
      'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, IFNULL(CONCAT(m.first_name, " ", m.last_name), "null") AS manager ';
    query +=
      'FROM employee e LEFT JOIN employee m on m.id = e.manager_id ';
    query +=
      'INNER JOIN role ON e.role_id = role.id ';
    query +=
      'INNER JOIN department ON department.id = role.dept_id';
    eTracker.connection.query(query, (err, res) => {
      if (err) throw err;
      // display data in table format using npm package
      console.table(res);
      // call main menu function again
      eTracker.runTracker();
    });
  };
  
  // function to view a department's budget
  viewBudget() {
    // SQL query to select all data from department table to generate choice list for CLI
    let query = 'SELECT * FROM department';
    eTracker.connection.query(query, (err, res) => {
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
          eTracker.connection.query(query, [ deptID, deptID ], (err, res) => {
            if(err) throw err;
            // display data in table format using npm package
            console.table(res);
            // call main menu function again
            eTracker.runTracker();
           });
        });
    })
  }
}

module.exports = ViewData;