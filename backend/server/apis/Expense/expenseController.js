const expenseModel = require("./expenseModel")

/* ===================== ADD EXPENSE ===================== */
const add = (req, res) => {
    let errMsgs = []

    if (!req.body.ticketId) errMsgs.push("ticketId is required")
    if (!req.body.storeId) errMsgs.push("storeId is required")
    if (!req.body.expenseHeadId) errMsgs.push("expenseHeadId is required")
    if (!req.body.natureOfExpenseId) errMsgs.push("natureOfExpenseId is required")
    if (!req.body.amount) errMsgs.push("amount is required")
    if (!req.body.remark) errMsgs.push("remark is required")
    if (!req.body.rca) errMsgs.push("rca is required")
    if (!req.body.policyId) errMsgs.push("policyId is required")
    if (!req.file) errMsgs.push("attachment is required")

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs })
    }

    // same ticketId active expense check
    expenseModel.findOne({
        ticketId: req.body.ticketId,
        status: { $in: ["Pending", "Hold"] }
    })
    .then(existing => {
        if (existing) {
            return res.send({
                status: 422,
                success: false,
                message: "Active expense already exists for this ticket"
            })
        }

        let expenseObj = new expenseModel()
        expenseObj.ticketId = req.body.ticketId
        expenseObj.storeId = req.body.storeId
        expenseObj.expenseHeadId = req.body.expenseHeadId
        expenseObj.natureOfExpense = req.body.natureOfExpenseId
        expenseObj.amount = req.body.amount
        expenseObj.remark = req.body.remark
        expenseObj.rca = req.body.rca
        expenseObj.policyId = req.body.policyId
        expenseObj.attachment = req.file.path

        // IMPORTANT
        expenseObj.currentStatus = "Pending"
        expenseObj.currentApprovalLevel = null

        expenseObj.save()
        .then(data => {
            res.send({
                status: 200,
                success: true,
                message: "Expense Added Successfully",
                data
            })
        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Expense Not Added"
            })
        })
    })
    .catch(() => {
        res.send({ status: 422, success: false, message: "Something Went Wrong" })
    })
}

/* ===================== GET ALL ===================== */
const getAll = (req, res) => {
    expenseModel.find({})
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

/* ===================== GET SINGLE ===================== */
const getSingle = (req, res) => {
    if (!req.body._id) {
        return res.send({ status: 422, success: false, message: "_id is required" })
    }

    expenseModel.findOne({ _id: req.body._id })
        .then(data => {
            if (!data) {
                res.send({ status: 422, success: false, message: "Expense not Found" })
            } else {
                res.send({ status: 200, success: true, message: "Expense Found", data })
            }
        })
        .catch(() => {
            res.send({ status: 422, success: false, message: "Something Went Wrong" })
        })
}

/* ===================== UPDATE ===================== */
const update = (req, res) => {
    if (!req.body._id) {
        return res.send({ status: 422, success: false, message: "_id is required" })
    }

    expenseModel.findOne({ _id: req.body._id })
        .then(expense => {
            if (!expense) {
                return res.send({ status: 422, success: false, message: "Expense not Found" })
            }

            // 🔒 LOCK AFTER SUBMIT
            if (expense.status !== "Draft") {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Expense cannot be edited after submission"
                })
            }

            if (req.body.ticketId) expense.ticketId = req.body.ticketId
            if (req.body.storeId) expense.storeId = req.body.storeId
            if (req.body.expenseHeadId) expense.expenseHeadId = req.body.expenseHeadId
            if (req.body.natureOfExpenseId) expense.natureOfExpenseId = req.body.natureOfExpenseId
            if (req.body.amount) expense.amount = req.body.amount
            if (req.body.remark) expense.remark = req.body.remark
            if (req.body.rca) expense.rca = req.body.rca
            if (req.body.policyId) expense.policyId = req.body.policyId
            if (req.file) expense.attachment = req.file.path

            expense.save()
                .then(data => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Expense Updated Successfully",
                        data
                    })
                })
                .catch(() => {
                    res.send({ status: 422, success: false, message: "Expense not Updated" })
                })
        })
        .catch(() => {
            res.send({ status: 422, success: false, message: "Something Went Wrong" })
        })
}

/* ===================== DELETE (SOFT) ===================== */
const delExpense = (req, res) => {
    if (!req.body._id) {
        return res.send({ status: 422, success: false, message: "_id is required" })
    }

    expenseModel.findOne({ _id: req.body._id })
        .then(expense => {
            if (!expense) {
                return res.send({ status: 422, success: false, message: "Expense not Found" })
            }

            expense.status = "Rejected"
            expense.save()
                .then(() => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Expense Rejected Successfully"
                    })
                })
        })
        .catch(() => {
            res.send({ status: 422, success: false, message: "Something Went Wrong" })
        })
}

/* ===================== CHANGE STATUS ===================== */
const changeStatus = (req, res) => {
    const allowedStatus = ['Draft', 'Pending', 'Approved', 'Rejected', 'Hold']

    if (!req.body._id || !allowedStatus.includes(req.body.status)) {
        return res.send({
            status: 422,
            success: false,
            message: "Invalid status or _id"
        })
    }

    expenseModel.findOne({ _id: req.body._id })
        .then(expense => {
            if (!expense) {
                return res.send({ status: 422, success: false, message: "Expense not Found" })
            }

            expense.status = req.body.status
            expense.save()
                .then(data => {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Status Updated Successfully",
                        data
                    })
                })
        })
        .catch(() => {
            res.send({ status: 422, success: false, message: "Something Went Wrong" })
        })
}

module.exports = { add, getAll, getSingle, update, delExpense, changeStatus }
