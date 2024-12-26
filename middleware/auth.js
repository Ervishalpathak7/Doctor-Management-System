import jwt from "jsonwebtoken"

export default function authMiddleware(req , res , next){
    const token = req.cookies.token("token")
    if(!token) return res.status(401).json({msg: "Unauthorized"})
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).json({msg: "Unauthorized"})
        req.user = user
        next()
    })
}