'use strict'
module.exports = (function () {
    var db = require("krakendb");
    var ne = require("node-encrypt");
	var fs = require("fs")
	var logmaker = require('logmaker')

    process.env.ENCRYPTION_KEY = '3a2de17ae6bd50361af8fb43e3076195';

    var funcs = {}

    if (db.dbexists("users")) {
        db.loaddb("users");
    } else {
        db.newdb("users", ["email", "pw", "theme", "day"]);
        db.exportdb();
    }

    funcs.login = function (un, pw) {
		if (db.indb(un)) {
			var pass = 1;
			// logmaker.log("checking passwords")
			ne.decrypt({ cipher: db.getItem(un, 'pw') }, (err, plaintext) => {
				pass = plaintext === pw ? 2 : 3;
			})
			while (pass) {
				if (pass !== 1)
					return pass;
			}
		} else {
			return 4;
		}
    }
	funcs.signup = function (un, email, pw, pc) {
		if (!db.indb(un) && !db.indb(email)) {
			if (pw == pc) {
				ne.encrypt({ text: pw }, (err, password) => {
					if (err)
						return "An error occured.";
					logmaker.log(password)
					db.push(un, [email, password, 1, 1]);
					if (db.getItem(un, 'pw') == null)
						db.setItem(un, 'pw', password)
					db.exportdb();
				});
				try {
					fs.mkdirSync(`./tables/${un}`)
				} catch (e) { null; }
				return 1;
			} else {
				return "Passwords don't match.";
			}
		} else {
			return "The Username or Email is taken.";
		}
	}

    return funcs;

})();
