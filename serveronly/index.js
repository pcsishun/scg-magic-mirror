const app = require("../js/app.js");
const Log = require("logger");

app.start((config) => {
	const bindAddress = config.address ? config.address : "localhost";
	// const httpType = config.useHttps ? "https" : "http";
	const httpType = "http";
	Log.log("\nReady to go! Please point your browser to: " + httpType + "://" + bindAddress + ":" + config.port);
	Log.log("Hee")
});


// app.start(3030, () => {
//     console.log(`Server running on port 3030, http://localhost:3030`);
// })