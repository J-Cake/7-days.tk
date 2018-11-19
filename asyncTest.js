async function getVal () {
	return "hello world";
}
async function start () {
	console.log(await getVal())
}

start()
