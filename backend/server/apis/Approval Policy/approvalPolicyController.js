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