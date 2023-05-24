const express = require('express');
var router = express.Router();
const {hashCompare,hashPassword,createToken,decodeToken,validate,
    roleAdmin,roleManager,roleEmployeeWithRights,
    roleEmployeeWithoutRights,roleCustomer}=require('../config/auth');
const {dbUrl}=require('../config/dbConfig');
const{customerModel}=require('../schema/customerSchema');
const{customerRequestModel}=require('../schema/customerRequestSchema')
const{employeeModel}=require('../schema/employeeSchema');
const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl);

/* GET users listing. */
router.get('/',validate,roleAdmin, async(req,res)=>{
  try {
    mongoose.connect(dbUrl);
    let user = await customerModel.find().sort({firstName:1});
  res.status(201).send({
    user   
   })  
  } catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error ",error})
  }
})

router.post('/createCustomer',async(req,res)=>{
try {
  mongoose.connect(dbUrl);
  let customer = await customerModel.findOne({email:req.body.email});

 if(!customer)
{
  req.body.password = await hashPassword(req.body.password)
  let doc = new customerModel(req.body);
  await doc.save()
   res.status(201).send({
  message:`customer created successfully`,
})
}
 else
  res.status(400).send({message:"customer already exists"})

} catch (error) {console.log(error)
  res.status(500).send({message:"Internal Server Error",error})
}
})

router.post('/createCustomerRequest',validate,roleCustomer,async(req,res)=>{
  try {
    mongoose.connect(dbUrl);
     let Employee=await employeeModel.findOne({handlingCarBrand:req.body.carBrand});
     let EmployeeCar=Employee.handlingCarBrand;
     console.log(EmployeeCar);
  
     if(req.body.carBrand==EmployeeCar){
      req.body.assignedTo=Employee.email;
     }
   
    let doc = new customerRequestModel(req.body);
    await doc.save()
     res.status(201).send({
    message:`customer request created successfully`,
  })
  
  
  
  } catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

router.put('/updateCustomer',validate,roleCustomer,async(req,res)=>{
  try {
    mongoose.connect(dbUrl);
    let user = await customerModel.findOne({email:req.body.email});

   if(user)
{
 
   let doc = await customerModel.updateOne({email:req.body.email},{$set:req.body},{runValidators:true});
    
  res.status(201).send({
    message:"customer updated successfully"    
   })
 
}
   else
    res.status(400).send({message:"customer doesn't exists"})

  } catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

router.delete('/deleteCustomer/:id',validate,roleCustomer,async(req,res)=>{
  try {
    mongoose.connect(dbUrl);
    let user = await customerModel.findOne({_id:req.params.id});

    if(user){
      let doc = await customerModel.deleteOne({_id:req.params.id});
    res.status(200).send({
      message:"customer Deleted Successfully"})
    }
    else
    {
      res.status(400).send({message:"Invalid customer Id"})
    }
  } catch (error) {console.log(error)
    res.status(500).send({message:"Internal Server Error",error})
  }
})

module.exports = router;