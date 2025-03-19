import express, { application }  from "express";
import "dotenv/config";             //is imported for .env use or the app can't reconigze it and it has to be always placed before the DB import.
import "./db";

import authRouter from "./routers/auth";
import audioRouter from "./routers/audio";
import favoriteRouter from "./routers/favorite";

const app = express();

//Register our middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("src/public"));
 
app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favorite", favoriteRouter);

const PORT = process.env.PORT || 8989;

app.listen(PORT, () =>{
    console.log("Port is listening on port " + PORT);
})

/****
 * The Plan and features
 * upload audio files
 * Listen to single audio
 * add to favorites
 * create playlist
 * remove playlist (public-private)
 * remove audios
 * many more 
 ****/