const locationModel = require("./locationModel")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.zoneName) {
        errMsgs.push("zoneName is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        locationModel.findOne({ cityName: req.body.cityName })
            .then((locationData) => {
                if (locationData == null) {
                    let locationObj = new locationModel()
                    locationObj.zoneName = req.body.zoneName
                    locationObj.cityName = req.body.cityName
                    locationObj.stateName = req.body.stateName
                    locationObj.save()
                        .then((locationData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Location Added Successfully",
                                data: locationData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Location Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Location Already Exists"
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
    locationModel.find(req.body)
        .then((locationData) => {
            if (locationData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "Location is Empty",
                    data: locationData
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "Location Found",
                    data: locationData
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
        locationModel.findOne({ _id: req.body._id })
            .then((locationData) => {
                if (locationData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Location not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Location Found",
                        data: locationData
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
        locationModel.findOne({ cityName: req.body.cityName })
            .then((locationData1) => {
                if (locationData1 && locationData1._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Location Already Exists with same Name"
                    })
                }
                else {
                    locationModel.findOne({ _id: req.body._id })
                        .then((locationData) => {
                            if (locationData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "Location not Found"
                                })
                            }
                            else {
                                if (req.body.zoneName) {
                                    locationData.zoneName = req.body.zoneName
                                }
                                if (req.body.cityName) {
                                    locationData.cityName = req.body.cityName
                                }
                                if (req.body.stateName) {
                                    locationData.stateName = req.body.stateName
                                }
                                locationData.save()
                                    .then((locationData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Location Updated Successfully",
                                            data: locationData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "Location not Updated"
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

const delLocation = (req, res) => {
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
        locationModel.findOne({ _id: req.body._id })
            .then((locationData) => {
                if (locationData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Location not Found"
                    })
                }
                else {
                    locationData.deleteOne()
                        .then(() => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Location Deleted Successfully"
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Location not Deleted "
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
        locationModel.findOne({ _id: req.body._id })
            .then((locationData) => {
                if (locationData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Location not Found"
                    })
                }
                else {
                    locationData.status = req.body.status
                    locationData.save()
                        .then((locationData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: locationData
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


module.exports = { add, getAll, getSingle, update, delLocation, changeStatus }