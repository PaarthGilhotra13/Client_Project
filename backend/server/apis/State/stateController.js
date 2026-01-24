const stateModel = require("./stateModel")

const add = (req, res) => {
    var errMsgs = []

    if (!req.body.stateName) {
        errMsgs.push("stateName array is required")
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
        stateModel.findOne({ stateName: req.body.stateName })
            .then((stateData) => {
                if (stateData == null) {

                    let stateObj = new stateModel()
                    stateObj.stateName = req.body.stateName
                    stateObj.zoneId = req.body.zoneId

                    stateObj.save()
                        .then((stateData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "State Added Successfully",
                                data: stateData
                            })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "State Not Added"
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "State Already Exists"
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
    stateModel.find(req.body)
        .populate("zoneId")
        .then((stateData) => {
            if (stateData.length == 0) {
                res.send({
                    status: 402,
                    success: false,
                    message: "State is Empty",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "State Found",
                    data: stateData
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
        stateModel.findOne({ _id: req.body._id })
            .populate("zoneId")
            .then((stateData) => {
                if (stateData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "State not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "State Found",
                        data: stateData
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

    if (!req.body.zoneId) {
        errMsgs.push("zoneId is required");
    }

    if (!req.body.stateName ) {
        errMsgs.push("At least one state is required");
    }

    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }
    else {
        stateModel.findOne({
            _id: req.body._id
        })
            .then((duplicateState) => {

                if (duplicateState) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "One or more states already exist in another zone"
                    });
                }
                else {
                    stateModel.findOne({ _id: req.body._id })
                        .then((stateData) => {

                            if (stateData == null) {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "State not Found"
                                });
                            }
                            else {
                                stateData.stateName = req.body.stateName;
                                stateData.zoneId = req.body.zoneId;

                                stateData.save()
                                    .then((updatedData) => {
                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "State Updated Successfully",
                                            data: updatedData
                                        });
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "State not Updated"
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



const delState = (req, res) => {
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
        stateModel.findOne({ _id: req.body._id })
            .then((stateData) => {
                if (stateData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    stateData.deleteOne()
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
        stateModel.findOne({ _id: req.body._id })
            .then((stateData) => {
                if (stateData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Data not Found"
                    })
                }
                else {
                    stateData.status = req.body.status
                    stateData.save()
                        .then((stateData) => {
                            res.send({
                                status: 200,
                                success: true,
                                message: "Status Updated Successfully",
                                data: stateData
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

module.exports = { add, getAll, getSingle, update, delState, changeStatus }