const fs = require("fs");
var enabled = false;

var currentLog = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`

module.exports.enable = function () {
    enabled = true;
}
module.exports.disable = function () {
    enabled = false;
}
module.exports.log = function (str) {
    if (enabled) {
        if (fs.existsSync("./logs"))
            confirmLog(str);
        else
            fs.mkdir("./logs");
    }

    console.log(str);
}

var confirmLog = function (str) {
    if (fs.existsSync("./logs/" + currentLog + ".log"))
        addToLog(str)
    else
        createLog(str);
}

var addToLog = function (str) {
    var cont = fs.readFileSync("./logs/" + currentLog + ".log", "utf8") + "\n";
    fs.writeFileSync("./logs/" + currentLog + ".log", cont + JSON.stringify(str), "utf8");
}

var createLog = function (str) {
    fs.openSync("./logs/" + currentLog + ".log", "w");
    addToLog(str);
}
module.exports.clearToday = function (log) {
    if (enabled)
        fs.writeFileSync("./logs/" + currentLog + ".log", "", "utf8");
}
module.exports.newSection = function () {
    if (enabled)
        addToLog(" - ");
}
module.exports.newLog = function(name) {
    var files = fs.readdirSync("./logs");
    var num = 0;
    for (var file of files) {
        if (file.indexOf(currentLog) > -1)
            num++
    }
    if (!name) {
        fs.openSync(`./logs/${currentLog}(${num}).log`, "w");
        currentLog = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}(${num})`;
    } else {
        fs.openSync(`./logs/${name}.log`, "w");
        currentLog = name;
    }
}
module.exports.changeCurrentLog = function(log) {
    if (log < 0) {
        if (fs.existsSync(`./logs${new Date().getDate() + log}-${new Date().getMonth() + 1}-${new Date().getFullYear()}(${num}).log`))
            currentLog = `${new Date().getDate() + log}-${new Date().getMonth() + 1}-${new Date().getFullYear()}(${num})`
    } else if (fs.existsSync(log + ".log")) {
        if (fs.existsSync("./logs" + log + ".log"))
            currentLog = log;
    } else if (log == "today") {
        currentLog = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;
    } else {
        fs.openSync(`./logs/${log}.log`, "w");
        currentLog = log;
    }
}
