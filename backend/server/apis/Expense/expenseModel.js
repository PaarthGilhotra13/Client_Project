<<<<<<< Updated upstream
// paarth
const mongoose = require("mongoose");
=======
//paarth
console.log("expense loaded")
const mongoose = require("mongoose")
>>>>>>> Stashed changes

const expenseSchema = new mongoose.Schema({
    ticketId: { type: String, default: "" },

    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "storeData",
        required: true
    },

    expenseHeadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "expenseHeadData",
        required: true
    },

    natureOfExpense: { 
        type: String, 
        default: "" 
    },

    amount: { 
        type: Number, 
        required: true 
    },

    remark: { type: String, default: "" },

    rca: { type: String, default: "" },

    policy: { type: String, default: "" },

    policyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "approvalPolicyData"
    },

    // 🔹 FIRST TIME FM UPLOAD
    attachment: { 
        type: String, 
        default: "" 
    },

    // 🔹 CURRENT FLOW TRACKING
    currentApprovalLevel: { 
        type: String, 
        default: null 
    },

    currentStatus: {
        type: String,
        enum: ["Pending", "Approved", "Hold", "Rejected"],
        default: "Pending"
    },

    raisedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",
        required: true
    },

    status: { 
        type: Boolean, 
        default: true 
    },

    createdAt: { 
        type: Date, 
        default: Date.now  
    },

    // 🔹 FM RE-UPLOAD AFTER HOLD
    resubmittedAttachment: { 
        type: String, 
        default: "" 
    },

    // 🔹 HOLD DETAILS
    holdComment: { 
        type: String, 
        default: "" 
    },

    heldFromLevel: { 
        type: String, 
        default: null 
    }
});

module.exports = mongoose.model("expenseData", expenseSchema);
