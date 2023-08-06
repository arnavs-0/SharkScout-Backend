const fs = require('fs');
const config = require("../../data/python/config.json");

export default function handler(request, response){
    if (request.method !== "POST"){
        response.status(400).json({ message: 'Only POST requests allowed' })
    }

    const number = request.body["team"];
    const uid = request.body["uid"];
    const res = request.body;
    const {keyMap} = config;
    let data = JSON.stringify(res);
    let file = config.Pit_Directory + "/" + number  + "-" + uid + ".json";
    if (fs.existsSync(file)) {
        file = config.Duplicate_Pit_Directory + "/" + "-" + uid+ ".json";
    }
    fs.appendFile(file, data, "utf8", (err) => {
        if (err) {
            console.log(err);
        }
    });
    response.status(200).json({message: "Success"});

}