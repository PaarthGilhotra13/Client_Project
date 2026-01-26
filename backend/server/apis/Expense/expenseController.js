// paarth 
const expenseModel = require("./expenseModel");
const approvalPolicyModel = require("../Approval Policy/approvalPolicyModel");
const userModel = require("../User/userModel");
const { uploadImg } = require("../../utilities/helper");

// const add = (req, res) => {
//     var errMsgs = [];
//     if (!req.body.ticketId) errMsgs.push("ticketId is required");
//     if (!req.body.storeId) errMsgs.push("storeId is required");
//     if (!req.body.expenseHeadId) errMsgs.push("expenseHeadId is required");
//     if (!req.body.natureOfExpense) errMsgs.push("natureOfExpense is required");
//     if (!req.body.amount) errMsgs.push("amount is required");
//     if (!req.body.remark) errMsgs.push("remark is required");
//     if (!req.body.rca) errMsgs.push("rca is required");
//     if (!req.body.policy) errMsgs.push("policy is required");
//     if (!req.body.policyId) errMsgs.push("policyId is required");
//     if (!req.file) errMsgs.push("attachment is required");

//     if (errMsgs.length > 0) {
//         return res.send({
//             status: 422,
//             success: false,
//             message: errMsgs
//         });
//     }

//     /* ===== CHECK ACTIVE EXPENSE FOR SAME TICKET ===== */
//     expenseModel.findOne({
//         ticketId: req.body.ticketId,
//         currentStatus: { $in: ["Pending", "Hold"] },
//         status: true
//     })
//         .then(existing => {

//             if (existing) {
//                 return res.send({
//                     status: 422,
//                     success: false,
//                     message: "Active expense already exists for this ticket"
//                 });
//             }

//             /* ===== FIND APPROVAL POLICY (VERIFY POLICY ID) ===== */
//             approvalPolicyModel.findOne({
//                 _id: req.body.policyId,
//                 status: true
//             })
//                 .then(policyData => {

//                     if (!policyData) {
//                         return res.send({
//                             status: 422,
//                             success: false,
//                             message: "Invalid approval policy"
//                         });
//                     }

//                     /* ===== DETERMINE NEXT APPROVER ===== */
//                     const approvalLevels = policyData.approvalLevels; // ["FM","CLM","ZONAL_HEAD"]
//                     let nextApprovalLevel = null;

//                     // FM submit karta hai → next approver
//                     if (approvalLevels.length > 1) {
//                         nextApprovalLevel = approvalLevels[1];
//                     }

//                     /* ===== CREATE EXPENSE OBJECT ===== */
//                     let expenseObj = new expenseModel();
//                     expenseObj.ticketId = req.body.ticketId;
//                     expenseObj.storeId = req.body.storeId;
//                     expenseObj.expenseHeadId = req.body.expenseHeadId;
//                     expenseObj.natureOfExpense = req.body.natureOfExpense;
//                     expenseObj.amount = req.body.amount;
//                     expenseObj.remark = req.body.remark;
//                     expenseObj.rca = req.body.rca;

//                     //  POLICY DATA (DONO SAVE)
//                     expenseObj.policy = req.body.policy;          // policy key/name
//                     expenseObj.policyId = req.body.policyId;      // policy ObjectId

//                     expenseObj.attachment = req.file.path;

//                     expenseObj.currentStatus = "Pending";
//                     expenseObj.currentApprovalLevel = nextApprovalLevel; //  CLM / next level
//                     expenseObj.status = true;

//                     expenseObj.save()
//                         .then(data => {
//                             res.send({
//                                 status: 200,
//                                 success: true,
//                                 message: "Expense Submitted Successfully",
//                                 data
//                             });
//                         })
//                         .catch(() => {
//                             res.send({
//                                 status: 422,
//                                 success: false,
//                                 message: "Expense Not Added"
//                             });
//                         });

//                 })
//                 .catch(() => {
//                     res.send({
//                         status: 422,
//                         success: false,
//                         message: "Policy lookup failed"
//                     });
//                 });

//         })
//         .catch(() => {
//             res.send({
//                 status: 422,
//                 success: false,
//                 message: "Something Went Wrong"
//             });
//         });
// };

