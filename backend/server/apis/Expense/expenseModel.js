const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    ticketId: { type: String, default: "" },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "storeData" },
    expenseHeadId: { type: mongoose.Schema.Types.ObjectId, ref: "expenseHeadData" },
    natureOfExpenseId: { type: mongoose.Schema.Types.ObjectId, ref: "natureOfExpenseData" },
    amount: { type: Number, required: true },
    remark: { type: String, default: "" },
    rca: { type: String, default: "" },
    policyId: { type: mongoose.Schema.Types.ObjectId, ref: "approvalPolicyData" },
    attachment: { type: String, default: "" },
    currentApprovalLevel: { type: String },
    status: { type: String,enum: ['Pending', 'Approved', 'Hold'],default: 'Pending'},
    createdAt: { type: Date, default: Date.now() }
})

module.exports = new mongoose.model("expenseData", expenseSchema)
