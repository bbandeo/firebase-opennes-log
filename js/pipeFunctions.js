const firebase = require("./firebase-connection");
const buffer = require('./buffer.js');

const formatDateNow = () => {
    const dateObject = new Date(Date.now());
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();
    const timeString = `${hours}_${minutes}_${seconds}`;
    return timeString;
}   // ACA HAY QUE DARLE VUELTA A LA FECHA. PROBABLEMENTE HAY QUE USAR LA DE SISTEMA NOMAS PORQUE SI SE CAE INTERNET NO HAY FORMA DE REGISTRAR
    // HAY DOS HORAS DE SISTEMA: LA DE SIEMENS Y LA DE WINDOWS

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