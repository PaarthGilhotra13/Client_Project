const expenseModel = require("./expenseModel");
const approvalPolicyModel = require("../Approval Policy/approvalPolicyModel");
const userModel = require("../User/userModel");

const add = (req, res) => {
    var errMsgs = [];

    /* ========== BASIC VALIDATIONS ========== */
    if (!req.body.ticketId) errMsgs.push("ticketId is required");
    if (!req.body.storeId) errMsgs.push("storeId is required");
    if (!req.body.expenseHeadId) errMsgs.push("expenseHeadId is required");
    if (!req.body.natureOfExpense) errMsgs.push("natureOfExpense is required");
    if (!req.body.amount) errMsgs.push("amount is required");
    if (!req.body.policy) errMsgs.push("policy is required");
    if (!req.body.raisedBy) errMsgs.push("raisedBy is required");
    if (!req.files || req.files.length === 0)
        errMsgs.push("At least one attachment is required");


    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    /* ===== CHECK ACTIVE EXPENSE FOR SAME TICKET ===== */
    expenseModel.findOne({
        ticketId: req.body.ticketId,
        currentStatus: { $in: ["Pending", "Hold"] },
        status: true
    })
        .then(existing => {

            if (existing) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Active expense already exists for this ticket"
                });
            }

            /* ================================================= */
            /* ================= CAPEX FLOW ==================== */
            /* ================================================= */
            if (req.body.natureOfExpense === "CAPEX") {

                (async () => {
                    let expenseObj = new expenseModel();

                    expenseObj.ticketId = req.body.ticketId;
                    expenseObj.storeId = req.body.storeId;
                    expenseObj.expenseHeadId = req.body.expenseHeadId;
                    expenseObj.natureOfExpense = "CAPEX";
                    expenseObj.amount = req.body.amount;
                    expenseObj.remark = req.body.remark || "";
                    expenseObj.rca = req.body.rca || "";

                    // ✅ Frontend policy = category / label
                    expenseObj.policy = req.body.policy;

                    // ❌ Approval policy bypass
                    expenseObj.policyId = null;
                    expenseObj.postApprovalStage = null;
                    // 🔥 CAPEX always starts from ZONAL_HEAD
                    expenseObj.attachment = req.files.map(file => file.path);
                    expenseObj.currentApprovalLevel = "ZONAL_HEAD";
                    expenseObj.currentStatus = "Pending";
                    expenseObj.raisedBy = req.body.raisedBy;
                    expenseObj.status = true;

                    expenseObj.save()
                        .then(data => {

                            // 🔔 Notify Zonal Head
                            if (req.body.zhId) {
                                sendNotification(
                                    req.body.zhId,
                                    "New CAPEX Expense Submitted",
                                    `CAPEX Expense ${data.ticketId} is pending for your approval`,
                                    data._id
                                );
                            }

                            return res.send({
                                status: 200,
                                success: true,
                                message: "CAPEX Expense Added Successfully",
                                data
                            });
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Expense Not Added"
                            });
                        });
                })();

            } else {

                /* ================================================= */
                /* ================= OPEX FLOW ===================== */
                /* ================================================= */

                approvalPolicyModel.findOne({
                    minAmount: { $lte: req.body.amount },
                    maxAmount: { $gte: req.body.amount },
                    status: true
                })
                    .then(async (policyData) => {

                        if (!policyData) {
                            return res.send({
                                status: 422,
                                success: false,
                                message: "No approval policy found for this amount"
                            });
                        }

                        let nextApprovalLevel = null;
                        if (policyData.approvalLevels.length > 0) {
                            nextApprovalLevel = policyData.approvalLevels[0];
                        }

                        let expenseObj = new expenseModel();

                        expenseObj.ticketId = req.body.ticketId;
                        expenseObj.storeId = req.body.storeId;
                        expenseObj.expenseHeadId = req.body.expenseHeadId;
                        expenseObj.natureOfExpense = "OPEX";
                        expenseObj.amount = req.body.amount;
                        expenseObj.remark = req.body.remark || "";
                        expenseObj.rca = req.body.rca || "";

                        // ✅ Frontend policy = category / label
                        expenseObj.policy = req.body.policy;

                        // ✅ Backend approval policy (amount-based)
                        expenseObj.policyId = policyData._id;
                        expenseObj.attachment = req.files.map(file => file.path);
                        expenseObj.currentApprovalLevel = nextApprovalLevel;
                        expenseObj.currentStatus = "Pending";
                        expenseObj.raisedBy = req.body.raisedBy;
                        expenseObj.status = true;

                        expenseObj.save()
                            .then(data => {

                                let notifyUserId = null;

                                if (nextApprovalLevel === "CLM") {
                                    notifyUserId = req.body.clmId;
                                } else if (nextApprovalLevel === "ZH") {
                                    notifyUserId = req.body.zhId;
                                } else if (nextApprovalLevel === "BF") {
                                    notifyUserId = req.body.bfId;
                                } else if (nextApprovalLevel === "PROCUREMENT") {
                                    notifyUserId = req.body.procurementId;
                                }

                                if (notifyUserId) {
                                    sendNotification(
                                        notifyUserId,
                                        "New Expense Submitted",
                                        `Expense ${data.ticketId} is pending for your approval`,
                                        data._id
                                    );
                                }

                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "Expense Added Successfully",
                                    data
                                });
                            })
                            .catch(() => {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Expense Not Added"
                                });
                            });

                    })
                    .catch(() => {
                        res.send({
                            status: 422,
                            success: false,
                            message: "Approval policy lookup failed"
                        });
                    });
            }

        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};

