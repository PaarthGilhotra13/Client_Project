const mongoose=require("mongoose")

const natureOfExpenseSchema=new mongoose.Schema({
    name:{type:String,default:""},
    expenseHeadId:{type:mongoose.Schema.Types.ObjectId,ref:"expenseHeadData"},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()}
})

module.exports=new mongoose.model("Nature of Expense",natureOfExpenseSchema)