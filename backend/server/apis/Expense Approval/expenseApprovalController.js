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
        const { expenseId, approverId, comment, prComment, poComment } = req.body;

        if (!expenseId || !approverId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId & approverId are required",
            });
        }

        const expense = await expenseModel.findById(expenseId).populate("policyId");
        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found",
            });
        }

        if (expense.currentStatus !== "Pending") {
            return res.send({
                status: 422,
                success: false,
                message: "Expense is not in pending state",
            });
        }

        const approver = await userModel.findById(approverId);
        if (!approver || !approver.designation) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid approver",
            });
        }

        const normalize = (v) =>
            v?.toUpperCase().replace(/\s+/g, "").replace(/\//g, "").trim();

        const approverLevel = normalize(approver.designation);
        const expenseLevel = normalize(expense.currentApprovalLevel);

        if (approverLevel !== expenseLevel) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid approval flow",
            });
        }

        /* ================= PR/PO UNIVERSAL LOGIC ================= */
        const prFile = req.files?.prAttachment?.[0];
        const poFile = req.files?.poAttachment?.[0];

        if (expense.currentApprovalLevel === "PR/PO") {

            if (!prComment?.trim() || !poComment?.trim()) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "PR & PO comment are required",
                });
            }

            expense.prComment = prComment.trim();
            expense.poComment = poComment.trim();

            try {
                if (prFile) {
                    expense.prAttachment = await uploadImg(prFile.buffer);
                }
                if (poFile) {
                    expense.poAttachment = await uploadImg(poFile.buffer);
                }
            } catch (err) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "PR/PO attachment upload failed",
                });
            }
        }

        /* ================= SAVE APPROVAL HISTORY ================= */
        await expenseApprovalModel.create({
            expenseId,
            level: expense.currentApprovalLevel,
            approverId,
            action: "Approved",
            comment:
                expense.currentApprovalLevel === "PR/PO"
                    ? `PR: ${expense.prComment} | PO: ${expense.poComment}`
                    : comment || "",
            actionAt: new Date(),
        });

        /* ================= CAPEX FLOW ================= */
        if (expense.natureOfExpense === "CAPEX") {

            if (expense.currentApprovalLevel === "PR/PO") {
                expense.currentApprovalLevel = "FM";
                expense.currentStatus = "Approved";
                expense.postApprovalStage = "FM_PENDING";
            } else {
                const CAPEX_FLOW = [
                    "ZONAL_HEAD",
                    "BUSINESS_FINANCE",
                    "PROCUREMENT",
                    "PR/PO",
                ];

                const idx = CAPEX_FLOW.map(normalize).indexOf(approverLevel);
                expense.currentApprovalLevel = CAPEX_FLOW[idx + 1];
                expense.currentStatus = "Pending";
            }

            expense.heldFromLevel = null;
            expense.holdComment = "";

            await expense.save();

            return res.send({
                status: 200,
                success: true,
                message: "CAPEX approved",
            });
        }

        /* ================= OPEX FLOW ================= */
        const levels = expense.policyId?.approvalLevels || [];
        const idx = levels.map(normalize).indexOf(approverLevel);
        const next = levels[idx + 1];

        if (next) {
            expense.currentApprovalLevel = next;
            expense.currentStatus = "Pending";
        } else {
            expense.currentStatus = "Approved";
            expense.currentApprovalLevel = "FM";
            expense.postApprovalStage = "FM_PENDING";
        }

        expense.heldFromLevel = null;
        expense.holdComment = "";

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "Expense approved",
        });

    } catch (err) {
        console.log("Approve Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Approval failed",
        });
    }
};


