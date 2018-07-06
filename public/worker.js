self.addEventListener('push', e => {
	var data = e.data.json()
	console.log("data: " + data)
	self.registration.showNotification(data.title, {
		body: "You now have " + data.subjectName + " at " + data.location,
		icon: '/res/logo.png'
	})
})
