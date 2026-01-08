const mongoose =require("mongoose")

const businessFinanceSchema=new mongoose.Schema({
    name:{type:String,default:""},
    email:{type:String,default:""},
    contact:{type:String,default:""},
    empcode:{type:String,unique:true},
    userId:{type:String,default:""},
    designation:{type:String,default:""},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()},
})

module.exports=new mongoose.model("businessFinanceData",businessFinanceSchema)


