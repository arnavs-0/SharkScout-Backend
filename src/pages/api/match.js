const fs = require('fs');
const config = require("../../data/python/config.json");

export default function handler(request, response){
    if (request.method !== "POST"){
        response.status(400).json({ message: 'Only POST requests allowed' })
    }

    const number = request.body["t"];
    const match = request.body["m"];
    const res = request.body;
    const {keyMap} = config;
    let ref = {};
    Object.keys(res).forEach((key) => {
        ref[keyMap[key]] = res[key]
    })
    let data = JSON.stringify(ref);
    let file = config.Working_Directory + "/" + number.split(" ")[0] + "-" + match + ".json";
    if (fs.existsSync(file)) {
        file = config.Duplicate_Directory + "/" + number.split(" ")[0] + "-" + match + ".json";
    }
    fs.appendFile(file, data, "utf8", (err) => {
        if (err) {
            console.log(err);
        }
    });
    response.status(200).json({message: "Success"});

}