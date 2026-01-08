const mongoose=require("mongoose")

const storeSchema=new mongoose.Schema({
    storeName:{type:String,default:""},
    storeCode:{type:String,default:""},
    storeCategoryId:{type:mongoose.Schema.Types.ObjectId,ref:"storeCategoryData"},
    cityId:{type:mongoose.Schema.Types.ObjectId,ref:"cityData"},
    zoneId:{type:mongoose.Schema.Types.ObjectId,ref:"zoneData"},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()}
})

module.exports=new mongoose.model("Store",storeSchema)

