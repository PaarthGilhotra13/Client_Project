const expenseApprovalModel = require("./expenseApprovalModel");
const expenseModel = require("../Expense/expenseModel");
const approvalPolicyModel = require("../Approval Policy/approvalPolicyModel");
const userModel = require("../User/userModel")
const storeModel = require("../Store/storeModel")
const zhModel = require("../Zonal Head/zonalHeadModel");
const { uploadImg } = require("../../utilities/helper");


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

        /* 1️⃣ Fetch Expense */
        const expense = await expenseModel
            .findById(expenseId)
            .populate("policyId");

        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found"
            });
        }

        if (expense.currentStatus !== "Pending") {
            return res.send({
                status: 422,
                success: false,
                message: "Expense is not in pending state"
            });
        }

        /* 2️⃣ Fetch Approver */
        const approver = await userModel.findById(approverId);

        if (!approver || !approver.designation) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid approver"
            });
        }

        const approverLevel = approver.designation.toUpperCase();

        /* 3️⃣ Validate approval level */
        if (expense.currentApprovalLevel !== approverLevel) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid approval flow"
            });
        }

        /* 4️⃣ Save approval history */
        await expenseApprovalModel.create({
            expenseId: expense._id,
            level: approverLevel,
            approverId,
            comment: comment || "",
            action: "Approved",
            status: "Approved"
        });

        /* 5️⃣ Decide next level */
        const policyLevels = expense.policyId?.approvalLevels || [];
        const currentIndex = policyLevels.indexOf(approverLevel);

        if (currentIndex === -1) {
            return res.send({
                status: 422,
                success: false,
                message: "Approval level not found in policy"
            });
        }

        const nextLevel = policyLevels[currentIndex + 1];

        /* =======================
           🔥 FINAL DECISION LOGIC
           ======================= */

        if (nextLevel) {
            // 🔁 Move to next approver
            expense.currentApprovalLevel = nextLevel;
            expense.currentStatus = "Pending";
        } else {
            // ✅ Final approval reached
            const isMultiLevel = policyLevels.length > 1;

            if (expense.natureOfExpense === "OPEX") {
                // 🔁 OPEX → always FM execution
                expense.currentStatus = "Approved";
                expense.postApprovalStage = "FM_PENDING";
                expense.currentApprovalLevel = "FM";

            } else if (
                expense.natureOfExpense === "CAPEX" &&
                isMultiLevel
            ) {
                // 🔁 CAPEX + multi-level → FM execution
                expense.currentStatus = "Approved";
                expense.postApprovalStage = "FM_PENDING";
                expense.currentApprovalLevel = "FM";

            } else {
                // ❌ CAPEX + single-level → direct close
                expense.currentStatus = "Closed";
                expense.postApprovalStage = "CLOSED";
                expense.currentApprovalLevel = null;
            }
        }

        /* Reset hold fields if any */
        expense.heldFromLevel = null;
        expense.holdComment = "";

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: nextLevel
                ? `Approved & sent to ${nextLevel}`
                : "Expense approved successfully"
        });

    } catch (err) {
        console.log("Approve Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Approval failed"
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

        // 1️⃣ Fetch Expense
        const expense = await expenseModel.findById(expenseId);
        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found"
            });
        }

        // 2️⃣ Approver ka role nikaalo
        const approver = await userModel.findById(approverId);
        if (!approver || !approver.designation) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid approver"
            });
        }

        // 🔥 NORMALIZE designation
        const approverLevel = approver.designation.toUpperCase(); // ZONAL_HEAD

        // 3️⃣ Save approval history
        await expenseApprovalModel.create({
            expenseId: expense._id,
            level: approverLevel,
            approverId: approverId,
            comment: comment || "",
            action: "Hold",
            status: "Hold"
        });

        // 4️⃣ Update expense
        expense.currentStatus = "Hold";
        expense.holdComment = comment || "";

        // 🔥 FIXED: always consistent value
        expense.heldFromLevel = approverLevel;

        // 🔥 FM ke paas bhejo
        expense.currentApprovalLevel = "FM";

        // 🔥 resubmittedAttachment clear
        expense.resubmittedAttachment = "";

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "Expense put on Hold and sent back to FM"
        });

    } catch (err) {
        console.log("Hold Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Hold failed"
        });
    }
};