/* ================= HOLD EXPENSE ================= */
const holdExpense = async (req, res) => {
    try {
        const { expenseId, approverId, comment } = req.body;

        if (!expenseId || !approverId || !comment?.trim()) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId, approverId & comment are required",
            });
        }

        const expense = await expenseModel.findById(expenseId);
        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found",
            });
        }

        const approver = await userModel.findById(approverId);
        if (!approver || !approver.designation) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid approver",
            });
        }

        const approverLevel = approver.designation.toUpperCase();

        let prAttachmentUrl = null;
        let poAttachmentUrl = null;

        try {
            if (req.files?.prAttachment?.length > 0) {
                prAttachmentUrl = await uploadImg(req.files.prAttachment[0].buffer);
            }
            if (req.files?.poAttachment?.length > 0) {
                poAttachmentUrl = await uploadImg(req.files.poAttachment[0].buffer);
            }
        } catch (err) {
            return res.send({
                status: 422,
                success: false,
                message: "Attachment upload failed",
            });
        }

        await expenseApprovalModel.create({
            expenseId: expense._id,
            level: approverLevel,
            approverId,
            comment,
            action: "Hold",
            status: "Hold",
        });

        expense.holdHistory.push({
            heldBy: approverId,
            level: approverLevel,
            comment: comment.trim(),
            prAttachment: prAttachmentUrl,
            poAttachment: poAttachmentUrl
        });

        expense.currentStatus = "Hold";
        expense.holdComment = comment.trim();
        expense.heldFromLevel = approverLevel;
        expense.currentApprovalLevel = "FM";
        expense.postApprovalStage = "NONE";

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "Expense put on Hold and sent back to FM",
        });

    } catch (err) {
        console.log("Hold Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Hold failed",
        });
    }
};


/* ================= REJECT EXPENSE ================= */
const rejectExpense = async (req, res) => {
    try {
        const { expenseId, approverId, comment } = req.body;

        if (!expenseId || !approverId || !comment?.trim()) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId, approverId & comment are required",
            });
        }

        const expense = await expenseModel.findById(expenseId);
        if (!expense || !expense.currentApprovalLevel) {
            return res.send({
                status: 422,
                success: false,
                message: "Invalid expense or no approval pending",
            });
        }

        await expenseApprovalModel.create({
            expenseId,
            level: expense.currentApprovalLevel,
            approverId,
            comment: comment.trim(),
            action: "Rejected",
            status: "Rejected",
        });

        expense.currentStatus = "Rejected";
        expense.currentApprovalLevel = null;
        expense.postApprovalStage = "CLOSED";

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "Expense Rejected",
        });

    } catch (err) {
        console.log("Reject Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Reject failed",
        });
    }
};

