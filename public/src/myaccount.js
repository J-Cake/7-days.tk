(function () {
	window.vars = {
		supported: function () {
			var support = 0;
			var div = document.createElement('div');
			support += ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div) ? 1 : 0
			support += 'FormData' in window ? 1 : 0
			support += 'FileReader' in window ? 1 : 0
			return support === 3;
		},
		init: function () {
			window.vars.fileTypes = ['png', 'jpg', 'gif', 'jpeg']

			var $form = $('.box');
			var isAdvancedUpload = window.vars.supported
			if (isAdvancedUpload) {
				$form.addClass('has-advanced-upload');

				window.vars.droppedFile = false;

				$form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
					e.preventDefault();
					e.stopPropagation();
				})
				.on('dragover dragenter', function() {
					$form.addClass('is-dragover');
				})
				.on('dragleave dragend drop', function() {
					$form.removeClass('is-dragover');
				})
				.on('drop', function(e) {
					window.vars.droppedFile = e.originalEvent.dataTransfer.files[0];
				});
			}

			var form = $("#options")
			$("#save").click(function (e) {
				var data = {}
				if (form.hasClass('is-uploading')) return false;

				form.addClass('is-uploading').removeClass('is-error');

				data.un = $("#un").val()
				data.email = $("#email").val()
				data.pw = $("#pw").val()
				data.theme = $(".themeBtn")[0].checked ? 1 : $(".themeBtn")[1].checked ? 2 : $(".themeBtn")[2].checked ? 3 : $(".themeBtn")[3].checked ? 4 : 5

				if (window.vars.supported()) {
					e.preventDefault();
					if (window.vars.droppedFile) {
						var fname = window.vars.droppedFile.name;
						if (window.vars.fileTypes.indexOf(fname.substring(fname.lastIndexOf('.') + 1).toLowerCase()) > -1) {
							var reader = new FileReader();
							reader.onload = async () => {
								data.profPic = reader.result
								// window.vars.send(data)
							 	fetch('/myaccount/saveSettings', {
									headers: { 'Content-type':'application/json',
										'X-Requested-With':'XMLHttpRequest'
									},
									method: 'put',
									body: JSON.stringify(data)
								}).then(res => alert('Saving Failed', 'Error'))
								// .then(res => res.json()).then(res => alert(res))
							}
						} else {
							throw new Error("unsupported image type")
						}
						reader.readAsBinaryString(window.vars.droppedFile);
					} else {
						data.profPic = null;
						console.log(data);
						fetch('/myaccount/saveSettings', {
							headers: { 'Content-type':'application/json',
								'X-Requested-With':'XMLHttpRequest'
							},
							method: 'put',
							body: JSON.stringify(data)
						})
					}
				}
			});
		},
		send: function (data) {
			console.log(data)
			var xhr = new XMLHttpRequest();
			xhr.open('put', '/myaccount/saveSettings', true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(JSON.stringify(data))
		}
	}

	window.alert = function (str, header) {
		new UIbox(new template({content: `str`, buttons: [new button('OK', 'ok')]}), header || "Message").show()
	}
})()
