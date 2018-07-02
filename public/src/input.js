'use strict';
(function () {
	'use strict'
    window.vars.getTime = function(picker) {

		window.vars.picker = picker;
		$("#timePicker .title").html("Choose Hour");
        $("#timePicker .cont")[0].innerHTML = `<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>10</li>
		<li>11</li><li>12</li></ul><br/>
		<div class="hours"><div class="am"><input type="radio" name="ampm" id="am" value="am" checked>
		<label for="am">AM</label></div><div class="pm"><input type="radio" name="ampm" id="pm" value="pm"><label for="pm">PM</lable></div>`

		$("#timePicker").show();

        $("#timePicker .cont ul li").click(function () {
            window.vars.selectedHour = Math.round(this.innerHTML) + ($(".hours input[type='radio'][name='ampm']:checked").val() == "pm" ? 12 : 0)

			$("#timePicker .title").html("Choose Minute");
			$("#timePicker .cont")[0].innerHTML = `<div class="minutes">
			<ul><li>05</li><li>10</li><li>15</li><li>20</li><li>25</li>
			<li>30</li><li>35</li><li>40</li><li>45</li><li>50</li><li>55</li><li>00</li></ul>`
            $(".minutes li").click(function () {
                window.vars.selectedMinute = this.innerHTML
				$(".timePicker").html("")
				$("#timePicker").hide();
				var time = window.vars.selectedHour + ":" + window.vars.selectedMinute;
				// window.vars.picker.innerHTML = time;
				// $(window.vars.picker?"#start":"#end").html(time)
				if (window.vars.picker === true) {
					window.vars.start = time
				} else if (window.vars.picker === false) {
					window.vars.end = time
				}
				$("#start").html(window.vars.start || "")
				$("#end").html(window.vars.end || "")
				// window.vars.picker = undefined;
            })
        })
    }
})();
