'use strict'
module.exports = (function() {
	let db = require("krakendb");
	let fs = require("fs")
	let ne = require("node-encrypt")

	process.env.ENCRYPTION_KEY = '3a2de17ae6bd50361af8fb43e3076195';

	let funcs = {}

	if (db.dbexists("users")) {
		db.loaddb("users");
	} else {
		db.newdb("users", ["email", "pw", "theme", "day"]);
		db.exportdb();
	}

	funcs.getTables = function(user) {
		let tables = fs.readdirSync("tables/" + user);

		let list = []

		for (let i in tables) {
			// list.push(i.split(".").pop())
			let newName = tables[i].split(".")
			let extension = newName.pop();
			if (extension === "json" && tables[i] != "userdata.json") {
				list.push(funcs.join(newName, "."))
			}
		}
		return list
	}

	funcs.join = function(arr, joinChar) {
		let newStr = "";
		for (let i in arr) {
			newStr += arr[i] + joinChar;
		}
		return newStr.slice(0, newStr.length - joinChar.length)
	}
	funcs.readTable = function(user, tableName) {
		return JSON.parse(fs.readFileSync("tables/" + user + "/" + tableName + ".json"))
	}
	funcs.saveTable = function(user, table) {
		// logmaker.log(table.settings)
		if (table.settings.name) {
			let response = ""
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
	funcs.getProfPic = function(user) {
		if (fs.existsSync(`tables/${user}/userpic.png`)) {
			return fs.readFileSync(`tables/${user}/userpic.png`)
		} else {
			return fs.readFileSync(`./userpic.png`)
		}
	}
	funcs.getUserSettings = function(user) {
		return db.getItem(user);
	}
	funcs.changes = function(body, user) {
		let prevInfo = db.getItem(user)
		if (user) {
			try {
				let err = "1";
				body.un = body.un || prevInfo[0]

				if (body.profPic !== null) {
					fs.writeFileSync(`tables/${user}/userpic.png`, body.profPic, 'binary')
				}
				try {
					db.delItem(user)
				} catch (e) {
					console.log(user);
				}
				ne.encrypt({
					text: body.pw
				}, (err, password) => {
					if (err)
						return "An error occured.";
					if (body.pw == "") {
						password = prevInfo[2]
					}
					db.push(body.un, [body.email || prevInfo[1], password || prevInfo[2], body.theme || prevInfo[3] || 1, prevInfo[4] || 1])
					db.exportdb()
					db.loaddb('users')
				});
				if (user !== body.un) {
					fs.renameSync(`tables/${user}`, `tables/${body.un}`);
				}

				return err;
			} catch (e) {
				console.log(e);
				db.delItem(body.un)
				db.push(prevInfo[0], [prevInfo[1], prevInfo[2], prevInfo[3]])
				return "That username is reserved."
			}
		} else {
			return "500";
		}
	}
	funcs.newTable = function(user, table) {
		try {
			let tabledata = Array(Math.round(table.rows)).fill(0).map(x => Array(Math.round(table.cols)).fill("{\"cont\":\"null\"}"))
			let dat = {
				settings: {
					name: table.name,
					days: {
						mon: true,
						tue: true,
						wed: true,
						thu: true,
						fri: true,
						sat: false,
						sun: false
					},
					size: {
						rows: table.rows,
						cols: table.cols
					},
					notifications: "standard"
				},
				table: tabledata
			}
			fs.writeFileSync(`tables/${user}/${table.name}.json`, JSON.stringify(dat))
		} catch (e) {
			// logmaker.log(e)
			return e
		}
	}
	funcs.getTheme = function(user) {
		if (user !== 1) {
			let themes = ['#3375ef', // blue theme
				'#f702d8', // pink theme
				'#13ad02', // green theme
				'#048e45', // darkgreen theme
				'#a72626'
			] // red theme]
			// let theme =
			return themes[Math.round(db.getItem(user, 'theme')) - 1] || '#3375ef'
		} else {
			return '#3375ef';
		}
	}
	funcs.getThemeId = function(user) {
		let theme = db.getItem(user, "theme")
		if (theme == null) {
			db.setItem(user, 'theme', '1');
			theme = db.getItem(user, 'theme');
		}

		return theme;

	}
	funcs.deleteTable = function(user, table) {
		fs.unlinkSync(`tables/${user}/${table}.json`)
		return ""
	}
	funcs.getDocs = function() {
		let pages = fs.readdirSync('views/docs')
		let pageList = []
		let blacklist = ["docIndex.pug", "results.pug"]
		pages.forEach((item, index) => {
			if (blacklist.indexOf(item) == -1) {
				let doc = {
					text: item.slice(0, item.length - 4),
					url: item.substring(0, item.length - 4)
				}
				doc.text = doc.text.replace(/([A-Z])/g, ' $1').trim();
				doc.text = doc.text[0].toUpperCase() + doc.text.substring(1)
				console.log(doc)
				pageList.push(doc)
			}
		})
		return pageList
	}
	funcs.getPayload = function(user) {
		let periods = [];
		// stores the periods that will be printed in the notifiction.

		let tables = []
		// parse each table as JSON
		fs.readdirSync(`tables/${user}`).forEach(item => {
			if (item.substring(item.length - 4) == "json") tables.push(JSON.parse(fs.readFileSync(`tables/${user}/${item}`)))
		})
		tables.forEach(table => {
			table.table.forEach(day => {
				day.forEach(period => {
					if (period.cont) {
						let id = period.cont.split('#')[1] || period.cont.substring(5)
						let p = funcs.getPeriodById(id, table.table)
						if (p !== 0) {
							if (funcs.betweenTimes(p.start, p.end)) {
								periods.push(JSON.stringify({
									title: p.name,
									subjectName: p.name,
									location: p.location
								}))
							}
						}
					} else {
						if (period.start == "$period:" && period.end == "$period:") {
							let times = funcs.getPeriodTimes(period.id, table.table)
							period.start = times.start;
							period.end = times.end;
						}
						if (funcs.betweenTimes(period.start, period.end)) {
							periods.push(JSON.stringify({
								title: period.name,
								subjectName: period.name,
								location: period.location
							}))
						}
					}
				})
			})
		})

		return periods;
	}
	funcs.betweenTimes = function(startTime, endTime) {
		if (startTime != "$period" && endTime != "$period") {
			let start = Number(startTime.split(":")[0] + "." + startTime.split(":")[1])
			let end = Number(endTime.split(':')[0] + "." + startTime.split(':')[1])
		} else {
			return "0";
		}
		let current = Math.round(new Date().getHours() + "." + new Date().getMinutes())
		return start <= current && end >= current
	}
	funcs.getPeriodTimes = function(id, table) {
		let p;
		table.forEach((day, i) => {
			day.forEach((period, j) => {
				if (period.id == id) {
					p = period;
					p.period = j
				}
			})
		})

		let doStart = true
		let doEnd = true;
		for (let i in table) {
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
		return {
			start: p.start == "$period:" ? "" : p.start,
			end: p.end == "$period:" ? "" : p.end
		}
	}
	funcs.whitelist = ["KlaussMC", "demonstation", "Demonstration"];
	funcs.getPeriodById = function(period, table) {
		let id = Math.round(period) + ''
		let p;
		let broken = false
		for (let i in table) {
			for (let j in table[i]) {
				if (table[i][j].id == id) {
					p = table[i][j]
					broken = true
					break;
				}
			}
		}
		if (!broken) {
			return 0
		}
		if (p)
			return p
		return p;
	}
	return funcs
})();