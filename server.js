var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var mysql = require('mysql');
var app = express();

// start mysql configuration
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_demo'
});

con.connect(function (err) {
  if (err) {
    throw err;
  }
});
// end mysql configuration

app.use(bodyParser());
app.use(cors());
app.use(fileUpload());

// start routes
app.get('/', function (req, res) {
  res.status(200).json({
    status: 'success'
  });
});

app.post('/login', function (req, res) {
  let email = req.body.email;
  console.log("login email : " + email);
  let sql = "SELECT * FROM users WHERE email = ?";
  con.query(sql, [email], function (err, result) {
    if (err) {
      throw err;
    }
    if (result[0].password == req.body.password) {
        res.status(200).json({
          status: 'success',
          data: result
        });
    }else {
      res.status(400).json({
          status: 'error'
      });
    }
  });
});

app.post('/register', function (req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let sql = "INSERT INTO users(name, email, password) VALUES(?, ?, ?)";
  con.query(sql, [name, email, password], function (err, result) {
    if (err) {
      throw err;
      res.status(400).json({
          status: 'error'
      });
    }
    res.status(200).json({
      status: 'success'
    });
  });
});

app.post('/updateProfile', function (req, res) {

  let id = req.body.id;
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  let sql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
  con.query(sql, [name, email, password, id], function (err, result) {
    if (err) {
      throw err;
      res.status(400).json({
          status: 'error'
      });
    }else {
      res.status(200).json({
          status: 'success',
          data: {
            id: id,
            name: name,
            email: email,
            password: password
          }
      });
    }
    console.log("Update profile success");
  });
});

app.post('/land', function (req, res) {
  let name = req.body.name;
  let area = req.body.area;
  let doc = "files/"+req.files.doc.name;
  let file = req.files.doc;
  file.mv('./'+doc,function (err) {
    if (err) {
      throw err;
    }
  });
  let sql = "INSERT INTO lands(name, area, document) VALUES (?, ?, ?)";
  con.query(sql, [name, area, doc], function (err, result) {
    if (err) {
      throw err;
      res.status(400).json({
        status: 'error'
      });
    }
    res.status(200).json({
      status: 'success'
    });
    console.log("Land created");
  });
});

app.get('/land', function (req, res) {
  con.query("SELECT * FROM lands", function (err, result) {
    if (err) {
      throw err;
      res.status(400).json({
        status: 'error'
      });
    }
    res.status(200).json({
      status: 'success',
      data: result
    });
  });
});

app.post('/updateLand', function (req, res) {
  let id = req.body.id;
  let name = req.body.name;
  let area = req.body.area;
  let doc = "files/"+req.files.doc.name;
  let file = req.files.doc;
  file.mv('./'+doc,function (err) {
    if (err) {
      throw err;
    }
  });
  let sql = "UPDATE lands SET name = ?, area = ?, document = ? WHERE id = ?";
  con.query(sql, [name, area, doc, id], function (err, result) {
    if (err) {
      throw err;
      res.status(400).json({
          status: 'error'
      });
    }
    res.status(200).json({
        status: 'success'
    });
  });
});

app.post('/deleteLand', function (req, res) {
  let id = req.body.id;
  let sql = "DELETE FROM lands WHERE id = ?";
  con.query(sql, [id], function (err, result) {
    if (err) {
      throw err;
      res.status(400).json({
          status: 'error'
      });
    }
    res.status(200).json({
        status: 'success'
    });
  });
});
//end routes

// server config
var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server is running at http://%s:%s", host, port);
});
