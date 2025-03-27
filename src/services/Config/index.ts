import mongoose from "mongoose";

//mongodb+srv://developersipun:testSipun345@cluster1.xm25lga.mongodb.net/

export default async function connect() {
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/scmsDB"!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("mongodb Connected successfully");

        });
        connection.on('error', (error) => {
            console.log("mongdb connection error please make sure mongoDB is running" + error);
            process.exit();
        })
    } catch (error) {
        console.log("something went wrong");
        console.log(error);

    }

}