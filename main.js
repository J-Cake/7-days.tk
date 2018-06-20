'use strict'
module.exports = (function () {
    var db = require("krakendb");
    var fs = require("fs")

    var funcs = {}

    if (db.dbexists("users")) {
        db.loaddb("users");
    } else {
        db.newdb("users", ["un", "pw", "userid"]);
        db.exportdb();
    }

    funcs.getTables = function (user) {
        var tables = fs.readdirSync("tables/" + user);

        var list = []

        for (var i in tables) {
            // list.push(i.split(".").pop())
            var newName = tables[i].split(".")
            newName.pop();
            list.push(funcs.join(newName, "."))
        }
        console.log(list)
        return list
    }

    funcs.join = function(arr, joinChar) {
        var newStr = "";
        for (var i in arr) {
            newStr += arr[i] + joinChar;
        }
        return newStr.slice(0, newStr.length - joinChar.length)
    }
    funcs.readTable = function (user, tableName) {
        return JSON.parse(fs.readFileSync("tables/" + user + "/" + tableName + ".json"))
    }

    return funcs
})();
