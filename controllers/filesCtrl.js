var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var fs = require('fs-extra');
// var Sync = require('sync');

var fileParser = require('../public/js/fileParser');

var Users = require('../models/users');
var Tests = require('../models/tests');

exports.uploadAvatar = function(req, res, next, dirname) {
  var currentUser = req.session.currentUser;
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    fstream = fs.createWriteStream(dirname + '/public/uploads/' + filename);
    file.pipe(fstream);
    fstream.on('close', function() {
      // console.log("Upload Finished of " + filename);
      Users.findById(currentUser._id, function(err, user) {
        user.img = '/uploads/' + filename;
        user.save(function(err, _data) {
          if (err) {
            res.status(500).send(err)
          }
          req.session.currentUser = _data;
          res.redirect('back');
        });
      })
    });
  });
};

exports.addTest = function(req, res, next, dirname) {
  var currentUser = req.session.currentUser;
  var testNew = {};

  var dataTestArr = [];

  var fileUpload;
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    if (filename != '') {
      fileUpload = fs.createWriteStream(dirname + '/public/uploads/' + filename);
      file.pipe(fileUpload);
      fileUpload.on('close', function() {
        // console.log("Upload Finished of " + filename);

        fileParser(req.headers.host, '/uploads/' + filename, function(results) {
          saveFile(results);
        });

      });
    } else {
      saveFile(dataTestArr);
    }

  });

  req.busboy.on('field', function(testname, val, fieldnameTruncated, valTruncated) {
    switch (testname) {
      case 'testname':
        testNew.name = val;
        break;
      case 'attemptselect':
        testNew.trying = val;
        break;
      case 'min':
        testNew.min = val;
        break;
      case 'publish':
        testNew.publish = val;
        break;
    }
  });

  function saveFile(dataTestArr) {
    testNew.data = dataTestArr;
    testNew = new Tests(testNew);

    testNew.save(function(err, _data) {
      if (err) {
        res.status(500).send(err)
      }
      res.redirect('/tests');
    });
  }

};
