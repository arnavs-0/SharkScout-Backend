var admin = require("firebase-admin");
const config = require("./src/config.json");

var serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.db_url
});

const firestore = admin.firestore();
const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "compiled-scouting");

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function (file) {
    var menu = require(`./compiled-scouting/${config.file_name}`);

    menu.forEach(function (obj) {
      firestore
        .collection(config.fb_collection)
        .doc("quals")
        .collection(obj.team + "-" + obj.match)
        .doc(obj.uid)
        .set(obj)
        .then(function (docRef) {
          console.log("Document written");
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    });
  });
});
