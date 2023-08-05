import { connect } from "mongoose";
import { MONGODB_URI } from "./config.js";

export const connectToDB = async() => {
    try {
        await connect(MONGODB_URI)
        console.log('MongoDB linked');
    }catch(error) {
        console.log(error);
    }
}
