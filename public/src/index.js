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

	window.vars.publicKey = "BHDjHOFgmu8QMhhGc43Q9kffe8dYPG5ECFcooxH4b08H8d2WQRh927fPAO6hwsRkoMkRq6CP0ADyFrtTJTIzGsI"

	window.vars.send = async function () {
		console.log('executing send function')
		var register = await navigator.serviceWorker.register('/worker.js', {scope:'/'})
		var subscription = await register.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: window.vars.urlBase64ToUint8Array(window.vars.publicKey)
		})
		await fetch ('/subscribe', {
			method: 'post',
			body: JSON.stringify(subscription),
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json"
			}
		})
	}

	if ('serviceWorker' in navigator) {
		window.vars.send().catch(err => console.error(err))
	}
})
