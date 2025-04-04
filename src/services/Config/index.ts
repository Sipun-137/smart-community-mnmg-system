import mongoose from "mongoose";



export default async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URI as string);
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