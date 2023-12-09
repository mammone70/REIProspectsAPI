const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
    const {name, email, password } = req.body;
    
    //validate properties
    if(!name || !email || !password)
        return res.
            status(400)
            .json({error: `Please enter all the required field.`});
    
    //validate email
    const emailReg = 
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/        
    
    if(!emailReg.test(email)) 
        return res
            .status(400)
            .json({error:"Please enter a valid email address."})

    //password validation
    if(password.length < 8) 
    return res
        .status(400)
        .json({error: 'password must be at least 8 characters'});

    //username validation
    if(name.length > 25) 
        return res
            .status(400)
            .json({error:"Username must be less than 25 characters."})

    try{
        const doesUserAlreadyExist = await User.findOne({email});

        if(doesUserAlreadyExist) 
            return res
                .status(400)
                .json({error: `The email [${email}] is already registered`
        });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({name, email, password : hashedPassword})

        //save the user
        const result = await newUser.save();

        result._doc.password = undefined;
        return res.status(201).json({...result._doc});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: err.message});
    }
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) 
        return res
            .status(400)
            .json({error:"Please provide email and password"});
    try {
        const existingUser = await User.findOne({email});
        if(!existingUser)
            return res 
                .status(400)
                .json({error: "Invalid username or password"});

        const passwordMatch = await bcrypt.compare(
            password, 
            existingUser.password);

        if(!passwordMatch)
            return res
                .status(400)
                .json({error: "Invalid username or password"});
        
        const payload = {_id: existingUser._id};
        const token = 
            jwt.sign(
                payload, 
                process.env.JWT_SECRET,
                {expiresIn: "1h"});
            
        const user = {...existingUser._doc, password:undefined};
        return  res
                    .status(200)
                    .json({token, user});
    }catch(err) {
        console.log(err);
        return res.status(500).json({error: error.message});
    }
});

router.get("/me", auth, async(req, res) => {
    return res.status(200).json({...req.user._doc});
});
module.exports = router;