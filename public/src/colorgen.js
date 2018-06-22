(function () {
	// window.vars.randomColour = function () {
	// 	// window.vars.colors = window.vars.colors || ["#17327a", "#4bccdf", "#42d3cc", "#0359f9", "#74afea", "#021a5f", "#051fa0", "#024661", "#7456ec", "#55bcf7"]
	// 	// return window.vars.colors.pop()
	//
	// }
	window.vars.randomColour = function () {
		var color = "";

		color += "024"[Math.floor(Math.random() * 3)];
		color += "024"[Math.floor(Math.random() * 3)];
		color += "024"[Math.floor(Math.random() * 3)];
		color += "024"[Math.floor(Math.random() * 3)];
		color += "9be"[Math.floor(Math.random() * 3)];
		color += "9be"[Math.floor(Math.random() * 3)];
		return "#" + color;
	}
})();
