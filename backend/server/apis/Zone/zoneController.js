const zoneModel = require("./zoneModel")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.zoneName) {
        errMsgs.push("name is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        zoneModel.findOne({ zoneName: req.body.zoneName })
            .then((zoneData) => {
                if (zoneData == null) {
                    let zoneObj = new zoneModel()
                    zoneObj.name = req.body.zoneName
                    zoneObj.save()
                        .then((zoneData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Zone Added Successfully",
                                data: zoneData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Zone Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Zone Already Exists"
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
    zoneModel.find(req.body)
        .then((zoneData) => {
            if (zoneData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Zone is Empty",
                    data: zoneData
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Zone Found",
                    data: zoneData
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
        zoneModel.findOne({ _id: req.body._id })
            .then((zoneData) => {
                if (zoneData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Zone not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Zone Found",
                        data: zoneData
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
        zoneModel.findOne({ zoneName: req.body.zoneName })
            .then((zoneData1) => {
                if (zoneData1 && zoneData1._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Zone Already Exists with same Name"
                    })
                }
                else {
                    zoneModel.findOne({ _id: req.body._id })
                        .then((zoneData) => {
                            if (zoneData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Zone not Found"
                                })
                            }
                            else {
                                if (req.body.zoneName) {
                                    zoneData.zoneName = req.body.zoneName
                                }
                                zoneData.save()
                                    .then((zoneData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Zone Updated Successfully",
                                            data: zoneData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Zone not Updated"
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

const delZone = (req, res) => {
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
        zoneModel.findOne({ _id: req.body._id })
            .then((zoneData) => {
                if (zoneData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Zone not Found"
                    })
                }
                else {
                    zoneData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Zone Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Zone not Deleted "
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
        zoneModel.findOne({ _id: req.body._id })
            .then((zoneData) => {
                if (zoneData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Zone not Found"
                    })
                }
                else {
                    zoneData.status = req.body.status
                    zoneData.save()
                        .then((zoneData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: zoneData
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


module.exports = { add, getAll, getSingle, update, delZone, changeStatus }