const resubmitHeldExpense = async (req, res) => {
    try {
        const { expenseId, fmComment } = req.body;

        if (!expenseId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId is required"
            });
        }

        if (!fmComment?.trim()) {
            return res.send({
                status: 422,
                success: false,
                message: "FM comment is required"
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

        let uploadedUrl;

        try {
            uploadedUrl = await uploadImg(req.file.buffer);
        } catch (err) {
            return res.send({
                status: 422,
                success: false,
                message: "Cloudinary Error"
            });
        }

        /* ================= PUSH INTO RESUBMISSION HISTORY ================= */

        expense.resubmissions.push({
            attachment: uploadedUrl,
            fmComment: fmComment.trim(),
            heldFromLevel: expense.heldFromLevel
        });

        /* ================= CREATE APPROVAL HISTORY ENTRY ================= */

        await expenseApprovalModel.create({
            expenseId: expense._id,
            level: "FM",
            approverId: req.body.approverId,
            action: "Resubmitted",
            comment: fmComment.trim(),
            actionAt: new Date()
        });

        /* ================= MOVE BACK TO SAME LEVEL ================= */

        expense.currentStatus = "Pending";
        expense.currentApprovalLevel = expense.heldFromLevel;

        expense.heldFromLevel = null;
        expense.holdComment = "";

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
//                 message: "userId, action & level required"
//             });
//         }

//         // 1️⃣ History fetch (case-insensitive level)
//         const history = await expenseApprovalModel
//             .find({
//                 approverId: userId,
//                 action: action,
//                 level: {
//                     $regex: `^${level}$`,
//                     $options: "i" // ZONAL_HEAD / Zonal_Head safe
//                 }
//             })
//             .populate({
//                 path: "expenseId",
//                 populate: {
//                     path: "storeId expenseHeadId raisedBy"
//                 }
//             })
//             .sort({ actionAt: -1 });

//         let filtered = [];

//         /* ================= APPROVED / REJECTED ================= */
//         if (action === "Approved" || action === "Rejected") {
//             /**
//              * ✅ History based
//              * Expense chahe next level pe chala gaya ho
//              * ya FM ke paas wapas aa gaya ho
//              * tab bhi yahan dikhega
//              */
//             filtered = history.filter(h => h.expenseId);
//         }

//         /* ================= HOLD ================= */
//         else if (action === "Hold") {
//             /**
//              * ✅ Sirf ACTIVE hold
//              * FM resubmit ke baad hold se gayab ho jaayega
//              */
//             filtered = history.filter(h =>
//                 h.expenseId &&
//                 h.expenseId.currentStatus === "Hold" &&
//                 h.expenseId.heldFromLevel === level
//             );
//         }

//         return res.send({
//             success: true,
//             data: filtered
//         });

//     } catch (err) {
//         console.log("myApprovalActions error:", err);
//         return res.send({
//             success: false,
//             message: "Approval list fetch failed"
//         });
//     }
// };

const myApprovalActions = async (req, res) => {
    try {
        const { userId, action, level } = req.body;

        /* ================= VALIDATION ================= */
        if (!userId || !action || !level) {
            return res.send({
                success: false,
                message: "userId, action & level required"
            });
        }

        /* ================= FETCH HISTORY ================= */
        const history = await expenseApprovalModel
            .find({
                approverId: userId,
                action: action,
                level: {
                    $regex: `^${level}$`,
                    $options: "i" // case-insensitive
                }
            })
            .populate({
                path: "expenseId",
                populate: [
                    { path: "storeId" },
                    { path: "expenseHeadId" },
                    { path: "raisedBy" }
                ]
            })
            .sort({ actionAt: -1 }); // latest first

        let filtered = [];

        /* ================= APPROVED / REJECTED / CLOSED ================= */
        if (["Approved", "Rejected", "Closed"].includes(action)) {
            /**
             * One row per expense
             * Latest action only
             */
            const uniqueMap = new Map();

            history.forEach(h => {
                if (h.expenseId && !uniqueMap.has(h.expenseId._id.toString())) {
                    uniqueMap.set(h.expenseId._id.toString(), h);
                }
            });

            filtered = Array.from(uniqueMap.values());
        }

        /* ================= HOLD ================= */
        else if (action === "Hold") {
            /**
             * Only ACTIVE holds
             * FM resubmit ke baad hat jaayega
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



// const adminExpensesByStatus = async (req, res) => {
//     try {
//         const { status } = req.body;
//         // status = Pending | Approved | Hold | Rejected | Closed

//         /* ================= PENDING ================= */
//         if (status === "Pending") {
//             const pending = await expenseModel
//                 .find({ currentStatus: "Pending" })
//                 .populate("raisedBy")
//                 .populate({
//                     path: "storeId",
//                     populate: [
//                         { path: "stateId" },
//                         { path: "zoneId" }
//                     ]
//                 })
//                 .populate("expenseHeadId")
//                 .sort({ createdAt: -1 });

//             return res.send({
//                 success: true,
//                 data: pending.map(e => ({
//                     ...e.toObject(),
//                     currentAt: e.currentApprovalLevel
//                 }))
//             });
//         }

//         /* ================= CLOSED ================= */
//         if (status === "Closed") {

//             const approvals = await expenseApprovalModel
//                 .find({ action: "Closed" })
//                 .populate({
//                     path: "expenseId",
//                     populate: [
//                         { path: "storeId" },
//                         { path: "expenseHeadId" }
//                     ]
//                 })
//                 .populate("approverId")
//                 .sort({ actionAt: -1 });

//             const map = new Map();

//             approvals.forEach(a => {
//                 if (!a.expenseId) return;

//                 const id = a.expenseId._id.toString();

//                 if (!map.has(id)) {
//                     map.set(id, {
//                         ...a.expenseId.toObject(),
//                         actionAt: a.actionAt, // 👈 this is real closed date
//                         actionBy: a.approverId?.name || "-"
//                     });
//                 }
//             });

//             return res.send({
//                 success: true,
//                 data: Array.from(map.values())
//             });
//         }


//         /* ================= APPROVED / HOLD / REJECTED ================= */
//         const approvals = await expenseApprovalModel
//             .find({ action: status })
//             .populate({
//                 path: "expenseId",
//                 populate: [
//                     { path: "raisedBy" },
//                     {
//                         path: "storeId",
//                         populate: [
//                             { path: "stateId" },
//                             { path: "zoneId" }
//                         ]
//                     },
//                     { path: "expenseHeadId" }
//                 ]
//             })
//             .populate("approverId")
//             .sort({ actionAt: -1 });

//         const map = new Map();

//         approvals.forEach(a => {
//             if (!a.expenseId) return;

//             const id = a.expenseId._id.toString();

//             if (!map.has(id)) {
//                 map.set(id, {
//                     ...a.expenseId.toObject(),

//                     action: a.action,
//                     actionBy: a.approverId?.name || "-",
//                     actionLevel: a.level,
//                     actionAt: a.actionAt,
//                     comment: a.comment || "-"
//                 });
//             }
//         });

//         return res.send({
//             success: true,
//             data: Array.from(map.values())
//         });

//     } catch (err) {
//         return res.send({
//             success: false,
//             message: "Admin expense fetch failed"
//         });
//     }
// };

const adminExpensesByStatus = async (req, res) => {
    try {
        const { status } = req.body;
        // status = Pending | Approved | Hold | Rejected | Closed

        if (!status) {
            return res.send({
                success: false,
                message: "Status is required"
            });
        }

        /* ================= FETCH FROM EXPENSE MODEL ================= */
        const expenses = await expenseModel
            .find({ currentStatus: status })
            .populate("raisedBy")
            .populate({
                path: "storeId",
                populate: [
                    { path: "stateId" },
                    { path: "zoneId" }
                ]
            })
            .populate("expenseHeadId")
            .sort({ createdAt: -1 });

        return res.send({
            success: true,
            data: expenses.map(e => ({
                ...e.toObject(),
                currentAt: e.currentApprovalLevel
            }))
        });

    } catch (err) {
        return res.send({
            success: false,
            message: "Admin expense fetch failed"
        });
    }
};

const uploadWcrInvoice = async (req, res) => {
    try {
        const { expenseId, fmComment, fmId } = req.body;

        if (!expenseId || !fmComment?.trim() || !fmId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId, fmId & fmComment are required",
            });
        }

        if (!req.files?.wcr || !req.files?.invoice) {
            return res.send({
                status: 422,
                success: false,
                message: "WCR & Invoice are mandatory",
            });
        }

        const wcrUrl = await uploadImg(req.files.wcr[0].buffer);
        const invoiceUrl = await uploadImg(req.files.invoice[0].buffer);

        const expense = await expenseModel.findById(expenseId);

        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found",
            });
        }

        /* ================= SAVE EXECUTION DATA ================= */
        expense.wcrAttachment = wcrUrl;
        expense.invoiceAttachment = invoiceUrl;
        expense.executionUploadedAt = new Date();
        expense.fmComment = fmComment.trim();

        /* ================= FLOW ================= */

        if (expense.natureOfExpense === "CAPEX") {

            expense.currentApprovalLevel = "PR/PO";
            expense.currentStatus = "Pending";
            expense.postApprovalStage = "PRPO_EMAIL";

        } else {

            expense.currentApprovalLevel = "ZONAL_COMMERCIAL";
            expense.currentStatus = "Pending";
            expense.postApprovalStage = "ZC_VERIFY";
        }

        /* ================= HISTORY ENTRY ================= */
        await expenseApprovalModel.create({
            expenseId: expense._id,
            level: "FM",
            approverId: fmId,
            action: "Approved", // keep as Approved for enum safety
            comment: `Execution Uploaded: ${fmComment.trim()}`,
            actionAt: new Date()
        });

        await expense.save();

        return res.send({
            status: 200,
            success: true,
            message: "WCR & Invoice uploaded successfully",
        });

    } catch (err) {
        console.log("FM Upload Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Upload failed",
        });
    }
};


