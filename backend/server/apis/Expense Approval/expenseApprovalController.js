const expenseApprovalModel = require("./expenseApprovalModel")
const expenseModel = require("../Expense/expenseModel")
const approvalPolicyModel = require("../approvalPolicy/approvalPolicyModel")

/* ===================== ADD APPROVAL ===================== */
const add = (req, res) => {
    let errMsgs = []

    if (!req.body.expenseId) errMsgs.push("expenseId is required")
    if (!req.body.level) errMsgs.push("level is required")
    if (!req.body.approverId) errMsgs.push("approverId is required")
    if (!req.body.status) errMsgs.push("status is required")

    if (errMsgs.length > 0) {
        return res.send({ status: 422, success: false, message: errMsgs })
    }

    // 1️⃣ Fetch expense
    expenseModel.findOne({ _id: req.body.expenseId })
        .then(expense => {
            if (!expense) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "Expense not found"
                })
            }

            // 2️⃣ Check correct approval level
            if (expense.currentApprovalLevel !== req.body.level) {
                return res.send({
                    status: 422,
                    success: false,
                    message: "You are not authorized to approve at this level"
                })
            }

            // 3️⃣ Prevent duplicate approval at same level
            expenseApprovalModel.findOne({
                expenseId: req.body.expenseId,
                level: req.body.level
            })
            .then(existing => {
                if (existing) {
                    return res.send({
                        status: 422,
                        success: false,
                        message: "Approval already given for this level"
                    })
                }

                // 4️⃣ Save approval
                let approvalObj = new expenseApprovalModel()
                approvalObj.expenseId = req.body.expenseId
                approvalObj.level = req.body.level
                approvalObj.approverId = req.body.approverId
                approvalObj.comment = req.body.comment || ""
                approvalObj.status = req.body.status

                approvalObj.save()
                    .then(() => {

                        // 5️⃣ Handle expense state
                        if (req.body.status === "Rejected") {
                            expense.status = "Rejected"
                            expense.currentApprovalLevel = null
                        }
                        else if (req.body.status === "Hold") {
                            expense.status = "Hold"
                        }
                        else {
                            // Approved → move to next level
                            approvalPolicyModel.findOne({ _id: expense.policyId })
                                .then(policy => {
                                    let levels = policy.approvalLevels
                                    let currentIndex = levels.indexOf(req.body.level)

                                    if (currentIndex === levels.length - 1) {
                                        expense.status = "Approved"
                                        expense.currentApprovalLevel = null
                                    } else {
                                        expense.currentApprovalLevel = levels[currentIndex + 1]
                                        expense.status = "Pending"
                                    }

                                    expense.save()
                                })
                        }

                        res.send({
                            status: 200,
                            success: true,
                            message: "Expense approval processed successfully"
                        })
                    })
            })
        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Something went wrong"
            })
        })
}

/* ===================== GET ALL ===================== */
const getAll = (req, res) => {
    expenseApprovalModel.find({})
        .then(data => {
            res.send({
                status: 200,
                success: true,
                message: "Expense Approval List",
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

    expenseApprovalModel.findOne({ _id: req.body._id })
        .then(data => {
            if (!data) {
                res.send({ status: 422, success: false, message: "Expense Approval not Found" })
            } else {
                res.send({ status: 200, success: true, message: "Expense Approval Found", data })
            }
        })
        .catch(() => {
            res.send({ status: 422, success: false, message: "Something Went Wrong" })
        })
}

module.exports = { add, getAll, getSingle }