const resubmitHeldExpense = async (req, res) => {
    try {
        const { expenseId } = req.body;

        if (!expenseId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId is required"
            });
        }

        const expense = await expenseModel.findById(expenseId);

        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found"
            });
        }

        if (expense.currentStatus !== "Hold") {
            return res.send({
                status: 422,
                success: false,
                message: "Expense is not in Hold state"
            });
        }

        /* ================= CLOUDINARY UPLOAD ================= */
        if (!req.file) {
            return res.send({
                status: 422,
                success: false,
                message: "Attachment is required for resubmission"
            });
        }

        try {
            const url = await uploadImg(req.file.buffer);
            expense.resubmittedAttachment = url; // 🔥 NEW attachment
        } catch (err) {
            return res.send({
                status: 422,
                success: false,
                message: "Cloudinary Error"
            });
        }

        /* ================= MOVE BACK TO SAME LEVEL ================= */
        expense.currentStatus = "Pending";
        expense.currentApprovalLevel = expense.heldFromLevel; // 🔥 SAME LEVEL
        expense.heldFromLevel = null;

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "Expense resubmitted successfully",
            data: expense
        });

    } catch (err) {
        console.log("Resubmit Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Resubmission failed"
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

        // 1️⃣ CLM user fetch
        const clmUser = await userModel.findById(clmId);

        if (!clmUser || !Array.isArray(clmUser.storeId) || clmUser.storeId.length === 0) {
            return res.send({
                success: false,
                message: "No store mapping found for CLM",
                data: []
            });
        }

        // 2️⃣ Expenses fetch (CLM ke stores + Pending + CLM level)
        const expenses = await expenseModel.find({
            storeId: { $in: clmUser.storeId },
            currentStatus: "Pending",
            currentApprovalLevel: "CLM",
            status: true
        })
            .populate("storeId expenseHeadId raisedBy");

        return res.send({
            success: true,
            data: expenses
        });

    } catch (err) {
        console.error("CLM Pending Expense Error:", err);
        return res.send({
            success: false,
            message: "CLM pending fetch failed",
            error: err.message
        });
    }
};

const pendingForZH = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.send({
                success: false,
                message: "userId is required"
            });
        }

        /* 1️⃣ Zonal Head data */
        const zhData = await zhModel.findOne({ userId });

        if (!zhData || !zhData.zoneId) {
            return res.send({
                success: false,
                message: "Zonal Head or zone not found"
            });
        }

        /* 2️⃣ Zone ke stores */
        const zoneStores = await storeModel.find(
            { zoneId: zhData.zoneId },
            { _id: 1 }
        );

        const storeIds = zoneStores.map(s => s._id);

        if (storeIds.length === 0) {
            return res.send({
                success: true,
                data: []
            });
        }

        /* 3️⃣ ZONAL_HEAD Pending expenses */
        const expenses = await expenseModel.find({
            storeId: { $in: storeIds },
            currentApprovalLevel: "ZONAL_HEAD",
            currentStatus: "Pending",
            status: true
        })
            .populate("storeId expenseHeadId raisedBy policyId")
            .sort({ createdAt: -1 });

        return res.send({
            success: true,
            message: "Zonal Head Pending Expenses",
            data: expenses
        });

    } catch (err) {
        console.log("Zonal Head Pending Error:", err);
        return res.send({
            success: false,
            message: "Zonal Head pending fetch failed"
        });
    }
};


const pendingForBF = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.send({
                status: 422,
                success: false,
                message: "userId is required"
            });
        }

        const bfUser = await userModel.findById(userId);

        if (!bfUser) {
            return res.send({
                status: 404,
                success: false,
                message: "User not found"
            });
        }

        // 🔹 Base condition (mandatory)
        let query = {
            currentApprovalLevel: "BUSINESS_FINANCE",
            currentStatus: "Pending",
            status: true
        };

        // 🔹 Store filter ONLY if BF has storeIds
        if (Array.isArray(bfUser.storeIds) && bfUser.storeIds.length > 0) {
            query.storeId = { $in: bfUser.storeIds };
        }
        console.log(query)
        const expenses = await expenseModel.find(query)
            .populate("storeId expenseHeadId raisedBy policyId")
            .sort({ createdAt: -1 });

        return res.send({
            status: 200,
            success: true,
            message: "BF Pending Expenses",
            data: expenses
        });

    } catch (err) {
        console.error("BF Pending Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "BF pending fetch failed"
        });
    }
};