const add = (req, res) => {
    var errMsgs = [];

    if (!req.body.ticketId) errMsgs.push("ticketId is required");
    if (!req.body.storeId) errMsgs.push("storeId is required");
    if (!req.body.expenseHeadId) errMsgs.push("expenseHeadId is required");
    if (!req.body.natureOfExpense) errMsgs.push("natureOfExpense is required");
    if (!req.body.amount) errMsgs.push("amount is required");
    if (!req.body.policy) errMsgs.push("policy is required");
    if (!req.body.raisedBy) errMsgs.push("raisedBy is required");
    if (!req.file) errMsgs.push("attachment is required");

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

            /* ===== FIND APPROVAL POLICY BASED ON AMOUNT ===== */
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

                    /* ===== SET NEXT APPROVAL LEVEL ===== */
                    let nextApprovalLevel = null;
                    if (policyData.approvalLevels.length > 0) {
                        nextApprovalLevel = policyData.approvalLevels[0];
                    }

                    /* ===== CREATE EXPENSE OBJECT ===== */
                    let expenseObj = new expenseModel();

                    expenseObj.ticketId = req.body.ticketId;
                    expenseObj.storeId = req.body.storeId;
                    expenseObj.expenseHeadId = req.body.expenseHeadId;
                    expenseObj.natureOfExpense = req.body.natureOfExpense;
                    expenseObj.amount = req.body.amount;
                    expenseObj.remark = req.body.remark || "";
                    expenseObj.rca = req.body.rca || "";

                    expenseObj.policy = req.body.policy;      // string only
                    expenseObj.policyId = policyData._id;     // internal reference

                    if (req.file) {
                        try {
                            let url = await uploadImg(req.file.buffer)
                            expenseObj.attachment = url
                        }
                        catch (err) {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Cloudinary Error"
                            })
                        }
                    }
                    expenseObj.currentApprovalLevel = nextApprovalLevel;
                    expenseObj.currentStatus = "Pending";

                    expenseObj.raisedBy = req.body.raisedBy;
                    expenseObj.status = true;

                    expenseObj.save()
                        .then(data => {
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

        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};


const getAll = (req, res) => {
    expenseModel.find(req.body)
        .then(data => {
            res.send({
                status: 200,
                success: true,
                message: "Expense List",
                data
            })
        })
        .catch(() => {
            res.send({ status: 422, success: false, message: "Something Went Wrong" })
        })
}

// const pendingReq = (req, res) => {
//     var errMsgs = [];

//     if (!req.body.userId) errMsgs.push("userId is required");
//     if (!req.body.storeId) errMsgs.push("storeId is required");

//     if (errMsgs.length > 0) {
//         return res.send({
//             status: 422,
//             success: false,
//             message: errMsgs
//         });
//     }

//     /* ===== GET USER ROLE ===== */
//     userModel.findOne({ _id: req.body.userId })
//         .then(user => {

//             if (!user) {
//                 return res.send({
//                     status: 422,
//                     success: false,
//                     message: "User not Found"
//                 });
//             }

//             // userType → role mapping
//             const roleMap = {
//                 3: "FM",
//                 4: "CLM",
//                 5: "ZONAL_HEAD",
//                 6: "BUSINESS_FINANCE",
//                 7: "PROCUREMENT"
//             };

//             const userRole = roleMap[user.userType];

//             if (!userRole) {
//                 return res.send({
//                     status: 422,
//                     success: false,
//                     message: "Invalid user role"
//                 });
//             }

//             /* ===== FIND PENDING EXPENSES ===== */
//             expenseModel.find({
//                 currentApprovalLevel: userRole,
//                 storeId: req.body.storeId,
//                 currentStatus: "Pending",
//                 status: true
//             })
//                 .populate("storeId expenseHeadId raisedBy")
//                 .then(data => {
//                     res.send({
//                         status: 200,
//                         success: true,
//                         message: "Pending Expense List",
//                         data
//                     });
//                 })
//                 .catch(() => {
//                     res.send({
//                         status: 422,
//                         success: false,
//                         message: "Something Went Wrong"
//                     });
//                 });

//         })
//         .catch(() => {
//             res.send({
//                 status: 422,
//                 success: false,
//                 message: "Something Went Wrong"
//             });
//         });
// };


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

/* ===================== CHANGE STATUS ===================== */
// const changeStatus = (req, res) => {
//     const allowedStatus = ['Draft', 'Pending', 'Approved', 'Rejected', 'Hold']

//     if (!req.body._id || !allowedStatus.includes(req.body.status)) {
//         return res.send({
//             status: 422,
//             success: false,
//             message: "Invalid status or _id"
//         })
//     }

//     expenseModel.findOne({ _id: req.body._id })
//         .then(expense => {
//             if (!expense) {
//                 return res.send({ status: 422, success: false, message: "Expense not Found" })
//             }

//             expense.status = req.body.status
//             expense.save()
//                 .then(data => {
//                     res.send({
//                         status: 200,
//                         success: true,
//                         message: "Status Updated Successfully",
//                         data
//                     })
//                 })
//         })
//         .catch(() => {
//             res.send({ status: 422, success: false, message: "Something Went Wrong" })
//         })
// }

const myExpenses = (req, res) => {
    var errMsgs = [];

    if (!req.body.userId) errMsgs.push("userId is required");

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }
    // base filter
    let filter = {
        raisedBy: req.body.userId,
        status: true
    };

    // OPTIONAL status filter (Pending / Approved / Hold / Declined)
    if (req.body.currentStatus) {
        filter.currentStatus = req.body.currentStatus.trim();
    }

    expenseModel.find(filter)
        .populate("storeId expenseHeadId policyId")
        .sort({ createdAt: -1 })
        .then(data => {
            res.send({
                status: 200,
                success: true,
                message: "My Expense List",
                data
            });
        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong"
            });
        });
};


