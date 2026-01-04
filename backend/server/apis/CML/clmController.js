const clmModel = require("./clmModel")
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
                    userObj.userType = 4
                    userObj.designation = "CLM"
                    userObj.save()
                    .then((newUserData) => {
                        let clmObj = new clmModel()
                        clmObj.userId = newUserData._id
                        clmObj.name = req.body.name
                        clmObj.email = req.body.email
                        clmObj.contact = req.body.contact
                        clmObj.designation = "CLM"
                        clmObj.empcode = generateEmployeeCode() 
                        clmObj.save()
                            .then((clmData) => {
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "CLM Register Successfully",
                                    employeeData: clmData,
                                    userData: newUserData
                                })
                            })
                            .catch(() => {
                                res.send({
                                    status: 500,
                                    success: false,
                                    message: "CLM Not Register!"
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
                        message: "CLM Already Exists"
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
    clmModel.find(req.body)
        .populate("userId")
        .then((clmData) => {
            if (clmData.length == 0) {
                res.send({
                    status: 422,
                    success: false,
                    message: "No CLM Data Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "All CLM Data Found",
                    data: clmData
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
        clmModel.findOne({ _id: req.body._id })
            .then((clmData) => {
                if (clmData == null) {
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
                        data: clmData
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
        clmModel.findOne({ _id: req.body._id })
            .then( (clmData) => {
                if (clmData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "CLM not Found"
                    })
                }
                else {
                    if (req.body.name) {
                        clmData.name = req.body.name
                    }
                    if (req.body.contact) {
                        clmData.contact = req.body.contact
                    }  
                    if (req.body.designation) {
                        clmData.designation = req.body.designation
                    }
                    clmData.save()
                        .then((clmData) => {
                            userModel.findOne({ _id: clmData.userId })
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
                                                    data: clmData,
                                                    userData
                                                })
                                            })
                                            .catch(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Not Updated ",
                                                    data: clmData
                                                })
                                            })
                                    }
                                })
                                .catch(() => {
                                    res.send({
                                        status: 422,
                                        success: false,
                                        message: "CLM Data not Updated"
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

const delclm = (req, res) => {
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
        clmModel.findOne({ _id: req.body._id })
            .then((clmData) => {
                if (clmData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "CLM not Found"
                    })
                }
                else {
                    clmData.deleteOne()
                        .then(() => {
                            userModel.findOne({ _id: clmData.userId })
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
                                message: "CLM Not Deleted!!"
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
        clmModel.findOne({ _id: req.body._id })
            .then((clmData) => {
                if (clmData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "CLM not Found"
                    })
                }
                else {
                    clmData.status = req.body.status
                    clmData.save()
                        .then((clmData) => {
                            userModel.findOne({ _id: clmData.userId })
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
                                                    clmData,
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


module.exports = { add, getAll, getSingle, update, delclm, changeStatus }