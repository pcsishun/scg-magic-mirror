/* MagicMirror²
 * Module: Compliments
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("compliments", {
	// Module config defaults.
	defaults: {
		compliments: {
			anytime: ["Hey there sexy!"],
			morning: ["Good morning, handsome!", "Enjoy your day!", "How was your sleep?"],
			afternoon: ["Hello, beauty!", "You look sexy!", "Looking good today!"],
			evening: ["Wow, you look hot!", "You look nice!", "Hi, sexy!"],
			"....-01-01": ["Happy new year!"]
		},
		updateInterval: 5000,
		remoteFile: null,
		fadeSpeed: 4000,
		morningStartTime: 5,
		morningEndTime: 5,
		afternoonStartTime: 5,
		afternoonEndTime: 5,
		random: true,
		mockDate: null
	},
	lastIndexUsed: -1,
	// Set currentweather from module
	currentWeatherType: "",

	// Define required scripts.
	getScripts: function () {
		return ["moment.js"];
	},

	// Define start sequence.
	start: function () {
		Log.info("Starting module: " + this.name);

		this.lastComplimentIndex = -1;

		if (this.config.remoteFile !== null) {
			this.complimentFile((response) => {
				this.config.compliments = JSON.parse(response);
				this.updateDom();
			});
		}

		// Schedule update timer.
		setInterval(() => {
			this.updateDom(this.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	/**
	 * Generate a random index for a list of compliments.
	 *
	 * @param {string[]} compliments Array with compliments.
	 * @returns {number} a random index of given array
	 */
	randomIndex: function (compliments) {
		if (compliments.length === 1) {
			return 0;
		}

		const generate = function () {
			return Math.floor(Math.random() * compliments.length);
		};

		let complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/**
	 * Retrieve an array of compliments for the time of the day.
	 *
	 * @returns {string[]} array with compliments for the time of the day.
	 */
	emotionFaceData:null,
	emotionVoiceData:null,
	 
	// for flask api // 
	// fetchingApiFace(){
	// 	fetch("http://localhost:3000/sending")
	// 	.then(res => res.json())
	// 	.then((data) => {
	// 		console.log("In fetch",data);
	// 		this.emotionFaceData = data
	// 	});
	// },

	// fetchingApiVoice(){
	// 	fetch("http://localhost:3000/sendingtwo")
	// 	.then(res => res.json())
	// 	.then((data) => {
	// 		console.log("In fetch",data);
	// 		this.emotionVoiceData = data
	// 	});	
	// },

	// for debug // 
	fetchingApiFace(){
		fetch("http://localhost:3000/sending")
		.then(response =>{
			// console.log(response);
			if(response.ok){
				//  console.log(response.json()); 
				 response.text().then((data) => {
					//  console.log(data)
					 this.emotionFaceData = data;
					})
				}
			},
		)
		// .then(data => console.log("data ==>", data))
	},

	fetchingApiVoice(){
		fetch("http://localhost:3000/sendingtwo")
		.then(res => res.text()
		.then(data => this.emotionVoiceData = data))
	},

	complimentArray:  function () {
		let compliments = [];

		try{
			
			this.fetchingApiFace();
			this.fetchingApiVoice();
			compliments.push(this.emotionFaceData);
			compliments.push(this.emotionVoiceData)
			// compliments = [this.emotionFaceData];
			console.log("result ==>",compliments)
			// console.log(compliments);
	
			if(compliments[0] === undefined || compliments[0] === null || compliments[0] === NaN){
				compliments = ["loading..."]
				return compliments;
			}else{
				return compliments;
			}
		}catch(err){
			compliments = ["fail to connect server."]
			return compliments
		}

	},



	/**
	 * Retrieve a file from the local filesystem
	 *
	 * @param {Function} callback Called when the file is retrieved.
	 */
	complimentFile: function (callback) {
		const xobj = new XMLHttpRequest(),
			isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			path = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		xobj.overrideMimeType("application/json");
		xobj.open("GET", path, true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState === 4 && xobj.status === 200) {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	},

	/**
	 * Retrieve a random compliment.
	 *
	 * @returns {string} a compliment
	 */
	randomCompliment: function () {
		// get the current time of day compliments list
		const compliments = this.complimentArray();
		// variable for index to next message to display
		let index;
		// are we randomizing
		if (this.config.random) {
			// yes
			index = this.randomIndex(compliments);
		} else {
			// no, sequential
			// if doing sequential, don't fall off the end
			index = this.lastIndexUsed >= compliments.length - 1 ? 0 : ++this.lastIndexUsed;
		}

		return compliments[index] || "";
	},

	// Override dom generator.
	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright pre-line";
		// get the compliment text
		const complimentText = this.randomCompliment();
		// split it into parts on newline text
		const parts = complimentText.split("\n");
		// create a span to hold it all
		const compliment = document.createElement("span");
		// process all the parts of the compliment text
		for (const part of parts) {
			// create a text element for each part
			compliment.appendChild(document.createTextNode(part));
			// add a break `
			compliment.appendChild(document.createElement("BR"));
		}
		// remove the last break
		compliment.lastElementChild.remove();
		wrapper.appendChild(compliment);

		return wrapper;
	},

	// From data currentweather set weather type
	setCurrentWeatherType: function (type) {
		this.currentWeatherType = type;
	},

	// Override notification handler.
	notificationReceived: function (notification, payload, sender) {
		if (notification === "CURRENTWEATHER_TYPE") {
			this.setCurrentWeatherType(payload.type);
		}
	}
});
