const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var router = express.Router();
var nodemailer=require('nodemailer')
const {hashCompare,hashPassword,createToken,decodeToken,validate,
    roleAdmin,roleManager,roleEmployeeWithRights,
    roleEmployeeWithoutRights,secretKey}=require('../config/auth');
const {dbUrl}=require('../config/dbConfig');
const{employeeModel}=require('../schema/employeeSchema');
const{customerModel}=require('../schema/customerSchema');
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl).then(console.log("db connected"));


/* GET users listing. */

router.post('/forget-password',async(req,res)=>{

  const{email}=req.body;
  console.log(email);
  try {
    mongoose.connect(dbUrl);
    const existingUser= await employeeModel.findOne({email});//change it for your database query
    if(!existingUser){
      return res.status(400).send({message:"Not a registered E-mail ID..!!"})
    }
    const newSecretKey=secretKey+existingUser.password;
    const token=jwt.sign({email:existingUser.email},newSecretKey,{expiresIn:"5m"})
    const link=`http://localhost:8000/password/reset-password/${existingUser.email}/${token}`
    

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jvadivel.1996@gmail.com',
    pass: 'ghvfdrgwnfgebtyn'
   
  }
});

var mailOptions = {
  from: 'crm @gmail.com',
  to: `gokulvickybarathy@gmail.com`,
  subject: 'Reset password-CRM',
  text:link
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
    console.log(link);
    res.status(200).send({message:
      "kindly check your registerd e-mail to Reset Your password,if not registered you wont be recieving any mails"})
  } catch (error) {
    console.log(error);
  }
})

router.get('/reset-password/:email/:token',async(req,res)=>{
  mongoose.connect(dbUrl);
     const{email,token}=req.params;
     console.log(req.params);
     const existingUser=await employeeModel.findOne({email});
     if(!existingUser){
      return res.send({message:"invalid link"})
     }
     const newSecretKey=secretKey+existingUser.password;
     try {
      const verify=jwt.verify(token,newSecretKey);
      console.log(verify);
      res.redirect(`http://localhost:3000/reset-password/${email}`);
     } catch (error) {
      res.send({message:"Not Verified"})
     }
          

})

router.post('/reset-password/:email',async(req,res)=>{
  try {
    mongoose.connect(dbUrl);
    const{password}=req.body;
    const {email}=req.params;
    const encryptedPassword=await bcrypt.hash(password,10)
    const updateUser=await employeeModel.updateOne({"email":email},{$set:{"password":encryptedPassword}});
    console.log(password);
    res.send({message:"password updated successfully"})

  } catch (error) {
    console.log(error)
  }
       

})




module.exports = router;
