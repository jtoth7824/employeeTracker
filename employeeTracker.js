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
function runTracker() {
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

module.exports = {connection, runTracker};

const createData = require('./addData');
const importAddData = new createData;

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
          importAddData.addDepartment();
          break;
        case 'Role':
          importAddData.addRole();
          break;
        case 'Employee':
          importAddData.addEmployee();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      };
    });
};

const viewSQLData = require('./viewData');
const importViewData = new viewSQLData;

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
          importViewData.viewDepartment();
          break;
        case 'Role':
          importViewData.viewRole();
          break;
        case 'Employee':
          importViewData.viewEmployee();
          break;
        case 'View All Employees':
          importViewData.viewAllEmployees();
          break;
        case 'Employee by Manager':
          importViewData.viewEmpByMgr();
          break;
        case 'Total Utilized Budget':
          importViewData.viewBudget();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const updateSQLData = require('./updateData');
const importUpdateData = new updateSQLData;

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
          importUpdateData.updateEmpRole();
          break;
        case 'Employee Manager':
          importUpdateData.updateEmpMgr();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const deleteSQLData = require('./deleteData');
const importDeleteData = new deleteSQLData;

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
          importDeleteData.deleteDept();
          break;
        case 'Role':
          importDeleteData.deleteRole();
          break;
        case 'Employee':
          importDeleteData.deleteEmp();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};