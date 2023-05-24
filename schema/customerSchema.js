const mongoose = require('mongoose');
const validator = require('validator');

const customerSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    gender:{type:String,required:true},
    age:{type:String,required:true},
    dateOfBirth:{type:String,required:true},
    email:{type:String,required:true,
        validate:(value)=>validator.isEmail(value)
    },
    mobileNumber:{type:String,required:true},
    address1:{type:String,required:true},//doorno,apartmentName
    address2:{type:String,required:true},//streetName,areaName
    address3:{type:String},
    state:{type:String,required:true},
    nationality:{type:String,required:true},//city/town
    pinCode:{type:String,required:true},//pincode
    role:{type:String,required:true, default:'customer'},
    password:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false,collection:'customer'})

const customerModel = mongoose.model('customer',customerSchema)
module.exports = {customerModel}
