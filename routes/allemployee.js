const express = require('express');
var router = express.Router();
const {hashCompare,hashPassword,createToken,decodeToken,validate,
    roleAdmin,roleManager,roleEmployeeWithRights,
    roleEmployeeWithoutRights}=require('../config/auth');
const {dbUrl}=require('../config/dbConfig');
const{employeeModel}=require('../schema/employeeSchema');
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl);

/* GET home page. */
router.get('/',validate,roleAdmin, async(req,res)=>{
    try {
      mongoose.connect(dbUrl);
      let user = await employeeModel.find().sort({firstName:1});
    res.status(201).send({
      user   
     })  
    } catch (error) {console.log(error)
      res.status(500).send({message:"Internal Server Error ",error})
    }
  })
router.post('/createEmployee',validate,roleAdmin,async(req,res)=>{
  try {
    mongoose.connect(dbUrl);
    let user = await employeeModel.findOne({email:req.body.email});
   if(!user)
{
    req.body.password = await hashPassword(req.body.password)
    let doc = new employeeModel(req.body);
    await doc.save()
  res.status(201).send({
    message:"Employee created successfully"    
   })
}
   else
    res.status(400).send({message:"Employee already exists"})

  } catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

router.put('/updateEmployee',validate,roleAdmin,async(req,res)=>{
    try {
      mongoose.connect(dbUrl);
      let user = await employeeModel.findOne({email:req.body.email});
      let token = req.headers.authorization.split(" ")[1]
       let data = decodeToken(token);
     if(user)
  {
      
    let notManager=await employeeModel.findOne({$and:[{email:req.body.email},{role:{$ne:"manager"}}]});
    
     let doc = await employeeModel.updateOne({$and:[{email:req.body.email},{role:{$ne:"manager"}}]},{$set:req.body},{runValidators:true});
      if(notManager){
    res.status(201).send({
      message:"Employee updated successfully"    
     })}
     else{
      res.status(201).send({
        message:"manager can be updated only by directors!!"    
       })

     }
    
  }
     else
      res.status(400).send({message:"Employee doesn't exists"})
  
    } catch (error) {console.log(error)
      res.status(500).send({message:"Internal Server Error",error})
    }
  })

  router.delete('/deleteEmployee/:id',validate,roleManager,async(req,res)=>{
    try {
      mongoose.connect(dbUrl);
      let user = await employeeModel.findOne({_id:req.params.id});
      if(user){
        let doc = await employeeModel.deleteOne({_id:req.params.id});
      res.status(200).send({
        message:"User Deleted Successfully"})
      }
      else
      {
        res.status(400).send({message:"Invalid Employee Id"})
      }
    } catch (error) {console.log(error)
      res.status(500).send({message:"Internal Server Error",error})
    }
  })

module.exports = router; 