import { BrowserRouter, Route, Routes } from "react-router-dom"
import AdminMaster from "./layout/Admin Layout/AdminMaster"
import Master from "./layout/Employee Layout/Master"
import AddCategory from "./Components/Admin/Department/AddDepartment"
import Login from "./Components/Login"
import ManageCategory from "./Components/Admin/Department/ManageDepartment"
import NotFoundPage from "./Components/NotFoundPage"
import EditCategory from "./Components/Admin/Department/EditDepartment"
import AddSubCategory from "./Components/Admin/Technology/AddTechnology"
import ManageSubCategory from "./Components/Admin/Technology/ManageTechnology"
import EditSubCategory from "./Components/Admin/Technology/EditTechnology"
import { Bounce, ToastContainer } from "react-toastify"
import AddProject from "./Components/Admin/project/AddProject"
import ManageProject from "./Components/Admin/project/ManageProject"
import EditProject from "./Components/Admin/project/EditProject"
import AddProjectTeam from "./Components/Admin/project Team/AddProjectTeam"
import ManageProjectTeam from "./Components/Admin/project Team/ManageProjectTeam"
import AddEmployee from "./Components/Admin/employee/AddEmployee"
import ManageEmployee from "./Components/Admin/employee/ManageEmployee"
import EditEmployee from "./Components/Admin/employee/EditEmployee"
import AddTask from "./Components/Admin/task/AddTask"
import ManageTask from "./Components/Admin/task/ManageTask"
import EditTask from "./Components/Admin/task/EditTask"
import AddCoin from "./Components/Admin/coin/AddCoin"
import ManageCoins from "./Components/Admin/coin/ManageCoin"
import EditCoin from "./Components/Admin/coin/EditCoin"
import ViewProgress from "./Components/Admin/task/ViewProgress"
import MyProjects from "./Components/Employee/My Projects/MyProjects"
import ViewProjectDetails from "./Components/Employee/My Projects/ViewProjectDetails"
import MyTasks from "./Components/Employee/My Tasks/MyTasks"
import ViewTaskDetails from "./Components/Employee/My Tasks/ViewTaskDetails"
import ManageTasks from "./Components/Employee/My Tasks/ManageTasks"
import EditSubmitTask from "./Components/Employee/My Tasks/EditSubmitTask"
import DailyProgress from "./Components/Employee/Progress/DailyProgress"
import MyProfile from "./Components/Employee/Profile/MyProfile"
import AdminDashboard from "./Components/Admin/AdminDashboard"
import EmployeeDashboard from "./Components/Employee/EmployeeDashboard"
import EditProjectTeam from "./Components/Admin/project Team/EditProjectTeam"
import ViewSubmitTask from "./Components/Admin/task/ViewSubmitTask"
import AddDepartment from "./Components/Admin/Department/AddDepartment"
import ManageDepartment from "./Components/Admin/Department/ManageDepartment"
import EditDepartment from "./Components/Admin/Department/EditDepartment"
import AddTechnology from "./Components/Admin/Technology/AddTechnology"
import ManageTechnology from "./Components/Admin/Technology/ManageTechnology"
import EditTechnology from "./Components/Admin/Technology/EditTechnology"
import AdminProfile from "./Components/Admin/AdminProfile/AdminProfile"
import ManageAnnouncement from "./Components/Admin/Announcement/ManageAnnouncement"
import AddAnnouncement from "./Components/Admin/Announcement/AddAnnouncement"
import EditAnnouncement from "./Components/Admin/Announcement/EditAnnouncement"
import ViewAnnouncement from "./Components/Employee/Announcement/ViewAnnouncement"
import BlockedEmployee from "./Components/Admin/employee/BlockedEmployee"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/admin" element={<AdminMaster />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/addAnnouncement" element={<AddAnnouncement/>}/>
            <Route path="/admin/announcement" element={<ManageAnnouncement/>}/>
            <Route path="/admin/editAnnouncement/:id" element={<EditAnnouncement/>}/>
            <Route path="/admin/addDepartment" element={<AddDepartment />} />
            <Route path="/admin/manageDepartment" element={<ManageDepartment />} />
            <Route path="/admin/editDepartment/:id" element={<EditDepartment />} />
            <Route path="/admin/addTechnology" element={<AddTechnology />} />
            <Route path="/admin/manageTechnology" element={<ManageTechnology />} />
            <Route path="/admin/editTechnology/:id" element={<EditTechnology />} />
            <Route path="/admin/addProject" element={<AddProject />} />
            <Route path="/admin/manageProject" element={<ManageProject />} />
            <Route path="/admin/editProject/:id" element={<EditProject />} />
            <Route path="/admin/addProjectTeam" element={<AddProjectTeam />} />
            <Route path="/admin/manageProjectTeam" element={<ManageProjectTeam />} />
            <Route path="/admin/editProjectTeam/:id" element={<EditProjectTeam />} />
            <Route path="/admin/addEmployee" element={<AddEmployee />} />
            <Route path="/admin/manageEmployee" element={<ManageEmployee />} />
            <Route path="/admin/blockedEmployee" element={<BlockedEmployee />} />
            <Route path="/admin/editEmployee/:id" element={<EditEmployee />} />
            <Route path="/admin/addTask" element={<AddTask />} />
            <Route path="/admin/manageTask" element={<ManageTask />} />
            <Route path="/admin/viewProgress" element={<ViewProgress />} />
            <Route path="/admin/viewSubmitTask/:id" element={<ViewSubmitTask />} />
            <Route path="/admin/editTask/:id" element={<EditTask />} />
            <Route path="/admin/addCoins" element={<AddCoin />} />
            <Route path="/admin/manageCoins" element={<ManageCoins />} />
            <Route path="/admin/editCoins/:id" element={<EditCoin />} />
            <Route path="/admin/myProfile" element={<AdminProfile />} />
          </Route>

          <Route path="/employee" element={<Master />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/viewAnnouncement" element={<ViewAnnouncement />} />
            <Route path="/employee/myProjects" element={<MyProjects />} />
            <Route path="/employee/viewProjectDetails/:id" element={<ViewProjectDetails />} />
            <Route path="/employee/myTasks" element={<MyTasks />} />
            <Route path="/employee/viewTaskDetails/:id" element={<ViewTaskDetails />} />
            <Route path="/employee/manageTasks" element={<ManageTasks />} />
            <Route path="/employee/editSubmitTask/:id" element={<EditSubmitTask />} />
            <Route path="/employee/dailyProgress" element={<DailyProgress />} />
            <Route path="/employee/myProfile" element={<MyProfile />} />

          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
