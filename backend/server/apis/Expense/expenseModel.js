//paarth
const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    ticketId: { type: String, default: "" },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "storeData" },
    expenseHeadId: { type: mongoose.Schema.Types.ObjectId, ref: "expenseHeadData" },
    natureOfExpense: { type: String, def: "" },
    amount: { type: Number, required: true },
    remark: { type: String, default: "" },
    rca: { type: String, default: "" },
    policy: { type: String, default: "" },
    policyId: { type: mongoose.Schema.Types.ObjectId, ref: "approvalPolicyData" },
    attachment: { type: String, default: "" },
    currentApprovalLevel: { type: String , default:null},
    currentStatus: { type: String, enum: ['Pending', 'Approved', 'Hold','Rejected'], default: 'Pending' },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "userData", required: true },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = new mongoose.model("expenseData", expenseSchema)
