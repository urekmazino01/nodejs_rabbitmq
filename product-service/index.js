import express from 'express'
import mongoose, { connection } from 'mongoose';
import jwt from 'jsonwebtoken'
import amqp from "amqp"
const app = express();
app.use(express.json())
const PORT = process.env.PORT_ONE || 8080;

// auth-service
mongoose.connect("mongodb://127.0.0.1:27017/product-service").then(()=>{
    console.log('connected to product-service database')
}).catch((error)=>{
    console.log(`error ${error}`)
})

async function connect(){
    const amqpServer = "amqp://localhost:5672";
    const connection = amqp.connect(amqpServer) 
    const channel = connection.createChannel();
    await channel.assertQueue("PRODUCT")
}

app.listen(PORT, ()=>{
    console.log(`product-Service at ${PORT}`)
})