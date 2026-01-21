const cityModel = require("./cityModel")

const add = (req, res) => {
    var errMsgs = [];

    if (!req.body.cityName || !Array.isArray(req.body.cityName)) {
        errMsgs.push("cityName array is required");
    }

    if (!req.body.stateId) {
        errMsgs.push("stateId is required");
    }

    if (!req.body.zoneId) {
        errMsgs.push("zoneId is required");
    }

    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }
    else {

        // 🔁 SAME LOGIC AS ADD STATE
        cityModel.findOne({
            stateId: req.body.stateId,
            zoneId: req.body.zoneId
        })
            .then((cityData) => {

                if (cityData == null) {

                    let cityObj = new cityModel();
                    cityObj.cityName = req.body.cityName;   // array
                    cityObj.stateId = req.body.stateId;
                    cityObj.zoneId = req.body.zoneId;

                    cityObj.save()
                        .then((savedCity) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "City Added Successfully",
                                data: savedCity
                            });
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "City Not Added"
                            });
                        });

                } else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "City Already Exists for this State"
                    });
                }
            })
            .catch(() => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                });
            });
    }
};



const getAll = (req, res) => {
    cityModel.find(req.body)
        .populate("zoneId")
        .populate("stateId")
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
            .populate("stateId")
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
    var errMsgs = [];

    if (!req.body._id) {
        errMsgs.push("_id is required");
    }

    if (!req.body.cityName || !Array.isArray(req.body.cityName) || req.body.cityName.length === 0) {
        errMsgs.push("cityName array is required");
    }

    if (!req.body.stateId) {
        errMsgs.push("stateId is required");
    }

    if (!req.body.zoneId) {
        errMsgs.push("zoneId is required");
    }

    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }
    else {

        /* 🔴 DUPLICATE CHECK (GLOBAL) */
        cityModel.findOne({
            cityName: { $in: req.body.cityName },
            _id: { $ne: req.body._id }
        })
            .then((duplicateCity) => {

                if (duplicateCity) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "One or more cities already exist"
                    });
                }
                else {
                    cityModel.findOne({ _id: req.body._id })
                        .then((cityData) => {

                            if (cityData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "City not Found"
                                });
                            }
                            else {
                                cityData.cityName = req.body.cityName;
                                cityData.stateId = req.body.stateId;
                                cityData.zoneId = req.body.zoneId;

                                cityData.save()
                                    .then((updatedCity) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "City Updated Successfully",
                                            data: updatedCity
                                        });
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "City not Updated"
                                        });
                                    });
                            }
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Internal Server Error"
                            });
                        });
                }
            })
            .catch(() => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Something Went Wrong"
                });
            });
    }
};


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