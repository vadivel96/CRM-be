const express = require('express');
var router = express.Router();
const {hashCompare,hashPassword,createToken,decodeToken,validate,
    roleAdmin,roleManager,roleEmployeeWithRights,
    roleEmployeeWithoutRights}=require('../config/auth');
const {dbUrl}=require('../config/dbConfig');
const{serviceModel}=require('../schema/serviceSchema');
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl);

/* GET users listing. */
router.get('/',validate,roleEmployeeWithoutRights, async(req,res)=>{
  try {
    mongoose.connect(dbUrl);
    let service = await serviceModel.find().sort({firstName:1});
  res.status(201).send({
     service   
   })  
  } catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error ",error})
  }
})
router.post('/createService',validate,roleEmployeeWithRights,async(req,res)=>{
try {
  mongoose.connect(dbUrl);
  let user = await serviceModel.findOne({email:req.body.email});
  let token = req.headers.authorization.split(" ")[1]
  let data = decodeToken(token) 
  req.body.assignedTo=data.email;

 if(!user)
{
  let doc = new serviceModel(req.body);
  await doc.save()
res.status(201).send({
  message:"service created successfully"    
 })
}
 else
  res.status(400).send({message:"service already exists"})

} catch (error) {console.log(error)
  res.status(500).send({message:"Internal Server Error",error})
}
})

router.put('/updateService',validate,roleEmployeeWithRights,async(req,res)=>{
  try {
    mongoose.connect(dbUrl);
    let user = await serviceModel.findOne({email:req.body.email});

   if(user)
{
 
   let doc = await serviceModel.updateOne({email:req.body.email},{$set:req.body},{runValidators:true});
    
  res.status(201).send({
    message:"service updated successfully"    
   })
 
}
   else
    res.status(400).send({message:"service doesn't exists"})

  } catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

router.delete('/deleteservice/:id',validate,roleEmployeeWithRights,async(req,res)=>{
  mongoose.connect(dbUrl);
  try {
    let user = await serviceModel.findOne({_id:req.params.id});
    if(user){
      let doc = await serviceModel.deleteOne({_id:req.params.id});
    res.status(200).send({
      message:"service Deleted Successfully"})
    }
    else
    {
      res.status(400).send({message:"Invalid service Id"})
    }
  } catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

module.exports = router;