const pendingForProcurement = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.send({
                status: 422,
                success: false,
                message: "userId is required"
            });
        }

        const procurementUser = await userModel.findById(userId);

        if (!procurementUser) {
            return res.send({
                status: 404,
                success: false,
                message: "User not found"
            });
        }
        // 🔹 Base mandatory condition
        let query = {
            currentApprovalLevel: "PROCUREMENT",
            currentStatus: "Pending",
            status: true
        };

        // 🔹 Optional store filtering
        if (
            Array.isArray(procurementUser.storeIds) &&
            procurementUser.storeIds.length > 0
        ) {
            query.storeId = { $in: procurementUser.storeIds };
        }

        const expenses = await expenseModel.find(query)
            .populate("storeId expenseHeadId raisedBy policyId")
            .sort({ createdAt: -1 });

        return res.send({
            status: 200,
            success: true,
            message: "Procurement Pending Expenses",
            data: expenses
        });

    } catch (err) {
        console.error("Procurement Pending Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Procurement pending fetch failed"
        });
    }
};

const prPoPendingExpenses = async (req, res) => {
    try {
        const errMsgs = [];

        if (!req.body.userId) errMsgs.push("userId is required");

        if (errMsgs.length > 0) {
            return res.send({
                status: 422,
                success: false,
                message: errMsgs,
            });
        }

        const userId = req.body.userId;

        // ✅ Check PR/PO user exists
        const prpoUser = await userModel.findById(userId);

        if (!prpoUser) {
            return res.send({
                success: false,
                message: "PR/PO user not found",
            });
        }

        // ✅ Fetch pending expenses for PR/PO
        const expenses = await expenseModel
            .find({
                currentApprovalLevel: "PR/PO",
                currentStatus: "Pending",
            })
            .populate("storeId")
            .populate("expenseHeadId")
            .populate("raisedBy")
            .sort({ createdAt: -1 });

        return res.send({
            success: true,
            message: "PR/PO pending expenses fetched successfully",
            data: expenses,
        });
    } catch (error) {
        console.log("PR/PO Pending Expense Error:", error);
        return res.send({
            success: false,
            message: "Something went wrong",
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


// const myApprovalActions = async (req, res) => {
//     try {
//         const { userId, action, level } = req.body;

//         if (!userId || !action || !level) {
//             return res.send({
//                 success: false,
//                 message: "userId & Action required"
//             });
//         }
//         const data = await expenseApprovalModel.find({
//             approverId: userId,
//             action: action,   // Approved | Hold | Rejected
//             level: level
//         })
//             .populate({
//                 path: "expenseId",
//                 populate: {
//                     path: "storeId expenseHeadId raisedBy"
//                 }
//             })
//             .sort({ actionAt: -1 });

//         res.send({
//             success: true,
//             data
//         });

//     } catch (err) {
//         res.send({
//             success: false,
//             message: "Approval list fetch failed"
//         });
//     }
// };

const myApprovalActions = async (req, res) => {
    try {
        const { userId, action, level } = req.body;

        if (!userId || !action || !level) {
            return res.send({
                success: false,
                message: "userId, action & level required"
            });
        }

        // 1️⃣ History fetch (case-insensitive level)
        const history = await expenseApprovalModel
            .find({
                approverId: userId,
                action: action,
                level: {
                    $regex: `^${level}$`,
                    $options: "i" // ZONAL_HEAD / Zonal_Head safe
                }
            })
            .populate({
                path: "expenseId",
                populate: {
                    path: "storeId expenseHeadId raisedBy"
                }
            })
            .sort({ actionAt: -1 });

        let filtered = [];

        /* ================= APPROVED / REJECTED ================= */
        if (action === "Approved" || action === "Rejected") {
            /**
             * ✅ History based
             * Expense chahe next level pe chala gaya ho
             * ya FM ke paas wapas aa gaya ho
             * tab bhi yahan dikhega
             */
            filtered = history.filter(h => h.expenseId);
        }

        /* ================= HOLD ================= */
        else if (action === "Hold") {
            /**
             * ✅ Sirf ACTIVE hold
             * FM resubmit ke baad hold se gayab ho jaayega
             */
            filtered = history.filter(h =>
                h.expenseId &&
                h.expenseId.currentStatus === "Hold" &&
                h.expenseId.heldFromLevel === level
            );
        }

        return res.send({
            success: true,
            data: filtered
        });

    } catch (err) {
        console.log("myApprovalActions error:", err);
        return res.send({
            success: false,
            message: "Approval list fetch failed"
        });
    }
};

const adminExpensesByStatus = async (req, res) => {
    try {
        const { status } = req.body;
        // status = Pending | Approved | Hold | Rejected

        // 🔹 PENDING (direct from expense)
        if (status === "Pending") {
            const pending = await expenseModel
                .find({ currentStatus: "Pending" })
                .populate("storeId expenseHeadId raisedBy");

            return res.send({
                success: true,
                data: pending.map(e => ({
                    ...e.toObject(),
                    currentAt: e.currentApprovalLevel // 👈 pending kahaan hai
                }))
            });
        }

        // 🔹 APPROVED / HOLD / REJECTED (from approval history)
        const approvals = await expenseApprovalModel
            .find({ action: status })
            .populate("expenseId approverId")
            .sort({ actionAt: -1 });

        const map = new Map();

        approvals.forEach(a => {
            if (!a.expenseId) return;

            const id = a.expenseId._id.toString();

            if (!map.has(id)) {
                map.set(id, {
                    ...a.expenseId.toObject(),
                    action: a.action,
                    actionBy: a.approverId?.name || "-",
                    actionLevel: a.level,
                    actionAt: a.actionAt,
                    comment: a.comment || "-"
                });
            }
        });

        res.send({
            success: true,
            data: Array.from(map.values())
        });

    } catch (err) {
        res.send({
            success: false,
            message: "Admin expense fetch failed"
        });
    }
};

const uploadWcrInvoice = async (req, res) => {
    try {
        const { expenseId } = req.body;

        if (!expenseId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId is required"
            });
        }

        /* 1️⃣ Fetch Expense */
        const expense = await expenseModel.findById(expenseId);

        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found"
            });
        }

        /* 2️⃣ Validate FM stage */
        if (
            expense.currentApprovalLevel !== "FM" ||
            expense.postApprovalStage !== "FM_PENDING"
        ) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not eligible for WCR/Invoice upload"
            });
        }

        /* 3️⃣ Validate files */
        if (!req.files || !req.files.wcr || !req.files.invoice) {
            return res.send({
                status: 422,
                success: false,
                message: "WCR & Invoice both are required"
            });
        }

        /* 4️⃣ Save attachments (Cloudinary assumed) */
        expense.wcrAttachment = req.files.wcr[0].path;
        expense.invoiceAttachment = req.files.invoice[0].path;

        /* 5️⃣ Move to Zonal Commercial */
        expense.postApprovalStage = "ZC_VERIFY";
        expense.currentApprovalLevel = "ZONAL_COMMERCIAL";
        expense.currentStatus = "Pending";

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "WCR & Invoice uploaded, sent to Zonal Commercial"
        });

    } catch (err) {
        console.log("WCR Upload Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Upload failed"
        });
    }
};

