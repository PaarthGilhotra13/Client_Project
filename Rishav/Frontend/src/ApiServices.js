import axios from "axios";
var BaseURL = "http://localhost:9610"

class ApiServices {
   getToken() {
      let obj = { authorization: sessionStorage.getItem("token") }
      return obj
   }

   // Category
   AddCategory(data) {
      return axios.post(BaseURL + "/apis/category/add", data, { headers: this.getToken() })
   }
   GetAllCategory(data) {
      return axios.post(BaseURL + "/apis/category/getAll", data, { headers: this.getToken() })
   }
   GetSingleCategory(data) {
      return axios.post(BaseURL + "/apis/category/getSingle", data, { headers: this.getToken() })
   }
   UpdateCategory(data) {
      return axios.post(BaseURL + "/apis/category/update", data, { headers: this.getToken() })
   }
   DeleteCategory(data) {
      return axios.post(BaseURL + "/apis/category/delete", data, { headers: this.getToken() })
   }
   ChangeStatusCategory(data) {
      return axios.post(BaseURL + "/apis/category/changeStatus", data, { headers: this.getToken() })
   }

   //SubCategory
   AddSubCategory(data) {
      return axios.post(BaseURL + "/apis/subCategory/add", data, { headers: this.getToken() })
   }
   GetAllSubCategory(data) {
      return axios.post(BaseURL + "/apis/subCategory/getAll", data, { headers: this.getToken() })
   }
   GetSingleSubCategory(data) {
      return axios.post(BaseURL + "/apis/subCategory/getSingle", data, { headers: this.getToken() })
   }
   UpdateSubCategory(data) {
      return axios.post(BaseURL + "/apis/subCategory/update", data, { headers: this.getToken() })
   }
   DeleteSubCategory(data) {
      return axios.post(BaseURL + "/apis/subCategory/delete", data, { headers: this.getToken() })
   }
   ChangeStatusSubCategory(data) {
      return axios.post(BaseURL + "/apis/subCategory/changeStatus", data, { headers: this.getToken() })
   }

   //Project
   AddProject(data) {
      return axios.post(BaseURL + "/apis/project/add", data, { headers: this.getToken() })
   }
   GetAllProject(data) {
      return axios.post(BaseURL + "/apis/project/getAll", data, { headers: this.getToken() })
   }
   GetSingleProject(data) {
      return axios.post(BaseURL + "/apis/project/getSingle", data, { headers: this.getToken() })
   }
   UpdateProject(data) {
      return axios.post(BaseURL + "/apis/project/update", data, { headers: this.getToken() })
   }
   DeleteProject(data) {
      return axios.post(BaseURL + "/apis/project/delete", data, { headers: this.getToken() })
   }
   ChangeStatusProject(data) {
      return axios.post(BaseURL + "/apis/project/changeStatus", data, { headers: this.getToken() })
   }

   //Project Team
   AddProjectTeam(data) {
      return axios.post(BaseURL + "/apis/projectTeam/add", data, { headers: this.getToken() })
   }
   GetAllProjectTeam(data) {
      return axios.post(BaseURL + "/apis/projectTeam/getAll", data, { headers: this.getToken() })
   }
   GetSingleProjectTeam(data) {
      return axios.post(BaseURL + "/apis/projectTeam/getSingle", data, { headers: this.getToken() })
   }
   UpdateProjectTeam(data) {
      return axios.post(BaseURL + "/apis/projectTeam/update", data, { headers: this.getToken() })
   }
   DeleteProjectTeam(data) {
      return axios.post(BaseURL + "/apis/projectTeam/delete", data, { headers: this.getToken() })
   }
   ChangeStatusProjectTeam(data) {
      return axios.post(BaseURL + "/apis/projectTeam/changeStatus", data, { headers: this.getToken() })
   }

