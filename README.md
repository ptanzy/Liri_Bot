# Liri_Bot
Liri is similar to Siri but is used with written commands through the node.js CL. Liri search for music and movies using the Band in Town Spotify and OMDB APIS. 

Commands Liri can respond to: "concert-this", "spotify-this-song", "movie-this", "do-what-it-says"

Depending on which commands are entered certain inquirer prompt objects will be obtained from a hash obj. 
Inquirer will prompt the user to enter value for a concert, song and/movie depending on which prompt objects were pushed into the prompts array of objects.
A API call will be made for each of the inputs from the user depending on the object type it corresponds to and the results will be displayed to the user.
There is as additional command that has a random.txt file with commands (one or more of the three commands) and entries read and the commands executed.  