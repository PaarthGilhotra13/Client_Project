const mongoose = require("mongoose");

const expenseApprovalSchema = new mongoose.Schema({
    expenseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "expenseData",
        required: true
    },

    level: {
        type: String,
        required: true   // FM / CLM / ZH / BF/ Procurement
    },

    approverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",
        required: true
    },

    action: {
        type: String,
        enum: ["Approved", "Rejected", "Hold"],
        required: true
    },

    comment: {
        type: String,
        default: ""
    },

    actionAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("expenseApprovalData", expenseApprovalSchema);
