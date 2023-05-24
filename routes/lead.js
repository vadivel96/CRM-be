const express = require('express');
var router = express.Router();
const {hashCompare,hashPassword,createToken,decodeToken,validate,
    roleAdmin,roleManager,roleEmployeeWithRights,
    roleEmployeeWithoutRights}=require('../config/auth');
const {dbUrl}=require('../config/dbConfig');
const{leadModel}=require('../schema/leadSchema');
const{employeeModel}=require('../schema/employeeSchema');
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl);

/* GET home page. */
router.get('/',validate,roleEmployeeWithoutRights, async(req,res)=>{
    try {
      mongoose.connect(dbUrl);
      let lead = await leadModel.find().sort({firstName:1});
    res.status(201).send({
      lead  
     })  
    } catch (error) {console.log(error)
      res.status(500).send({message:"Internal Server Error ",error})
    }
  })
router.post('/createLead',validate,roleEmployeeWithRights,async(req,res)=>{
  try {
    mongoose.connect(dbUrl);
    let user = await leadModel.findOne({email:req.body.email});

    let token = req.headers.authorization.split(" ")[1]
    let data = decodeToken(token) 
    req.body.assignedTo=data.email;
  
   if(!user)
{
    let doc = new leadModel(req.body);
    await doc.save();
    res.status(201).send({
    message:"Lead created successfully"    
   })
}
   else
    res.status(400).send({message:"Lead already exists"})

  } catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

router.put('/updateLead',validate,roleEmployeeWithRights,async(req,res)=>{
    try {
      mongoose.connect(dbUrl);
      let user = await leadModel.findOne({email:req.body.email});
     if(user)
  {
   
    let doc = await leadModel.updateOne({email:req.body.email},{$set:req.body},{runValidators:true});
    
    res.status(201).send({
      message:"Lead updated successfully"    
     })
  }
     else
      res.status(400).send({message:"Lead doesn't exists"})
  
    } catch (error) {console.log(error)
      res.status(500).send({message:"Internal Server Error",error})
    }
  })

  router.delete('/deleteLead/:id',validate,roleEmployeeWithRights,async(req,res)=>{
    try {
      mongoose.connect(dbUrl);
      let user = await leadModel.findOne({_id:req.params.id});
      if(user){
        let doc = await leadModel.deleteOne({_id:req.params.id});
      res.status(200).send({
        message:"User Deleted Successfully"})
      }
      else
      {
        res.status(400).send({message:"Invalid Lead Id"})
      }
    } catch (error) {console.log(error)
      res.status(500).send({message:"Internal Server Error",error})
    }
  })

module.exports = router;