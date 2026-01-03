const routes=require("express").Router()

const employeeModel = require("../apis/Employee/employeeController")
const userController=require("../apis/User/userController")

routes.post("/user/add",employeeModel.add)
routes.post("/user/login",userController.login)
routes.post("/user/getAll",userController.getAll)
routes.post("/user/getSingle",userController.getSingle)

module.exports=routes