const verifyAndCloseExpense = async (req, res) => {
    try {
        const { expenseId, prismId, comment, approverId } = req.body;

        if (!expenseId || !prismId || !approverId) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId, prismId & approverId are required"
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

        /* 🚫 BLOCK CAPEX */
        if (expense.natureOfExpense === "CAPEX") {
            return res.send({
                status: 422,
                success: false,
                message: "CAPEX expenses are not verified by Zonal Commercial"
            });
        }

        /* ✅ OPEX ONLY */
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

        if (!expense.wcrAttachment || !expense.invoiceAttachment) {
            return res.send({
                status: 422,
                success: false,
                message: "WCR & Invoice must be uploaded before verification"
            });
        }

        if (expense.currentStatus === "Closed") {
            return res.send({
                status: 422,
                success: false,
                message: "Expense already closed"
            });
        }

        /* 🔐 CLOSE */
        expense.prismId = prismId;
        expense.currentStatus = "Closed";
        expense.postApprovalStage = "CLOSED";
        expense.currentApprovalLevel = null;

        await expense.save();

        // await expenseApprovalModel.create({
        //     expenseId: expense._id,
        //     level: "ZONAL_COMMERCIAL",
        //     approverId,
        //     comment: prismId || "",
        //     action: "Closed",
        //     status: "Closed"
        // });
        await expenseApprovalModel.create({
            expenseId: expense._id,
            level: "ZONAL_COMMERCIAL",
            approverId,
            action: "Closed",
            comment: prismId,  // ✅ YE HONA CHAHIYE
            actionAt: new Date()
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



const zonalCommercialPending = async (req, res) => {
    try {
        const data = await expenseModel
            .find({
                currentApprovalLevel: "ZONAL_COMMERCIAL",
                postApprovalStage: "ZC_VERIFY",
                status: true
            })
            .populate("storeId expenseHeadId raisedBy")
            .sort({ createdAt: -1 });

        return res.send({
            success: true,
            data
        });

    } catch (err) {
        console.log("ZC Pending Error:", err);
        return res.send({
            success: false,
            message: "Failed to fetch ZC pending expenses"
        });
    }
};

const prpoEmailAndClose = async (req, res) => {
    try {
        const { expenseId, approverId, prPoEmailSubject } = req.body;

        if (!expenseId || !approverId || !prPoEmailSubject?.trim()) {
            return res.send({
                status: 422,
                success: false,
                message: "expenseId, approverId & email subject are required",
            });
        }

        const expense = await expenseModel.findById(expenseId);
        if (!expense) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not found",
            });
        }

        /* ✅ CORRECT PR/PO EMAIL STAGE VALIDATION */
        if (
            expense.currentApprovalLevel !== "PR/PO" ||
            expense.postApprovalStage !== "PRPO_EMAIL" ||
            expense.currentStatus !== "Pending"   // 🔥 FIX HERE
        ) {
            return res.send({
                status: 422,
                success: false,
                message: "Expense not eligible for final closure",
            });
        }

        /* 💾 Save email subject */
        expense.prPoEmailSubject = prPoEmailSubject.trim();

        /* 🔥 Final close */
        expense.currentStatus = "Closed";
        expense.currentApprovalLevel = null;
        expense.postApprovalStage = "CLOSED";

        await expense.save();

        /* 🧾 Approval history */
        await expenseApprovalModel.create({
            expenseId: expense._id,
            level: "PR/PO",
            approverId,
            action: "Closed",
            comment: prPoEmailSubject.trim(),
            actionAt: new Date(),
        });

        return res.send({
            status: 200,
            success: true,
            message: "Expense closed successfully",
        });

    } catch (err) {
        console.log("PR/PO Close Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Final closure failed",
        });
    }
};






module.exports = { approveExpense, holdExpense, rejectExpense, approvalHistory, clmPendingExpenses, pendingForProcurement, pendingForBF, pendingForZH, expenseAction, myApprovalActions, resubmitHeldExpense, adminExpensesByStatus, prPoPendingExpenses, uploadWcrInvoice, verifyAndCloseExpense, zonalCommercialPending, prpoEmailAndClose }
