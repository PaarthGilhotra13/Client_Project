import { BrowserRouter, Route, Routes } from "react-router-dom"
import AdminMaster from "./layout/Admin Layout/AdminMaster"
import Master from "./layout/Employee Layout/Master"
// import AddCategory from "./Components/Admin/Department/AddDepartment"
import Login from "./Components/Login"
// import ManageCategory from "./Components/Admin/Department/ManageDepartment"
import NotFoundPage from "./Components/NotFoundPage"
import AddEmployee from "./Components/Admin/employee/AddEmployee"
import ManageEmployee from "./Components/Admin/employee/ManageEmployee"
import EditEmployee from "./Components/Admin/employee/EditEmployee"
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
import ViewAnnouncement from "./Components/Employee/Announcement/ViewAnnouncement"
import BlockedEmployee from "./Components/Admin/employee/BlockedEmployee"

import ViewRequest from "./Components/Admin/Complaint/ViewRequest";
import HoldComplaint from "./Components/Admin/Complaint/HoldComplaint";
import ApprovedComplaint from "./Components/Admin/Complaint/ApprovedComplaint";
import DeclinedComplaint from "./Components/Admin/Complaint/DeclinedComplaint";
import AddRequest from "./Components/Admin/Complaint/AddRequest";
import AddZone from "./Components/Admin/Zone/AddZone"
import ManageZone from "./Components/Admin/Zone/ManageZone"
import EditZone from "./Components/Admin/Zone/EditZone"
import AddCity from "./Components/Admin/City/AddCity"
import ManageCity from "./Components/Admin/City/ManageCity"
import EditCity from "./Components/Admin/City/EditCity"
import AddStoreCategory from "./Components/Admin/Store Category/AddStoreCategory"
import ManageStoreCategory from "./Components/Admin/Store Category/ManageStoreCategory"
import EditStoreCategory from "./Components/Admin/Store Category/EditStoreCategory"
import ManageStore from "./Components/Admin/Store/ManageStore"
import AddStore from "./Components/Admin/Store/AddStore"
import EditStore from "./Components/Admin/Store/EditStore"


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/admin" element={<AdminMaster />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/addEmployee" element={<AddEmployee />} />
            <Route path="/admin/manageEmployee" element={<ManageEmployee />} />
            <Route path="/admin/blockedEmployee" element={<BlockedEmployee />} />
            <Route path="/admin/editEmployee/:id" element={<EditEmployee />} />

            {/* Zone */}
            <Route path="/admin/addZone" element={<AddZone />} />
            <Route path="/admin/manageZone" element={<ManageZone />} />
            <Route path="/admin/editZone/:id" element={<EditZone />} />

            {/* City */}
            <Route path="/admin/addCity" element={<AddCity />} />
            <Route path="/admin/manageCity" element={<ManageCity />} />
            <Route path="/admin/editCity/:id" element={<EditCity/>} />

            {/* Store Category */}
            <Route path="/admin/addStoreCategory" element={<AddStoreCategory />} />
            <Route path="/admin/manageStoreCategory" element={<ManageStoreCategory />} />
            <Route path="/admin/editStoreCategory/:id" element={<EditStoreCategory/>} />

            {/* Store */}
            <Route path="/admin/addStore" element={<AddStore />} />
            <Route path="/admin/manageStore" element={<ManageStore />} />
            <Route path="/admin/editStore/:id" element={<EditStore/>} />

            {/* <Route path="/admin/addTask" element={<AddTask />} />
            <Route path="/admin/manageTask" element={<ManageTask />} />
            <Route path="/admin/viewProgress" element={<ViewProgress />} />
            <Route path="/admin/viewSubmitTask/:id" element={<ViewSubmitTask />} />
            <Route path="/admin/editTask/:id" element={<EditTask />} />
            <Route path="/admin/addCoins" element={<AddCoin />} />
            <Route path="/admin/manageCoins" element={<ManageCoins />} />
            <Route path="/admin/editCoins/:id" element={<EditCoin />} />
            <Route path="/admin/myProfile" element={<AdminProfile />} /> */}

            {/* Complaint Routes */}
            <Route path="/admin/viewRequest" element={<ViewRequest />} />
            <Route path="/admin/holdComplaint" element={<HoldComplaint />} />
            <Route path="/admin/approvedComplaint" element={<ApprovedComplaint />} />
            <Route path="/admin/declinedComplaint" element={<DeclinedComplaint />} />

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



            <Route path="/employee/addrequest" element={<AddRequest />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
