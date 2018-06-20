'use strict'
module.exports = (function () {
    var db = require("krakendb");
    var ne = require("node-encrypt");

    process.env.ENCRYPTION_KEY = '3a2de17ae6bd50361af8fb43e3076195';

    var funcs = {}

    if (db.dbexists("users")) {
        db.loaddb("users");
    } else {
        db.newdb("users", ["un", "pw", "userid"]);
        db.exportdb();
    }

    funcs.login = function (un, pw) {
		if (db.indb(un)) {
			var pass = 1;
			// console.log("checking passwords")
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

    return funcs;

})();
