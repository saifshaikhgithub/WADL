const userModel = require('../models/userModel')

// const loginController = 

const reguser = async(req,res) =>{
    console.log(req.body)
    try{
        const newUser = new userModel(req.body)
        await newUser.save()
  
        res.status(201).json({
            sucess:true,
            newUser
        })
    }
    catch(err){
        res.status(400).json({
            sucess:false,
            err
        })
    }
  }
  
const loginController = async (req,res)=>{
    console.log(req.body)
    try{
        const {email , password} = req.body
        const user = await userModel.findOne({email , password})
        if(!user){
            return res.status(404).send("user not found")
        }
        res.status(200).json({
            sucess:true,
            user})
    }
    catch(err){
        res.status(400).json({
            sucess:false,
            err
        })
    }
  }

module.exports = {loginController,reguser}
// module.exports = {}