const getAll = async (req, res) => {
    try {
        const expenses = await expenseModel
            .find()
            .populate("storeId expenseHeadId raisedBy")
            .sort({ createdAt: -1 });

        res.send({
            success: true,
            data: expenses
        });

    } catch (err) {
        res.send({
            success: false,
            message: "Failed to fetch expenses"
        });
    }
};


const getSingle = (req, res) => {

    if (!req.body._id) {
        return res.send({
            status: 422,
            success: false,
            message: "_id is required"
        });
    }

    expenseModel.findOne({
        _id: req.body._id,
        status: true
    })
        .populate("storeId expenseHeadId policyId raisedBy")
        .then(data => {
            if (!data) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Expense not Found"
                });
            } else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Expense Found",
                    data
                });
            }
        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};

const myExpenses = (req, res) => {
    var errMsgs = [];

    if (!req.body.userId) errMsgs.push("userId is required");

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs,
        });
    }

    /* ================= BASE FILTER ================= */
    let filter = {
        raisedBy: req.body.userId,
        status: true,
    };
    if (req.body.includeExecutionStage) {

        filter.$or = [
            { currentStatus: "Closed" },
            {
                postApprovalStage: { $in: ["PRPO_EMAIL", "ZC_VERIFY"] }
            }
        ];

    } else {

        /* ================= OPTIONAL STATUS ================= */
        if (req.body.currentStatus) {
            filter.currentStatus = req.body.currentStatus.trim();
        }

        /* ================= OPTIONAL APPROVAL LEVEL ================= */
        if (req.body.currentApprovalLevel) {
            filter.currentApprovalLevel = req.body.currentApprovalLevel.trim();
        }

        /* ================= OPTIONAL POST STAGE ================= */
        if (req.body.postApprovalStage) {
            filter.postApprovalStage = req.body.postApprovalStage.trim();
        }

        /* ========================================================= */
        /* 🔥 SAFETY: FM Pending page */
        /* ========================================================= */
        if (
            req.body.currentApprovalLevel === "FM" &&
            req.body.currentStatus === "Pending" &&
            !req.body.postApprovalStage
        ) {
            filter.postApprovalStage = "NONE";
        }
        if (req.body.excludePostApprovalStage) {
            filter.postApprovalStage = {
                $ne: req.body.excludePostApprovalStage,
            };
        }
    }

    expenseModel
        .find(filter)
        .populate("storeId expenseHeadId policyId")
        .populate("holdHistory.heldBy", "name designation")
        .populate("raisedBy", "name designation")
        .sort({ createdAt: -1 })
        .then((data) => {
            res.send({
                status: 200,
                success: true,
                message: "My Expense List",
                data,
            });
        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
            });
        });
};



module.exports = { add, getAll, getSingle, myExpenses }
