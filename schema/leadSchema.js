const mongoose = require('mongoose');
const validator = require('validator');

const leadSchema = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true,
        validate:(value)=>validator.isEmail(value)
    },
    mobileNumber:{type:String,required:true},
    occupation:{type:String,required:true},
    leadReliability:{type:String,required:true},
    leadRisk:{type:String,required:true},
    leadSource:{type:String,required:true},
    call:{type:String,required:true},
    status:{type:String,default:"new",required:true},
    assignedTo:{type:String},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false,collection:'leads'})

const leadModel = mongoose.model('leads',leadSchema)
module.exports = {leadModel}