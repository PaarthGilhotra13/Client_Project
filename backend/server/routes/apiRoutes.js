const routes=require("express").Router()

const employeeModel = require("../apis/Employee/employeeController")
const userController=require("../apis/User/userController")
const zhController=require("../apis/ZH/zhController")
const clmController=require("../apis/CML/clmController")
const fmController=require("../apis/FM/fmController")
const bfController=require("../apis/BF/bfController")
const procureController=require("../apis/Procurement/procurementController")

// Employee Model
routes.post("/employee/add",employeeModel.add)
routes.post("/employee/all",employeeModel.getAll)
routes.post("/employee/single",employeeModel.getSingle)
routes.post("/employee/update",employeeModel.update)
routes.post("/employee/delete",employeeModel.delEmployee)
routes.post("/employee/changeStatus",employeeModel.changeStatus)

// User Model
routes.post("/user/login",userController.login)
routes.post("/user/all",userController.getAll)
routes.post("/user/single",userController.getSingle)
routes.post("/user/changePassword",userController.changePassword)

// Zonal Head
routes.post("/zh/add",zhController.add)
routes.post("/zh/all",zhController.getAll)
routes.post("/zh/single",zhController.getSingle)
routes.post("/zh/update",zhController.update)
routes.post("/zh/delete",zhController.delzh)
routes.post("/zh/changeStatus",zhController.changeStatus)

// CLM
routes.post("/clm/add",clmController.add)
routes.post("/clm/all",clmController.getAll)
routes.post("/clm/single",clmController.getSingle)
routes.post("/clm/update",clmController.update)
routes.post("/clm/delete",clmController.delclm)
routes.post("/clm/changeStatus",clmController.changeStatus)

// Facility Manager
routes.post("/fm/add",fmController.add)
routes.post("/fm/all",fmController.getAll)
routes.post("/fm/single",fmController.getSingle)
routes.post("/fm/update",fmController.update)
routes.post("/fm/delete",fmController.delfm)
routes.post("/fm/changeStaus",fmController.changeStatus)

// Business Finance
routes.post("/bf/add",bfController.add)
routes.post("/bf/all",bfController.getAll)
routes.post("/bf/single",bfController.getSingle)
routes.post("/bf/update",bfController.update)
routes.post("/bf/delete",bfController.delbf)
routes.post("/bf/changeStaus",bfController.changeStatus)

routes.post("/bf/add",bfController.add)
routes.post("/bf/add",bfController.add)
routes.post("/bf/add",bfController.add)
routes.post("/bf/add",bfController.add)
routes.post("/bf/add",bfController.add)
routes.post("/bf/add",bfController.add)

// Procurement
routes.post("/procure/add",procureController.add)
routes.post("/procure/all",procureController.getAll)
routes.post("/procure/single",procureController.getSingle)
routes.post("/procure/update",procureController.update)
routes.post("/procure/delete",procureController.delprocure)
routes.post("/procure/changeStaus",procureController.changeStatus)

module.exports=routes