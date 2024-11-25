import express  from "express";
import "dotenv/config";
import "./db";

const app = express();

const PORT = 8989;

app.listen(PORT, () =>{
    console.log("Port is listening on port " + PORT);
})


/**
 * The Plan and features
 * upload audio files
 * Listen to single audio
 * add to favorites
 * create playlist
 * remove playlist (public-private)
 * remove audios
 * many more 
 */