const cityModel = require("./cityModel")

const add = (req, res) => {
    var errMsgs = []
    if (!req.body.cityName) {
        errMsgs.push("cityName is required")
    }
    if (!req.body.zoneId) {
        errMsgs.push("zoneId is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        })
    }
    else {
        cityModel.findOne({ cityName: req.body.cityName })
            .then((cityData) => {
                if (cityData == null) {
                    let cityObj = new cityModel()
                    cityObj.name = req.body.cityName
                    cityObj.zoneId = req.body.zoneId
                    cityObj.save()
                        .then((cityData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "City Added Successfully",
                                data: cityData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "City Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "City Already Exists"
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
    cityModel.find(req.body)
        .populate("zoneId")
        .then((cityData) => {
            if (cityData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "City is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "City Found",
                    data: cityData
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
        cityModel.findOne({ _id: req.body._id })
            .populate("zoneId")
            .then((cityData) => {
                if (cityData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "City not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "City Found",
                        data: cityData
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
        cityModel.findOne({ cityName: req.body.cityName })
            .then((cityData) => {
                if (cityData && cityData._id.toString()  !== req.body._id.toString() ) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "City Already Exists with same name"
                    })
                }
                else {
                    cityModel.findOne({ _id: req.body._id })
                        .then((cityData) => {
                            if (cityData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "City not Found"
                                })
                            }
                            else {
                                if (req.body.cityName) {
                                    cityData.cityName = req.body.cityName
                                }
                                if (req.body.zoneId) {
                                    cityData.zoneId = req.body.zoneId
                                }
                                cityData.save()
                                    .then((cityData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "City Updated Successfully",
                                            data: cityData
                                        })
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "City not Updated"
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

const delCity = (req, res) => {
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
        cityModel.findOne({ _id: req.body._id })
            .then((cityData) => {
                if (cityData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    cityData.deleteOne()
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
        cityModel.findOne({ _id: req.body._id })
            .then((cityData) => {
                if (cityData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    cityData.status = req.body.status
                    cityData.save()
                        .then((cityData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: cityData
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

module.exports = { add, getAll, getSingle, update, delCity, changeStatus }