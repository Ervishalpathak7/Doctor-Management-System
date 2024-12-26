
function validInfo(req, res, next){
    const { name , email , password } = req.body

    if(req.path === "/register")
    {
        if(!name || !email || !password){
            return res.status(400).json({msg: "Please fill in all fields"})
        } else if(password.length < 6){
            return res.status(400).json({msg: "Password must be at least 6 characters long"})
        }
    } 

    else if(req.path === "/login")
    {
        if(!email || !password){
            return res.status(400).json({msg: "Please fill in all fields"})
        } else if(password.length < 6){
            return res.status(400).json({msg: "Password must be at least 6 characters long"})
        }
    }

    next()
}

export default validInfo;