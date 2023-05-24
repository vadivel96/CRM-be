const mongoose = require('mongoose');
const validator = require('validator');

const serviceSchema = new mongoose.Schema({
    customerName:{type:String,required:true},
    serviceCategory:{type:String,required:true},
    serviceName:{type:String,required:true},
    serviceDescription:{type:String},
    email:{type:String,required:true,
        validate:(value)=>validator.isEmail(value)
    },
    mobileNumber:{type:String,required:true,default:"1234567890"},
    status:{type:String,required:true},
    createdBY:{type:String,required:true,default:"customer"},
    assignedTo:{type:String},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false,collection:'services'})

const serviceModel = mongoose.model('services',serviceSchema)
module.exports = {serviceModel}