// const approve = (req, res) => {
//     var errMsgs = [];

//     if (!req.body._id) errMsgs.push("_id is required");
//     if (!req.body.userRole) errMsgs.push("userRole is required");

//     if (errMsgs.length > 0) {
//         return res.send({
//             status: 422,
//             success: false,
//             message: errMsgs
//         });
//     }

//     expenseModel.findOne({ _id: req.body._id, status: true })
//         .then(expense => {

//             if (!expense) {
//                 return res.send({
//                     status: 422,
//                     success: false,
//                     message: "Expense not Found"
//                 });
//             }

//             // role check
//             if (expense.currentApprovalLevel !== req.body.userRole) {
//                 return res.send({
//                     status: 422,
//                     success: false,
//                     message: "You are not authorized to approve this expense"
//                 });
//             }

//             approvalPolicyModel.findOne({ _id: expense.policyId })
//                 .then(policy => {

//                     const levels = policy.approvalLevels;
//                     const currentIndex = levels.indexOf(req.body.userRole);

//                     // last approval
//                     if (currentIndex === levels.length - 1) {
//                         expense.currentApprovalLevel = null;
//                         expense.currentStatus = "Approved";
//                     } else {
//                         expense.currentApprovalLevel = levels[currentIndex + 1];
//                         expense.currentStatus = "Pending";
//                     }

//                     expense.save()
//                         .then(data => {
//                             res.send({
//                                 status: 200,
//                                 success: true,
//                                 message: "Expense Approved Successfully",
//                                 data
//                             });
//                         });
//                 });

//         })
//         .catch(() => {
//             res.send({
//                 status: 422,
//                 success: false,
//                 message: "Something Went Wrong"
//             });
//         });
// };

// const hold = (req, res) => {
//     var errMsgs = [];

//     if (!req.body._id) errMsgs.push("_id is required");
//     if (!req.body.userRole) errMsgs.push("userRole is required");
//     if (!req.body.remark) errMsgs.push("remark is required");

//     if (errMsgs.length > 0) {
//         return res.send({
//             status: 422,
//             success: false,
//             message: errMsgs
//         });
//     }

//     expenseModel.findOne({ _id: req.body._id, status: true })
//         .then(expense => {

//             if (!expense) {
//                 return res.send({
//                     status: 422,
//                     success: false,
//                     message: "Expense not Found"
//                 });
//             }

//             if (expense.currentApprovalLevel !== req.body.userRole) {
//                 return res.send({
//                     status: 422,
//                     success: false,
//                     message: "You are not authorized to hold this expense"
//                 });
//             }

//             expense.currentStatus = "Hold";
//             expense.remark = req.body.remark;

//             expense.save()
//                 .then(data => {
//                     res.send({
//                         status: 200,
//                         success: true,
//                         message: "Expense Put On Hold",
//                         data
//                     });
//                 });
//         })
//         .catch(() => {
//             res.send({
//                 status: 422,
//                 success: false,
//                 message: "Something Went Wrong"
//             });
//         });
// };

/* ===================== REJECT EXPENSE ===================== */
// const reject = (req, res) => {
//     var errMsgs = [];

//     if (!req.body._id) errMsgs.push("_id is required");
//     if (!req.body.userRole) errMsgs.push("userRole is required");
//     if (!req.body.remark) errMsgs.push("remark is required");

//     if (errMsgs.length > 0) {
//         return res.send({
//             status: 422,
//             success: false,
//             message: errMsgs
//         });
//     }

//     expenseModel.findOne({ _id: req.body._id, status: true })
//         .then(expense => {

//             if (!expense) {
//                 return res.send({
//                     status: 422,
//                     success: false,
//                     message: "Expense not Found"
//                 });
//             }

//             if (expense.currentApprovalLevel !== req.body.userRole) {
//                 return res.send({
//                     status: 422,
//                     success: false,
//                     message: "You are not authorized to reject this expense"
//                 });
//             }

//             expense.currentStatus = "Rejected";
//             expense.currentApprovalLevel = null;
//             expense.remark = req.body.remark;

//             expense.save()
//                 .then(data => {
//                     res.send({
//                         status: 200,
//                         success: true,
//                         message: "Expense Rejected Successfully",
//                         data
//                     });
//                 });
//         })
//         .catch(() => {
//             res.send({
//                 status: 422,
//                 success: false,
//                 message: "Something Went Wrong"
//             });
//         });
// };

module.exports = { add, getAll, getSingle, myExpenses }
