const express =require('express');
const jwt = require("jsonwebtoken");

// Requiring users file 
const users = require("./../data/user"); 

// generates & return a JWT token for a given name & password 
const loginUser = (req,res) =>{
    
    if(!req.body.name && !req.body.password){
        return res.status(401).send({
            error:"missing username or password"
        })
    }
    let flag= false;
    
    for(let i=0;i<users.length;i++){
        if(users[i].name === req.body.name && users[i].password === req.body.password)
            flag= true;   
    }
    if(flag === true){
        let token = jwt.sign(req.body.name, `TOKEN_SECRET`);
        res.status(200).send({
            token: token
        })
    }
    else{
        res.status(401).send({
            error:"invalid credentials"
        })
    }

}

const router = express.Router();
router.route('/login')
    .post(loginUser)

module.exports = router