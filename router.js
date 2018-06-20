'use strict'
var express = require('express');
var router = express.Router();

var auth = require("./auth")
var main = require("./main")

var title = "7-days.io";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title, errors: req.session.errors });
});
router.post('/', function (req, res) {
  var login = auth.login(req.body.un, req.body.pw)
	// console.log(login)?
	req.session.user = req.body.un;
	req.session.signedIn = login === 2;
	req.session.fromSignup = false;
	// 1 is pending, 2 is a success, 3 is a password failure, 4 is unknown username
	if (login >= 3) {
		if (login == 4) {
			req.session.error = "Unknown Username";
		} else {
			req.session.error = "Wrong Password";
		}
  }
  req.session.user = req.body.un;
  res.redirect('/dashboard')
});

router.get('/dashboard', function (req, res) {
  if (req.session.signedIn)
		res.render("dashboard", { title, useSecondHeader: req.session.signedIn, tables: main.getTables(req.session.user) })
	else {
    req.session.errors = "You need to log in first"
		res.redirect('/')
  }
})
router.post('/logout', function (req, res) {
  req.session.signedIn = false
  req.session.errors = "Log Out Successfull"
  res.redirect('/')
})
router.get('/dashboard/:table', function (req, res) {
  if (req.session.signedIn) {
    res.render('tableEditor', { title, table: main.readTable(req.session.user, req.params.table) })
  } else {
    req.session.errors = "You need to log in first"
		res.redirect('/')
  }
})

module.exports = router;
