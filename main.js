'use strict'
module.exports = (function () {
    var db = require("krakendb");
    var fs = require("fs")
	var ne = require("node-encrypt")

    process.env.ENCRYPTION_KEY = '3a2de17ae6bd50361af8fb43e3076195';

    var funcs = {}

    if (db.dbexists("users")) {
        db.loaddb("users");
    } else {
        db.newdb("users", ["email", "pw", "theme", "day"]);
        db.exportdb();
    }

    funcs.getTables = function (user) {
        var tables = fs.readdirSync("tables/" + user);

        var list = []

        for (var i in tables) {
            // list.push(i.split(".").pop())
            var newName = tables[i].split(".")
            var extension = newName.pop();
			if (extension === "json" && tables[i] != "userdata.json") {
	            list.push(funcs.join(newName, "."))
			}
        }
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
	funcs.saveTable = function(user, table) {
		// console.log(table.settings)
		if (table.settings.name) {
			var response = ""
			try {
				fs.writeFileSync(`tables/${user}/${table.settings.name}.json`, JSON.stringify(table))
			} catch (e) {
				response = "Error saving: \n" + e;
			} finally {
				if (!response)
					response = "Save successfull";
			}
			return response;
		} else {
			return "A name must be provided";
		}
	}
	funcs.getProfPic = function (user) {
		if (fs.existsSync(`tables/${user}/userpic.png`)) {
			return fs.readFileSync(`tables/${user}/userpic.png`)
		} else {
			return fs.readFileSync(`./userpic.png`)
		}
	}
	funcs.getUserSettings = function (user) {
		return db.getItem(user);
	}
	funcs.changes = function (body, user) {
		var prevInfo = db.getItem(user)
		if (user) {
			try {
				var err = "1";
				if (body.profPic !== null) {
					fs.writeFileSync(`tables/${user}/userpic.png`, body.profPic, 'binary')
				}
				db.delItem(user)
				ne.encrypt({ text: body.pw }, (err, password) => {
					if (err)
						return "An error occured.";
					console.log(body.theme)
					db.push(body.un, [body.email || prevInfo[1], password || prevInfo[2], body.theme || prevInfo[3] || 1])
					db.exportdb()
					db.loaddb('users')
				});
				if (user !== body.un) {
					fs.renameSync(`tables/${user}`, `tables/${body.un}`);
				}

				return err;
			} catch (e) {
				db.delItem(body.un)
				db.push(prevInfo[0], [prevInfo[1], prevInfo[2], prevInfo[3]])
				return "That username is reserved."
			}
		} else {
			return "500";
		}
	}
	funcs.newTable = function (user, table) {
		try {
			var tabledata = Array(Math.round(table.rows)).fill(0).map(x => Array(Math.round(table.cols)).fill("{\"cont\":\"null\"}"))
			var dat = {
				settings:{
					name: table.name,
					days: {
						mon:true,
						tue:true,
						wed:true,
						thu:true,
						fri:true,
						sat:false,
						sun:false
					},
					size: {
						rows:table.rows,
						cols:table.cols
					},
					notifications:"standard"
				},
				table: tabledata
			}
			fs.writeFileSync(`tables/${user}/${table.name}.json`, JSON.stringify(dat))
		} catch (e) {
			// console.log(e)
			return e
		}
	}
	funcs.getTheme = function (user) {
		if (user !== 1) {
			var themes = ['#3375ef', // blue theme
						  '#f702d8', // pink theme
						  '#13ad02', // green theme
						  '#048e45', // yellow theme
						  '#a72626'] // red theme]
			return themes[Math.round(db.getItem(user, 'theme')) - 1] || '#3375ef'
		} else {
			return '#3375ef';
		}
	}
	funcs.getThemeId = function (user) {
		return db.getItem(user, "theme")
	}
	funcs.deleteTable = function (user, table) {
		fs.unlinkSync(`tables/${user}/${table}.json`)
		return ""
	}
	funcs.getDocs = function () {
		var pages = fs.readdirSync('views/docs')
		var pageList = []
		var blacklist = ["docIndex.pug", "results.pug"]
		pages.forEach((item, index) => {
			if (blacklist.indexOf(item) == -1 ) {
				var doc = { text: item.slice(0, item.length - 4), url: item.substring(0, item.length - 4)}
				doc.text = doc.text.replace(/([A-Z])/g, ' $1').trim();
				doc.text = doc.text[0].toUpperCase() + doc.text.substring(1)
				console.log(doc)
				pageList.push(doc)
			}
		})
		return pageList
	}
	// funcs.getPayload = function (user) {
	// 	try {
	// 		var tables = []
	// 		// parse each table as JSON
	// 		fs.readdirSync(`tables/${user}`).forEach(item => { if (item.substring(item.length - 4) == "json") tables.push(JSON.parse(fs.readFileSync(`tables/${user}/${item}`))) })
	// 		// check for period change
	// 		var subjects = []
	// 		tables.forEach(item => {
	// 			var periods = item.table[(Math.round(db.getItem(user, 'days')) % item.table.length) - 1]
	// 			// console.log(periods)
	// 			periods.forEach(period => {
	// 				var periodInfo;
	// 				if (period.cont) {
	// 					var id = Math.round(period.cont.split("#")[1])
	// 					item.table.forEach(day => {
	// 						day.forEach((loopPeriod, index) => {
	// 							if (loopPeriod.id == id) {
	// 								periodInfo = loopPeriod;
	// 								periodInfo.period = index
	// 								// retrieve period information in case it's an anchored period
	// 							}
	// 						})
	// 					})
	// 				} else {
	// 					periodInfo = period;
	// 					// if it is not an achored period, use the period as-is
	// 					periodInfo.period = periods.indexOf(periodInfo)
	// 					// append periodIndex
	// 				}
	// 				// console.log(periodInfo)
	// 				if (periodInfo) {
	// 				// console.log(periodInfo)
	// 					var betweenTimes = funcs.betweenTimes(periodInfo.start, periodInfo.end)
	// 					// check to make sure that the current period is active at the moment.
	// 					var info
	// 					if (betweenTimes) {
	// 						info = JSON.stringify({ title: periodInfo.name, subjectName: periodInfo.name, location: periodInfo.location })
	// 					} else {
	// 						item.table[periodInfo.period].forEach(periodBlock => {
	// 							if (periodBlock.start != "$period")
	// 								periodInfo.start = periodBlock.start
	// 							if (periodBlock.end != "$period")
	// 								periodInfo.end = periodBlock.end
	//
	// 							// fixed "$period". records period index and scans all periods of same index for start / end times.
	// 						})
	// 						if (periodInfo.start == "$period" || periodInfo.end == "$period") {
	// 							return "a period time was not provided."
	// 						}
	// 					}
	// 					return info
	// 				}
	// 			})
	// 			// subjects.push(periods)
	// 		})
	//
	// 	} catch (e) {
	// 		console.log(e)
	// 	}
	// }
	funcs.getPayload = function (user) {
		var periods = [];
		// stores the periods that will be printed in the notifiction.

		var tables = []
		// parse each table as JSON
		fs.readdirSync(`tables/${user}`).forEach(item => { if (item.substring(item.length - 4) == "json") tables.push(JSON.parse(fs.readFileSync(`tables/${user}/${item}`))) })
		tables.forEach(table => {
			table.table.forEach(day => {
				day.forEach(period => {
					if (period.cont) {
						var id = period.cont.split('#')[1] || period.cont.substring(5)
						console.log(funcs.getPeriodById(id, table.table))
						// console.log(period.cont)
					} else {
						if (period.start == "$period:" && period.end == "$period:") {
							var times = funcs.getPeriodTimes(period.id, table.table)
							period.start = times.start;
							period.end = times.end;
						}
						if (funcs.betweenTimes(period.start, period.end)) {
							periods.push(JSON.stringify({ title: period.name, subjectName: period.name, location: period.location }))
						}
					}
				})
			})
		})
	}
	funcs.betweenTimes = function (startTime, endTime) {
		if (startTime != "$period" && endTime != "$period") {
			var start = Math.round(startTime.split(":")[0] + "." + startTime.split(":")[1])
			var end = Math.round(endTime.split(':')[0] + "." + startTime.split(':')[1])
		} else {
			return "0";
		}
		var current = Math.round(new Date().getHours() + "." + new Date().getMinutes())
		return start <= current && end >= current
	}
	funcs.getPeriodTimes = function (id, table) {
		var p;
		table.forEach((day, i) => {
			day.forEach((period, j) => {
				if (period.id == id) {
					p = period;
					p.period = j
				}
			})
		})

		var doStart = true
		var doEnd = true;
		for (var i in table) {
			if (doStart) {
				if (table[i][p.period].start) {
					p.start = table[i][p.period].start;
					doStart = false
				}
			}
			if (doEnd) {
				if (table[i][p.period].end) {
					p.end = table[i][p.period].end
					doEnd = false
				}
			}
			if (!doStart && !doEnd) {
				break;
			}
		}
		// console.log(p)
		return { start:p.start == "$period:" ? "" : p.start, end:p.end == "$period:" ? "" : p.end }
	}
	// returns day times rather than periods.
	funcs.getPeriodById = function (period, table) {
		var id = Math.round(period) + ''
		// console.log(id)
		var p;
		var broken = false
		for (var i in table) {
			for (var j in table[i]) {
				if (table[i][j].id == id) {
					p = table[i][j]
					broken = true
					break;
				}
			}
		}
		if (!broken) {
			console.log("not found: " + id)
			return 'not found ' + id
		}
		if (p)
			return p
		return p;
	}
    return funcs
})();