const verifyAndCloseExpense = async (req, res) => {
    try {
        const { expenseId, prismId, comment } = req.body;

        if (!expenseId || !prismId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId & prismId are required"
            });
        }

        /* 1️⃣ Fetch Expense */
        const expense = await expenseModel.findById(expenseId);

        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found"
            });
        }

        /* 2️⃣ Validate ZC stage */
        if (
            expense.currentApprovalLevel !== "ZONAL_COMMERCIAL" ||
            expense.postApprovalStage !== "ZC_VERIFY"
        ) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not eligible for verification"
            });
        }

        /* 3️⃣ Validate attachments */
        if (!expense.wcrAttachment || !expense.invoiceAttachment) {
            return res.send({
                status: 422,
                success: false,
                message: "WCR & Invoice must be uploaded before verification"
            });
        }

        /* 4️⃣ Save Prism ID */
        expense.prismId = prismId;

        /* 5️⃣ Close Ticket */
        expense.currentStatus = "Closed";
        expense.postApprovalStage = "CLOSED";
        expense.currentApprovalLevel = null;

        await expense.save();

        /* 6️⃣ Save audit history (recommended) */
        await expenseApprovalModel.create({
            expenseId: expense._id,
            level: "ZONAL_COMMERCIAL",
            approverId: req.userId || null,
            comment: comment || "",
            action: "Closed",
            status: "Closed"
        });

        return res.send({
            status: 200,
            success: true,
            message: "Expense verified and closed successfully"
        });

    } catch (err) {
        console.log("ZC Verify Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Verification failed"
        });
    }
};


module.exports = { approveExpense, holdExpense, rejectExpense, approvalHistory, clmPendingExpenses, pendingForProcurement, pendingForBF, pendingForZH, expenseAction, myApprovalActions, resubmitHeldExpense, adminExpensesByStatus, prPoPendingExpenses,uploadWcrInvoice,verifyAndCloseExpense }
