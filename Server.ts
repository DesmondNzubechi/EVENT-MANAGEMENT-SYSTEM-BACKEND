import app from "./App";
import mongoose from "mongoose";
import { config } from "dotenv";

config({path : './config.env'});

const {PORT, DATABASE_URL} = process.env;

if(!PORT || !DATABASE_URL){
    throw new Error("Make sure that the database url and the port is defined");
    
}

const DB = DATABASE_URL;


mongoose.connect(DB).then(() => {
    console.log("connection successful")
}).catch((error) => {
    console.log("An error occured during connection", error)
})


app.listen(PORT, () => {
    console.log(`This app is running on port ${PORT}`)
})
  