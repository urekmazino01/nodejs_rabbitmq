import express from 'express'
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import amqp from "amqplib"
import { Order } from './Order.js';
import isAuthenticated from '../isAuthenticated.js';
import { Product } from '../product-service/product.js';
const app = express();
app.use(express.json())
const PORT = process.env.PORT_ONE || 9090;

var channel, connection;

// auth-service
mongoose.connect("mongodb://127.0.0.1:27017/order-service").then(()=>{
    console.log('connected to order-service database')
}).catch((error)=>{
    console.log(`error ${error}`)
})

async function createOrder(products, userEmail){
    let total = 0;
    for(let t =0; t< products.length;t++){
        total += products[t].price
    }
    const result =await Order.create({
        products,
        user:userEmail,
        total_price:total
    })
    return result;
    
}

async function connect(){
    const amqpServer = "amqp://127.0.0.1:5672";
    connection =await amqp.connect(amqpServer) 
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER")
}
connect().then(()=>{
    channel.consume("ORDER", (data) =>{
        const {products, userEmail} = JSON.parse(data.content);
        console.log("consuming order queue");
        console.log(products)
        const newOrder = createOrder(products, userEmail);
        channel.ack(data);
        channel.sendToQueue("PRODUCT",Buffer.from(JSON.stringify({newOrder}))) 
        console.log("product queue", products);
    })
})


app.listen(PORT, ()=>{
    console.log(`order-Service at ${PORT}`)
})