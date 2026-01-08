const expenseHeadModel = require("./expenseHeadModel")


const add = (req, res) => {
    var errMsgs = []
    if (!req.body.name) {
        errMsgs.push("Name is required")
    }
    if (!req.body.description) {
        errMsgs.push("Description is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        expenseHeadModel.findOne({ name: req.body.name })
            .then((expenseHeadData) => {
                if (expenseHeadData == null) {
                    let expenseHeadObj = new expenseHeadModel()
                    expenseHeadObj.name = req.body.name
                    expenseHeadObj.description = req.body.description
                    expenseHeadObj.save()
                        .then((expenseHeadData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Expense Head Added Successfully",
                                data: expenseHeadData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Expense Head Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense Head Already Exists"
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
    expenseHeadModel.find(req.body)
        .then((expenseHeadData) => {
            if (expenseHeadData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Expense Headis Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Expense HeadFound",
                    data: expenseHeadData
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
        expenseHeadModel.findOne({ _id: req.body._id })
            .populate("description")
            .then((expenseHeadData) => {
                if (expenseHeadData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense Headnot Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Expense HeadFound",
                        data: expenseHeadData
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
        expenseHeadModel.findOne({ name: req.body.name })
            .then((expenseHeadData) => {
                if (expenseHeadData && expenseHeadData._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Expense HeadAlready Exists with same name"
                    })
                }
                else {
                    expenseHeadModel.findOne({ _id: req.body._id })
                        .then((expenseHeadData) => {
                            if (expenseHeadData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Expense Headnot Found"
                                })
                            }
                            else {
                                if (req.body.name) {
                                    expenseHeadData.name = req.body.name
                                }
                                if (req.body.description) {
                                    expenseHeadData.description = req.body.description
                                }
                                expenseHeadData.save()
                                    .then((expenseHeadData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Expense HeadUpdated Successfully",
                                            data: expenseHeadData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Expense Headnot Updated"
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

const delExpenseHead = (req, res) => {
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
        expenseHeadModel.findOne({ _id: req.body._id })
            .then((expenseHeadData) => {
                if (expenseHeadData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    expenseHeadData.deleteOne()
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
        expenseHeadModel.findOne({ _id: req.body._id })
            .then((expenseHeadData) => {
                if (expenseHeadData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    expenseHeadData.status = req.body.status
                    expenseHeadData.save()
                        .then((expenseHeadData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: expenseHeadData
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

module.exports = { add, getAll, getSingle, update, delExpenseHead, changeStatus }