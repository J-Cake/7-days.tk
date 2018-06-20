(function () {
	'use strict'
    window.vars.getTime = function() {
        $(".input").html(`<div class="hours"><input type="radio" name="ampm" id="am" value="am" checked>
						<label for="am">AM</label><input type="radio" name="ampm" id="pm" value="pm"><label for="pm">PM</lable><br/>
						<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>10</li>
						<li>11</li><li>12</li>`)

        $(".hours li").click(function () {
            window.vars.selectedHour = Math.round(this.innerHTML) + ($(".hours input[type='radio'][name='ampm']:checked").val() == "pm" ? 12 : 0)
            $(".input").html(`<div class="minutes"><ul><li>05</li><li>10</li><li>15</li><li>20</li><li>25</li>
							<li>30</li><li>35</li><li>40</li><li>45</li><li>50</li><li>55</li><li>00</li>`)
            $(".minutes li").click(function () {
                window.vars.selectedMinute = this.innerHTML
				$(".input").html("")
				var time = window.vars.selectedHour + ":" + window.vars.selectedMinute;
				window.vars.activePicker.innerHTML = time;
				window.vars.activePicker = undefined
            })
        })
    }
})()
