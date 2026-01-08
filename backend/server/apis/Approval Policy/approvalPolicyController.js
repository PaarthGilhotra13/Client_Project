const approvalPolicyModel = require("./approvalPolicyModel")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.minApproval) {
        errMsgs.push("Min Approval is required")
    }
    if (!req.body.maxApproval) {
        errMsgs.push("Max Approval is required")
    }
    if (!req.body.approvalLevels) {
        errMsgs.push("Approval Levels is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        approvalPolicyModel.findOne({ minApproval: req.body.minApproval }) //Doubt
            .then((approvalPolicyData) => {
                if (approvalPolicyData == null) {
                    let storeCategoryObj = new approvalPolicyModel()
                    storeCategoryObj.minApproval = req.body.minApproval
                    storeCategoryObj.maxApproval = req.body.maxApproval
                    storeCategoryObj.ApprovalLevels = req.body.ApprovalLevels
                    storeCategoryObj.save()
                        .then((approvalPolicyData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Approval Policy Added Successfully",
                                data: approvalPolicyData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Approval Policy Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Approval Policy Already Exists"
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

const getAll = (req, res) => {
    approvalPolicyModel.find(req.body)
        .then((approvalPolicyData) => {
            if (approvalPolicyData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Approval Policy is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Approval Policy Found",
                    data: approvalPolicyData
                })

            }
        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Something Went Wrong",
            })
        })
}

const getSingle = (req, res) => {
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
                    res.send({
                        status: 200,
                        success: true,
                        message: "Approval Policy Found",
                        data: approvalPolicyData
                    })
                }
            })
            .catch(() => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Somehting Went Wrong"
                })
            })
    }
}

const update = (req, res) => {
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
        approvalPolicyModel.findOne({ minApproval: req.body.minApproval })
            .then((approvalPolicyData1) => {
                if (approvalPolicyData1 && approvalPolicyData1._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Approval Policy Already Exists with same minApproval"
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
                                if (req.body.minApproval) {
                                    approvalPolicyData.minApproval = req.body.minApproval
                                }
                                if (req.body.maxApproval) {
                                    approvalPolicyData.maxApproval = req.body.maxApproval
                                }
                                if (req.body.approvalLevels) {
                                    approvalPolicyData.approvalLevels = req.body.approvalLevels
                                }
                                approvalPolicyData.save()
                                    .then((approvalPolicyData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Approval Policy Updated Successfully",
                                            data: approvalPolicyData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Approval Policy not Updated"
                                        })
                                    })
                            }
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Internal Server Error"
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
    var errMsgs = []
    if (!req.body._id) {
        errMsgs.push("_id is required")
    }
    if (!req.body.status) {
        errMsgs.push("status is required")

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
                    approvalPolicyData.status = req.body.status
                    approvalPolicyData.save()
                        .then((approvalPolicyData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: approvalPolicyData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Status Not Updated "
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


module.exports = { add, getAll, getSingle, update, delApprovalPolicy, changeStatus }