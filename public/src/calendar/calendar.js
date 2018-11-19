(function(window) {
	'use strict'

	window.vars = {
		activeBoxes: 0,
		async clickHandler() {
			let HTML = await window.vars.getTable();
			$(this).html(HTML);
			// console.log([...document.querySelectorAll('.week')])
			$('.week').click(e => window.vars.clickHandler()); // the click handler is reset when the dialog is opened. this will replace the handler
		},
		async init() {
			for (let i = 1; i < 52; i++) {
				$(".layer")[0].appendHTML(`<span class="week">None</span>`);
			}
			$(".week").click(window.vars.clickHandler)
			$(".addRow").click(e => {
				$(".calendarEditor")[0].appendHTML(`<div class="layer"></div>`)
				let layer = $(".layer");
				layer = layer[layer.length - 1];
				for (let i = 1; i < 52; i++) {
					layer.appendHTML(`<span class="week">None</span>`)
				}
				$(".week").click(window.vars.clickHandler)
			})
			$(".save").click(async e => {
				console.log(await (await fetch('/calendar', {
					method: 'POST',
					body: JSON.stringify(window.vars.exportCalendar($(".calendarEditor")[0]))
				})).text())
			})
		},
		async getTable(el) {
			if (window.vars.activeBoxes == 0) {
				let box;
				let uiBoxGetterFunction = async function() {
					let html = `<div class="tablePicker">
					<ul class="dropdown">`
					window.vars.tableList.forEach(table => {
						html += `<li class="table-option">
						${table}
						</li>`
					})
					html += `<li class="table-option">None</li>`
					html += `</ul>
					<div>
					<div name="table" class="output">${window.vars.tableList[0]}</div>
					</div>
					</div>`

					if (window.vars.tableList.length > 1) {
						box = new UIbox(new template({
							content: html,
							buttons: [new button('OK', 'ok'), new button('Cancel', 'cancel')]
						}), "Select table", function() {
							$('.dropdown .table-option')[0].id = 'selected'
							window.vars.selectedTable = $('.dropdown .table-option')[0]
							$('.tablePicker .table-option').click(function() {
								$('.table-option#selected')[0].id = "";
								window.vars.selectedTable = this;
								this.id = 'selected';
								$('.output').html(window.vars.selectedTable.innerHTML)
							})

							window.vars.activeBoxes++;

						}, null, e => window.vars.activeBoxes--, e => window.vars.activeBoxes--);
						return box.get();
					} else {
						return window.vars.tableList[0];
					}
				};
				return await uiBoxGetterFunction();
			}
		},
		exportCalendar(el) {
			let output = [];
			[...el.children].forEach(i => {
				output.push([...i.children].map(j => j.innerHTML != "None" ? j.innerHTML : ""));
			})
			return [...output[0]];
		}
	}

	$(document).ready(() => window.vars.init())
})(window);