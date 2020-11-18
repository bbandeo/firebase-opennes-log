"use strict";
const fn = require("./js/buffer.js");
const firebase = require("./js/firebase-connection");
const { connect } = require("./js/openness-connection");

console.log("Starting..");
connect();

const ref = firebase.database().ref();
const messagesRef = ref.child("messages");
let payload = {};
let message = {};
let uploadFeatures = [];
let uploadTime = 5000;

// DELETE DATABASE
// if (true) { firebase.database().ref().remove(); }

// INTERVALO DE ESCRITURA EN DB
setInterval(() => {
  let connectedRef = firebase.database().ref(".info/connected");
  connectedRef.on("value", function (snap) {
    if (snap.val() === true) {
      uploadFeatures = fn.readValues();
      console.log(uploadFeatures.length);
      if (uploadFeatures.length > 0) {
        payload = {};
        uploadFeatures.forEach((e) => {
          const timeString = fn.formatDateNow();
          let title = e.tagName.replace(".", "-");
          // firebase.database().ref(`${userNum}/${title}`).child(timeString).set({
          message = {
            "tagName": e.tagName,
            "tagValue": e.tagValue,
            "Quality": e.Quality,
            "server_timestamp": {
              ".sv": "timestamp",
            },
            "system_timestamp": e.timeStamp,
            "system_date": e.date,
            "hasChanged": e.hasChanged,
          };
          payload[`Logs/${title}/${timeString}`] = message;
        });
        ref.update(payload);
        console.log("Uploaded..");
        console.log(payload);
        // VER ACA QUE ESTOY SUBIENDO CUALQUIER COSA
      }
    } else console.log("Conexión con DB fracasó");
    console.log(fn.readValues().length);
    fn.deleteValues();
  });
}, uploadTime);
