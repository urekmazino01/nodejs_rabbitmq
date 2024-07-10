import express from 'express'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import amqp from "amqplib"
import { Product } from './product.js';
import isAuthenticated from '../isAuthenticated.js';
const app = express();
app.use(express.json())
const PORT = process.env.PORT_ONE || 8080;

var channel, connection;
// auth-service
mongoose.connect("mongodb://127.0.0.1:27017/product-service").then(()=>{
    console.log('connected to product-service database')
}).catch((error)=>{
    console.log(`error ${error}`)
})

async function connect(){
    const amqpServer = "amqp://localhost:5672";
     connection =await amqp.connect(amqpServer) 
     channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT")
}

connect()

//create a new product
// Buy a product

app.post("/product/create", isAuthenticated, async(req,res)=>{
    // req.user.email
    console.log("Hello inside here")
    const { name, description, price} = req.body;
    const newProduct = await Product.create({
        name:name,
        description:description,
        price:price
    })
    res.json({newProduct})
})

// user sends a list of product ids to buy
// creating an order with those productsand a total value of sum of product's prices.

app.post('/products/buy', isAuthenticated, async(req,res)=>{
    const {ids} = req.body;

    const products = await Product.find({_id:{$in : ids}})
    channel.sendToQueue("ORDER", Buffer.from(
        JSON.stringify({
            products,
            userEmail: req.user.email
        })
    ))
    // res.json(products)
    // channel.consume("PRODUCT", data =>{
    //     var order = JSON.parse(data.content);
    //     channel.ack(data)
    // })
    // return res.json(order)
})

app.listen(PORT, ()=>{
    console.log(`product-Service at ${PORT}`)
})