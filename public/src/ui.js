'use strict';

(function () {
    window.vars.alert = function (body, header) {
		if (body) {
			$(".body").html(body);
			$(".headCont").html(header || "");

			$(".alert").show();
			$(".alert button#closeAlert").click(function () {
				$(".alert").hide();
				$(".headCont").html("")
				$(".body").html("")
			})
		}
	}
})()
