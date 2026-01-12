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
                    userObj.storeId=req.body.storeId
                    userObj.designation = "FM"
                    userObj.save()
                    .then((newUserData) => {
                        let fmObj = new fmModel()
                        fmObj.userId = newUserData._id
                        fmObj.name = req.body.name
                        fmObj.email = req.body.email
                        fmObj.contact = req.body.contact
                        fmObj.storeId=req.body.storeId
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
        .then((fmData) => {
            if (fmData.length == 0) {
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
        fmModel.findOne({ _id: req.body._id })
            .then( (fmData) => {
                if (fmData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Facility Manager not Found"
                    })
                }
                else {
                    if (req.body.name) {
                        fmData.name = req.body.name
                    }
                    if (req.body.contact) {
                        fmData.contact = req.body.contact
                    }  
                    if (req.body.designation) {
                        fmData.designation = req.body.designation
                    }
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
                                        if (req.body.name) {
                                            userData.name = req.body.name
                                        }
                                        userData.save()
                                            .then(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Updated Successfully",
                                                    data: fmData,
                                                    userData
                                                })
                                            })
                                            .catch(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Not Updated ",
                                                    data: fmData
                                                })
                                            })
                                    }
                                })
                                .catch(() => {
                                    res.send({
                                        status: 422,
                                        success: false,
                                        message: "Facility Manager Data not Updated"
                                    })
                                })
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


module.exports = { add, getAll, getSingle, update, delfm, changeStatus }