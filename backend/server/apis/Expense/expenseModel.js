const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    ticketId: { type: String, default: "" },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "storeData" },
    expenseHeadId: { type: mongoose.Schema.Types.ObjectId, ref: "expenseHeadData" },
    natureOfExpenseId: { type: mongoose.Schema.Types.ObjectId, ref: "natureOfExpenseData" },
    amount: { type: Number, default: "" },
    remark: { type: String, default: "" },
    rca: { type: String, default: "" },
    policyId: { type: mongoose.Schema.Types.ObjectId, ref: "approvalPolicyData" },
    attachment:{type:String, default:""},
    currentApprovalLevel: { type: String, default: "" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports=new mongoose.model("expenseData",expenseSchema)
