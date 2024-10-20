const handlebars = require("express-handlebars");
const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
var mysql = require("mysql2");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "employeemanagement",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("dashboard");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});
//EMPLOYEES

app.get("/employees", (req, res) => {
  connection.query(
    `SELECT EMP.id, EMP.Name AS EMPLOYENAME,Age,Salary,emp.\`phone number\` AS PHONENUMBER,DEP.NAME AS DEPARTMENTNAME FROM employeemanagement.employees AS EMP
    left JOIN employeemanagement.departments AS DEP ON EMP.Department = DEP.id`,
    function (err, results, fields) {
      res.render("employees", { employees: results });
    }
  );
});
//add employeees

app.get("/AddEmployee", (req, res) => {
  connection.query(
    `SELECT id, name FROM departments`,
    (err, results, fields) => {
      res.render("AddEmployee", { departments: results });
    }
  );
});

//edit employee
app.get("/editemployee", (req, res) => {
  let name = req.query.employeename;
  let age = req.query.age;
  let department = req.query.departmentname;
  let salary = req.query.salary;
  let phonenumber = req.query.phonenumber;
  var data = {
    name: name,
    age: age,
    department: department,
    salary: parseInt(salary),
    phonenumber: phonenumber,
  };
  res.render("AddEmployee", data);
});

app.delete("/deleteemployee", (req, res) => {
  let id = req.body.id;
  connection.query(
    `delete FROM employees where id=${id}`,
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("error in deletion");
      }
      res.send("deleted");
    }
  );
});
//save employeee

app.post("/saveemployee", (req, res) => {
  let name = req.body.EmployeeName;
  let age = req.body.EmployeeAge;
  let department = req.body.department;
  let salary = req.body.EmployeeSalary;
  let phonenumber = req.body.EmployeePhoneNumber;
  connection.query(
    `insert into employees (name,age,department,salary,\`phone number\`)
    values('${name}','${age}','${department}','${salary}','${phonenumber}')`,
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("error in addition");
      } else {
        res.redirect("/employees");
      }
    }
  );
});

//DEPARTMENTS

app.get("/departments", (req, res) => {
  connection.query(
    "SELECT * FROM `departments`",
    function (err, results, fields) {
      res.render("departments", { departments: results });
    }
  );
});

app.get("/Adddepartment", (req, res) => {
  res.render("Adddepartment");
});

app.get("/editdepartment/:id", (req, res) => {
  let id = req.params.id;
  let name = req.query.name;
  let description = req.query.description;
  console.log(req.query);
  res.render("Adddepartment", {
    departmentId: id,
    name: name,
    description: description,
  });
});

app.post("/savedepartment", (req, res) => {
  let hiddendepartmentid = req.body.hiddendepartmentid;
  let name = req.body.DepartmentName;
  let description = req.body.Description;

  if (hiddendepartmentid) {
    connection.query(
      `update departments set name = '${name}',description='${description}' where id = ${hiddendepartmentid}`,
      function (err, result) {
        if (err) {
          console.log(err);
          res.send("error in updation");
        }
        res.redirect("departments");
      }
    );
  } else {
    connection.query(
      `insert into departments (name,description)
      values('${name}','${description}')`,
      function (err, result) {
        if (err) {
          console.log(err);
          res.send("error in addition");
        }
        res.redirect("departments");
      }
    );
  }
});

app.delete("/deletedepartment", (req, res) => {
  let id = req.body.id;
  connection.query(
    `delete FROM departments where id=${id}`,
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("error in deletion");
      }
      res.send("deleted");
    }
  );
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
