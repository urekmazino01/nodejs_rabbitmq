import express from 'express'
import mongoose from 'mongoose';
import { User } from "./user.js"
import jwt from 'jsonwebtoken'
const app = express();
app.use(express.json())
const PORT = process.env.PORT_ONE || 7070;

// auth-service
mongoose.connect("mongodb://127.0.0.1:27017/auth-service").then(()=>{
    console.log('connected to auth-service database')
}).catch((error)=>{
    console.log(`error ${error}`)
})

//Register
//Login


app.post("/auth/login" , async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        // confirm.log("inside here")
        return res.json({ message:"User doesn't exists"})
    }else{
        //check if the entered password is valid
        if(password !== user.password){
            return res.json({
                message: "password incorrect"
            })
        }
        const payload = {
            email,
            name: user.name
        }
        jwt.sign(payload, "secret", (err,token)=>{
            if(err) console.log(err);
            else{
                return res.json({token : token});
            }
        })
    }
})

app.post("/auth/register", async(req, res) =>{
    const {email,password, name} = req.body;
     const userExists = await User.findOne({email});
     if(userExists){
        return res.json({
            message:"User already exists"
        })
     }else{
        const newUser = await User.create({
            name:name,
            email:email,
            password:password
        })
        return res.json(newUser);
     }
})


app.listen(PORT, ()=>{
    console.log(`Auth-Service at ${PORT}`)
})