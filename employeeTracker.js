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
      const query = 'INSERT INTO Department SET ?'
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
      const query = 'INSERT INTO Role SET ?'
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
    console.log(deptNames);
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
    console.log(roleNames);
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
    console.log(employeeNames);
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
var john = [];
const updateEmpMgr = () => {
  // query the database for all items being auctioned
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({ first_name, last_name }) => {
              temp = first_name + ' ' + last_name;
              choiceArray.push(temp);
            });
            return john = choiceArray;
          },
          message: 'Which employee would you like to update manager for?',
        },
        {
          name: 'updatedID',
          type: 'input',
          message: 'What is the new manager ID for the selected employee?',
        }
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenName;
        john.forEach((name, index) => {
          var temp1 = john[0].split(" ");
          console.log(name);
          if ( john[index].split(" ")[1] === temp1[1]) {
            chosenName = index;
          }
        });

          var query = 'UPDATE employee SET ? WHERE ?';
          connection.query(
            query,
            [{
                manager_id: answer.updatedID,
              },
              {
                id: chosenName +1,
              },
            ],
            (error) => {
              if (error) throw err;
              runTracker();
            }
          );
      });
  });
};

const updateEmpRole = () => {
  john = [];
  // query the database for all items being auctioned
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({ first_name, last_name }) => {
              temp = first_name + ' ' + last_name;
              choiceArray.push(temp);
            });
            return john = choiceArray;
          },
          message: 'Which employee would you like to update Role for?',
        },
        {
          name: 'updatedRole',
          type: 'input',
          message: 'What is the new Role ID for the selected employee?',
        }
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenName;
        john.forEach((name, index) => {
          var temp1 = john[0].split(" ");
          console.log(name);
          if ( john[index].split(" ")[1] === temp1[1]) {
            chosenName = index;
          }
        });

          var query = 'UPDATE employee SET ? WHERE ?';
          connection.query(
            query,
            [{
                role_id: answer.updatedRole,
              },
              {
                id: chosenName +1,
              },
            ],
            (error) => {
              if (error) throw err;
              runTracker();
            }
          );
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
      .prompt([
        {
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({ name }) => {
              choiceArray.push(name);
            });
            return john = choiceArray;
          },
          message: 'Which department would you like to delete?',
        },
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenName;
        console.log(john);
        john.forEach((name, index) => {
//          var temp1 = john[0].split(" ");
          console.log(name);
          if ( name === answer.choice) {
            chosenName = index;
          }
        });

          var query = 'DELETE FROM department WHERE ?';
          connection.query(
            query,
            [ {
                id: chosenName +1,
              },
            ],
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
      .prompt([
        {
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({ title }) => {
              choiceArray.push(title);
            });
            return john = choiceArray;
          },
          message: 'Which role would you like to delete?',
        },
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenName;
        console.log(john);
        john.forEach((name, index) => {
//          var temp1 = john[0].split(" ");
          console.log(name);
          if ( name === answer.choice) {
            chosenName = index;
          }
        });

          var query = 'DELETE FROM role WHERE ?';
          connection.query(
            query,
            [ {
                id: chosenName +1,
              },
            ],
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
      .prompt([
        {
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({ first_name, last_name }) => {
              temp = first_name + ' ' + last_name;
              choiceArray.push(temp);
            });
            return john = choiceArray;
          },
          message: 'Which employee would you like to delete?',
        },
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenName;
        john.forEach((name, index) => {
          var temp1 = john[0].split(" ");
          console.log(name);
          if ( john[index].split(" ")[1] === temp1[1]) {
            chosenName = index;
          }
        });

          var query = 'DELETE FROM employee WHERE ?';
          connection.query(
            query,
            [ {
                id: chosenName +1,
              },
            ],
            (error) => {
              if (error) throw err;
              runTracker();
            }
          );
      });
  });
};

const songAndAlbumSearch = () => {
  inquirer
    .prompt({
      name: 'artist',
      type: 'input',
      message: 'What artist would you like to search for?',
    })
    .then((answer) => {
      let query =
        'SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ';
      query +=
        'FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ';
      query +=
        '= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position';

      connection.query(query, [answer.artist, answer.artist], (err, res) => {


        runSearch();
      });
    });
};