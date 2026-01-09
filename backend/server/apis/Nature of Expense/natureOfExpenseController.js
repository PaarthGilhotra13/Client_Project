const NatureOfExpenseModel= require("./natuteOfExpenseModel")



const add = (req, res) => {
    var errMsgs = []
    if (!req.body.name) {
        errMsgs.push("name is required")
    }
    if (!req.body.ExpenseHeadId) {
        errMsgs.push("ExpenseHeadId is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        NatureOfExpenseModel.findOne({ name: req.body.name })
            .then((natureOfExpenseData) => {
                if (natureOfExpenseData == null) {
                    let NatureOfExpenseObj = new NatureOfExpenseModel()
                    NatureOfExpenseObj.name = req.body.name
                    NatureOfExpenseObj.ExpenseHeadId = req.body.ExpenseHeadId
                    NatureOfExpenseObj.save()
                        .then((natureOfExpenseData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Nature of Expense Added Successfully",
                                data: natureOfExpenseData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Nature of Expense Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Nature of Expense Already Exists"
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
    NatureOfExpenseModel.find(req.body)
        .populate("ExpenseHeadId")
        .then((natureOfExpenseData) => {
            if (natureOfExpenseData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Nature of Expense is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Nature of Expense Found",
                    data: natureOfExpenseData
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
        NatureOfExpenseModel.findOne({ _id: req.body._id })
            .populate("ExpenseHeadId")
            .then((natureOfExpenseData) => {
                if (natureOfExpenseData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Nature of Expense not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Nature of Expense Found",
                        data: natureOfExpenseData
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
        NatureOfExpenseModel.findOne({ name: req.body.name })
            .then((natureOfExpenseData) => {
                if (natureOfExpenseData && natureOfExpenseData._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Nature of Expense Already Exists with same name"
                    })
                }
                else {
                    NatureOfExpenseModel.findOne({ _id: req.body._id })
                        .then((natureOfExpenseData) => {
                            if (natureOfExpenseData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Nature of Expense not Found"
                                })
                            }
                            else {
                                if (req.body.name) {
                                    natureOfExpenseData.name = req.body.name
                                }
                                if (req.body.ExpenseHeadId) {
                                    natureOfExpenseData.ExpenseHeadId = req.body.ExpenseHeadId
                                }
                                natureOfExpenseData.save()
                                    .then((natureOfExpenseData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Nature of Expense Updated Successfully",
                                            data: natureOfExpenseData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Nature of Expense not Updated"
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

const delNoE= (req, res) => {
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
        NatureOfExpenseModel.findOne({ _id: req.body._id })
            .then((natureOfExpenseData) => {
                if (natureOfExpenseData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    natureOfExpenseData.deleteOne()
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
        NatureOfExpenseModel.findOne({ _id: req.body._id })
            .then((natureOfExpenseData) => {
                if (natureOfExpenseData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    natureOfExpenseData.status = req.body.status
                    natureOfExpenseData.save()
                        .then((natureOfExpenseData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: natureOfExpenseData
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

module.exports = { add, getAll, getSingle, update, delNoE, changeStatus }