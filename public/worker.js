self.addEventListener('push', e => {
	var data = e.data.json()
	self.registration.showNotification(data.title, {
		body: "You now have " + data.subjectName + " at " + data.location,
		icon: '/res/logo.png'
	})
})
