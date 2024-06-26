import jwt from "jsonwebtoken"

export default async function isAuthenticated(req, res, next){
    const token = req.headers["authorization"].split(" ")[1]
    // "Bearer <token>".split(" ")[1]
    // [<token>]

    jwt.verify(token, "secret", (err,user)=>{
        if(err){
            return res.json({message:err})
        }
        else{
            req.user =user;
            next()
        }
    })
}