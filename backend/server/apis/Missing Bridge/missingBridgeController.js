const missingBridgeModel = require("./missingBridgeModel")
const userModel = require("../User/userModel")
const bcrypt = require("bcrypt")

const generateEmployeeCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};


const add = (req, res) => {
    var errMsgs = []
    if (!req.body.name) {
        errMsgs.push("name is required")
    }
    if (!req.body.email) {
        errMsgs.push("email is required")
    }
    if (!req.body.password) {
        errMsgs.push("password is required")
    }
    if (!req.body.contact) {
        errMsgs.push("contact is required")
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
        userModel.findOne({ email: req.body.email })
            .then((userData) => {
                if (userData == null) {
                    let userObj = new userModel()
                    userObj.name = req.body.name
                    userObj.email = req.body.email
                    userObj.storeId = req.body.storeId
                    userObj.password = bcrypt.hashSync(req.body.password, 10)
                    userObj.userType = 10
                    userObj.designation = "Missing_Bridge"
                    userObj.save()
                        .then((newUserData) => {
                            let missingBridgeObj = new missingBridgeModel()
                            missingBridgeObj.userId = newUserData._id
                            missingBridgeObj.name = req.body.name
                            missingBridgeObj.storeId = req.body.storeId
                            missingBridgeObj.email = req.body.email
                            missingBridgeObj.contact = req.body.contact
                            missingBridgeObj.zoneId = req.body.zoneId
                            missingBridgeObj.designation = "Missing_Bridge"
                            missingBridgeObj.empcode = generateEmployeeCode()
                            missingBridgeObj.save()
                                .then((missingBridgeData) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Missing Bridge Register Successfully",
                                        employeeData: missingBridgeData,
                                        userData: newUserData
                                    })
                                })
                                .catch(() => {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "Missing Bridge Not Register!"
                                    })
                                })
                        })
                        .catch(() => {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Internel server error!!",
                            })
                        })
                }
                else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Missing Bridge Already Exists"
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
    missingBridgeModel.find(req.body)
        .populate("userId")
        .populate("storeId")
        .then((missingBridgeData) => {
            if (missingBridgeData.length == 0) {
                res.send({
                    status: 422,
                    success: false,
                    message: "No Missing Bridge Data Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "All Missing Bridge Data Found",
                    data: missingBridgeData
                })

            }
        })
        .catch((err) => {
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
        missingBridgeModel.findOne({ _id: req.body._id })
            .populate("storeId")
            .then((missingBridgeData) => {
                if (missingBridgeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Business Finance not Found"
                    })
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Business Finance Data Found",
                        data: missingBridgeData
                    })
                }
            })
            .catch((err) => {
                res.send({
                    status: 422,
                    success: false,
                    message: "Somehting Went Wrong"
                })
            })
    }
}


const updateMissingBridge = (req, res) => {
    var errMsgs = [];

    if (!req.body._id) {
        errMsgs.push("_id is required");
    }

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    missingBridgeModel.findOne({ _id: req.body._id })
        .then((missingBridgeData) => {

            if (missingBridgeData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Missing Bridge not Found"
                });
            }
            else {

                if (req.body.name) {
                    missingBridgeData.name = req.body.name;
                }
                if (req.body.contact) {
                    missingBridgeData.contact = req.body.contact;
                }
                if (req.body.storeId) {
                    missingBridgeData.storeId = req.body.storeId;
                }
                if (req.body.zoneId) {
                    zhData.zoneId = req.body.zoneId;
                }
                missingBridgeData.save()
                    .then((updatedData) => {

                        userModel.findOne({ _id: updatedData.userId })
                            .then((userData) => {

                                if (userData == null) {
                                    res.send({
                                        status: 422,
                                        success: false,
                                        message: "User not Found"
                                    });
                                }
                                else {

                                    if (req.body.name) {
                                        userData.name = req.body.name;
                                    }
                                    if (req.body.contact) {
                                        userData.contact = req.body.contact;
                                    }
                                    if (req.body.storeId) {
                                        userData.storeId = req.body.storeId;
                                    }

                                    userData.save()
                                        .then(() => {
                                            res.send({
                                                status: 200,
                                                success: true,
                                                message: "Updated Successfully",
                                                data: updatedData
                                            });
                                        })
                                        .catch(() => {
                                            res.send({
                                                status: 422,
                                                success: false,
                                                message: "User not updated"
                                            });
                                        });
                                }
                            })
                            .catch(() => {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "User fetch error"
                                });
                            });
                    })
                    .catch(() => {
                        res.send({
                            status: 422,
                            success: false,
                            message: "Missing Bridge not updated"
                        });
                    });
            }
        })
        .catch(() => {
            res.send({
                status: 422,
                success: false,
                message: "Something went wrong"
            });
        });
};


const delMissingBridge = (req, res) => {
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
        missingBridgeModel.findOne({ _id: req.body._id })
            .then((missingBridgeData) => {
                if (missingBridgeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Missing Bridge not Found"
                    })
                }
                else {
                    missingBridgeData.deleteOne()
                        .then(() => {
                            userModel.findOne({ _id: missingBridgeData.userId })
                                .then((userData) => {
                                    if (userData == null) {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "User not Found"
                                        })
                                    }
                                    else {
                                        userData.deleteOne()
                                            .then(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Deleted Successfully"
                                                })
                                            })
                                            .catch(() => {
                                                res.send({
                                                    status: 422,
                                                    success: false,
                                                    message: "Not Deleted"
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
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Missing Bridge Not Deleted!!"
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
        missingBridgeModel.findOne({ _id: req.body._id })
            .then((missingBridgeData) => {
                if (missingBridgeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Missing Bridge not Found"
                    })
                }
                else {
                    missingBridgeData.status = req.body.status
                    missingBridgeData.save()
                        .then((missingBridgeData) => {
                            userModel.findOne({ _id: missingBridgeData.userId })
                                .then((userData) => {
                                    if (userData == null) {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "User not Found"
                                        })
                                    }
                                    else {
                                        userData.status = req.body.status
                                        userData.save()
                                            .then((userData) => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Status Updated Successfully",
                                                    missingBridgeData,
                                                    userData
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
                                        message: "Internal Server Error"
                                    })
                                })
                        })
                        .catch(() => {
                            res.send({
                                status: 422,
                                success: false,
                                message: "Internal Server Error "
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


module.exports = { add, getAll, getSingle, updateMissingBridge, delMissingBridge, changeStatus }