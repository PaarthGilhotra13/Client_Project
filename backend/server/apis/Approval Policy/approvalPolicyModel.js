const mongoose=require("mongoose")

const approvalPolicySchema=new mongoose.Schema({
    minAmount:{type:Number,default:""},
    maxAmount:{type:Number,default:""},
    approvalLevels:[{type:String,default:""}],
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()}
})

module.exports=new mongoose.model("approvalPolicyData",approvalPolicySchema)