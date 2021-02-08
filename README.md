# employeeTracker

## Description

This project demonstrates a command line input (CLI) application utilizing mySQL database and queries.   The application contains database tables for department, role and employees.   The user is able to create, read, update and delete (CRUD) from the employee tracker database.   The application permits the user via the CLI to view the data in either the department, role or employee table.  The application further allows the user to add data into the department, role and employee tables.  Update functionality permits the user to update an employee's role.

An extensive menu system is displayed to the user grouped by CRUD functionality in order to keep the menu interface clean and intuitive.   This means all the add/create options are under one menu, all the view options are under another menu option and so on.

For bonus features, the application incorporated updating an employee's manager, viewing employees by manager, viewing all employee information from all 3 tables in one result set and allowing user to delete a department, role or employee.  The delete functionality for department and role took into account whether there were related data in the other tables that also needed to be deleted.  For example, if there was a employee that was defined with a role associated to a department, when that department was deleted then the application also deleted corresponding roles associated with the department and the employees associated with those roles.   The same methodology was applied if user was deleting a role.  The application checks if there are employees currently with that role and also deletes those employees.

SQL SELECT queries were utilized everywhere that was possible to display lists of possible selections to the user instead of having the user manually enter an ID or other data that could be mistyped.   This made the application more robust such that the user only had to make selections from lists rather than typing everything in at the command line.

Most of the result sets returned from the SQL queries were manipulated to display department name, role or manager name information instead of just primary key or other integer ID fields that mean nothing to the end user.  The only place the raw ID information is displayed to the end user is where the user selects to just view the department, role or employee table.

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
 
The following is a screenshot of the Team Profile Generator application.

<p align="center">
  <img src="./Develop/images/teamProfileGenerator.png" alt="Team Profile Generator application screenshot">
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

## Video

Due to there being no front end to this project that a user can open in a browser, please view the following video link to get a feel for how the command line application is executed and types of inputs required by the user in order to generate the team profile.

https://drive.google.com/file/d/1dMmgd3qgIDM8XDGsh29zjFfZj8kDA0Og/view?usp=sharing

## Repository

Direct link to repository:  https://github.com/jtoth7824/employeeTracker