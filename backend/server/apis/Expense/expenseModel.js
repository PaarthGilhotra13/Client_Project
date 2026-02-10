const mongoose = require("mongoose");


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
        enum: ["Pending", "Approved", "Hold", "Rejected", "Closed"],
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
    },
    postApprovalStage: {
        type: String,
        enum: [
            "NONE",        // normal approval flow
            "FM_PENDING",  // FM ko WCR + Invoice upload karna hai
            "PRPO_EMAIL",  // PR/PO ko email subject dalna hai
            "ZC_VERIFY",   // Zonal Commercial verify karega (OPEX)
            "CLOSED"       // final close
        ],
        default: "NONE"
    },
    wcrAttachment: { type: String, default: "" },
    invoiceAttachment: { type: String, default: "" },
    fmComment: { type: String, default: "" },
    prismId: { type: String, default: "" },
    prComment: {
        type: String,
        default: null
    },

    poComment: {
        type: String,
        default: null
    },
    prPoEmailSubject: {
        type: String,
        default: null
    },
    prAttachment: {
        type: String,     // Cloudinary URL
        default: null,
    },

    poAttachment: {
        type: String,     // Cloudinary URL
        default: null,
    },

});

module.exports = mongoose.model("expenseData", expenseSchema);
