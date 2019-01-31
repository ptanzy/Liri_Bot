var fs = require("fs");
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var inquirer = require("inquirer");
var spotify = new Spotify(keys.spotify);


var userCmnds = process.argv.slice(2);
var liriCmnds = {
  "concert-this": {
    type: "input",
    name: "concert",
    message: "To search a concert enter an artist/band name"
  },
  "spotify-this-song": {
    type: "input",
    name: "song",
    message: "To search a song enter the title..."
  },
  "movie-this": {
    type: "input",
    name: "movie",
    message: "To search a movie enter the title..."
  }
};
var randomCmnd = false;
var cmndPrompts = [];
for(var i = 0; i<userCmnds.length; i++){
  var cmnd = userCmnds[i].trim();
  if(cmnd === "do-what-it-says" && userCmnds.length === 1){
    randomCmnd = true;
    continue;
  }
  var liriCmnd = liriCmnds[cmnd]
  if(liriCmnd){
    cmndPrompts.push(liriCmnd);
  }else{
    console.log("Command: ["+cmnd+"] is invalid. (hint"+
      " do-what-it-says command is incompatible with other commands");
  }

}



// Created a series of questions
inquirer.prompt(cmndPrompts).then(async function(user) {
  if(user.song){
    await searchSong(user.song.trim().split(' ').join('+'));
  }
  if(user.concert){
    await searchConcert(user.concert.trim().split(' ').join('+'));
  }
  if(user.movie){
    await searchMovie(user.movie.trim().split(' ').join('+'));
  }

  if(randomCmnd === true){
    randomCmnd = false;
    //TODO random logic
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream('random.txt')
    });
    lineReader.on('error', function(err){
      // error on the stream
    });
    lineReader.on('line', async function (line) {
      var arr = line.split(",");
      var cmnd = arr[0];
      var input = arr[1];
      switch(cmnd) {
        case "concert-this":
          await searchConcert(input);
          break;
        case "spotify-this-song":
          await searchSong(input);
          break;
        case "movie-this":
          await searchMovie(input);
          break;
        default:
          console.log("random.txt command is invalid")
      }
    });
  }
});

async function searchSong(song){
  spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }
    if( data.tracks.items.length > 0){
      var song = data.tracks.items[Math.floor(Math.random()*data.tracks.items.length)];
      console.log("-------------------SONG-------------------");
      console.log("Artist(s): "+song.artists[0].name);
      console.log("Title: "+song.name);
      console.log("Preview: "+song.href);
      console.log("Album: "+song.album.name);
      console.log("------------------------------------------");
    }
  });
}

async function searchConcert(concert){
  axios.get("https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp").then(
    function(response) {
      var failure = "{error=An error occurred while searching.}";
      if(response.statusText === "OK" && response.data.length > 0 && typeof response.data !== "string"){
        var concert = response.data[Math.floor(Math.random()*response.data.length)];
        var venue = concert.venue;
        console.log("-------------------CONCERT-------------------");
        console.log(concert.description);
        console.log("Line Up: "+concert.lineup);
        console.log("Location: "+concert.venue.name);
        console.log("Address: "+venue.city+", "+venue.region+", "+venue.country)
        console.log("Date/Time: "+concert.datetime);
        console.log("---------------------------------------------");
      }else{
        console.log("Status: "+response.statusText+" and data length: "+response.data);
      }
    }
  );
}

async function searchMovie(movie){
  axios.get("http://www.omdbapi.com/?t="+movie+"&y=&plot=short&apikey=trilogy").then(
    function(response) {
      var failure = "{error=An error occurred while searching.}";
      if(response.statusText === "OK" && response.data && typeof response.data !== "string"){
        var info = response.data;
        console.log("-------------------MOVIE-------------------");
        console.log("Title: " + info.Title);
        console.log("Released: " + info.Released);
        console.log("IMDB Rating: " + info.imdbRating);
        console.log("Rotten Rating" + info.Ratings[1]);
        console.log("Country: " + info.Country);
        console.log("Language: " + info.Language);
        console.log("Plot: " + info.Plot);
        console.log("Actors: " + info.Actors);
        console.log("---------------------------------------------");
      }else{
        console.log("Status: "+response.statusText+" and data length: "+response.data);
      }
    }
  );
}
