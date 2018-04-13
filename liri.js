var dotEnv = require("dotenv").config();
var keys = require('./keys.js');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require('request');
var fs = require('fs');
var client = new twitter(keys.twitter);

//Command Line
var commandNames = process.argv.filter((value,index) => index > 2).reduce((a, b) => {return a + " " + b},"");
var command = process.argv[2];

//Switch Case for different command scenarios
switch(command) {
    case "my-tweets":
        tweetHistory();
        break;
    case "spotify-this-song":
        if(commandNames){
            showSongs(commandNames);
        }
        else{
            console.log("The Sign" + "by Ace of Base")
        }
        break;
    case "movie-this":
        if(commandNames){

            showMovie(commandNames);
        }else{
            showMovie("Mr.Nobody");
        }
        break;
    case "do-what-it-says":
        doIt();
        break;

    default:
        console.log("{Enter a command: my-tweets, spotify-this-song, movie-this}");
        console.log("-----Pick a song name for command 'spotify-this-song' ----- Pick a movie name for command 'movie-this'-----");
      break;
}

//Function to populate the last 20 tweets
function tweetHistory(){
    var params = {screen_name: 'andyho2604'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
                console.log("TWEETS HISTORY")
                tweets.forEach(element => {console.log(`Tweet-Message: ${element.text} \nDate Create: ${element.created_at}`);console.log("---------------------------");
                fs.appendFile("log.txt",`\n*******TWEETS HISTORY\n\nTweet-Message: ${element.text} \nDate Create: ${element.created_at}\n\n`)})
            };
        });
};

// Function to populate songs
function showSongs(commandNames){
    spotify.search({ type: `track`, query: commandNames }, function(err, data) {
        if (!err) {
        //   return console.log(data);

            var dataA = data.tracks.items[0].album;
            // console.log(dataA)

            console.log(`Album Type: ${dataA.album_type} \nArtist: ${dataA.artists[0].name} \nThe song name: ${commandNames} \nLink: ${dataA.external_urls.spotify}`)
            fs.appendFile("log.txt",`\n*****Show Songs\n\nAlbum Type: ${dataA.album_type} \nArtist: ${dataA.artists[0].name} \nThe song name: ${commandNames} \nLink: ${dataA.external_urls.spotify}\n\n`)
        }
    });
};

//Function to show movie details
function showMovie(commandNames){
    var queryUrl = `http://www.omdbapi.com/?t=${commandNames}&y=&plot=short&apikey=trilogy`;

    request(queryUrl,function(error,response,body){

        if(!error && response.statusCode === 200){

            var parsing = JSON.parse(body);
            console.log(`Title: ${parsing.Title} \nYear: ${parsing.Released}`);

            var accessRatings = (parsing.Ratings).filter((item,index) => index < 2 )
            accessRatings.forEach(element => {console.log(`${element.Source} Rating: ${element.Value}`)});

            console.log(`Country: ${parsing.Country} \nLanguage: ${parsing.Language} \nPlot: ${parsing.Plot} \nActors: ${parsing.Actors}`)
            fs.appendFile("log.txt",`\nShow Movie*****\n\nTitle: ${parsing.Title} \nYear: ${parsing.Released} \nCountry: ${parsing.Country} \nLanguage: ${parsing.Language} \nPlot: ${parsing.Plot} \nActors: ${parsing.Actors}\n\n`)
            };
        })
};

//Function readfile from random.txt and run the command on that text file
function doIt() {
    fs.readFile("random.txt","utf8", function(error,data){
        if(!error){
            //console.log(data);
            var autoCommand = data.split(',')
            
            if(autoCommand[0] == "spotify-this-song"){
                showSongs(autoCommand[1])
            }else if(autoCommand[0] == "movie-this"){
                showMovie(autoCommand[1]);
            }else if(autoCommand[0] == "my-tweets"){
                tweetHistory();
            }else{
                console.log("No command stored")
            };

            //Beta testing for multiple command in randomText
            // var autoCommands = data.split('\r\n');
            // var autoCommand = [];
            // while(autoCommands.length){
            //     autoCommand = autoCommands.splice(0,1)
            //     autoCommand.forEach((element,index)=> {var remove = element.split(",");console.log(remove)})
            // };
        }
    })
}