const mongoose=require("mongoose")

const stateSchema=new mongoose.Schema({
    stateName:{type:String,default:""},
    zoneId:{type:mongoose.Schema.Types.ObjectId,ref:"zoneData"},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()}
})

module.exports=new mongoose.model("stateData",stateSchema)

