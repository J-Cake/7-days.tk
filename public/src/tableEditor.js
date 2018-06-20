(function (window) {
	'use strict'

    window.vars = {
        init: function (rows, cols) {

            delete window.sessionStorage.rows
            delete window.sessionStorage.cols

            window.vars.rows = Math.round(rows)
            window.vars.cols = Math.round(cols)

			window.vars.shiftKey = false;
			window.vars.linkedFields = []

            window.vars.table = []
            for (var i = 0; i < window.vars.rows; i++) {
                window.vars.table.push(new Array(window.vars.cols))
            }

            $("#controls").hide();
            $("td").click(function () {
                // open period properties
				if (!window.vars.shiftKey) {
					window.vars.linkedFields.push(this)
	                $(".periodEditor").show()
				} else {
					if (window.vars.linkedFields.indexOf(this) == -1) { // entity is **Not** in list
						window.vars.linkedFields.push(this)
						this.innerHTML += "&#128204;"
						this.setAttribute("anchored", window.vars.linkedFields[0].id)
					}
				}
            })
			$(".periodEditor").hide()
            $("#showSettings").click(function () {
                if (!window.vars.openSettings) {
                    $("#controls").show();
                    window.vars.openSettings = true;
                    $("#showSettings").html("Hide Settings")
                } else {
                    $("#controls").hide();
                    window.vars.openSettings = false;
                    $("#showSettings").html("Show Settings")
                }
            })
            $("#rows").change(function () {
                window.vars.rows = Math.round($("#rows").val())
                window.vars.updateTable();
            })
            $("#cols").change(function () {
                window.vars.cols = Math.round($("#cols").val())
                window.vars.updateTable();
            })
			$(".timePicker").click(function () {
				window.vars.activePicker = this
				window.vars.getTime();
			})
			$("#save").click(function () {
				window.vars.applyPeriod();
			})
        },
        getTimeFromUser: function () {
            return prompt("enter a start time in the fomat of \"HH:MM\" ")
        },
        updateTable: function() {
            if (confirm("Resizing the table will discard everything? Continue?")) {
                var table = "<tbody>"
                for (var i = 0; i < window.vars.rows; i++) {
                    var row = "<tr>"
                    for (var j = 0; j < window.vars.cols; j++) {
                        row += "<td></td>"
                    }
                    table += row + "</tr>"

                }
                $("#tableBody").html(table + "</tbody>")
				window.vars.setTdIds();
            }
        },
        createPeriod: function() {
            $(".periodEditor").show()
        },
        applyPeriod: function() {
            window.vars.addToPeriod(window.vars.convertToJSON($(".periodEditor")[0]), 1, 1);
        },
        convertToJSON: function(htmlObj) {
            // console.log(htmlObj)
            return {
                name: htmlObj.querySelector("#periodName").value,
                start: htmlObj.querySelector("#start").innerHTML || "$period:",
                end: htmlObj.querySelector("#end").innerHTML || "$period:",
                location: htmlObj.querySelector("#location").value
            }
        },
        addToPeriod: function(inf, day, period) {
            if (inf.name && inf.location) {
				window.vars.table[day - 1][period - 1] = inf;
				window.vars.writePeriod(inf)
				$(".periodEditor").hide()
            } else
                alert("Not all required information was correctly entered")
        },
		writePeriod: function (inf) {
			for (var i = 0; i < window.vars.linkedFields.length; i++) {
				if (i != 0) {
					window.vars.linkedFields[i].innerHTML = "$get:#" + window.vars.linkedFields[0].id
				} else {
					var str = `<b class="name">${inf.name}</b><br/><span class="duration">${inf.start} - ${inf.end}</span><br/><span class="location">${inf.location}</span>`
					window.vars.linkedFields[0].innerHTML = str;
				}
			}
			window.vars.linkedFields = [];
		}
    }

})(window);

$(document).ready(function () {
    window.vars.init(window.sessionStorage.rows, window.sessionStorage.cols)
})

window.addEventListener('keydown', e => {
	if (e.keyCode == 16) {
		window.vars.shiftKey = true;
	}
})
window.addEventListener('keyup', e => {
	if (e.keyCode == 16) {
		window.vars.shiftKey = false;
		if (window.vars.linkedFields.length !== 0)
			$(".periodEditor").show()
	}
})
