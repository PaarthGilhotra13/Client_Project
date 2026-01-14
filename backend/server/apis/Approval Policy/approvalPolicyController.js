//paarth

// const add = (req, res) => {
//     var errMsgs = []
//     if (!req.body.minAmount) {
//         errMsgs.push("Min Approval is required")
//     }
//     if (!req.body.maxAmount) {
//         errMsgs.push("Max Approval is required")
//     }
//     if (!req.body.approvalLevels) {
//         errMsgs.push("Approval Levels is required")
//     }
//     if (req.body.minAmount > req.body.maxAmount) {
//         errMsgs.push("minAmount cannot be greater than maxAmount")
//     }
//     if (errMsgs.length > 0) {
//         res.send({
//             status: 422,
//             success: false,
//             message: errMsgs
//         })
//     }
//     else {
//         approvalPolicyModel.findOne({
//             minAmount: { $lte: req.body.maxAmount },
//             maxAmount: { $gte: req.body.minAmount },
//             status: true
//         })
//             .then((approvalPolicyData) => {
//                 if (approvalPolicyData == null) {
//                     let approvalPolicyObj = new approvalPolicyModel()
//                     approvalPolicyObj.minAmount = req.body.minAmount
//                     approvalPolicyObj.maxAmount = req.body.maxAmount
//                     approvalPolicyObj.approvalLevels = req.body.approvalLevels
//                     approvalPolicyObj.save()
//                         .then((approvalPolicyData) => {
//                             res.send({
//                                 status: 200,
//                                 success: true,
//                                 message: "Approval Policy Added Successfully",
//                                 data: approvalPolicyData
//                             })
//                         })
//                         .catch(() => {
//                             res.send({
//                                 status: 422,
//                                 success: false,
//                                 message: "Approval Policy Not Added"
//                             })
//                         })
//                 }
//                 else {
//                     res.send({
//                         status: 422,
//                         success: false,
//                         message: "Approval Policy Already Exists"
//                     })
//                 }
//             })
//             .catch(() => {
//                 res.send({
//                     status: 422,
//                     success: false,
//                     message: "Something Went Wrong"
//                 })
//             })

//     }
// }
const approvalPolicyModel = require("./approvalPolicyModel");

