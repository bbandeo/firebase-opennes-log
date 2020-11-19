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
  let c = 0;
  let connectedRef = firebase.database().ref(".info/connected");
  connectedRef.on("value", (snap) => {
    if (snap.val() === true) {
      uploadFeatures = fn.readValues();
      // console.log(uploadFeatures.length);
          if (uploadFeatures.length > 0) {
            payload = {};
                  uploadFeatures.forEach((e) => {
                    const timeString = fn.formatDateNow();
                    let title = e.tagName.replace(/\./g,"-");
                    message = {
                      "tagName": e.tagName,
                      "tagValue": e.tagValue,
                      "Quality": e.Quality,
                      "server_timestamp": {
                        ".sv": "timestamp",
                      },
                      "system_timestamp": e.timeStamp,
                      "hasChanged": e.hasChanged,
                      User: fn.userNum                      
                    };
                    if(message.hasChanged === 1) {payload[`Logs/${title}/${timeString}`] = message;}
                    
                  });
            console.log(payload);
            ref.update(payload);
            console.log("Uploaded..");
            // VER ACA QUE ESTOY SUBIENDO CUALQUIER COSA
          }
          fn.deleteValues();
    } else {
      message = {
          "Descripcion": "Error de conexión con Database",
          "server_timestamp": {
            ".sv": "timestamp",
          },
        }
        console.log("Conexión con DB fracasó");
        setTimeout( () => { 
            console.log("Reintentando conexión"); 
      }, reconnTime);
      }
    console.log(fn.readValues().length);
  });
}, uploadTime);
