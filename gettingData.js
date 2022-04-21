// import { async } from "node-ical";

const axios = require("axios");

const gettingDatas = async () => {
		const datas = await axios.get("http://localhost:3000/sending");
        const eachData = datas.data; 
        console.log(eachData)
 
}

gettingDatas()

