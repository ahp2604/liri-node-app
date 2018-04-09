var dotEnv = require("dotenv").config();
var twitter = require('twitter');
var spotifyNpm = require('node-spotify-api');
var request = require('request');
var keys = require('./keys.js');
var fs = require('fs');

//Command Line
// var command = process.argv.filter((value,index) => index > 2).reduce((data, i) => data + " " + i);

// console.log(command); 
//testing if the values are being place in same array.

// var spotify = new Spotify(keys.spotify);
var client = new twitter(keys.twitter);

function tweetHistory(){
    var params = {screen_name: 'andyho2604'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

        tweets.forEach(element => console.log(`Tweet-Message: ${element.text} \nDate Create: ${element.created_at} \n`));
            
    };
        
    
    });
};

tweetHistory();