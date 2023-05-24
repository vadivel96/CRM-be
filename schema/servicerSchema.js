const mongoose = require('mongoose');
const validator = require('validator');

const servicerSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    services:{type:String,required:true},
    mobileNumber:{type:String,required:true},
    email:{type:String,required:true,
        validate:(value)=>validator.isEmail(value)
    },
    address1:{type:String,required:true},//doorno,apartmentName
    address2:{type:String,required:true},//streetName,areaName
    address3:{type:String},
    address4:{type:String},
    address5:{type:String,required:true},//city/town
    pincode:{type:String,required:true},//pincode
    servicerLocation:{type:String,required:true},
    servicerDayAvailability:{type:String,required:true},
    servicerTiming:{type:String,required:true},
    createdBY:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false,collection:'servicer'})

const servicerModel = mongoose.model('servicer',servicerSchema)
module.exports = {servicerModel}