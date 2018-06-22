(function () {
	window.vars.setTdIds = () => {
		window.vars.tdnum = 1
		var elements = [...document.querySelectorAll("td")]
		elements.forEach(item => {
			item.id = window.vars.tdnum;
			window.vars.tdnum++;
			item.style.background = window.vars.randomColour();
		})

		elements.forEach(item => {
			if (item.innerHTML.substring(0, 5) === "$get:") {
				item.setAttribute("value", item.innerHTML);
				var id = item.innerHTML.substring(5)
				console.log(id)
				var source = $(id)[0]
				item.innerHTML = source.innerHTML
				item.style.background = source.style.background;
			}
		})
	}

	window.vars.setTdIds();

	window.vars.showTableProperly = function () {
		[...$("td")].forEach(item => {
			if (item.innerHTML.substring(0, 5) === "$get:") {
				item.setAttribute("value", item.innerHTML);
				var id = item.innerHTML.substring(5)
				console.log(id)
				var source = $(id)[0]
				item.innerHTML = source.innerHTML
				item.style.background = source.style.background;
			}
		})
	}
})();
