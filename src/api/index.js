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
    const number = request.body["team"];
    const match = request.body["match"];
    const uid = request.body["uid"];
    const res = request.body;
    let data = JSON.stringify(res);
    let file = __dirname + "/scouting/" + number + "-" + match + "-" + uid + ".json";
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
