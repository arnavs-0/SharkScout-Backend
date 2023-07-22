const express = require("express");
const cors = require("cors");
const fs = require("fs");
const {spawn, exec} = require("child_process");
const admin = require("firebase-admin");
const config = require("./src/config.json");

const serviceAccount = require("./service_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.db_url
});


const app = express();

app.use(cors());
app.options("*", cors());
const port = config.port;

app.use(express.json());

app.get("/", function (request, response) {
    response.send("226 Scouting API");
})

app.get("/reformat", function (request, response) {
    console.log(request.query.file);
    let python;
    if (request.query.file === undefined) {
        python = spawn(config.python_prefix, ["./src/Main.py", "./src/config.json"]);
    } else {
        python = spawn(config.python_prefix, ["./src/Main.py", request.query.file]);
    }

    python.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    python.stderr.on("data", (data) => {
        console.log(`${data}`);
    });

    python.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
        response.sendStatus(200);
    });
});

app.post("/match", function (request, response) {
    console.log(request.body);
    const number = request.body["t"];
    const match = request.body["m"];
    const res = request.body;
    const keyMap = {
        "m": "match",
        "t": "team",
        "a": "Alliance Color",
        "n": "Scouter Name",
        "acol": "Auton Cones Lower",
        "acul": "Auton Cubes Lower",
        "acom": "Auton Cones Mid",
        "acum": "Auton Cubes Mid",
        "acou": "Auton Cones Upper",
        "acuu": "Auton Cubes Upper",
        "acs": "Auton Charge Station",
        "tcol": "Teleop Cones Lower",
        "tcul": "Teleop Cubes Lower",
        "tcom": "Teleop Cones Mid",
        "tcum": "Teleop Cubes Mid",
        "tcou": "Teleop Cones Upper",
        "tcuu": "Teleop Cubes Upper",
        "p": "Piece Pickup",
        "cs": "Charge Station",
        "ud": "Under Defense",
        "on": "Other Notes",
        "dr": "Defense Rating",
        "dn": "Defense Notes",
        "rr": "Robot Rating",
        "ap": "Auton Points",
        "tp": "Teleop Points",
        "ttp": "Total Points"
    }
    let ref = {};
    // for (const key in res) {
    //     if (key.hasOwnProperty(key)) {
    //         ref[keyMap[key]] = res[key]
    //     }
    // }
    Object.keys(res).forEach((key) => {
        ref[keyMap[key]] = res[key]
    })
    let data = JSON.stringify(ref);
    let file = __dirname + "/scouting/" + number + "-" + match + ".json";
    if (fs.existsSync(file)) {
        file = __dirname + "/duplicates/" + number + "-" + match + ".json";
    }
    fs.appendFile(file, data, "utf8", (err) => {
        if (err) {
            console.log(err);
        }
    });
    console.log(data);
    response.sendStatus(200);
});

app.post("/pit", function (request, response) {
    console.log(request.body);
    const number = request.body["team"];
    const uid = request.body["uid"];
    const res = request.body;
    let data = JSON.stringify(res);
    let file = __dirname + "/pit/" + number  + "-" + uid + ".json";
    if (fs.existsSync(file)) {
        file = __dirname + "/duplicates-pit/" + "-" + uid+ ".json";
    }
    fs.appendFile(file, data, "utf8", (err) => {
        if (err) {
            console.log(err);
        }
    });
    fs.appendFile(__dirname + "/compiled-pit-scouting/pit.json", data, "utf8", (err) => {
        if (err){
            console.log(err)
        }
    })
    console.log(data);
    response.sendStatus(200);
});

app.get("/upload", function (request, response) {
    console.log(request.body);

    exec("node uploader.js", (err, stdout) => {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
        response.sendStatus(200);
    })

})

app.get("/backup", function (request, response) {
    console.log(request.query.file);
    exec("firestore-export --accountCredentials service_key.json --backupFile backup.json", (err, stdout) => {
        if (err) {
            console.log(err);
            response.sendStatus(500)
        }
        console.log(stdout);
        response.sendStatus(200);
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
