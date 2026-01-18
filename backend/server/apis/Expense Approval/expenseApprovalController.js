const expenseApprovalModel = require("./expenseApprovalModel");
const expenseModel = require("../Expense/expenseModel");
const approvalPolicyModel = require("../Approval Policy/approvalPolicyModel");
const userModel = require("../User/userModel")
/* ================= APPROVE EXPENSE ================= */
const approveExpense = async (req, res) => {
    try {
        const { expenseId, approverId, comment } = req.body;

        if (!expenseId || !approverId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId & approverId are required"
            });
        }

        const expense = await expenseModel
            .findById(expenseId)
            .populate("policyId");

        if (!expense) {
            return res.send({
                status: 404,
                success: false,
                message: "Expense not found"
            });
        }

        if (!expense.currentApprovalLevel) {
            return res.send({
                status: 422,
                success: false,
                message: "No approval pending for this expense"
            });
        }

        if (!expense.policyId || !expense.policyId.approvalLevels) {
            return res.send({
                status: 422,
                success: false,
                message: "Approval policy missing"
            });
        }

        const levels = expense.policyId.approvalLevels;
        const currentIndex = levels.indexOf(expense.currentApprovalLevel);

        if (currentIndex === -1) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid approval level"
            });
        }

        /* ===== SAVE APPROVAL HISTORY ===== */
        await expenseApprovalModel.create({
            expenseId,
            level: expense.currentApprovalLevel,
            approverId,
            comment: comment || "",
            action: "Approved",
            status: "Approved"
        });

        /* ===== MOVE TO NEXT LEVEL OR FINAL APPROVE ===== */
        if (currentIndex === levels.length - 1) {
            expense.currentStatus = "Approved";
            expense.currentApprovalLevel = null;
        } else {
            expense.currentApprovalLevel = levels[currentIndex + 1];
        }

        await expense.save();

        res.send({
            status: 200,
            success: true,
            message: "Expense Approved Successfully"
        });

    } catch (err) {
        console.log("Approve Error:", err);
        res.send({
            status: 500,
            success: false,
            message: "Approve failed"
        });
    }
};

/* ================= HOLD EXPENSE ================= */
const holdExpense = async (req, res) => {
    try {
        const { expenseId, approverId, comment } = req.body;

        if (!expenseId || !approverId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId & approverId are required"
            });
        }

        const expense = await expenseModel.findById(expenseId);

        if (!expense || !expense.currentApprovalLevel) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid expense or no approval pending"
            });
        }

        await expenseApprovalModel.create({
            expenseId,
            level: expense.currentApprovalLevel,
            approverId,
            comment: comment || "",
            action: "Hold",
            status: "Hold"
        });

        expense.currentStatus = "Hold";
        await expense.save();

        res.send({
            status: 200,
            success: true,
            message: "Expense put on Hold"
        });

    } catch (err) {
        console.log("Hold Error:", err);
        res.send({
            status: 500,
            success: false,
            message: "Hold failed"
        });
    }
};

/* ================= REJECT EXPENSE ================= */
const rejectExpense = async (req, res) => {
    try {
        const { expenseId, approverId, comment } = req.body;

        if (!expenseId || !approverId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId & approverId are required"
            });
        }

        const expense = await expenseModel.findById(expenseId);

        if (!expense || !expense.currentApprovalLevel) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid expense or no approval pending"
            });
        }

        await expenseApprovalModel.create({
            expenseId,
            level: expense.currentApprovalLevel,
            approverId,
            comment: comment || "",
            action: "Rejected",
            status: "Rejected"
        });

        expense.currentStatus = "Rejected";
        expense.currentApprovalLevel = null;
        await expense.save();

        res.send({
            status: 200,
            success: true,
            message: "Expense Rejected"
        });

    } catch (err) {
        console.log("Reject Error:", err);
        res.send({
            status: 500,
            success: false,
            message: "Reject failed"
        });
    }
};

/* ================= APPROVAL HISTORY ================= */
const approvalHistory = async (req, res) => {
    try {
        const { expenseId } = req.body;

        if (!expenseId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId is required"
            });
        }

        const data = await expenseApprovalModel
            .find({ expenseId })
            .populate("approverId")
            .sort({ actionAt: 1 });

        res.send({
            status: 200,
            success: true,
            message: "Approval History",
            data
        });

    } catch (err) {
        console.log("History Error:", err);
        res.send({
            status: 500,
            success: false,
            message: "History fetch failed"
        });
    }
};


const clmPendingExpenses = async (req, res) => {
    try {
        const clmId = req.body.userId;

        // console.log(clmId)
        // 1️⃣ CLM ka store mapping nikaalo
        const clmUser = await userModel.findById(clmId);
        // console.log(clmUser);
        // console.log(clmUser.storeIds?.length);
        // console.log(clmUser.storeId,);

        if (!clmUser || !clmUser.storeId) {
            return res.send({
                success: false,
                message: "No store mapping found for CLM"
            });
        }
        // 2️⃣ Sirf wahi expenses lao jo
        // - CLM ke stores ke ho
        // - Pending ho
        // - CLM level pe ho
        const expenses = await expenseModel.find({
            storeId: clmUser.storeId,
            currentStatus: "Pending",
            currentApprovalLevel: "CLM",
            status: true
        })
            .populate("storeId expenseHeadId raisedBy");

        res.send({
            success: true,
            data: expenses
        });

    } catch (err) {
        res.send({
            success: false,
            message: "CLM pending fetch failed"
        });
    }
};

