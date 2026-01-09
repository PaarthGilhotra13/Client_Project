const routes=require("express").Router()

const employeeModel = require("../apis/Employee/employeeController")
const userController=require("../apis/User/userController")
const zhController=require("../apis/Zonal Head/zonalHeadController")
const clmController=require("../apis/CLM/clmController")
const fmController=require("../apis/Facility Manager/facilityManagerController")
const bfController=require("../apis/Business Finance/businessFinanceController")
const procureController=require("../apis/Procurement/procurementController")
const zoneController=require("../apis/Zone/zoneController")
const cityController=require("../apis/City/cityController")
const storeCategoryController=require("../apis/Store Category/storeCategoryController")
const storeController=require("../apis/Store/storeController")
const expenseController=require("../apis/Expense/expenseController")

const multer=require("multer")
const storage=multer.memoryStorage()
const upload=multer({storage:storage})

//login
routes.post("/user/login",userController.login)

// Token checker
routes.use(require("../middleware/tokenChecker"))

// Employee Model
routes.post("/employee/add",employeeModel.add)
routes.post("/employee/all",employeeModel.getAll)
routes.post("/employee/single",employeeModel.getSingle)
routes.post("/employee/update",employeeModel.update)
routes.post("/employee/delete",employeeModel.delEmployee)
routes.post("/employee/changeStatus",employeeModel.changeStatus)

// User Model
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

// Procurement
routes.post("/procure/add",procureController.add)
routes.post("/procure/all",procureController.getAll)
routes.post("/procure/single",procureController.getSingle)
routes.post("/procure/update",procureController.update)
routes.post("/procure/delete",procureController.delprocure)
routes.post("/procure/changeStaus",procureController.changeStatus)

// Zone
routes.post("/zone/add",zoneController.add)
routes.post("/zone/all",zoneController.getAll)
routes.post("/zone/single",zoneController.getSingle)
routes.post("/zone/update",zoneController.update)
routes.post("/zone/delete",zoneController.delZone)
routes.post("/zone/changeStaus",zoneController.changeStatus)

// City
routes.post("/city/add",cityController.add)
routes.post("/city/all",cityController.getAll)
routes.post("/city/single",cityController.getSingle)
routes.post("/city/update",cityController.update)
routes.post("/city/delete",cityController.delCity)
routes.post("/city/changeStaus",cityController.changeStatus)

// Store Category
routes.post("/storeCategory/add",storeCategoryController.add)
routes.post("/storeCategory/all",storeCategoryController.getAll)
routes.post("/storeCategory/single",storeCategoryController.getSingle)
routes.post("/storeCategory/update",storeCategoryController.update)
routes.post("/storeCategory/delete",storeCategoryController.delStoreCategory)
routes.post("/storeCategory/changeStaus",storeCategoryController.changeStatus)

// Store 
routes.post("/store/add",storeController.add)
routes.post("/store/all",storeController.getAll)
routes.post("/store/single",storeController.getSingle)
routes.post("/store/update",storeController.update)
routes.post("/store/delete",storeController.delStore)
routes.post("/store/changeStaus",storeController.changeStatus)

// Expense 
routes.post("/expense/add",expenseController.add)
routes.post("/expense/all",expenseController.getAll)
routes.post("/expense/single",expenseController.getSingle)
routes.post("/expense/update",expenseController.update)
routes.post("/expense/delete",expenseController.delExpense)
routes.post("/expense/changeStaus",expenseController.changeStatus)

module.exports=routes