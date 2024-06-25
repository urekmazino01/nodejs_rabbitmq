import express from 'express'
import mongoose from 'mongoose';
import User from "./user"
import jwt from 'jsonwebtoken'
const app = express();

const PORT = process.env.PORT_ONE || 7070;
mongoose.connect("mongodb://localhost/auth-ervice").then(()=>{
    console.log('connected to auth-service database')
})

//Register
//Login
app.use(express.json())

app.post("/auth/login" , async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.find({email});
    if(!user){
        return res.json({ message:" User doesn't exists"})
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