/* ===================== ADD APPROVAL POLICY ===================== */
const add = (req, res) => {
    var errMsgs = [];

    if (req.body.minAmount === undefined) errMsgs.push("minAmount is required");
    if (req.body.maxAmount === undefined) errMsgs.push("maxAmount is required");
    if (!req.body.approvalLevels || req.body.approvalLevels.length === 0) {
        errMsgs.push("approvalLevels are required");
    }

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    const minAmount = Number(req.body.minAmount);
    const maxAmount = Number(req.body.maxAmount);

    if (minAmount > maxAmount) {
        return res.send({
            status: 422,
            success: false,
            message: "minAmount cannot be greater than maxAmount"
        });
    }

    /* ===== CHECK OVERLAPPING POLICY ===== */
    approvalPolicyModel.findOne({
        minAmount: { $lte: maxAmount },
        maxAmount: { $gte: minAmount }
    })
        .then(existing => {
            if (existing) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Approval policy already exists for this amount range"
                });
            }

            let policyObj = new approvalPolicyModel();
            policyObj.minAmount = minAmount;      
            policyObj.maxAmount = maxAmount;        
            policyObj.approvalLevels = req.body.approvalLevels;
            policyObj.status = true;

            policyObj.save()
                .then(data => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Approval Policy Added Successfully",
                        data
                    });
                })
                .catch(() => {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Approval Policy Not Added"
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

    approvalPolicyModel.find({})
        .then(data => {
            res.send({
                status: 200,
                success: true,
                message: "Approval Policy List",
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

const getSingle = (req, res) => {

    if (!req.body._id) {
        return res.send({
            status: 422,
            success: false,
            message: "_id is required"
        });
    }

    approvalPolicyModel.findOne({ _id: req.body._id })
        .then(data => {
            if (!data) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Approval Policy not Found"
                });
            } else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Approval Policy Found",
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

// const update = (req, res) => {
//     var errMsgs = []
//     if (!req.body._id) {
//         errMsgs.push("_id is required")
//     }
//     if (errMsgs.length > 0) {
//         res.send({
//             status: 422,
//             success: false,
//             message: errMsgs
//         })
//     }
//     else {
//         approvalPolicyModel.findOne({
//             _id: { $ne: req.body._id },
//             minAmount: { $lte: req.body.maxAmount },
//             maxAmount: { $gte: req.body.minAmount },
//             status: true
//         })
//             .then((approvalPolicyData1) => {
//                 if (approvalPolicyData1 && approvalPolicyData1._id.toString() !== req.body._id.toString()) {
//                     res.send({
//                         status: 422,
//                         success: false,
//                         message: "Approval Policy Already Exists with same minAmount"
//                     })
//                 }
//                 else {
//                     approvalPolicyModel.findOne({ _id: req.body._id })
//                         .then((approvalPolicyData) => {
//                             if (approvalPolicyData == null) {
//                                 res.send({
//                                     status: 422,
//                                     success: false,
//                                     message: "Approval Policy not Found"
//                                 })
//                             }
//                             else {
//                                 if (req.body.minAmount) {
//                                     approvalPolicyData.minAmount = req.body.minAmount
//                                 }
//                                 if (req.body.maxAmount) {
//                                     approvalPolicyData.maxAmount = req.body.maxAmount
//                                 }
//                                 if (req.body.approvalLevels) {
//                                     approvalPolicyData.approvalLevels = req.body.approvalLevels
//                                 }
//                                 approvalPolicyData.save()
//                                     .then((approvalPolicyData) => {
//                                         res.send({
//                                             status: 200,
//                                             success: true,
//                                             message: "Approval Policy Updated Successfully",
//                                             data: approvalPolicyData
//                                         })
//                                     })
//                                     .catch(() => {
//                                         res.send({
//                                             status: 422,
//                                             success: false,
//                                             message: "Approval Policy not Updated"
//                                         })
//                                     })
//                             }
//                         })
//                         .catch(() => {
//                             res.send({
//                                 status: 422,
//                                 success: false,
//                                 message: "Internal Server Error"
//                             })
//                         })

//                 }
//             })
//             .catch(() => {
//                 res.send({
//                     status: 422,
//                     success: false,
//                     message: "Something Went Wrong"
//                 })
//             })

//     }
// }

const update = (req, res) => {
    var errMsgs = [];

    if (!req.body._id) errMsgs.push("_id is required");
    if (!req.body.minAmount && req.body.minAmount !== 0) errMsgs.push("minAmount is required");
    if (!req.body.maxAmount && req.body.maxAmount !== 0) errMsgs.push("maxAmount is required");
    if (!req.body.approvalLevels || req.body.approvalLevels.length === 0) {
        errMsgs.push("approvalLevels are required");
    }

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    if (req.body.minAmount > req.body.maxAmount) {
        return res.send({
            status: 422,
            success: false,
            message: "minAmount cannot be greater than maxAmount"
        });
    }

    approvalPolicyModel.findOne({ _id: req.body._id })
        .then(policy => {

            if (!policy) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Approval Policy not Found"
                });
            }

            /* ===== CHECK OVERLAPPING (EXCEPT CURRENT) ===== */
            approvalPolicyModel.findOne({
                _id: { $ne: req.body._id },
                status: true,
                minAmount: { $lte: req.body.maxAmount },
                maxAmount: { $gte: req.body.minAmount }
            })
                .then(existing => {

                    if (existing) {
                        return res.send({
                            status: 422,
                            success: false,
                            message: "Approval policy already exists for this amount range"
                        });
                    }

                    policy.minAmount = req.body.minAmount;
                    policy.maxAmount = req.body.maxAmount;
                    policy.approvalLevels = req.body.approvalLevels;

                    policy.save()
                        .then(data => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Approval Policy Updated Successfully",
                                data
                            });
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Approval Policy Not Updated"
                            });
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

const delApprovalPolicy = (req, res) => {
    var errMsgs = []
    if (!req.body._id) {
        errMsgs.push("_id is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        approvalPolicyModel.findOne({ _id: req.body._id })
            .then((approvalPolicyData) => {
                if (approvalPolicyData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Approval Policy not Found"
                    })
                }
                else {
                    approvalPolicyData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Approval Policy Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Approval Policy not Deleted "
                            })
                        })
                }
            })
            .catch(() => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                })
            })
    }
}

const changeStatus = (req, res) => {

    if (!req.body._id ) {
        return res.send({
            status: 422,
            success: false,
            message: "_id are required"
        });
    }

    approvalPolicyModel.findOne({ _id: req.body._id })
        .then(policy => {

            if (!policy) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Approval Policy not Found"
                });
            }

            policy.status = req.body.status;

            policy.save()
                .then(data => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Approval Policy Status Updated Successfully",
                        data
                    });
                })
                .catch(() => {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Status Not Updated"
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


module.exports = { add, getAll, getSingle, update, delApprovalPolicy, changeStatus }