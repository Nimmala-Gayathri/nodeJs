const  express = require('express');
const router = express()
const User = require("../models/user")


// get all user s data
router.get('/', async(req,res)=>{
    // console.log(req.query)
   try{
    const userData = await User.find()
    res.status(200).json({data: userData})
   } catch(err){
    res.status(500).json({message: err.message})
   }
})

// get single user data
router.get('/:id', async(req,res)=>{
   try{
    const user = await User.findById(req.params.id)
    if(user){
         res.json({ data : user})
    }else{
        res.status(404).json({message:"User not found"})
    }
   }catch(err){
    res.status(500).json({message: " error accured"})
   }
      // res.json({message:"single user get success"})
  
})

// To create the data
router.post('/new', async (req,res) =>{
    // console.log(req.body)
    const newUser = new User({userName: req.body.userName})
    await newUser.save()
    res.status(200).json({message: "new user created"})
})

// To update the user details 
router.put('/update/:id',(req,res) =>{
    // console.log(req.params)
    // console.log(req.body)
    res.status(200).json({message: "user details updated"})
})
//mongo db update details
router.patch('/update/:id',async(req,res) =>{
    const user = await User.findById(req.params.id);
    user.userName = req.body.userName;
    await user.save()
    res.status(200).json({message: "user detail updated"})
})

// to delete the user
router.delete('/delete/:id', async(req,res) =>{
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({message: "user deleted"})
})


//Sign in componet
// router


module.exports = router