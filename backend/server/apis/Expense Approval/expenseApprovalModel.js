const mongoose = require("mongoose")

const expenseApprovalSchema = new mongoose.Schema({
    expenseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "expenseData",
        required: true
    },

    level: {
        type: String,
        required: true   // FM / CLM / FINANCE
    },

    approverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",   // ❗ approver is USER, not policy
        required: true
    },

    comment: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["Approved", "Rejected", "Hold"],
        required: true
    },

    actionAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = new mongoose.model("expenseApprovalData", expenseApprovalSchema)
