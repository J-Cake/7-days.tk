'use strict';
(function () {
	window.vars.export = function () {

		var table = $("tbody")[0],
			days = table.querySelectorAll("tr");

	    window.vars.table = []
	    for (var i = 0; i < window.vars.rows; i++) {
	        window.vars.table.push(new Array(window.vars.cols))
	    }

		for (var i in days) {
			if (typeof days[i] === 'object') {
				var periods = days[i].querySelectorAll("td")
				for (var j in periods) {
					if (typeof periods[j] !== 'function' && typeof periods[j] !== 'number') {
						// console.log(typeof periods[j])

						var period = periods[j].getAttribute("value") === null ?
							(function () {
								var duration = periods[j].querySelector(".duration")
								// console.log(duration);
								if (duration !== null) {
									duration = duration.innerHTML.split(" - ") || [undefined, undefined]
									return {
										name: periods[j].querySelector(".name").innerHTML,
										start: duration[0],
										end: duration[1],
										location: periods[j].querySelector(".location").innerHTML,
										id: periods[j].id
									}
								} else {
									return { cont: periods[j].getAttribute("value") }
								}
							})() : { cont: periods[j].getAttribute("value") };

						window.vars.table[i][j] = period;
					}
				}
			}
		}
	}
	window.vars.saveTable = function () {
		var obj = {
			settings: window.vars.getSettings(),
			table: window.vars.table
		}
		console.log(obj)
		if (obj.settings.name != "") {
			// console.log(JSON.stringify(obj))
			fetch('/dashboard/save', {
				method: 'PUT', // or 'POST'
				body: JSON.stringify(obj), // data can be `string` or {object}!
				headers:{
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/json'
				}
			}).then((res => { null })())
			.catch((error => { window.vars.alert(error) })())
			.then((response => { if (response) window.vars.alert(response) })());
		} else {
			window.vars.alert("A display name must be provided. Set it in the table settings menu by clicking the settings icon.", "Display Name Not Provided")
		}
	}
	window.vars.getSettings = function () {
		var el = $("#settings")[0],
			settings = {
				name: el.querySelector("#displayName").value,
				days: {
					mon: el.querySelector("#mon").checked,
					tue: el.querySelector("#tue").checked,
					wed: el.querySelector("#wed").checked,
					thu: el.querySelector("#thu").checked,
					fri: el.querySelector("#fri").checked,
					sat: el.querySelector("#sat").checked,
					sun: el.querySelector("#sun").checked
				},
				size: {
					rows: window.vars.rows,
					cols: window.vars.cols
				},
				notifications: window.vars.getNotificationSettings()
			}
		return settings;
	}
	window.vars.getNotificationSettings = function () {
		var options = [...$("input[name='notification']")]
	    return options[0].checked ? "priority" : ( options[1].checked ? "mute" : "standard" )
	}
})();
