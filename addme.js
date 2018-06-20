'use strict'
module.exports = function (username, password) {

    var db = require("krakendb")
    var ne = require("node-encrypt")
    db.loaddb("users")

    process.env.ENCRYPTION_KEY = '3a2de17ae6bd50361af8fb43e3076195';

    ne.encrypt({ text: password }, (err, cipher) => {
        db.push(username, [username, cipher, null])
        db.exportdb()
    })

}
