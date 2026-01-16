const mongoose=require("mongoose")

const citySchema=new mongoose.Schema({
    cityName:{type:String,default:""},
    stateId:{type:mongoose.Schema.Types.ObjectId,ref:"stateData"},
    zoneId:{type:mongoose.Schema.Types.ObjectId,ref:"zoneData"},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()}
})

module.exports=new mongoose.model("cityData",citySchema)

