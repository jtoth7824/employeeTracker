# employeeTracker

## Description

This project demonstrates a command line input (CLI) application utilizing mySQL database and queries.   The Employee Tracker application contains database tables for department, role and employees.   The user is able to create, read, update and delete (CRUD) from the employee tracker database.   The application permits the user via the CLI to view the data in either the department, role or employee table.  The application further allows the user to add data into the department, role and employee tables.  Update functionality permits the user to update an employee's role.

An extensive menu system is displayed to the user grouped by CRUD functionality in order to keep the menu interface clean and intuitive.   This means all the add/create options are under one menu, all the view options are under another menu option and so on.

For bonus features, the application incorporated updating an employee's manager, viewing employees by manager, viewing the total budget of a department.   In addition, viewing all employee information from all 3 tables in one result set and allowing user to delete a department, role or employee was added to the application.  The delete functionality for department and role took into account whether there were related data in the other tables that also needed to be deleted.  For example, if there was an employee with a role associated to a department, when that department was deleted then the application deletes corresponding data from the other tables also.  The same methodology was applied if user was deleting a role.  The application checks if there are employees currently with that role and also deletes those employees.

SQL SELECT queries were utilized everywhere that was possible to display lists of possible selections to the user instead of having the user manually enter an ID or other data that could be mistyped.   This made the application more robust such that the user only had to make selections from lists rather than typing everything in at the command line.

Most of the result sets returned from the SQL queries were manipulated to display department name, role or manager name information instead of just integer ID fields that mean nothing to the end user.  The only place the raw ID information is displayed to the end user is where the user selects to just view the department, role or employee table.

## Table of Contents

* [Screenshots](#Screenshots)
* [Installation](#Installation)
* [Usage](#Usage)
* [Support](#Support)
* [Technologies](#Technologies)
* [Video](#Video)
* [Repository](#Repository)
* [Output](#Output)

## Screenshots

Screen shots are grouped by View, Add, Update and Delete functions.   See Screenshot Table of Contents below:

* [View](#View)
* [Add](#Add)
* [Update](#Update)
* [Delete](#Delete)

The following is a screenshot of the Employee Tracker application Main menu.

<p align="center">
  <img src="./images/employeeTrackerMainMenu.png" alt="Employee tracker application main menu screenshot">
</p>

## View

The following is a screenshot of the Employee Tracker application View menu.

<p align="center">
  <img src="./images/employeeTrackerViewMenu.png" alt="Employee tracker application view menu screenshot">
</p>

The following is a screenshot of the Employee Tracker application View Department results.

<p align="center">
  <img src="./images/employeeTrackerViewDept.png" alt="Employee tracker application view department screenshot">
</p>

The following is a screenshot of the Employee Tracker application View Role results.

<p align="center">
  <img src="./images/employeeTrackerViewRole.png" alt="Employee tracker application view role screenshot">
</p>

The following is a screenshot of the Employee Tracker application View Employee results.

<p align="center">
  <img src="./images/employeeTrackerViewEmployee.png" alt="Employee tracker application view employee screenshot">
</p>

The following is a screenshot of the Employee Tracker application View Employee by Manager results.

<p align="center">
  <img src="./images/employeeTrackerViewEmpByMgr.png" alt="Employee tracker application view employee by manager screenshot">
</p>

The following is a screenshot of the Employee Tracker application View All Employees results.

<p align="center">
  <img src="./images/employeeTrackerViewAllEmp.png" alt="Employee tracker application view all employees screenshot">
</p>

The following is a screenshot of the Employee Tracker application View Total Budget results.

<p align="center">
  <img src="./images/employeeTrackerTotalBudget.png" alt="Employee tracker application view total department budget screenshot">
</p>

## Add

The following is a screenshot of the Employee Tracker application Add Menu.

<p align="center">
  <img src="./images/employeeTrackerAddMenu.png" alt="Employee tracker application Add menu screenshot">
</p>

The following is a screenshot of the Employee Tracker application Add Department option.

<p align="center">
  <img src="./images/employeeTrackerAddDept.png" alt="Employee tracker application add department screenshot">
</p>

The following is a screenshot of the Employee Tracker application Add Role option.

<p align="center">
  <img src="./images/employeeTrackerAddRole.png" alt="Employee tracker application add role screenshot">
</p>

The following is a screenshot of the Employee Tracker application Add Employee option.

<p align="center">
  <img src="./images/employeeTrackerAddEmployee.png" alt="Employee tracker application add employee screenshot">
</p>

## Update

The following is a screenshot of the Employee Tracker application Update menu.

<p align="center">
  <img src="./images/employeeTrackerUpdateMenu.png" alt="Employee tracker application update menu screenshot">
</p>

The following is a screenshot of the Employee Tracker application Update Employee Role option.

<p align="center">
  <img src="./images/employeeTrackerUpdateEmpRole.png" alt="Employee tracker application update employee role screenshot">
</p>

The following is a screenshot of the Employee Tracker application Update Employee Manager option.

<p align="center">
  <img src="./images/employeeTrackerUpdateEmpMgr.png" alt="Employee tracker application update employee manager screenshot">
</p>

## Delete

The following is a screenshot of the Employee Tracker application Delete menu.

<p align="center">
  <img src="./images/employeeTrackerDeleteMenu.png" alt="Employee tracker application delete menu screenshot">
</p>

The following is a screenshot of the Employee Tracker application Delete Department option.

<p align="center">
  <img src="./images/employeeTrackerDeleteDept.png" alt="Employee tracker application delete department screenshot">
</p>

The following is a screenshot of the Employee Tracker application Delete Role option.

<p align="center">
  <img src="./images/employeeTrackerDeleteRole.png" alt="Employee tracker application delete role screenshot">
</p>

The following is a screenshot of the Employee Tracker application Delete Employee option.

<p align="center">
  <img src="./images/employeeTrackerDeleteEmp.png" alt="Employee tracker application delete employee screenshot">
</p>


## Installation

* Install node.js to computer, if not already present.
    * Node.js can be installed from [here](https://nodejs.org/en/)
* Copy all the application files locally to one's machine.
* In a terminal window where you copied the files, install 'inquirer' and 'mysql' using node package manager (npm)
    * **npm install**

## Usage

This application requires Node.js to be installed.  It also requires the user to have installed 'Inquirer' and 'mySQL' via npm.  (See [Installation](#installation) section.)  Once these items have been installed, the user can launch the application from a terminal window as follows:

**node employeeTracker.js**

## Support

Please email me for further information jtoth7824@gmail.com


## Technologies

<div>Node.js</div>
<div>mySQL</div>
<div>Javascript</div>
<div>npm</div>
<div>inquirer</div>

## Video

Due to there being no front end to this project that a user can open in a browser, please view the following video links to get a feel for how the application is executed and types of options available to user to interact with the database tables.

Due to limit on Screencastify of 5 minutes, I have recorded 4 short videos - one for each operation of CRUD.

### view data
https://drive.google.com/file/d/1fvK3-NwZH7Yf-UvJcNltxiG798uKDm-X/view?usp=sharing

### add data
https://drive.google.com/file/d/19jsz2wY62gkj-VScgdu75wjM9lYWugZ0/view?usp=sharing

### update data
https://drive.google.com/file/d/1otkA8BqcynAB6hv6da0zDpVSgkBvi9OV/view?usp=sharing

### delete data
https://drive.google.com/file/d/1w8cZnOBAC1JEZGAyNsebuMjJdY4SZIvo/view?usp=sharing


## Repository

Direct link to repository:  https://github.com/jtoth7824/employeeTracker