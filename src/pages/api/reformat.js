const {spawn, exec} = require("child_process");
const config = require("../../data/python/config.json");

export default function handler(request, response){
    console.log(request.query.file);
    let python;
    if (request.query.file === undefined) {
        python = spawn(config.python_prefix, ["src/data/python/Main.py", "src/data/python/config.json"]);
    } else {
        python = spawn(config.python_prefix, ["src/data/python/Main.py", request.query.file]);
    }

    python.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    python.stderr.on("data", (data) => {
        console.log(`${data}`);
        
    });

    python.on("exit", (code) => {
        if (code === 0) {
            response.status(200).json({message: "Success"});
        } else {
            response.status(500).json({message: "Error"});
        }
    });

    
}