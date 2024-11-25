import mongoose from "mongoose";

const URI = process.env.MONGO_URI as string;

mongoose.connect(URI).then(() =>{
    console.log("DB is connected!");
}).catch((err) => {
    console.log("DB connection failed!", err);
})