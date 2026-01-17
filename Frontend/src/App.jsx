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
import AdminDashboard from "./Components/Admin/AdminDashboard"
import EmployeeDashboard from "./Components/Employee/EmployeeDashboard"
import BlockedEmployee from "./Components/Admin/employee/BlockedEmployee"
import ViewRequest from "./Components/Admin/Complaint/ViewRequest";
import HoldComplaint from "./Components/Admin/Complaint/HoldComplaint";
import ApprovedComplaint from "./Components/Admin/Complaint/ApprovedComplaint";
import DeclinedComplaint from "./Components/Admin/Complaint/DeclinedComplaint";
import AddZone from "./Components/Admin/Zone/AddZone"
import ManageZone from "./Components/Admin/Zone/ManageZone"
import BlockedZone from "./Components/Admin/Zone/BlockedZone"
import EditZone from "./Components/Admin/Zone/EditZone"
import AddCity from "./Components/Admin/City/AddCity"
import ManageCity from "./Components/Admin/City/ManageCity"
import BlockedCity from "./Components/Admin/City/BlockedCity"
import AddStoreCategory from "./Components/Admin/Store Category/AddStoreCategory"
import ManageStoreCategory from "./Components/Admin/Store Category/ManageStoreCategory"
import BlockedStoreCategory from "./Components/Admin/Store Category/BlockedStoreCategory"
import EditStoreCategory from "./Components/Admin/Store Category/EditStoreCategory"
import ManageStore from "./Components/Admin/Store/ManageStore"
import AddStore from "./Components/Admin/Store/AddStore"
import EditStore from "./Components/Admin/Store/EditStore"
import Redirect from "./layout/Redirect"
import FmMaster from "./layout/FM/FmMaster"
import AddExpenseHead from "./Components/Admin/Expense Head/AddExpenseHead"
import ManageExpenseHead from "./Components/Admin/Expense Head/ManageExpenseHead"
import EditExpenseHead from "./Components/Admin/Expense Head/EditExpenseHead"
import BlockedExpenseHead from "./Components/Admin/Expense Head/BlockedExpenseHead"
import ClmMaster from "./layout/CLM/ClmMaster"
import AddApprovalPolicy from "./Components/Admin/Approval Policy/AddApprovalPolicy"
import ManageApprovalPolicy from "./Components/Admin/Approval Policy/ManageApprovalPolicy"
import EditApprovalPolicy from "./Components/Admin/Approval Policy/EditApprovalPolicy"
import BlockedAppovalPolicy from "./Components/Admin/Approval Policy/BlockedApprovalPolicy"
import AddState from "./Components/Admin/State/AddState"
import ManageState from "./Components/Admin/State/ManageState"
import BlockedState from "./Components/Admin/State/BlockedState"
import EditState from "./Components/Admin/State/EditState"
import BlockedStore from "./Components/Admin/Store/BlockedStore"
import AddExpenses from "./Components/FM/Expenses/AddExpenses"


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/redirect" element={<Redirect/>}/>
          <Route path="/admin" element={<AdminMaster />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/addEmployee" element={<AddEmployee />} />
            <Route path="/admin/manageEmployee" element={<ManageEmployee />} />
            <Route path="/admin/blockedEmployee" element={<BlockedEmployee />} />
            <Route path="/admin/editEmployee/:id" element={<EditEmployee />} />

            {/* Zone */}
            <Route path="/admin/addZone" element={<AddZone />} />
            <Route path="/admin/manageZone" element={<ManageZone />} />
            <Route path="/admin/blockedZone" element={<BlockedZone />} />
            <Route path="/admin/editZone/:id" element={<EditZone />} />

            {/* State */}
            <Route path="/admin/addState" element={<AddState />} />
            <Route path="/admin/manageState" element={<ManageState />} />
            <Route path="/admin/blockedState" element={<BlockedState />} />
            <Route path="/admin/editState/:id" element={<EditState />} />

            {/* City */}
            <Route path="/admin/addCity" element={<AddCity />} />
            <Route path="/admin/manageCity" element={<ManageCity />} />
            <Route path="/admin/blockedCity" element={<BlockedCity />} />

            {/* Store Category */}
            <Route path="/admin/addStoreCategory" element={<AddStoreCategory />} />
            <Route path="/admin/manageStoreCategory" element={<ManageStoreCategory />} />
            <Route path="/admin/blockedStoreCategory" element={<BlockedStoreCategory />} />
            <Route path="/admin/editStoreCategory/:id" element={<EditStoreCategory/>} />

            {/* Store */}
            <Route path="/admin/addStore" element={<AddStore />} />
            <Route path="/admin/manageStore" element={<ManageStore />} />
            <Route path="/admin/blockedStore" element={<BlockedStore />} />
            <Route path="/admin/editStore/:id" element={<EditStore/>} />

            {/* Expense Head */}
            <Route path="/admin/addExpenseHead" element={<AddExpenseHead />} />
            <Route path="/admin/manageExpenseHead" element={<ManageExpenseHead />} />
            <Route path="/admin/blockedExpenseHead" element={<BlockedExpenseHead />} />
            <Route path="/admin/editExpenseHead/:id" element={<EditExpenseHead/>} />

            {/* Approval Policy */}
            <Route path="/admin/addApprovalPolicy" element={<AddApprovalPolicy />} />
            <Route path="/admin/manageApprovalPolicy" element={<ManageApprovalPolicy />} />
            <Route path="/admin/editApprovalPolicy/:id" element={<EditApprovalPolicy/>} />
            <Route path="/admin/blockedApprovalPolicy" element={<BlockedAppovalPolicy/>} />

            {/* Complaint Routes */}
            <Route path="/admin/viewRequest" element={<ViewRequest />} />
            <Route path="/admin/holdComplaint" element={<HoldComplaint />} />
            <Route path="/admin/approvedComplaint" element={<ApprovedComplaint />} />
            <Route path="/admin/declinedComplaint" element={<DeclinedComplaint />} />

          </Route>

          <Route path="/fm" element={<FmMaster />}>
            <Route path="/fm" element={<EmployeeDashboard/>}/>
            <Route path="/fm/addExpenses" element={<AddExpenses />} />
            <Route path="/fm/myExpenses" element={<AddExpenses />} />
          </Route>
          <Route path="/clm" element={<ClmMaster/>}>

          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
