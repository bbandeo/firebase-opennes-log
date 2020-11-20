const firebase = require("./firebase-connection");
const buffer = require('./buffer.js');

const printSuccess = (data) => {
    let clientCookie = data.ClientCookie;
    let message = data.Message;
    console.log("\nMessage:" + message + "\nclientCookie: " + clientCookie);
}

const printOnError = (data) => {
    let message = data.Message;
    let errorCode = data.ErrorCode;
    let errorDescription = data.ErrorDescription;
    let clientCookie = data.ClientCookie;

    console.log("\nMessage" + message + "\n Error: " + errorCode + "\n Description: " + errorDescription + "\nclientCookie: " + clientCookie);
}

const printOnSuccess = (data) => {
    let logVal = {};
    for (var i = 0; i < data.length; i++) {
        let changed = data[i].hasChanged;
        if (changed === 1) {
            let tagName = data[i].Name;
            let value = data[i].Value;
            let quality = data[i].Quality;
            let timeStamp = data[i].TimeStamp;
            let time = parseInt((new Date(timeStamp).getTime()).toFixed(0));
            logVal = {
                "tagName": tagName,
                "tagValue": value,
                "Quality": quality,
                "timeStamp": time,
                "hasChanged": changed
            };
            buffer.pushValue(logVal);
        }
    }
}

const printError = (data) => {
    firebase.database().ref(`${longTime}_error`).set({
        "message": data.Message,
        "errorCode": data.ErrorCode,
        "errorDescription": data.ErrorDescription,
        "clientCookie": data.ClientCookie
    });

    console.log("\nMessage" + message + "\nclientCookie: " + clientCookie + "\n Error: " + errorCode + "\n Description: " + errorDescription);
}

module.exports = {
    printSuccess,
    printOnError,
    printOnSuccess,
    printError
}