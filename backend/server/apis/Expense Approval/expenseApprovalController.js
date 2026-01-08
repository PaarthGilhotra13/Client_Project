const expenseApprovalModel = require("./expenseApprovalModel")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.expenseId) {
        errMsgs.push("expenseId is required")
    }
    if (!req.body.level) {
        errMsgs.push("level is required")
    }
    if (!req.body.approverId) {
        errMsgs.push("approverId is required")
    }
    if (!req.body.comment) {
        errMsgs.push("comment is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        expenseApprovalModel.findOne({ expenseId: req.body.expenseId })
            .then((expenseApprovalData) => {
                if (expenseApprovalData == null) {
                    let storeObj = new expenseApprovalModel()
                    storeObj.expenseId = req.body.expenseId
                    storeObj.level = req.body.level
                    storeObj.approverId = req.body.approverId
                    storeObj.comment = req.body.comment
                    storeObj.save()
                        .then((expenseApprovalData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Expense Approval Added Successfully",
                                data: expenseApprovalData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Expense Approval Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense Approval Already Exists"
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
    expenseApprovalModel.find(req.body)
        .then((expenseApprovalData) => {
            if (expenseApprovalData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Expense Approval is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Expense Approval Found",
                    data: expenseApprovalData
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
        expenseApprovalModel.findOne({ _id: req.body._id })
            .then((expenseApprovalData) => {
                if (expenseApprovalData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense Approval not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Expense Approval Found",
                        data: expenseApprovalData
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
        expenseApprovalModel.findOne({ expenseId: req.body.expenseId })
            .then((expenseApprovalData1) => {
                if (expenseApprovalData1 && expenseApprovalData1._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense Approval Already Exists with same Name"
                    })
                }
                else {
                    expenseApprovalModel.findOne({ _id: req.body._id })
                        .then((expenseApprovalData) => {
                            if (expenseApprovalData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Expense Approval not Found"
                                })
                            }
                            else {
                                if (req.body.expenseId) {
                                    expenseApprovalData.expenseId = req.body.expenseId
                                }
                                if (req.body.level) {
                                    expenseApprovalData.level = req.body.level
                                }
                                if (req.body.approverId) {
                                    expenseApprovalData.approverId = req.body.approverId
                                }
                                if (req.body.comment) {
                                    expenseApprovalData.comment = req.body.comment
                                }
                                expenseApprovalData.save()
                                    .then((expenseApprovalData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Expense Approval Updated Successfully",
                                            data: expenseApprovalData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Expense Approval not Updated"
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

const delExpenseApproval = (req, res) => {
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
        expenseApprovalModel.findOne({ _id: req.body._id })
            .then((expenseApprovalData) => {
                if (expenseApprovalData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense Approval not Found"
                    })
                }
                else {
                    expenseApprovalData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Expense Approval Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Expense Approval not Deleted "
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
        expenseApprovalModel.findOne({ _id: req.body._id })
            .then((expenseApprovalData) => {
                if (expenseApprovalData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense Approval not Found"
                    })
                }
                else {
                    expenseApprovalData.status = req.body.status
                    expenseApprovalData.save()
                        .then((expenseApprovalData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Successfully",
                                data: expenseApprovalData
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


module.exports = { add, getAll, getSingle, update, delExpenseApproval, changeStatus }