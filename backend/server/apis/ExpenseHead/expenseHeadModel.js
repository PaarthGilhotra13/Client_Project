const mongoose=require("mongoose")

const expenseHeadSchema=new mongoose.Schema({
    name:{type:String,default:""},
    description:{type:String,default:""},
    status:{type:Boolean,default:true},
    createdAt:{type:Date,default:Date.now()}
})

<<<<<<< HEAD
module.exports=new mongoose.model("expenseHeadData",expenseHeadSchema)
=======
<<<<<<< HEAD
module.exports=new mongoose.model("expenseHeadData",expenseHeadSchema)
=======
module.exports=new mongoose.model("expenseHead",expenseHeadSchema)
>>>>>>> 97338558a47ba0127299be0b5a0f27cb2ad40678
>>>>>>> 1442d32cb9573fc943f1cc7e980f8123f4ac5906
