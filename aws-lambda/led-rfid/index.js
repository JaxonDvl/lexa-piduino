'use strict';

var Alexa = require('alexa-sdk');
var request = require('request');

var APP_ID = "amzn1.ask.skill.60d67a22-f0c3-468b-8765-9ffdd0d8f3ca";

var firebase = require('firebase');
var firebase_app = firebase.initializeApp({
    apiKey: "AIzaSyB3ZvJDuZ2HD-UppgPvY2by-GI0KnessXw",
    authDomain: "rlexa-9f1ca.firebaseapp.com",
    databaseURL: "https://rlexa-9f1ca.firebaseio.com",
    projectId: "rlexa-9f1ca",
    storageBucket: "rlexa-9f1ca.appspot.com",
    messagingSenderId: "161670508523"
});
var db = firebase.database();

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LedIntent': function () {
        var that = this;
        var ledStateSlot = this.event.request.intent.slots.NewLedState;
        var userStateSlot = this.event.request.intent.slots.UserState;
        var stateName;
        if (ledStateSlot && ledStateSlot.value) {
            stateName = ledStateSlot.value.toLowerCase();
        }
        var name;
        if (userStateSlot && userStateSlot.value) {
            name = userStateSlot.value.toLowerCase();
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }
        // slot user

        // check if it exists as authed if not try again
        db.ref().once('value', function (snap) {
            var isUserLogged = snap.child("authed/" + name).val();
            if (isUserLogged) {
                var userLed = snap.child("users/" + name + "/led").val();
                request({
                    url: 'http://lexa.tuscale.ro/publish',
                    method: 'POST',
                    json: {
                        led: (stateName === "on" ? 1 : 0),
                        userLed: userLed
                    }
                },
                    function (error, response, body) {
                        if (error) {
                            return console.error('upload failed:', error);
                        }
                        that.emit(':tell', 'Hi ' + name + '! Turning ' + stateName + ' the LED!');
                        console.log('Upload successful!  Server responded with:', body)
                    }
                );
            } else {
                that.emit(':tell', 'If you completed the registration, please scan your tag and try again.');
            }
        })

    },
    'SensorIntent': function () {
        var that = this;
        var sensorStateSlot = this.event.request.intent.slots.sensorState;
        var sensorState;
        if (sensorStateSlot && sensorStateSlot.value) {
            sensorState = sensorStateSlot.value.toLowerCase();
        }
        if (sensorState === "temperature") {
            request({
                url: 'http://lexa.tuscale.ro/publish',
                method: 'POST',
                json: {
                    intent: "temp"
                }
            },
                function (error, response, body) {
                    var tempvalue = body.result;
                    if (error) {
                        return console.error('upload failed:', error);
                    }
                    that.emit(':tell', 'The temperature is ' + tempvalue + ' ,have a nice day!');
                    console.log('Upload successful!  Server responded with:', body)
                }
            );
        } else {
            request({
                url: 'http://lexa.tuscale.ro/publish',
                method: 'POST',
                json: {
                    intent: "hum"
                }
            },
                function (error, response, body) {
                    var humvalue = body.result;
                    if (error) {
                        return console.error('upload failed:', error);
                    }
                    that.emit(':tell', 'The humidity is ' + humvalue + ' ,have a nice day!');
                    console.log('Upload successful!  Server responded with:', body)
                }
            );
        }
    }
};