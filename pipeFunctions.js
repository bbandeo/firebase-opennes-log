const firebase = require("./firebase/firebase-connection");
const buffer = require('./firebase/buffer.js');


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
        let tagName = data[i].Name;
        let value = data[i].Value;
        let qualityCode = data[i].QualityCode;
        let quality = data[i].Quality;
        let timeStamp = data[i].TimeStamp;
        let errorCode = data[i].ErrorCode;
        let changed = data[i].hasChanged;
        let errorDescription = data[i].ErrorDescription;
        let time = parseInt((new Date(timeStamp).getTime()).toFixed(0));
        let longTime = parseInt((new Date(timeStamp).getTime()).toFixed(0));
        let title = tagName.replace(".", "-");
        logVal = {
            "tagName": tagName,
            "tagValue": value,
            "QualityCode": qualityCode,
            "Quality": quality,
            "date": timeStamp,
            "timeStamp": time,
            "tagValue": value,
            "hasChanged": changed
        };
        buffer.pushValue(logVal);
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

const StopSubscription = () => {
    var Unsubscribecommand = `{"Message":"UnsubscribeTag","ClientCookie":"mySubscription1"}\n`;
    client.write(Unsubscribecommand);
    console.log('Subscription Stopped');
}

module.exports = {
    printSuccess,
    printOnError,
    printOnSuccess,
    printError,
    StopSubscription
}