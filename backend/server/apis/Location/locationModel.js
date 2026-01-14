const mongoose=require("mongoose")

const locationSchema=new mongoose.Schema({
    zoneName:{type:String,default:""},
    stateName:{type:String,default:""},
    cityName:{type:String,default:""},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()}
})

module.exports=new mongoose.model("locationData",locationSchema)