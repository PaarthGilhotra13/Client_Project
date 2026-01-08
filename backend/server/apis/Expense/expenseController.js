const expenseModel = require("./expenseModel")


const add = (req, res) => {
    var errMsgs = []
    if (!req.body.ticketId) {
        errMsgs.push("ticketId is required")
    }
    if (!req.body.storeId) {
        errMsgs.push("storeId is required")
    }
    if (!req.body.expenseHeadId) {
        errMsgs.push("expenseHeadId is required")
    }
    if (!req.body.natureOfExpenseId) {
        errMsgs.push("natureOfExpenseId is required")
    }
    if (!req.body.amount) {
        errMsgs.push("amount is required")
    }
    if (!req.body.remark) {
        errMsgs.push("remark is required")
    }
    if (!req.body.rca) {
        errMsgs.push("rca is required")
    }
    if (!req.body.policyId) {
        errMsgs.push("policyId is required")
    }
    if (!req.body.currentApprovalLevel) {
        errMsgs.push("currentApprovalLevel is required")
    }
    if (!req.file) {
        errMsgs.push("attachment is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        expenseModel.findOne({ ticketId: req.body.ticketId })
            .then((expenseData) => {
                if (expenseData == null) {
                    let expenseObj = new expenseModel()
                    expenseObj.ticketId = req.body.ticketId
                    expenseObj.storeId = req.body.storeId
                    expenseObj.expenseHeadId = req.body.expenseHeadId
                    expenseObj.natureOfExpenseId = req.body.natureOfExpenseId
                    expenseObj.amount = req.body.amount
                    expenseObj.remark = req.body.remark
                    expenseObj.rca = req.body.rca
                    expenseObj.policyId = req.body.policyId
                    expenseObj.currentApprovalLevel = req.body.currentApprovalLevel
                    expenseObj.attachment = req.body.attachment
                    expenseObj.save()
                        .then((expenseData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Expense Added Successfully",
                                data: expenseData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Expense Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense Already Exists"
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
    expenseModel.find(req.body)
        .then((expenseData) => {
            if (expenseData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Expense is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Expense Found",
                    data: expenseData
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
        expenseModel.findOne({ _id: req.body._id })
            // .populate("description")
            .then((expenseData) => {
                if (expenseData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Expense Found",
                        data: expenseData
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
        expenseModel.findOne({ ticketId: req.body.ticketId })
            .then((expenseData) => {
                if (expenseData && expenseData._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense Already Exists with same name"
                    })
                }
                else {
                    expenseModel.findOne({ _id: req.body._id })
                        .then((expenseData) => {
                            if (expenseData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Expense not Found"
                                })
                            }
                    //         expenseObj.ticketId = req.body.ticketId
                    // expenseObj.storeId = req.body.storeId
                    // expenseObj.expenseHeadId = req.body.expenseHeadId
                    // expenseObj.natureOfExpenseId = req.body.natureOfExpenseId
                    // expenseObj.amount = req.body.amount
                    // expenseObj.remark = req.body.remark
                    // expenseObj.rca = req.body.rca
                    // expenseObj.policyId = req.body.policyId
                    // expenseObj.currentApprovalLevel = req.body.currentApprovalLevel
                    // expenseObj.attachment = req.body.attachment
                            else {
                                if (req.body.ticketId) {
                                    expenseData.ticketId = req.body.ticketId
                                }
                                if (req.body.storeId) {
                                    expenseData.storeId = req.body.storeId
                                }
                                if (req.body.expenseHeadId) {
                                    expenseData.expenseHeadId = req.body.expenseHeadId
                                }
                                if (req.body.natureOfExpenseId) {
                                    expenseData.natureOfExpenseId = req.body.natureOfExpenseId
                                }
                                if (req.body.amount) {
                                    expenseData.amount = req.body.amount
                                }
                                if (req.body.remark) {
                                    expenseData.remark = req.body.remark
                                }
                                if (req.body.rca) {
                                    expenseData.rca = req.body.rca
                                }
                                if (req.body.policyId) {
                                    expenseData.policyId = req.body.policyId
                                }
                                if (req.body.currentApprovalLevel) {
                                    expenseData.currentApprovalLevel = req.body.currentApprovalLevel
                                }
                                if (req.body.attachment) {
                                    expenseData.attachment = req.body.attachment
                                }
                                expenseData.save()
                                    .then((expenseData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Expense Updated Successfully",
                                            data: expenseData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Expense not Updated"
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
                    message: "Somehting Went Wrong"
                })
            })



    }
}

const delExpense = (req, res) => {
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
        expenseModel.findOne({ _id: req.body._id })
            .then((expenseData) => {
                if (expenseData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    expenseData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Data Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Data not Deleted Successfully"
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
        expenseModel.findOne({ _id: req.body._id })
            .then((expenseData) => {
                if (expenseData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    expenseData.status = req.body.status
                    expenseData.save()
                        .then((expenseData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: expenseData
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

module.exports = { add, getAll, getSingle, update, delExpense, changeStatus }