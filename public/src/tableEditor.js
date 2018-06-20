(function (window) {
	'use strict'

    window.vars = {
        init: function (rows, cols) {

            delete window.sessionStorage.rows
            delete window.sessionStorage.cols

            window.vars.rows = Math.round(rows)
            window.vars.cols = Math.round(cols)

            window.vars.table = []
            for (var i = 0; i < window.vars.rows; i++) {
                window.vars.table.push(new Array(window.vars.cols))
            }

            $("#controls").hide();
            $("td").click(function () {
                // open period properties
                $(".periodEditor").show()
            })
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
                start: htmlObj.querySelector("#start").innerHTML,
                end: htmlObj.querySelector("#end").innerHTML,
                location: htmlObj.querySelector("#location").value
            }
        },
        addToPeriod: function(inf, day, period) {
            if (inf.name && inf.start && inf.end && inf.location)
                window.vars.table[day - 1][period - 1] = inf;
            else
                alert("Not all information was correctly entered")
        }
    }

})(window);

$(document).ready(function () {
    window.vars.init(window.sessionStorage.rows, window.sessionStorage.cols)
})
