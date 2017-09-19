var bodyParser = require('body-parser');
var Tests = require('../models/tests');
var Users = require('../models/users');

var ReadAnswers = require('../public/js/readAnswers');
var CheckTest = require('../public/js/checkTest');
var PassExistTest = require('../public/js/passExistTest');
var RewriteSertif = require('../public/js/rewriteSertif');

exports.getTest = function(req, res, next) {
  if (!req.session.currentUser) {
    res.redirect('/login');
  } else {
    Tests.findById(req.params.idTest, function(err, _data) {
      res.render('test', {
        test: _data
      });
    });
  }
};

exports.delTest = function(req, res, next) {
  var currentUser = req.session.currentUser;

  Users.find().exec(
    function(err, users) {
      for (var j = 0; j < users.length; j++) {
        var user = users[j];
        var curentUserResults = user.results;

        for (var i = 0; i < curentUserResults.length; i++) {
          var currentResult = curentUserResults[i];
          if (currentResult._id == req.params.idTest) {
            curentUserResults.splice(i, 1);
            break;
          }
        }
        user.results = curentUserResults;

        user.save(function(err, _data) {
          if (!err) {
            if (currentUser._id == _data._id) {
              req.session.currentUser = _data;
              Tests.remove({
                _id: req.params.idTest
              }, function(err, _data) {
                res.redirect('back');
              });
            }
          }
        });

      }
    }
  );
};

exports.questionAdd = function(req, res, next) {
  var idTest = req.params.idTest;
  Tests.findById(idTest, function(err, _data) {
    var formData = req.body;
    var resultData = new ReadAnswers();
    var answersArr = resultData.parseData(formData);
    var resultsArr = resultData.getResults();

    var questNew = answersArr;
    questNew.question = req.body.questionname;
    questNew.results = resultsArr;

    _data.data.push(questNew);

    _data.save(function(err, _data) {
      if (err) {
        res.status(500).send(err)
      }
      res.redirect('/tests/edit/' + idTest);
    });
  });
};

exports.questionDel = function(req, res, next) {
  var idTest = req.params.idTest;
  var numbQuest = req.params.numbQuest;
  Tests.findById(idTest, function(err, _data) {
    var questArr = _data.data;
    questArr.splice(numbQuest, 1);
    _data.data = questArr;
    _data.save(function(err, _data) {
      if (err) {
        res.status(500).send(err)
      }
      res.redirect('/tests/edit/' + idTest);
    });
  });
};

exports.editSettings = function(req, res, next) {
  var idTest = req.params.idTest;
  Tests.findById(idTest, function(err, _data) {
    var testData = _data;
    _data.name = req.body.testname;
    _data.min = req.body.min;
    _data.trying = req.body.attemptselect;
    _data.publish = (req.body.publish == 'on') ? 'true' : 'false';

    _data.save(function(err, _data) {
      if (err) {
        res.status(500).send(err)
      }
      res.redirect('/tests');
    });
  });
};

exports.checkTest = function(req, res, next) {
  var idTest = req.params.idTest;
  var currentUser = req.session.currentUser;

  Tests.findById(idTest, function(err, _data) {
    var checkTestData = new CheckTest(_data.data, req.body);

    for (var reslt in req.body) {
      checkTestData.checkData(reslt);
    }

    var resultsPersents = checkTestData.getPersents();
    var resultsMark = checkTestData.getResults(_data.min);

    Users.findById(currentUser._id, function(err, userchng) {
      userchng.certif = RewriteSertif(userchng.certif, _data.name, resultsMark);
      console.log(userchng.certif);

      if (resultsMark === 'success') {
        resultsMark = 'pass';
      }

      userchng.results = PassExistTest(userchng.results, idTest, resultsMark, _data.name);

      userchng.save(function(err, userchng) {
        if (!err) {
          req.session.currentUser = userchng;
          var fullResults = checkTestData.readFullResults();
          console.log(fullResults);
          res.render('result', {
            test: _data,
            mark: resultsMark,
            persents: resultsPersents,
            fullResults: fullResults
          });
        }
      });

    });
  });
};
