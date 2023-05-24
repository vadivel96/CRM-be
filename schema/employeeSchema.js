const mongoose = require('mongoose');
const validator = require('validator');

const employeeSchema = new mongoose.Schema({
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
    address4:{type:String},
    address5:{type:String,required:true},//city/town
    pincode:{type:String,required:true},//pincode
    role:{type:String,required:true, default:'employeeWithoutRights'},
    password:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false,collection:'allWorkers'})

const employeeModel = mongoose.model('allWorkers',employeeSchema)
module.exports = {employeeModel}