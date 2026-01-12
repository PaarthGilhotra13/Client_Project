const bfModel = require("./businessFinanceModel")
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
                    userObj.email = req.body.email
                    userObj.password = bcrypt.hashSync(req.body.password, 10)
                    userObj.userType = 6
                    userObj.designation = "Business Finance"
                    userObj.save()
                    .then((newUserData) => {
                        let bfObj = new bfModel()
                        bfObj.userId = newUserData._id
                        bfObj.name = req.body.name
                        bfObj.email = req.body.email
                        bfObj.contact = req.body.contact
                        bfObj.designation = "Business Finance"
                        bfObj.empcode = generateEmployeeCode() 
                        bfObj.save()
                            .then((bfData) => {
                                res.send({
                                    status: 200,
                                    success: true,
                                    message: "Business Finance Register Successfully",
                                    employeeData: bfData,
                                    userData: newUserData
                                })
                            })
                            .catch(() => {
                                res.send({
                                    status: 500,
                                    success: false,
                                    message: "Business Finance Not Register!"
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
                        message: "Business Finance Already Exists"
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
    bfModel.find(req.body)
        .populate("userId")
        .then((bfData) => {
            if (bfData.length == 0) {
                res.send({
                    status: 422,
                    success: false,
                    message: "No Employee Data Found",
                })
            }
            else {
                res.send({
                    status: 200,
                    success: true,
                    message: "All Employee Data Found",
                    data: bfData
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
        bfModel.findOne({ _id: req.body._id })
            .then((bfData) => {
                if (bfData == null) {
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
                        data: bfData
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
        bfModel.findOne({ _id: req.body._id })
            .then(async (bfData) => {
                if (bfData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Business Finance not Found"
                    })
                }
                else {
                    if (req.body.name) {
                        bfData.name = req.body.name
                    }
                    if (req.body.contact) {
                        bfData.contact = req.body.contact
                    }  
                    if (req.body.designation) {
                        bfData.designation = req.body.designation
                    }
                    bfData.save()
                        .then((bfData) => {
                            userModel.findOne({ _id: bfData.userId })
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
                                                    data: bfData,
                                                    userData
                                                })
                                            })
                                            .catch(() => {
                                                res.send({
                                                    status: 200,
                                                    success: true,
                                                    message: "Not Updated ",
                                                    data: bfData
                                                })
                                            })
                                    }
                                })
                                .catch(() => {
                                    res.send({
                                        status: 422,
                                        success: false,
                                        message: "Business Finance Data not Updated"
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

const delbf = (req, res) => {
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
        bfModel.findOne({ _id: req.body._id })
            .then((bfData) => {
                if (bfData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Business finance not Found"
                    })
                }
                else {
                    bfData.deleteOne()
                        .then(() => {
                            userModel.findOne({ _id: bfData.userId })
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
                                message: "Business finance Not Deleted!!"
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
        employeeModel.findOne({ _id: req.body._id })
            .then((employeeData) => {
                if (employeeData == null) {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Employee not Found"
                    })
                }
                else {
                    employeeData.status = req.body.status
                    employeeData.save()
                        .then((employeeData) => {
                            userModel.findOne({ _id: employeeData.userId })
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
                                                    employeeData,
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


module.exports = { add, getAll, getSingle, update, delbf, changeStatus }