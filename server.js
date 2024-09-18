
// import  express
const express = require('express')
const bcrypt = require("bcryptjs")
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = express() 
app.use(express.json())
app.set("view engine", "ejs")// setting the views
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
// connect with db
mongoose.connect(process.env.mongo_uri)
// get the connections

const db = mongoose.connection
db.once('open',() => {//once is the event listener
    console.log("successfuly connected with db")
    // var collections =  db.collections
    // console.log(collections)
})
// if the db was no connected then it will though the error
db.on("error",(error)=>{
    console.log(error)
})
// protected route
app.get('/',(req,res)=>{
    // res.status(200).json({messege:"hello Gayathri"})
    const {token} = req.cookies;
    if(token){
        const tokenData = jwt.verify(token, process.env.jwt_secrete_key);
        if(tokenData.type === "user"){
        res.render("home")
    }
    }else{
        res.redirect("/signin")
    }
})
app.get('/signin', (req,res)=>{
    res.render('signin')
})
app.get('/signup', (req,res)=>{
    res.render('signup')
})
app.post("/signup", async(req,res)=>{
   
    const {name,email,password: plainTextPassword} = req.body;
    // console.log(req.body)
    // const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hashSync(plainTextPassword,10)
    if (!plainTextPassword) {
        return res.status(400).send('Password is required');
    }

    try{
        await user.create({
            name, 
            email,
            password: encryptedPassword
        })
        res.redirect('/signin')
    }catch(error){
         console.log(error)
        res.status(500).send('Error during signup');
    }
})

app.post("/signin",async(req,res)=>{
    const {email,password} = req.body;
    const userObj = await user.findOne({email})
    if(!userObj){
        res.send({error:"user doesn't exist",status:404})
    }
   try{
    if(await bcrypt.compare(password, userObj.password)){
        const token = jwt.sign({
         userId : userObj._id, email: email, type:"user"
        },process.env.jwt_secrete_key, {expiresIn:"2h"})
        res.cookie("token", token, {maxAge: 2*60*60*1000})
        res.render("home")
     }
   }catch (error){
    console.log(error)
   }
   
})
const user = require('./models/user')

const userRouter = require('./routes/user')
app.use('/user',userRouter)



app.listen(5000)
console.log("sever is listening 5000")

//for sign in componet