   //Employee
   AddEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/add", data, { headers: this.getToken() })
   }
   GetAllEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/getAll", data, { headers: this.getToken() })
   }
   GetSingleEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/getSingle", data, { headers: this.getToken() })
   }
   UpdateEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/update", data, { headers: this.getToken() })
   }
   DeleteEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/delete", data, { headers: this.getToken() })
   }
   ChangeStatusEmployee(data) {
      return axios.post(BaseURL + "/apis/employee/changeStatus", data, { headers: this.getToken() })
   }

   //Submit
   AddSubmit(data) {
      return axios.post(BaseURL + "/apis/submit/add", data, { headers: this.getToken() })
   }
   GetAllSubmit(data) {
      return axios.post(BaseURL + "/apis/submit/getAll", data, { headers: this.getToken() })
   }
   GetSingleSubmit(data) {
      return axios.post(BaseURL + "/apis/submit/getSingle", data, { headers: this.getToken() })
   }
   UpdateSubmit(data) {
      return axios.post(BaseURL + "/apis/submit/update", data, { headers: this.getToken() })
   }
   DeleteSubmit(data) {
      return axios.post(BaseURL + "/apis/submit/delete", data, { headers: this.getToken() })
   }
   ChangeStatusSubmit(data) {
      return axios.post(BaseURL + "/apis/submit/changeStatus", data, { headers: this.getToken() })
   }

   //Coin
   AddCoin(data) {
      return axios.post(BaseURL + "/apis/coin/add", data, { headers: this.getToken() })
   }
   GetAllCoin(data) {
      return axios.post(BaseURL + "/apis/coin/getAll", data, { headers: this.getToken() })
   }
   GetSingleCoin(data) {
      return axios.post(BaseURL + "/apis/coin/getSingle", data, { headers: this.getToken() })
   }
   UpdateCoin(data) {
      return axios.post(BaseURL + "/apis/coin/update", data, { headers: this.getToken() })
   }
   DeleteCoin(data) {
      return axios.post(BaseURL + "/apis/coin/delete", data, { headers: this.getToken() })
   }
   ChangeStatusCoin(data) {
      return axios.post(BaseURL + "/apis/coin/changeStatus", data, { headers: this.getToken() })
   }

   //Task
   AddTask(data) {
      return axios.post(BaseURL + "/apis/task/add", data, { headers: this.getToken() })
   }
   GetAllTask(data) {
      return axios.post(BaseURL + "/apis/task/getAll", data, { headers: this.getToken() })
   }
   GetSingleTask(data) {
      return axios.post(BaseURL + "/apis/task/getSingle", data, { headers: this.getToken() })
   }
   UpdateTask(data) {
      return axios.post(BaseURL + "/apis/task/update", data, { headers: this.getToken() })
   }
   DeleteTask(data) {
      return axios.post(BaseURL + "/apis/task/delete", data, { headers: this.getToken() })
   }
   ChangeStatusTask(data) {
      return axios.post(BaseURL + "/apis/task/changeStatus", data, { headers: this.getToken() })
   }

   //Announcement
   AddAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/add", data, { headers: this.getToken() })
   }
   GetAllAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/getAll", data, { headers: this.getToken() })
   }
   GetSingleAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/getSingle", data, { headers: this.getToken() })
   }
   UpdateAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/update", data, { headers: this.getToken() })
   }
   DeleteAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/delete", data, { headers: this.getToken() })
   }
   ChangeStatusAnnouncement(data) {
      return axios.post(BaseURL + "/apis/Announcement/changeStatus", data, { headers: this.getToken() })
   }

   //user Login, ChangePassword
   Login(data) {
      return axios.post(BaseURL + "/apis/user/login", data)
   }
   GetAllUser(data) {
      return axios.post(BaseURL + "/apis/user/getAll", data, { headers: this.getToken() })
   }
   GetSingleUser(data) {
      return axios.post(BaseURL + "/apis/user/getSingle", data, { headers: this.getToken() })
   }
   ChangePassword(data) {
      return axios.post(BaseURL + "/apis/user/changePassword", data, { headers: this.getToken() })
   }

   //Dashboard
   Dashboard() {
      return axios.post(BaseURL + "/apis/dashboard", null, { headers: this.getToken() })
   }
}

export default new ApiServices;