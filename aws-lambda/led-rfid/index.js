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
    'TestIntent': function () {
        var that = this;
        var ledStateSlot = this.event.request.intent.slots.NewLedState;
        var stateName;
        if (ledStateSlot && ledStateSlot.value) {
            stateName = ledStateSlot.value.toLowerCase();
        }

        db.ref('authed').once('value', function (snap) {
            var lastScannedTagOwner = snap.val();

            if (lastScannedTagOwner) {
                // Valid tag present
                request({
                    url: 'http://lexa.tuscale.ro/publish',
                    method: 'POST',
                    json: { led: (stateName === "on" ? 1 : 0) }
                },
                    function (error, response, body) {
                        if (error) {
                            return console.error('upload failed:', error);
                        }

                        // Delete scanned tag and notify user of successfull op
                        db.ref('authed').remove();
                        that.emit(':tell', 'Hi ' + lastScannedTagOwner + '! Turning ' + stateName + ' the LED!');
                        console.log('Upload successful!  Server responded with:', body)
                    }
                );
            } else {
                that.emit(':tell', 'Please scan your tag and try again.');
            }
        });
    }
};