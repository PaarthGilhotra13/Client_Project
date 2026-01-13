const mongoose =require("mongoose")

const facilityManagerSchema=new mongoose.Schema({
    name:{type:String,default:""},
    email:{type:String,default:""},
    contact:{type:String,default:""},
    empcode:{type:String,unique:true},
    userId:{type:String,default:""},
    storeId:{type:mongoose.Schema.Types.ObjectId,ref:"storeData"},
    designation:{type:String,default:""},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()},
})

module.exports=new mongoose.model("facilityManagerData",facilityManagerSchema)


