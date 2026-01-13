const employeeModel = require("../Employee/employeeModel")
const clmModel = require("../CLM/clmModel")
const bfModel = require("../Business Finance/businessFinanceModel")
const procurementModel = require("../Procurement/procureModel")
const zhModel = require("../Zonal Head/zonalHeadModel")
const fmModel = require("./facilityManagerModel")
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
                    userObj.password = bcrypt.hashSync(req.body.password, 10)
                    userObj.userType = 3
                    userObj.storeId = req.body.storeId
                    userObj.designation = "FM"
                    userObj.save()
                        .then((newUserData) => {
                            let fmObj = new fmModel()
                            fmObj.userId = newUserData._id
                            fmObj.name = req.body.name
                            fmObj.email = req.body.email
                            fmObj.contact = req.body.contact
                            fmObj.storeId = req.body.storeId
                            fmObj.designation = "FM"
                            fmObj.empcode = generateEmployeeCode()
                            fmObj.save()
                                .then((fmData) => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "FM Register Successfully",
                                        employeeData: fmData,
                                        userData: newUserData
                                    })
                                })
                                .catch(() => {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: "FM Not Register!"
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
                        message: "FM Already Exists"
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
    fmModel.find(req.body)
        .populate("userId")
        .populate("storeId")
        .then((fmData) => {
            if (fmData.length == 0) {
                res.send({
                    status: 422,
                    success: false,
                    message: "No FM Data Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "All FM Data Found",
                    data: fmData
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
        fmModel.findOne({ _id: req.body._id })
            .populate("storeId")
            .then((fmData) => {
                if (fmData == null) {
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
                        data: fmData
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
//         fmModel.findOne({ _id: req.body._id })
//             .then(async (fmData) => {
//                 if (fmData == null) {
//                     res.send({
//                         status: 422,
//                         success: false,
//                         message: "FM not Found"
//                     })
//                 }
//                 else {
//                     if (req.body.designation) {
//                         const designationModelMap = {
//                             Employee: employeeModel,
//                             FM: fmModel,
//                             CLM: clmModel,
//                             Zonal_Head: zhModel,
//                             Business_Finance: bfModel,
//                             Procurement: procurementModel
//                         };
//                         const oldDesignation = fmData.designation;
//                         const newDesignation = req.body.designation;
//                         if (newDesignation && newDesignation !== oldDesignation) {

//                             const OldModel = designationModelMap[oldDesignation];
//                             const NewModel = designationModelMap[newDesignation];

//                             if (!OldModel || !NewModel) {
//                                 return res.send({
//                                     status: 400,
//                                     success: false,
//                                     message: "Invalid designation"
//                                 });
//                             }

//                             const oldData = fmData.toObject();

//                             // delete from old collection
//                             await OldModel.deleteOne({ _id: fmData._id });

//                             // create in new collection
//                             oldData.designation = newDesignation;
//                             delete oldData._id;

//                             const newRecord = await NewModel.create(oldData);

//                             // update user designation
//                             await userModel.updateOne(
//                                 { _id: fmData.userId },
//                                 { designation: newDesignation }
//                             );

//                             return res.send({
//                                 status: 200,
//                                 success: true,
//                                 message: "Designation transferred successfully",
//                                 data: newRecord
//                             });
//                         }


//                     }
//                     else {
//                         if (req.body.storeId) {
//                             fmData.storeId = req.body.storeId
//                         }
//                         if (req.body.name) {
//                             fmData.name = req.body.name
//                         }
//                         if (req.body.contact) {
//                             fmData.contact = req.body.contact
//                         }
//                         fmData.save()
//                             .then((fmData) => {
//                                 userModel.findOne({ _id: fmData.userId })
//                                     .then((userData) => {
//                                         if (userData == null) {
//                                             res.send({
//                                                 status: 422,
//                                                 success: false,
//                                                 message: "User not Found"
//                                             })
//                                         }
//                                         else {
//                                             if (req.body.name) {
//                                                 userData.name = req.body.name
//                                             }
//                                             if (req.body.contact) {
//                                                 userData.contact = req.body.contact
//                                             }
//                                             if (req.body.storeId) {
//                                                 userData.storeId = req.body.storeId
//                                             }
//                                             userData.save()
//                                                 .then(() => {
//                                                     res.send({
//                                                         status: 200,
//                                                         success: true,
//                                                         message: "Updated Successfully",
//                                                         data: fmData,
//                                                         userData
//                                                     })
//                                                 })
//                                                 .catch(() => {
//                                                     res.send({
//                                                         status: 200,
//                                                         success: true,
//                                                         message: "Not Updated ",
//                                                         data: fmData
//                                                     })
//                                                 })
//                                         }
//                                     })
//                                     .catch(() => {
//                                         res.send({
//                                             status: 422,
//                                             success: false,
//                                             message: "Employee Data not Updated"
//                                         })
//                                     })
//                             })
//                             .catch(() => {
//                                 res.send({
//                                     status: 422,
//                                     success: false,
//                                     message: "Internal Server Error"
//                                 })
//                             })
//                     }
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


// const update = (req, res) => {
//     var errMsgs = [];

//     if (!req.body._id) {
//         errMsgs.push("_id is required");
//     }

//     if (!req.body.oldDesignation) {
//         errMsgs.push("oldDesignation is required");
//     }

//     if (errMsgs.length > 0) {
//         res.send({
//             status: 422,
//             success: false,
//             message: errMsgs
//         });
//     }
//     else {

//         const designationModelMap = {
//             FM: fmModel,
//             CLM: clmModel,
//             Zonal_Head: zhModel,
//             Business_Finance: bfModel,
//             Procurement: procurementModel
//         };

//         const OldModel = designationModelMap[req.body.oldDesignation];
//         const NewModel = designationModelMap[req.body.designation];

//         if (!OldModel) {
//             return res.send({
//                 status: 400,
//                 success: false,
//                 message: "Invalid old designation"
//             });
//         }

//         // 🔹 SAME STYLE: findOne → then
//         OldModel.findOne({ _id: req.body._id })
//             .then((oldData) => {

//                 if (oldData == null) {
//                     res.send({
//                         status: 422,
//                         success: false,
//                         message: "Record not Found"
//                     });
//                 }
//                 else {

//                     // 🔥 DESIGNATION CHANGE → TRANSFER
//                     if (
//                         req.body.designation &&
//                         req.body.designation !== req.body.oldDesignation
//                     ) {

//                         if (!NewModel) {
//                             return res.send({
//                                 status: 400,
//                                 success: false,
//                                 message: "Invalid new designation"
//                             });
//                         }

//                         const oldObj = oldData.toObject();

//                         OldModel.deleteOne({ _id: oldData._id })
//                             .then(() => {

//                                 oldObj.designation = req.body.designation;
//                                 delete oldObj._id;

//                                 NewModel.create(oldObj)
//                                     .then((newRecord) => {

//                                         userModel.findOne({ _id: oldData.userId })
//                                             .then((userData) => {
//                                                 if (userData) {
//                                                     userData.designation = req.body.designation;
//                                                     userData.save();
//                                                 }

//                                                 res.send({
//                                                     status: 200,
//                                                     success: true,
//                                                     message: "Designation transferred successfully",
//                                                     data: newRecord
//                                                 });
//                                             })
//                                             .catch(() => {
//                                                 res.send({
//                                                     status: 422,
//                                                     success: false,
//                                                     message: "User not Found"
//                                                 });
//                                             });

//                                     })
//                                     .catch(() => {
//                                         res.send({
//                                             status: 422,
//                                             success: false,
//                                             message: "New record not created"
//                                         });
//                                     });

//                             })
//                             .catch(() => {
//                                 res.send({
//                                     status: 422,
//                                     success: false,
//                                     message: "Old record not deleted"
//                                 });
//                             });
//                     }

//                     // 🔹 NORMAL UPDATE (designation same)
//                     else {
//                         if (req.body.name) {
//                             oldData.name = req.body.name;
//                         }
//                         if (req.body.contact) {
//                             oldData.contact = req.body.contact;
//                         }
//                         if (req.body.storeId) {
//                             oldData.storeId = req.body.storeId;
//                         }
//                         oldData.save()
//                             .then((updatedData) => {
//                                 userModel.findOne({ _id: updatedData.userId })
//                                     .then((userData) => {
//                                         if (userData == null) {
//                                             res.send({
//                                                 status: 422,
//                                                 success: false,
//                                                 message: "User not Found"
//                                             });
//                                         }
//                                         else {

//                                             if (req.body.name) {
//                                                 userData.name = req.body.name;
//                                             }
//                                             if (req.body.contact) {
//                                                 userData.contact = req.body.contact;
//                                             }
//                                             if (req.body.storeId) {
//                                                 userData.storeId = req.body.storeId;
//                                             }

//                                             userData.save()
//                                                 .then(() => {
//                                                     res.send({
//                                                         status: 200,
//                                                         success: true,
//                                                         message: "Updated Successfully",
//                                                         data: updatedData,
//                                                         userData
//                                                     });
//                                                 })
//                                                 .catch(() => {
//                                                     res.send({
//                                                         status: 422,
//                                                         success: false,
//                                                         message: "User not updated"
//                                                     });
//                                                 });
//                                         }
//                                     })
//                                     .catch(() => {
//                                         res.send({
//                                             status: 422,
//                                             success: false,
//                                             message: "User fetch error"
//                                         });
//                                     });
//                             })
//                             .catch(() => {
//                                 res.send({
//                                     status: 422,
//                                     success: false,
//                                     message: "Employee not updated"
//                                 });
//                             });
//                     }
//                 }
//             })
//             .catch(() => {
//                 res.send({
//                     status: 422,
//                     success: false,
//                     message: "Something went wrong"
//                 });
//             });
//     }
// };


// const update = (req, res) => {
//     var errMsgs = [];

//     if (!req.body._id) errMsgs.push("_id is required");
//     if (!req.body.oldDesignation) errMsgs.push("oldDesignation is required");

//     if (errMsgs.length > 0) {
//         return res.send({
//             status: 422,
//             success: false,
//             message: errMsgs
//         });
//     }

//     const designationModelMap = {
//         FM: fmModel,
//         CLM: clmModel,
//         Zonal_Head: zhModel,
//         Business_Finance: bfModel,
//         Procurement: procurementModel
//     };

//     const OldModel = designationModelMap[req.body.oldDesignation];
//     const NewModel = designationModelMap[req.body.designation];

//     OldModel.findOne({ _id: req.body._id })
//         .then((oldData) => {

//             if (!oldData) {
//                 return res.send({
//                     status: 422,
//                     success: false,
//                     message: "Record not found"
//                 });
//             }

//             // 🔥 TRANSFER BLOCK (TOP PRIORITY)
//             if (
//                 req.body.designation &&
//                 req.body.designation !== req.body.oldDesignation
//             ) {

//                 if (!NewModel) {
//                     return res.send({
//                         status: 400,
//                         success: false,
//                         message: "Invalid designation"
//                     });
//                 }

//                 const obj = oldData.toObject();

//                 OldModel.deleteOne({ _id: oldData._id })
//                     .then(() => {

//                         obj.designation = req.body.designation;
//                         delete obj._id;

//                         NewModel.create(obj)
//                             .then((newRecord) => {

//                                 userModel.updateOne(
//                                     { _id: oldData.userId },
//                                     { designation: req.body.designation }
//                                 ).then(() => {

//                                     return res.send({
//                                         status: 200,
//                                         success: true,
//                                         message: "Designation transferred successfully",
//                                         data: newRecord
//                                     });

//                                 });

//                             });

//                     });

//                 return; // 🔥 VERY IMPORTANT
//             }

//             // 🔹 NORMAL UPDATE
//             if (req.body.name) oldData.name = req.body.name;
//             if (req.body.contact) oldData.contact = req.body.contact;
//             if (req.body.storeId) oldData.storeId = req.body.storeId;

//             oldData.save()
//                 .then((updated) => {

//                     userModel.updateOne(
//                         { _id: updated.userId },
//                         {
//                             ...(req.body.name && { name: req.body.name }),
//                             ...(req.body.contact && { contact: req.body.contact }),
//                             ...(req.body.storeId && { storeId: req.body.storeId })
//                         }
//                     ).then(() => {

//                         res.send({
//                             status: 200,
//                             success: true,
//                             message: "Updated Successfully",
//                             data: updated
//                         });

//                     });

//                 });

//         })
//         .catch(() => {
//             res.send({
//                 status: 422,
//                 success: false,
//                 message: "Something went wrong"
//             });
//         });
// };


const updateFm = (req, res) => {
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

    fmModel.findOne({ _id: req.body._id })
        .then((fmData) => {

            if (fmData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "FM not Found"
                });
            }
            else {

                if (req.body.name) {
                    fmData.name = req.body.name;
                }
                if (req.body.contact) {
                    fmData.contact = req.body.contact;
                }
                if (req.body.storeId) {
                    fmData.storeId = req.body.storeId;
                }

                fmData.save()
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
                            message: "FM not updated"
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


const delfm = (req, res) => {
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
        fmModel.findOne({ _id: req.body._id })
            .then((fmData) => {
                if (fmData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Facility Manager not Found"
                    })
                }
                else {
                    fmData.deleteOne()
                        .then(() => {
                            userModel.findOne({ _id: fmData.userId })
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
                                message: "Facility Manager Not Deleted!!"
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
        fmModel.findOne({ _id: req.body._id })
            .then((fmData) => {
                if (fmData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Facility Manager not Found"
                    })
                }
                else {
                    fmData.status = req.body.status
                    fmData.save()
                        .then((fmData) => {
                            userModel.findOne({ _id: fmData.userId })
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
                                                    fmData,
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

const changeDesignation = (req, res) => {
    var errMsgs = [];

    if (!req.body._id) {
        errMsgs.push("_id is required");
    }
    if (!req.body.oldDesignation) {
        errMsgs.push("oldDesignation is required");
    }
    if (!req.body.newDesignation) {
        errMsgs.push("newDesignation is required");
    }
    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs
        });
    }

    const designationModelMap = {
        FM: fmModel,
        CLM: clmModel,
        Zonal_Head: zhModel,
        Business_Finance: bfModel,
        Procurement: procurementModel
    };

    const OldModel = designationModelMap[req.body.oldDesignation];
    const NewModel = designationModelMap[req.body.newDesignation];

    if (!OldModel || !NewModel) {
        return res.send({
            status: 400,
            success: false,
            message: "Invalid designation"
        });
    }

    OldModel.findOne({ _id: req.body._id })
        .then((oldData) => {

            if (oldData == null) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Record not Found"
                });
            }
            else {

                const oldObj = oldData.toObject();

                OldModel.deleteOne({ _id: oldData._id })
                    .then(() => {

                        oldObj.designation = req.body.newDesignation;
                        delete oldObj._id;

                        NewModel.create(oldObj)
                            .then((newRecord) => {

                                userModel.findOne({ _id: oldData.userId })
                                    .then((userData) => {

                                        if (userData) {
                                            userData.designation = req.body.newDesignation;
                                            userData.save();
                                        }

                                        res.send({
                                            status: 200,
                                            success: true,
                                            message: "Designation changed successfully",
                                            data: newRecord
                                        });
                                    })
                                    .catch(() => {
                                        res.send({
                                            status: 422,
                                            success: false,
                                            message: "User not Found"
                                        });
                                    });

                            })
                            .catch(() => {
                                res.send({
                                    status: 422,
                                    success: false,
                                    message: "New record not created"
                                });
                            });
                    })
                    .catch(() => {
                        res.send({
                            status: 422,
                            success: false,
                            message: "Old record not deleted"
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


module.exports = { add, getAll, getSingle, updateFm, delfm, changeStatus, changeDesignation }