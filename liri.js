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
  if(cmnd === "do-what-it-says"){
    randomCmnd = true;
    continue;
  }
  var liriCmnd = liriCmnds[cmnd]
  if(liriCmnd){
    cmndPrompts.push(liriCmnd);
  }else{
    console.log("Command: ["+cmnd+"] is invalid")
  }

}

// Created a series of questions
inquirer.prompt(cmndPrompts).then(function(user) {
  var song = user.song.trip().split(' ').join('+');
  var concert = user.concert.trip().split(' ').join('+');
  var movie = user.movie.trip().split(' ').join('+');
  if(song){
    searchSong(song);
  }
  if(concert){
    // Then run a request with axios to the OMDB API with the movie specified
    searchConcert(concert);
  }
  if(movie){
    // Then run a request with axios to the OMDB API with the movie specified
    searchMovie(movie);
  }

  if(randomCmnd === true){
    //TODO random logic
  }
});

function searchSong(song){
  spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log(data); 
  });
}

function searchConcert(concert){
  axios.get("https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp").then(
    function(response) {
      console.log("The movie's rating is: " + response);
    }
  );
}

function searchMovie(movie){
  axios.get("http://www.omdbapi.com/?t="+movie+"&y=&plot=short&apikey=trilogy").then(
    function(response) {
      console.log("The movie's rating is: " + response);
    }
  );
}
