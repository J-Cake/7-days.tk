(function () {
	window.vars.setTdIds = () => {
		window.vars.tdnum = 1
		var elements = [...document.querySelectorAll("td")]
		elements.forEach(item => {
			item.id = window.vars.tdnum;
			window.vars.tdnum++;
		})
	}

	window.vars.setTdIds();
})();
