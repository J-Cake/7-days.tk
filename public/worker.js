self.addEventListener('push', e => {
	let data = e.data
	console.log(data)
	if (data.title && data.subjectName && data.location) {
		self.registration.showNotification(data.title, {
			body: "You now have " + data.subjectName + " at " + data.location,
			icon: '/res/logo.png'
		})
	}
})