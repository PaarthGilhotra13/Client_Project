// import { ScaleLoader } from "react-spinners";
// import PageTitle from "../PageTitle";
// import { useEffect, useState } from "react";
// import ApiServices from "../../ApiServices";
// import { Link } from "react-router-dom";

// export default function AdminDashboard() {
//   const [load, setLoad] = useState(false);

//   const [data, setData] = useState({
//     // REQUEST COUNTS
//     totalRequests: 0,
//     pendingRequests: 0,
//     approvedRequests: 0,
//     rejectedRequests: 0,
//     inProcessRequests: 0,
//     todayRequests: 0,

//     // AMOUNTS
//     totalAmount: 0,
//     pendingAmount: 0,
//     approvedAmount: 0,
//     rejectedAmount: 0,
//     holdAmount: 0,

//     // SYSTEM & ROLE
//     totalUsers: 0,
//     totalFacilityManagers: 0,
//     totalCLMs: 0,
//     totalZonalHeads: 0,
//     totalBusinessFinance: 0,
//     totalProcurement: 0,
//     totalPrPo: 0,
//     totalZonalCommercial: 0,
//     totalMissingBridgeUsers: 0,
//   });

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       setLoad(true);
//       try {
//         /** -------- EXPENSE DATA -------- */
//         const expenseRes = await ApiServices.GetAllExpense();
//         const expenses = expenseRes?.data?.data || [];

//         const todayDate = new Date().toISOString().split("T")[0];

//         const pending = expenses.filter(e => e.currentStatus === "Pending");
//         const approved = expenses.filter(e => e.currentStatus === "Approved");
//         const rejected = expenses.filter(e => e.currentStatus === "Rejected");
//         const hold = expenses.filter(e => e.currentStatus === "Hold");

//         const sum = arr =>
//           arr.reduce((t, e) => t + Number(e.amount || 0), 0);

//         /** -------- ROLE DATA (AS IT WAS) -------- */
//         const roleRes = await ApiServices.Dashboard();
//         const roleData = roleRes?.data?.data || {};

//         setData({
//           totalRequests: expenses.length,
//           pendingRequests: pending.length,
//           approvedRequests: approved.length,
//           rejectedRequests: rejected.length,
//           inProcessRequests: hold.length,
//           todayRequests: expenses.filter(
//             e => e.createdAt?.split("T")[0] === todayDate
//           ).length,

//           totalAmount: sum(expenses),
//           pendingAmount: sum(pending),
//           approvedAmount: sum(approved),
//           rejectedAmount: sum(rejected),
//           holdAmount: sum(hold),

