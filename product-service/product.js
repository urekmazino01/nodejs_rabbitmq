import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema  = new Schema({
    name:String,
    description : String,
    price:Number,
    created_at:{
        type:Date,
        default:Date
    }
})

const Product = mongoose.model("product", productSchema)
export {Product}