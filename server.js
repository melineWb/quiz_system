var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var busboy = require('connect-busboy');
var fs = require('fs-extra');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var favicon = require('serve-favicon');
var currentUser = false;

// db connection
// mongoose.connect('mongodb://localhost/testsystem');
mongoose.connect('mongodb://meline:qwerty654321@ds161042.mlab.com:61042/testsystem');


var Users = require('./models/users');
var Tests = require('./models/tests');

// controllers
var userCtrl = require('./controllers/userCtrl');
var filesCtrl = require('./controllers/filesCtrl');
var testsCtrl = require('./controllers/testsCtrl');

var port = process.env.PORT || 8082;

var app = express();

app.use(cookieParser());
app.use(session({
  secret: 'meline_test_system',
  key: 'skey',
  saveUninitialized: true,
  resave: true,
  proxy: true,
  cookie: {
    secure: !true
  }
}));
app.use(flash());
app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.set('views', __dirname + '/views/');
app.set('view engine', 'jade');
app.use('/', express.static(path.join(__dirname + '/public/')));
app.use(favicon(__dirname + '/public/favicon.ico'));

// app.set('trust proxy', 1)

app.get('/', function(req, res, next) {
  if (!req.session.currentUser) {
    res.redirect('/login');
  } else {
    Tests.count({
      publish: true
    }, function(err, _data) {
      res.render('index', {
        currentUser: req.session.currentUser,
        testCount: _data
      });
    })
  }
});

app.post('/fileupload', function(req, res, next) {
  filesCtrl.uploadAvatar(req, res, next, __dirname);
});

//tests logic

app.get('/tests', function(req, res) {
  if (!req.session.currentUser) {
    res.redirect('/login');
  } else {
    Tests.find().exec(
      function(err, _data) {
        res.render('tests', {
          tests: _data,
          currentUser: req.session.currentUser
        });
      }
    );
  }
});

app.get('/tests/add', function(req, res) {
  res.render('add');
});

app.get('/tests/:idTest', testsCtrl.getTest);

app.get('/tests/edit/:idTest', function(req, res) {
  Tests.findById(req.params.idTest, function(err, _data) {
    res.render('edit', {
      test: _data
    });
  });
});

app.post('/tests/add', function(req, res, next) {
  filesCtrl.addTest(req, res, next, __dirname);
});

app.post('/tests/del/:idTest', testsCtrl.delTest);
app.post('/question/add/:idTest', testsCtrl.questionAdd);
app.post('/question/:idTest/del/:numbQuest', testsCtrl.questionDel);
app.post('/settings/:idTest', testsCtrl.editSettings);
app.post('/test/:idTest/check', testsCtrl.checkTest);

//users logic

app.get('/users', userCtrl.getUsers);

app.get('/users/:idUser', function(req, res) {
  Users.findById(req.params.idUser, function(err, user) {
    Tests.count({
      publish: true
    }, function(err, _data) {
      res.render('user', {
        currentUser: user,
        testCount: _data
      })
    })
  })
});

app.post('/users/role/:idUser', userCtrl.userRole);

app.get('/login', function(req, res, next) {
  res.render('login', {
    msg: req.flash('info')
  });
});

app.post('/users/login', userCtrl.login);

app.get('/registration', function(req, res) {
  res.render('registration', {
    msg: req.flash('info')
  });
});

app.post('/users/registration', userCtrl.registration);
app.post('/users/edit', userCtrl.userEdit);

app.get('/logout',
  function(req, res) {
    currentUser = req.session.currentUser = false;
    res.redirect('/login');
  }
);

app.listen(port, function() {
  console.log('server start at http://localhost:' + port);
});
