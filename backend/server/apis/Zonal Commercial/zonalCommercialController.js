const zonalCommercialModel = require("./zonalCommercialModel")
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
                    userObj.userType = 9
                    userObj.designation = "Zonal_Commercial"
                    userObj.save()
                        .then((newUserData) => {
                            let zonalCommercialObj = new zonalCommercialModel()
                            zonalCommercialObj.userId = newUserData._id
                            zonalCommercialObj.name = req.body.name
                            zonalCommercialObj.storeId = req.body.storeId
                            zonalCommercialObj.email = req.body.email
                            zonalCommercialObj.contact = req.body.contact
                            zonalCommercialObj.designation = "Zonal_Commercial"
                            zonalCommercialObj.empcode = generateEmployeeCode()
                            zonalCommercialObj.save()
                                .then((zonalCommercialData) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Zonal Commercial Register Successfully",
                                        employeeData: zonalCommercialData,
                                        userData: newUserData
                                    })
                                })
                                .catch(() => {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "Zonal Commercial Not Register!"
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
                        message: "Zonal Commercial Already Exists"
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
    zonalCommercialModel.find(req.body)
        .populate("userId")
        .populate("storeId")
        .then((zonalCommercialData) => {
            if (zonalCommercialData.length == 0) {
                res.send({
                    status: 422,
                    success: false,
                    message: "No Zonal Commercial Data Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "All Zonal Commercial Data Found",
                    data: zonalCommercialData
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
        zonalCommercialModel.findOne({ _id: req.body._id })
            .populate("storeId")
            .then((zonalCommercialData) => {
                if (zonalCommercialData == null) {
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
                        data: zonalCommercialData
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


const updateZonalCommercial = (req, res) => {
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

    zonalCommercialModel.findOne({ _id: req.body._id })
        .then((zonalCommercialData) => {

            if (zonalCommercialData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Zonal Commercial not Found"
                });
            }
            else {

                if (req.body.name) {
                    zonalCommercialData.name = req.body.name;
                }
                if (req.body.contact) {
                    zonalCommercialData.contact = req.body.contact;
                }
                if (req.body.storeId) {
                    zonalCommercialData.storeId = req.body.storeId;
                }

                zonalCommercialData.save()
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
                            message: "Zonal Commercial not updated"
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


const delZonalCommercial = (req, res) => {
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
        zonalCommercialModel.findOne({ _id: req.body._id })
            .then((zonalCommercialData) => {
                if (zonalCommercialData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Zonal Commercial not Found"
                    })
                }
                else {
                    zonalCommercialData.deleteOne()
                        .then(() => {
                            userModel.findOne({ _id: zonalCommercialData.userId })
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
                                message: "Zonal Commercial Not Deleted!!"
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
        zonalCommercialModel.findOne({ _id: req.body._id })
            .then((zonalCommercialData) => {
                if (zonalCommercialData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Zonal Commercial not Found"
                    })
                }
                else {
                    zonalCommercialData.status = req.body.status
                    zonalCommercialData.save()
                        .then((zonalCommercialData) => {
                            userModel.findOne({ _id: zonalCommercialData.userId })
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
                                                    zonalCommercialData,
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


module.exports = { add, getAll, getSingle, updateZonalCommercial, delZonalCommercial, changeStatus }