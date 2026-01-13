const zhModel = require("./zonalHeadModel")
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
                    userObj.userType = 5
                    userObj.designation = "Zonal_Head"
                    userObj.save()
                        .then((newUserData) => {
                            let zhObj = new zhModel()
                            zhObj.userId = newUserData._id
                            zhObj.name = req.body.name
                            zhObj.email = req.body.email
                            zhObj.storeId = req.body.storeId
                            zhObj.contact = req.body.contact
                            zhObj.designation = "Zonal_Head"
                            zhObj.empcode = generateEmployeeCode()
                            zhObj.save()
                                .then((zhData) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Zonal Head Register Successfully",
                                        employeeData: zhData,
                                        userData: newUserData
                                    })
                                })
                                .catch(() => {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "Zonal Head Not Register!"
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
                        message: "Zonal Head Already Exists"
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
    zhModel.find(req.body)
        .populate("userId")
        .then((zhData) => {
            if (zhData.length == 0) {
                res.send({
                    status: 422,
                    success: false,
                    message: "No Manager Data Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "All Manager Data Found",
                    data: zhData
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
        zhModel.findOne({ _id: req.body._id })
        .populate("storeId")
            .then((zhData) => {
                if (zhData == null) {
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
                        data: zhData
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

// const update = (req, res) => {
//     var errMsgs = []
//     if (!req.body._id) {
//         errMsgs.push("_id is required")
//     }
//     if (errMsgs.length > 0) {
//         res.send({
//             status: 422,
//             success: false,
//             message: errMsgs
//         })
//     }
//     else {
//         zhModel.findOne({ _id: req.body._id })
//             .then((zhData) => {
//                 if (zhData == null) {
//                     res.send({
//                         status: 422,
//                         success: false,
//                         message: "Zonal Head not Found"
//                     })
//                 }
//                 else {
//                     if (req.body.name) {
//                         zhData.name = req.body.name
//                     }
//                     if (req.body.contact) {
//                         zhData.contact = req.body.contact
//                     }
//                     if (req.body.designation) {
//                         zhData.designation = req.body.designation
//                     }
//                     if (req.body.storeId) {
//                         zhData.storeId = req.body.storeId
//                     }
//                     zhData.save()
//                         .then((zhData) => {
//                             userModel.findOne({ _id: zhData.userId })
//                                 .then((userData) => {
//                                     if (userData == null) {
//                                         res.send({
//                                             status: 422,
//                                             success: false,
//                                             message: "User not Found"
//                                         })
//                                     }
//                                     else {
//                                         if (req.body.name) {
//                                             userData.name = req.body.name
//                                         }
//                                         if (req.body.contact) {
//                                             userData.contact = req.body.contact
//                                         }
//                                         if (req.body.designation) {
//                                             userData.designation = req.body.designation
//                                         }
//                                         if (req.body.storeId) {
//                                             userData.storeId = req.body.storeId
//                                         }
//                                         userData.save()
//                                             .then(() => {
//                                                 res.send({
//                                                     status: 200,
//                                                     success: true,
//                                                     message: "Updated Successfully",
//                                                     data: zhData,
//                                                     userData
//                                                 })
//                                             })
//                                             .catch(() => {
//                                                 res.send({
//                                                     status: 200,
//                                                     success: true,
//                                                     message: "Not Updated ",
//                                                     data: zhData
//                                                 })
//                                             })
//                                     }
//                                 })
//                                 .catch(() => {
//                                     res.send({
//                                         status: 422,
//                                         success: false,
//                                         message: "Zonal Head Data not Updated"
//                                     })
//                                 })
//                         })
//                         .catch(() => {
//                             res.send({
//                                 status: 422,
//                                 success: false,
//                                 message: "Internal Server Error"
//                             })
//                         })
//                 }
//             })
//             .catch(() => {
//                 res.send({
//                     status: 422,
//                     success: false,
//                     message: "Something Went Wrong"
//                 })
//             })
//     }
// }

const updateZh = (req, res) => {
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

    zhModel.findOne({ _id: req.body._id })
        .then((zhData) => {

            if (zhData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Zonal Head not Found"
                });
            }
            else {
                if (req.body.name) {
                    zhData.name = req.body.name;
                }
                if (req.body.contact) {
                    zhData.contact = req.body.contact;
                }
                if (req.body.storeId) {
                    zhData.storeId = req.body.storeId;
                }
                zhData.save()
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
                            message: "Zonal Head not updated"
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

const delzh = (req, res) => {
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
        zhModel.findOne({ _id: req.body._id })
            .then((zhData) => {
                if (zhData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Zonal Head not Found"
                    })
                }
                else {
                    zhData.deleteOne()
                        .then(() => {
                            userModel.findOne({ _id: zhData.userId })
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
                                message: "Zonal Head Not Deleted!!"
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
        zhModel.findOne({ _id: req.body._id })
            .then((zhData) => {
                if (zhData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Zonal Head not Found"
                    })
                }
                else {
                    zhData.status = req.body.status
                    zhData.save()
                        .then((zhData) => {
                            userModel.findOne({ _id: zhData.userId })
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
                                                    zhData,
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


module.exports = { add, getAll, getSingle, updateZh, delzh, changeStatus }