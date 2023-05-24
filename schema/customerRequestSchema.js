const mongoose = require('mongoose');
const validator = require('validator');

const customerRequestSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    carBrand:{type:String,required:true},
    carModel:{type:String},
    carType:{type:String},
    serviceCategory:{type:String,required:true},
    serviceName:{type:String,required:true},
    subServiceName:{type:String},
    mobileNumber:{type:String,required:true,default:"1234567890"},
    email:{type:String,required:true,
        validate:(value)=>validator.isEmail(value)
    },
    preferredLocation:{type:String,required:true},
    customerExistingAddress:{type:String,required:true},
    address1:{type:String},//doorno,apartmentName
    address2:{type:String},//streetName,areaName
    address3:{type:String},
    address4:{type:String},
    address5:{type:String},//city/town
    pinCode:{type:String},
    customerDayAvailability:{type:String,required:true},
    customerTiming:{type:String,required:true},
    assignedTo:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false,collection:'customerRequest'})

const customerRequestModel = mongoose.model('customerRequest',customerRequestSchema)
module.exports = {customerRequestModel}