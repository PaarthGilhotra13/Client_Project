const storeCategoryModel = require("./storeCategoryModel")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.name) {
        errMsgs.push("name is required")
    }
    if (!req.body.description) {
        errMsgs.push("description is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        storeCategoryModel.findOne({ name: req.body.name })
            .then((storeCategoryData) => {
                if (storeCategoryData == null) {
                    let storeCategoryObj = new storeCategoryModel()
                    storeCategoryObj.name = req.body.name
                    storeCategoryObj.description = req.body.description
                    storeCategoryObj.save()
                        .then((storeCategoryData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Store Category Added Successfully",
                                data: storeCategoryData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Store Category Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store Category Already Exists"
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
    storeCategoryModel.find(req.body)
        .then((storeCategoryData) => {
            if (storeCategoryData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Store Category is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Store Category Found",
                    data: storeCategoryData
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
        storeCategoryModel.findOne({ _id: req.body._id })
            .then((storeCategoryData) => {
                if (storeCategoryData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store Category not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Store Category Found",
                        data: storeCategoryData
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
        storeCategoryModel.findOne({ name: req.body.name })
            .then((storeCategoryData1) => {
                if (storeCategoryData1 && storeCategoryData1._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store Category Already Exists with same Name"
                    })
                }
                else {
                    storeCategoryModel.findOne({ _id: req.body._id })
                        .then((storeCategoryData) => {
                            if (storeCategoryData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Store Category not Found"
                                })
                            }
                            else {
                                if (req.body.name) {
                                    storeCategoryData.name = req.body.name
                                }
                                if (req.body.description) {
                                    storeCategoryData.description = req.body.description
                                }
                                storeCategoryData.save()
                                    .then((storeCategoryData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Store Category Updated Successfully",
                                            data: storeCategoryData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Store Category not Updated"
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

const delStoreCategory = (req, res) => {
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
        storeCategoryModel.findOne({ _id: req.body._id })
            .then((storeCategoryData) => {
                if (storeCategoryData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store Category not Found"
                    })
                }
                else {
                    storeCategoryData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Store Category Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Store Category not Deleted "
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
        storeCategoryModel.findOne({ _id: req.body._id })
            .then((storeCategoryData) => {
                if (storeCategoryData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store Category not Found"
                    })
                }
                else {
                    storeCategoryData.status = req.body.status
                    storeCategoryData.save()
                        .then((storeCategoryData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: storeCategoryData
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


module.exports = { add, getAll, getSingle, update, delStoreCategory, changeStatus }