//           totalUsers: roleData.totalUsers ?? 0,
//           totalFacilityManagers: roleData.totalFacilityManagers ?? 0,
//           totalCLMs: roleData.totalCLMs ?? 0,
//           totalZonalHeads: roleData.totalZonalHeads ?? 0,
//           totalBusinessFinance: roleData.totalBusinessFinance ?? 0,
//           totalProcurement: roleData.totalProcurement ?? 0,
//           totalPrPo: roleData.totalPrPo ?? 0,
//           totalZonalCommercial: roleData.totalZonalCommercial ?? 0,
//           totalMissingBridgeUsers: roleData.totalMissingBridgeUsers ?? 0,
//         });
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoad(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   /** -------- REQUEST CARDS -------- */
//   const requestCards = [
//     { title: "Total Requests / Complaints", value: data.totalRequests, color: "#4B49AC", icon: "bi-collection", link: "/admin/allExpenses" },
//     { title: "Pending Requests", value: data.pendingRequests, color: "#FFC107", icon: "bi-hourglass-split", link: "/admin/allPendingExpenses" },
//     { title: "Approved Requests", value: data.approvedRequests, color: "#20C997", icon: "bi-check-circle", link: "/admin/allApprovedExpenses" },
//     { title: "Rejected Requests", value: data.rejectedRequests, color: "#FF6B6B", icon: "bi-x-circle", link: "/admin/allRejectedExpenses" },
//     { title: "In-Process / Under Review", value: data.inProcessRequests, color: "#4D96FF", icon: "bi-arrow-repeat", link: "/admin/allHoldExpenses" },
//     { title: "Today’s New Requests", value: data.todayRequests, color: "#00B8D9", icon: "bi-calendar-event", link: "/admin/todayRequests" },
//   ];

//   /** -------- AMOUNT CARDS -------- */
//   const amountCards = [
//     { title: "Total Amount", value: data.totalAmount, color: "#6F42C1", link: "/admin/allExpenses" },
//     { title: "Pending Amount", value: data.pendingAmount, color: "#FFC107", link: "/admin/allPendingExpenses" },
//     { title: "Approved Amount", value: data.approvedAmount, color: "#20C997", link: "/admin/allApprovedExpenses" },
//     { title: "Rejected Amount", value: data.rejectedAmount, color: "#FF6B6B", link: "/admin/allRejectedExpenses" },
//     { title: "Hold Amount", value: data.holdAmount, color: "#4D96FF", link: "/admin/allHoldExpenses" },
//   ];

//   /** -------- SYSTEM & ROLE CARDS -------- */
//   const roleCards = [
//     { title: "Total Users", value: data.totalUsers, color: "#6F42C1", icon: "bi-people", link: "/admin/manageEmployee" },
//     { title: "Facility Managers", value: data.totalFacilityManagers, color: "#198754", icon: "bi-person-badge", link: "/admin/FMs" },
//     { title: "CLMs", value: data.totalCLMs, color: "#FD7E14", icon: "bi-building", link: "/admin/CLMs" },
//     { title: "Zonal Heads", value: data.totalZonalHeads, color: "#0D6EFD", icon: "bi-diagram-3", link: "/admin/zonalHead" },
//     { title: "Business Finance", value: data.totalBusinessFinance, color: "#6610f2", icon: "bi-currency-rupee", link: "/admin/businessFinance" },
//     { title: "Procurement", value: data.totalProcurement, color: "#0dcaf0", icon: "bi-cart-check", link: "/admin/procurement" },
//     { title: "PR / PO", value: data.totalPrPo, color: "#adb5bd", icon: "bi-receipt", link: "/admin/prpo" },
//     { title: "Zonal Commercial", value: data.totalZonalCommercial, color: "#20c997", icon: "bi-briefcase", link: "/admin/zonalCommercial" },
//     { title: "Missing Bridge (Designation)", value: data.totalMissingBridgeUsers, color: "#dc3545", icon: "bi-exclamation-octagon", link: "/admin/missingBridge" },
//   ];

//   return (
//     <main id="main" className="main">
//       <PageTitle child="Dashboard" />

//       {load && (
//         <div className="text-center mt-5">
//           <ScaleLoader color="#6776f4" />
//         </div>
//       )}

//       {!load && (
//         <>
//           {/* REQUEST OVERVIEW */}
//           <div className="row">
//             {requestCards.map((c, i) => (
//               <div key={i} className="col-xxl-4 col-md-6 mb-4">
//                 <Link to={c.link} style={{ textDecoration: "none", color: "inherit" }}>
//                   <div className="card info-card h-100">
//                     <div className="card-body">
//                       <h5 className="card-title">{c.title}</h5>
//                       <div className="d-flex align-items-center">
//                         <div
//                           className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
//                           style={{ width: 50, height: 50, background: c.color }}
//                         >
//                           <i className={`bi ${c.icon} fs-4`} />
//                         </div>
//                         <h6 className="fw-bold">{c.value}</h6>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>

//           {/* AMOUNT OVERVIEW */}
//           <h4 className="mt-4 mb-3 fw-bold" style={{ color: "#012970" }}>
//             Expense Amount Overview
//           </h4>

//           <div className="row">
//             {amountCards.map((c, i) => (
//               <div key={i} className="col-xxl-3 col-md-6 mb-4">
//                 <Link to={c.link} style={{ textDecoration: "none", color: "inherit" }}>
//                   <div className="card info-card h-100">
//                     <div className="card-body">
//                       <h5 className="card-title">{c.title}</h5>
//                       <h4 className="fw-bold" style={{ color: c.color }}>
//                         ₹ {c.value.toLocaleString()}
//                       </h4>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>

//           {/* SYSTEM & ROLE OVERVIEW */}
//           <h4 className="mt-4 mb-3 fw-bold" style={{ color: "#012970" }}>
//             System & Role Overview
//           </h4>

//           <div className="row">
//             {roleCards.map((c, i) => (
//               <div key={i} className="col-xxl-3 col-md-6 mb-4">
//                 <Link to={c.link} style={{ textDecoration: "none", color: "inherit" }}>
//                   <div className="card info-card h-100">
//                     <div className="card-body">
//                       <h5 className="card-title">{c.title}</h5>
//                       <div className="d-flex align-items-center">
//                         <div
//                           className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
//                           style={{ width: 50, height: 50, background: c.color }}
//                         >
//                           <i className={`bi ${c.icon} fs-4`} />
//                         </div>
//                         <h6 className="fw-bold">{c.value}</h6>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </main>
//   );
// }

import { ScaleLoader } from "react-spinners";
import PageTitle from "../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [load, setLoad] = useState(false);

  const [data, setData] = useState({
    // REQUEST COUNTS
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    inProcessRequests: 0,
    todayRequests: 0,

    // AMOUNTS (sirf cards ke liye)
    totalAmount: 0,
    pendingAmount: 0,
    approvedAmount: 0,
    rejectedAmount: 0,
    holdAmount: 0,
    todayAmount: 0,

    // SYSTEM & ROLE
    totalUsers: 0,
    totalFacilityManagers: 0,
    totalCLMs: 0,
    totalZonalHeads: 0,
    totalBusinessFinance: 0,
    totalProcurement: 0,
    totalPrPo: 0,
    totalZonalCommercial: 0,
    totalMissingBridgeUsers: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoad(true);
    try {
      /* ================= EXPENSE DATA ================= */
      const expenseRes = await ApiServices.GetAllExpense();
      const expenses = expenseRes?.data?.data || [];

      const todayDate = new Date().toISOString().split("T")[0];

      const pending = expenses.filter(e => e.currentStatus === "Pending");
      const approved = expenses.filter(e => e.currentStatus === "Approved");
      const rejected = expenses.filter(e => e.currentStatus === "Rejected");
      const hold = expenses.filter(e => e.currentStatus === "Hold");

      const todayExpenses = expenses.filter(
        e => e.createdAt?.split("T")[0] === todayDate
      );

      const sumAmount = (arr) =>
        arr.reduce((sum, e) => sum + Number(e.amount || 0), 0);

      const pendingAmount = sumAmount(pending);
      const approvedAmount = sumAmount(approved);
      const rejectedAmount = sumAmount(rejected);
      const holdAmount = sumAmount(hold);
      const todayAmount = sumAmount(todayExpenses);

      /* ================= ROLE DATA ================= */
      const roleRes = await ApiServices.Dashboard();
      const roleData = roleRes?.data?.data || {};

      setData({
        // COUNTS
        totalRequests: expenses.length,
        pendingRequests: pending.length,
        approvedRequests: approved.length,
        rejectedRequests: rejected.length,
        inProcessRequests: hold.length,
        todayRequests: todayExpenses.length,

        // AMOUNTS
        totalAmount: pendingAmount + approvedAmount + rejectedAmount + holdAmount,
        pendingAmount,
        approvedAmount,
        rejectedAmount,
        holdAmount,
        todayAmount,

        // SYSTEM & ROLE
        totalUsers: roleData.totalUsers ?? 0,
        totalFacilityManagers: roleData.totalFacilityManagers ?? 0,
        totalCLMs: roleData.totalCLMs ?? 0,
        totalZonalHeads: roleData.totalZonalHeads ?? 0,
        totalBusinessFinance: roleData.totalBusinessFinance ?? 0,
        totalProcurement: roleData.totalProcurement ?? 0,
        totalPrPo: roleData.totalPrPo ?? 0,
        totalZonalCommercial: roleData.totalZonalCommercial ?? 0,
        totalMissingBridgeUsers: roleData.totalMissingBridgeUsers ?? 0,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoad(false);
    }
  };

  /* ================= REQUEST CARDS ================= */
  const requestCards = [
    {
      title: "Total Requests / Complaints",
      count: data.totalRequests,
      amount: data.totalAmount,
      color: "#4B49AC",
      icon: "bi-collection",
      link: "/admin/allExpenses",
    },
    {
      title: "Pending Requests",
      count: data.pendingRequests,
      amount: data.pendingAmount,
      color: "#FFC107",
      icon: "bi-hourglass-split",
      link: "/admin/allPendingExpenses",
    },
    {
      title: "Approved Requests",
      count: data.approvedRequests,
      amount: data.approvedAmount,
      color: "#20C997",
      icon: "bi-check-circle",
      link: "/admin/allApprovedExpenses",
    },
    {
      title: "Rejected Requests",
      count: data.rejectedRequests,
      amount: data.rejectedAmount,
      color: "#FF6B6B",
      icon: "bi-x-circle",
      link: "/admin/allRejectedExpenses",
    },
    {
      title: "In-Process / Under Review",
      count: data.inProcessRequests,
      amount: data.holdAmount,
      color: "#4D96FF",
      icon: "bi-arrow-repeat",
      link: "/admin/allHoldExpenses",
    },
    {
      title: "Today’s New Requests",
      count: data.todayRequests,
      amount: data.todayAmount,
      color: "#00B8D9",
      icon: "bi-calendar-event",
      link: "/admin/todayRequests",
    },
  ];

  /* ================= SYSTEM & ROLE ================= */
  const roleCards = [
    { title: "Total Users", value: data.totalUsers, color: "#6F42C1", icon: "bi-people", link: "/admin/manageEmployee" },
    { title: "Facility Managers", value: data.totalFacilityManagers, color: "#198754", icon: "bi-person-badge", link: "/admin/FMs" },
    { title: "CLMs", value: data.totalCLMs, color: "#FD7E14", icon: "bi-building", link: "/admin/CLMs" },
    { title: "Zonal Heads", value: data.totalZonalHeads, color: "#0D6EFD", icon: "bi-diagram-3", link: "/admin/zonalHead" },
    { title: "Business Finance", value: data.totalBusinessFinance, color: "#6610f2", icon: "bi-currency-rupee", link: "/admin/businessFinance" },
    { title: "Procurement", value: data.totalProcurement, color: "#0dcaf0", icon: "bi-cart-check", link: "/admin/procurement" },
    { title: "PR / PO", value: data.totalPrPo, color: "#adb5bd", icon: "bi-receipt", link: "/admin/prpo" },
    { title: "Zonal Commercial", value: data.totalZonalCommercial, color: "#20c997", icon: "bi-briefcase", link: "/admin/zonalCommercial" },
    { title: "Missing Bridge (Designation)", value: data.totalMissingBridgeUsers, color: "#dc3545", icon: "bi-exclamation-octagon", link: "/admin/missingBridge" },
  ];

  return (
    <main id="main" className="main">
      <PageTitle child="Dashboard" />

      {load && (
        <div className="text-center mt-5">
          <ScaleLoader color="#6776f4" />
        </div>
      )}

      {!load && (
        <>
          {/* REQUEST OVERVIEW */}
          <div className="row">
            {requestCards.map((c, i) => (
              <div key={i} className="col-xxl-4 col-md-6 mb-4">
                <Link to={c.link} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card info-card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{c.title}</h5>
                      <div className="d-flex align-items-center">
                        <div
                          className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: 50, height: 50, background: c.color }}
                        >
                          <i className={`bi ${c.icon} fs-4`} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{c.count}</h6>
                          <small className="text-muted">
                            ₹ {c.amount.toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* SYSTEM & ROLE OVERVIEW */}
          <h4 className="mt-4 mb-3 fw-bold" style={{ color: "#012970" }}>
            System & Role Overview
          </h4>

          <div className="row">
            {roleCards.map((c, i) => (
              <div key={i} className="col-xxl-3 col-md-6 mb-4">
                <Link to={c.link} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card info-card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{c.title}</h5>
                      <div className="d-flex align-items-center">
                        <div
                          className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: 50, height: 50, background: c.color }}
                        >
                          <i className={`bi ${c.icon} fs-4`} />
                        </div>
                        <h6 className="fw-bold">{c.value}</h6>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

