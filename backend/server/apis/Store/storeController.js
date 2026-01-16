const storeModel = require("./storeModel")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.storeName) {
        errMsgs.push("storeName is required")
    }
    if (!req.body.storeCode) {
        errMsgs.push("storeCode is required")
    }
    if (!req.body.storeCategoryId) {
        errMsgs.push("storeCategoryId is required")
    }
    if (!req.body.cityId) {
        errMsgs.push("cityId is required")
    }
    if (!req.body.stateId) {
        errMsgs.push("stateId is required")
    }
    if (!req.body.zoneId) {
        errMsgs.push("zoneId is required")
    }
    if (!req.body.address) {
        errMsgs.push("address is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        storeModel.findOne({ storeName: req.body.storeName })
            .then((storeData) => {
                if (storeData == null) {
                    let storeObj = new storeModel()
                    storeObj.storeName = req.body.storeName
                    storeObj.storeCode = req.body.storeCode
                    storeObj.storeCategoryId = req.body.storeCategoryId
                    storeObj.cityId = req.body.cityId
                    storeObj.stateId = req.body.stateId
                    storeObj.zoneId = req.body.zoneId
                    storeObj.address = req.body.address
                    storeObj.save()
                        .then((storeData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Store Added Successfully",
                                data: storeData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Store Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store Already Exists"
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
    storeModel.find(req.body)
        .populate("storeCategoryId")
        .populate("cityId")
        .populate("stateId")
        .populate("zoneId")
        .then((storeData) => {
            if (storeData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Store is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Store Found",
                    data: storeData
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
        storeModel.findOne({ _id: req.body._id })
            .populate("storeCategoryId")
            .populate("cityId")
            .populate("stateId")
            .populate("zoneId")
            .then((storeData) => {
                if (storeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Store Found",
                        data: storeData
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
        storeModel.findOne({ storeName: req.body.storeName })
            .then((storeData1) => {
                if (storeData1 && storeData1._id.toString() !== req.body._id.toString()) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store Already Exists with same Name"
                    })
                }
                else {
                    storeModel.findOne({ _id: req.body._id })
                        .then((storeData) => {
                            if (storeData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Store not Found"
                                })
                            }
                            else {
                                if (req.body.storeName) {
                                    storeData.storeName = req.body.storeName
                                }
                                if (req.body.storeCode) {
                                    storeData.storeCode = req.body.storeCode
                                }
                                if (req.body.storeCategoryId) {
                                    storeData.storeCategoryId = req.body.storeCategoryId
                                }
                                if (req.body.cityId) {
                                    storeData.cityId = req.body.cityId
                                }
                                if (req.body.stateId) {
                                    storeData.stateId = req.body.stateId
                                }
                                if (req.body.zoneId) {
                                    storeData.zoneId = req.body.zoneId
                                }
                                if (req.body.address) {
                                    storeData.address = req.body.address
                                }
                                storeData.save()
                                    .then((storeData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Store Updated Successfully",
                                            data: storeData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Store not Updated"
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

const delStore = (req, res) => {
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
        storeModel.findOne({ _id: req.body._id })
            .then((storeData) => {
                if (storeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store not Found"
                    })
                }
                else {
                    storeData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Store Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Store not Deleted "
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
        storeModel.findOne({ _id: req.body._id })
            .then((storeData) => {
                if (storeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Store not Found"
                    })
                }
                else {
                    storeData.status = req.body.status
                    storeData.save()
                        .then((storeData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Successfully",
                                data: storeData
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


module.exports = { add, getAll, getSingle, update, delStore, changeStatus }