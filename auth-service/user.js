import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
    name:String,
    email:String,
    password:String,
    created_at:{
        type:Date,
        default:Date.now()
    }

})
const User = mongoose.model("user", UserSchema)

export {User};