import mongoose from "mongoose";

const db = async (res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`db connected to Mongo URL`);
    } catch (error) {
        console.log(`Error while connecting db ${error}`);
    }
}

export default db;