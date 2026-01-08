const mongoose=require("mongoose")

const expenseApprovalSchema=new mongoose.Schema({
    expenseId:{type:mongoose.Schema.Types.ObjectId,ref:"expenseData"},
    level:{type:String,default:""},
    approverId:{type:mongoose.Schema.Types.ObjectId,ref:"approvalPolicyData"}, //Doubt
    Comment:{type:String,default:""},
    status:{type:Boolean,default:true},
    actionAt:{type:Date,default:Date.now()}
})

module.exports=new mongoose.model("expenseApprovalData",expenseApprovalSchema)