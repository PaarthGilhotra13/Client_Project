const procureModel = require("./procureModel")
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
                    userObj.userType = 7
                    userObj.designation = "Procurement"
                    userObj.save()
                        .then((newUserData) => {
                            let procureObj = new procureModel()
                            procureObj.userId = newUserData._id
                            procureObj.name = req.body.name
                            procureObj.email = req.body.email
                            procureObj.storeId = req.body.storeId
                            procureObj.contact = req.body.contact
                            procureObj.designation = "Procurement"
                            procureObj.empcode = generateEmployeeCode()
                            procureObj.save()
                                .then((procureData) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Procurement Register Successfully",
                                        employeeData: procureData,
                                        userData: newUserData
                                    })
                                })
                                .catch(() => {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "Procurement Not Register!"
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
                        message: "Procurement Already Exists"
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
    procureModel.find(req.body)
        .populate("userId")
        .then((procureData) => {
            if (procureData.length == 0) {
                res.send({
                    status: 422,
                    success: false,
                    message: "No procure Data Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "All procure Data Found",
                    data: procureData
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
        procureModel.findOne({ _id: req.body._id })
        .populate("storeId")
            .then((procureData) => {
                if (procureData == null) {
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
                        data: procureData
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
//         procureModel.findOne({ _id: req.body._id })
//             .then((procureData) => {
//                 if (procureData == null) {
//                     res.send({
//                         status: 422,
//                         success: false,
//                         message: "procure not Found"
//                     })
//                 }
//                 else {
//                     if (req.body.name) {
//                         procureData.name = req.body.name
//                     }
//                     if (req.body.contact) {
//                         procureData.contact = req.body.contact
//                     }
//                     if (req.body.designation) {
//                         procureData.designation = req.body.designation
//                     }
//                     if (req.body.storeId) {
//                         procureData.storeId = req.body.storeId
//                     }
//                     procureData.save()
//                         .then((procureData) => {
//                             userModel.findOne({ _id: procureData.userId })
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
//                                                     data: procureData,
//                                                     userData
//                                                 })
//                                             })
//                                             .catch(() => {
//                                                 res.send({
//                                                     status: 200,
//                                                     success: true,
//                                                     message: "Not Updated ",
//                                                     data: procureData
//                                                 })
//                                             })
//                                     }
//                                 })
//                                 .catch(() => {
//                                     res.send({
//                                         status: 422,
//                                         success: false,
//                                         message: "procure Data not Updated"
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

const updatePr = (req, res) => {
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

    procureModel.findOne({ _id: req.body._id })
        .then((procureData) => {

            if (procureData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Procurement not Found"
                });
            }
            else {
                if (req.body.name) {
                    procureData.name = req.body.name;
                }
                if (req.body.contact) {
                    procureData.contact = req.body.contact;
                }
                if (req.body.storeId) {
                    procureData.storeId = req.body.storeId;
                }
                procureData.save()
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
                            message: "Procurement not updated"
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

const delprocure = (req, res) => {
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
        procureModel.findOne({ _id: req.body._id })
            .then((procureData) => {
                if (procureData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "procure not Found"
                    })
                }
                else {
                    procureData.deleteOne()
                        .then(() => {
                            userModel.findOne({ _id: procureData.userId })
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
                                message: "procure Not Deleted!!"
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
        procureModel.findOne({ _id: req.body._id })
            .then((procureData) => {
                if (procureData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "procure not Found"
                    })
                }
                else {
                    procureData.status = req.body.status
                    procureData.save()
                        .then((procureData) => {
                            userModel.findOne({ _id: procureData.userId })
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
                                                    procureData,
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


module.exports = { add, getAll, getSingle, updatePr, delprocure, changeStatus }