$(document).ready(function () {
	window.vars.urlBase64ToUint8Array = function(base64String) {
		const padding = '='.repeat((4 - base64String.length % 4) % 4);
		const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}
		return outputArray;
	}

	window.vars.key = "BPKB6MzMh3GCxBSHY3LqwFJ0SOJIXBssaEpezIC4WHstHORnyuvUSZxzbyc9CXs8gB031B3tWnduJnT_7oRlFDA"

	window.vars.send = async function () {
		var register = await navigator.serviceWorker.register('/worker.js', {scope:'/dashboard'})
		var subscription = await register.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: window.vars.urlBase64ToUint8Array(window.vars.key)
		})
		await fetch ('/subscribe', {
			method: 'post',
			body: JSON.stringify(subscription),
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json"
			}
		})/*.then(res => {
			return res.text().then(text => {
				console.log(text)
			})
		})*/
	}

	if ('serviceWorker' in navigator) {
		window.vars.send().catch(err => console.error(err))
	}
})
