'use strict';
var express = require('express');
var router = express.Router();

var auth = require("./auth")
var main = require("./main")

var fs = require('fs')
var less = require("less")

var webpush = require('web-push');

var bodyParser = require('body-parser')

var title = "7-days.io";

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.signedIn)
		res.render('index', { title, username: req.session.user, signedIn: req.session.signedIn, errors: req.session.errors });
	else
		res.render('index', { title, errors: req.session.errors });
});
router.post('/', function (req, res) {
	var login = auth.login(req.body.un, req.body.pw)
	console.log(login)
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
	res.redirect('/dashboard')
});
router.get('/signup', function (req, res) {
	res.render("signup", { title, errors: req.session.errors})
})
router.post('/signup', function(req, res) {
	var signup = auth.signup(req.body.un, req.body.email, req.body.pw, req.body.pc);
	console.log(signup)
	req.session.user = req.body.un;
	req.session.signedIn = signup == 1;
	req.session.fromSignup = true;

	req.session.error = signup

	if (signup === 1)
		res.redirect("/dashboard")
	else {
		res.render("signup", { title, errors: signup})
	}
})

router.get('/dashboard', function (req, res) {
	if (req.session.signedIn)
		res.render("dashboard", { title, tables: main.getTables(req.session.user), username: req.session.user, signedIn: true })
	else {
		if (req.session.fromSignup)
			res.redirect('/signup')
		else
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
		res.render('tableEditor', { title, table: main.readTable(req.session.user, req.params.table), signedIn: true })
	} else {
	    req.session.errors = "You need to log in first"
		res.redirect('/')
	}
})
router.put('/dashboard/save', function (req, res) {
	var ajax = req.xhr;
	if (ajax) {
		var response = main.saveTable(req.session.user, req.body)
		res.send(response)
	}
})
router.put('/dashboard/deleteTable', function (req, res) {
	if (req.session.signedIn) {
		try {
			main.deleteTable(req.session.user, req.body.table)
			res.send('1')
		} catch (e) {
			console.log(e)
		}
	}
})
router.get('/myaccount', function (req, res) {
	if (req.session.signedIn) {
		res.render('myaccount', { title, settings: main.getUserSettings(req.session.user), username: req.session.user, signedIn: true, theme: main.getThemeId(req.session.user) })
	} else {
		req.session.errors = "You need to log in first"
		res.redirect('/')
	}
})
router.get('/myaccount/pic', function (req, res) {
	if (req.session.signedIn) {
		res.send(main.getProfPic(req.session.user))
	} else {
		req.session.errors = "You need to log in first"
		res.redirect('/')
	}
})
router.put('/myaccount/saveSettings', function (req, res) {
	bodyParser.json({limit: "3mb"})
	if (req.xhr) {
		res.send(new String(main.changes(req.body, req.session.user)))
	}
})
router.post("/newTable", function (req, res) {
	if (req.session.signedIn) {
		res.send(main.newTable(req.session.user, req.body))
	} else {
		res.send('0');
	}
})
router.post('/docs', function (req, res) {
	var query = req.body.search;
	var spawn = require("child_process").spawn;
	var pythonProcess = spawn('python',["./scan.py", query]);
	pythonProcess.stdout.on('data', function (data) {
		var returnedQuery = data.toString('utf8').trim().split(",")
		var results = []
		returnedQuery.forEach(item => {
			var doc = { text: item.slice(0, item.length), url: item.substring(0, item.length)}
			doc.text = doc.text.replace(/([A-Z])/g, ' $1').trim();
			doc.text = doc.text[0].toUpperCase() + doc.text.substring(1)
			results.push(doc)
		})
		res.render('docs/results', { title, results, username: req.session.user, signedIn: req.session.signedIn })
	});
})
router.get('/docs', function (req, res) {
	res.render('docs/docindex', { title, username: req.session.user, signedIn: req.session.signedIn, docPages: main.getDocs() })
})
router.get('/docs/:page', function (req, res) {
	res.render('docs/' + req.params.page, { title, username: req.session.user, signedIn: req.session.signedIn })
})

var publicKey = "BHDjHOFgmu8QMhhGc43Q9kffe8dYPG5ECFcooxH4b08H8d2WQRh927fPAO6hwsRkoMkRq6CP0ADyFrtTJTIzGsI"
var privateKey = "b5Yq5a8zALsI-Uiro7IIth9jiqhKxaIYM66R_SpaZ_Y"
webpush.setVapidDetails('mailto:jakieschneider13@gmail.com', publicKey, privateKey)

router.post('/subscribe', function (req, res) {
	// get push sub obj
	console.log(req.session)
	if (req.session.signedIn) {
		var subscription = req.body
		var payload = JSON.stringify(main.getPayload(req.session.user))
		// console.log(payload)
		res.status(201).json({});
		webpush.sendNotification(subscription, /* payload */ "hello world", { headers: { "content-type":"application/json" }})
		.then(value => {
			console.log(value)
		})
		.catch(err => console.error(err))
	} else {
		res.status(200).json({})
	}
})

// static files

router.get('/css/master.css', function (req, res) {
	res.set('Content-Type', 'text/css');
	var input = fs.readFileSync(__dirname + '/less/master.less', 'utf-8')
	var options = {
		modifyVars: {
			blue: main.getTheme(req.session.user || 1)/*,
			darkgrey: "#dacbff",
			lightColor: "#2d2f44"*/
		}
	}
	less.render(input, options, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			res.send(result.css)
		}
	})
})
router.get('/css/main.css', function (req, res) {
	res.set('Content-Type', 'text/css');
	var input = fs.readFileSync(__dirname + '/less/main.less', 'utf-8')
	var options = {
		modifyVars: {
			blue: main.getTheme(req.session.user || 1)/*,
			darkgrey: "#dacbff",
			lightColor: "#2d2f44"*/
		}
	}
	less.render(input, options, function (err, result) {
		res.send(result.css)
	})
})
router.get('/hostedImages/:image', function (req, res) {
	var img = req.params.image
	console.log(img)
	res.send(fs.readFileSync(`./hostedImages/${img}`))
})

router.get('/tmp/tanks.zip', (req, res) => {
	res.send(fs.readFileSync("C:/Users/Jacob/Desktop/Tanks.zip"))
})

module.exports = router;