const pendingForZH = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.send({
                status: 422,
                success: false,
                message: "userId is required"
            });
        }

        const zhUser = await userModel.findById(req.body.userId);

        if (!zhUser) {
            return res.send({
                status: 404,
                success: false,
                message: "User not found"
            });
        }

        const expenses = await expenseModel.find({
            currentApprovalLevel: "ZH",
            currentStatus: "Pending",
            storeId: { $in: zhUser.storeIds },
            status: true
        })
            .populate("storeId expenseHeadId raisedBy policyId")
            .sort({ createdAt: -1 });

        res.send({
            status: 200,
            success: true,
            message: "ZH Pending Expenses",
            data: expenses
        });

    } catch (err) {
        res.send({
            status: 500,
            success: false,
            message: "ZH pending fetch failed"
        });
    }
};
const pendingForBF = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.send({
                status: 422,
                success: false,
                message: "userId is required"
            });
        }

        const bfUser = await userModel.findById(req.body.userId);

        if (!bfUser) {
            return res.send({
                status: 404,
                success: false,
                message: "User not found"
            });
        }

        const expenses = await expenseModel.find({
            currentApprovalLevel: "BF",
            currentStatus: "Pending",
            storeId: { $in: bfUser.storeIds },
            status: true
        })
            .populate("storeId expenseHeadId raisedBy policyId")
            .sort({ createdAt: -1 });

        res.send({
            status: 200,
            success: true,
            message: "BF Pending Expenses",
            data: expenses
        });

    } catch (err) {
        res.send({
            status: 500,
            success: false,
            message: "BF pending fetch failed"
        });
    }
};
const pendingForProcurement = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.send({
                status: 422,
                success: false,
                message: "userId is required"
            });
        }

        const procurementUser = await userModel.findById(req.body.userId);

        if (!procurementUser) {
            return res.send({
                status: 404,
                success: false,
                message: "User not found"
            });
        }

        const expenses = await expenseModel.find({
            currentApprovalLevel: "PROCUREMENT",
            currentStatus: "Pending",
            storeId: { $in: procurementUser.storeIds },
            status: true
        })
            .populate("storeId expenseHeadId raisedBy policyId")
            .sort({ createdAt: -1 });

        res.send({
            status: 200,
            success: true,
            message: "Procurement Pending Expenses",
            data: expenses
        });

    } catch (err) {
        res.send({
            status: 500,
            success: false,
            message: "Procurement pending fetch failed"
        });
    }
};



const expenseAction = async (req, res) => {
    try {
        const { expenseId, approverId, level, status, comment } = req.body;

        //  validations
        if (!expenseId || !approverId || !level || !status) {
            return res.send({
                success: false,
                message: "expenseId, approverId, level & status are required"
            });
        }

        const expense = await expenseModel
            .findById(expenseId)
            .populate("policyId");

        if (!expense) {
            return res.send({
                success: false,
                message: "Expense not found"
            });
        }

        //  save approval history
        await expenseApprovalModel.create({
            expenseId,
            approverId,
            level,
            status,        // Approved / Rejected / Hold
            comment: comment || ""
        });

        // 🔁 ACTION LOGIC
        if (status === "Approved") {
            const levels = expense.policyId.approvalLevels;
            const index = levels.indexOf(expense.currentApprovalLevel);

            if (index === levels.length - 1) {
                // final approval
                expense.currentStatus = "Approved";
                expense.currentApprovalLevel = null;
            } else {
                // move to next level
                expense.currentApprovalLevel = levels[index + 1];
            }
        }

        if (status === "Hold") {
            expense.currentStatus = "Hold";
        }

        if (status === "Rejected") {
            expense.currentStatus = "Rejected";
            expense.currentApprovalLevel = null;
        }

        await expense.save();

        res.send({
            success: true,
            message: `Expense ${status} successfully`
        });

    } catch (err) {
        console.error("Expense Action Error:", err);
        res.send({
            success: false,
            message: "Expense action failed"
        });
    }
};


const myApprovalActions = async (req, res) => {
    try {
        const { userId, action, level } = req.body;

        if (!userId || !action || !level) {
            return res.send({
                success: false,
                message: "userId & Action required"
            });
        }
        const data = await expenseApprovalModel.find({
            approverId: userId,
            action: action,   // Approved | Hold | Rejected
            level: level
        })
            .populate({
                path: "expenseId",
                populate: {
                    path: "storeId expenseHeadId raisedBy"
                }
            })
            .sort({ actionAt: -1 });

        res.send({
            success: true,
            data
        });

    } catch (err) {
        res.send({
            success: false,
            message: "Approval list fetch failed"
        });
    }
};

module.exports = { approveExpense, holdExpense, rejectExpense, approvalHistory, clmPendingExpenses, pendingForProcurement, pendingForBF, pendingForZH, expenseAction, myApprovalActions }
