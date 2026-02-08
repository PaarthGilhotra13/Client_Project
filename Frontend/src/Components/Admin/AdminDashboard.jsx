import { ScaleLoader } from "react-spinners";
import PageTitle from "../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [load, setLoad] = useState(false);
  const [data, setData] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    inProcessRequests: 0,
    todayRequests: 0,
    missingBridgeRequests: 0,

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
    setLoad(true);
    ApiServices.Dashboard()
      .then((res) => {
        const d = res?.data?.data || {};

        setData({
          totalRequests: d.totalRequests ?? 0,
          pendingRequests: d.pendingRequests ?? 0,
          approvedRequests: d.approvedRequests ?? 0,
          rejectedRequests: d.rejectedRequests ?? 0,
          inProcessRequests: d.inProcessRequests ?? 0,
          todayRequests: d.todayRequests ?? 0,
          missingBridgeRequests: d.missingBridgeRequests ?? 0,

          totalUsers: d.totalUsers ?? 0,
          totalFacilityManagers: d.totalFacilityManagers ?? 0,
          totalCLMs: d.totalCLMs ?? 0,
          totalZonalHeads: d.totalZonalHeads ?? 0,
          totalBusinessFinance: d.totalBusinessFinance ?? 0,
          totalProcurement: d.totalProcurement ?? 0,
          totalPrPo: d.totalPrPo ?? 0,
          totalZonalCommercial: d.totalZonalCommercial ?? 0,
          totalMissingBridgeUsers: d.totalMissingBridgeUsers ?? 0,
        });

        setLoad(false);
      })
      .catch(() => {
        setLoad(false);
      });
  }, []);

  const requestCards = [
    {
      title: "Total Requests / Complaints",
      value: data.totalRequests,
      color: "#4B49AC",
      icon: "bi-collection",
      link: "/admin/allPendingExpenses",
    },
    {
      title: "Pending Requests",
      value: data.pendingRequests,
      color: "#FFC107",
      icon: "bi-hourglass-split",
      link: "/admin/allPendingExpenses",
    },
    {
      title: "Approved Requests",
      value: data.approvedRequests,
      color: "#20C997",
      icon: "bi-check-circle",
      link: "/admin/allApprovedExpenses",
    },
    {
      title: "Rejected Requests",
      value: data.rejectedRequests,
      color: "#FF6B6B",
      icon: "bi-x-circle",
      link: "/admin/allRejectedExpenses",
    },
    {
      title: "In-Process / Under Review",
      value: data.inProcessRequests,
      color: "#4D96FF",
      icon: "bi-arrow-repeat",
      link: "/admin/allHoldExpenses",
    },
    {
      title: "Missing Bridge (3+ Days)",
      value: data.missingBridgeRequests,
      color: "#DC3545",
      icon: "bi-exclamation-triangle",
      link: "/admin/allPendingExpenses",
    },
    {
      title: "Today’s New Requests",
      value: data.todayRequests,
      color: "#00B8D9",
      icon: "bi-calendar-event",
      link: "/admin/allPendingExpenses",
    },
  ];

  const roleCards = [
    {
      title: "Total Users",
      value: data.totalUsers,
      color: "#6F42C1",
      icon: "bi-people",
      link: "/admin/manageEmployee",
    },
    {
      title: "Facility Managers",
      value: data.totalFacilityManagers,
      color: "#198754",
      icon: "bi-person-badge",
      link: "/admin/FMs/",
    },
    {
      title: "CLMs",
      value: data.totalCLMs,
      color: "#FD7E14",
      icon: "bi-building",
      link: "/admin/CLMs/",
    },
    {
      title: "Zonal Heads",
      value: data.totalZonalHeads,
      color: "#0D6EFD",
      icon: "bi-diagram-3",
      link: "/admin/zonalHead/",
    },
    {
      title: "Business Finance",
      value: data.totalBusinessFinance,
      color: "#6610f2",
      icon: "bi-currency-rupee",
      link: "/admin/businessFinance",
    },
    {
      title: "Procurement",
      value: data.totalProcurement,
      color: "#0dcaf0",
      icon: "bi-cart-check",
      link: "/admin/procurement",
    },
    {
      title: "PR / PO",
      value: data.totalPrPo,
      color: "#adb5bd",
      icon: "bi-receipt",
      link: "/admin/prpo",
    },
    {
      title: "Zonal Commercial",
      value: data.totalZonalCommercial,
      color: "#20c997",
      icon: "bi-briefcase",
      link: "/admin/zonalCommercial",
    },
    {
      title: "Missing Bridge (Designation)",
      value: data.totalMissingBridgeUsers,
      color: "#dc3545",
      icon: "bi-exclamation-octagon",
      link: "/admin/missingBridge",
    },
  ];

  return (
    <main id="main" className="main">
      <PageTitle child="Dashboard" />

      {load && (
        <div className="container-fluid text-center mt-5">
          <ScaleLoader color="#6776f4" />
        </div>
      )}

      {!load && (
        <>
          <div className="row">
            {requestCards.map((card, i) => (
              <div key={i} className="col-xxl-4 col-md-6 mb-4">
                <Link to={card.link} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card info-card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{card.title}</h5>
                      <div className="d-flex align-items-center">
                        <div
                          className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: 50, height: 50, background: card.color }}
                        >
                          <i className={`bi ${card.icon} fs-4`} />
                        </div>
                        <h6 className="mb-0 fw-bold">{card.value}</h6>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <h4 className="mt-4 mb-3 fw-bold" style={{ color: "#012970" }}>
            System & Role Overview
          </h4>

          <div className="row">
            {roleCards.map((card, i) => (
              <div key={i} className="col-xxl-3 col-md-6 mb-4">
                <Link to={card.link} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card info-card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{card.title}</h5>
                      <div className="d-flex align-items-center">
                        <div
                          className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: 50, height: 50, background: card.color }}
                        >
                          <i className={`bi ${card.icon} fs-4`} />
                        </div>
                        <h6 className="mb-0 fw-bold">{card.value}</h6>
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
