const express = require('express');
var router = express.Router();
const {hashCompare,hashPassword,createToken,decodeToken,validate,
    roleAdmin,roleManager,roleEmployeeWithRights,
    roleEmployeeWithoutRights}=require('../config/auth');
const {dbUrl}=require('../config/dbConfig');
const{employeeModel}=require('../schema/employeeSchema');
const{customerModel}=require('../schema/customerSchema');
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl);

/* GET home page. */
router.post('/',async(req,res)=>{
  try {
    mongoose.connect(dbUrl);
    let user = await employeeModel.findOne({email:req.body.email});
    let customer = await customerModel.findOne({email:req.body.email});

   if(user || customer)
   {
      
      if(user)
      {
        if(await hashCompare(req.body.password,user.password))
      {
        let token = createToken({email:user.email,firstName:user.firstName,lastName:user.lastName,role:user.role})
        res.status(200).send({message:"Login Successfull",token,role:"employee"}) 
      }
      else
       { 
        res.status(400).send({message:"Invalid  password"})
      }
      }
      
        if(customer){
         if(await hashCompare(req.body.password,customer.password))
          {
            let token = createToken({email:customer.email,firstName:customer.firstName,lastName:customer.lastName,
              role:customer.role})
            res.status(200).send({message:"Login Successfull",token,role:"customer"}) 
          
        }
        else
        {res.status(400).send({message:"Invalid password"})}
   }
  }
   else
    {res.status(400).send({message:"enter registered email"})}
  }      
  catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})
 //'gokulvickybarathy@gmail.com',
    //'fdiqjxytuyvwnyij'
module.exports = router;
