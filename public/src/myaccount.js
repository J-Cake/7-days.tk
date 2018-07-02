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
							reader.onload = () => {
								data.profPic = reader.result
								window.vars.send(data)
							}
						} else {
							throw new Error("unsupported image type")
						}
						reader.readAsBinaryString(window.vars.droppedFile);
					} else {
						data.profPic = null;
						window.vars.send(data)
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
})()
