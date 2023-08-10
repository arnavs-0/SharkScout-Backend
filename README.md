<img src="https://yt3.ggpht.com/ytc/AKedOLS6CuwrrOvURWxJNMZt0KjWetOmkT6MJIP8DuGItQ=s900-c-k-c0x00ffffff-no-rj" align="right" width="150" height="150"/>

# SharkScout Backend

SharkScout is a configurable PWA FRC robot scouting application for FRC team 226. It is a fast offline-first application that allows you to scout robots and teams without having to be connected to the internet by generating QRCodes and submitting it to the Backend Database. It also has the ability to submit data to Firebase when internet connection is available.

Note this app is pairs with the [SharkScout PWA](https://github.com/arnavs-0/SharkScout-PWA) which is a server that stores the data by scanning QR codes.

** Please Note: Documentation is still in the works. If you have any questions feel free to open an issue **

**There Appears to be a Bug with Git renaming `viewer.js` to `Viewer.js,` if you are having issues with the viewer, please rename the file to `viewer.js`**

## Required Tools

- [Node.js](https://nodejs.org) version 14 LTS or greater (tested on Node.js 18.17.0)
- [Yarn](https://yarnpkg.com) version 1.22 or greater (tested on Yarn 1.22.17)
- [Git](https://git-scm.com) version 2.22 or greater (tested on Git 2.22.0)

## Setup Environment

1. `git clone https://github.com/arnavs-0/SharkScout-Backend.git`
2. `cd SharkScout-Backend`
3. `yarn`
4. In `src/data/compiled` ensure that the following directories exist: `compiled-pit`, `compiled-scouting`, `csv`
   1. In `compiled-pit` and `compiled-scouting` create a `compiled.json` file with the following: `[]`
      This will populate with all the data that is scanned into one file
    2. In `csv` create a `compiled.csv` file
5. In `src/data/raw` ensure that the following directories exist: `scouting`, `scouting-pit`, `duplicates`, `duplicates-pit`, each item scanned will have an individual file placed into these directories
6.  In `src/data/python/config.json` change the config file to the correct values
7.  In the root dir run `yarn run dev` to start the app backend.
8.  Go to `localhost:3000` to view the app


*Note: In the event of errors for parsing values, you might need to wait for the backend to complete parsing, the frontend loads faster than the backend*