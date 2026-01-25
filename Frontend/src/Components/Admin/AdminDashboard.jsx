// import { ScaleLoader } from "react-spinners";
// import PageTitle from "../PageTitle";
// import { useEffect, useState } from "react";
// import ApiServices from "../../ApiServices";

// export default function AdminDashboard() {
//   const [load, setLoad] = useState(false);
//   const [data, setData] = useState({});

//   useEffect(() => {
//     setLoad(true);
//     ApiServices.Dashboard()
//       .then((res) => {
//         console.log("DASHBOARD RESPONSE 👉", res.data);
//         // 🔥 IMPORTANT FIX
//         setData(res.data.data);
//         setLoad(false);
//       })
//       .catch((err) => {
//         console.log("DASHBOARD ERROR ❌", err);
//         setLoad(false);
//       });
//   }, []);

//   return (
//     <>
//       <main id="main" className="main">
//         <PageTitle child="Dashboard" />

//         {load && (
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-md-12">
//                 <ScaleLoader
//                   color="#6776f4"
//                   cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {!load && (
//           <div className="row" style={{ cursor: "default" }}>
//             {/* Total Requests */}
//             <div className="col-xxl-4 col-md-6 mb-4">
//               <div className="card info-card">
//                 <div className="card-body mb-4">
//                   <h5 className="card-title">Total Requests / Complaints</h5>
//                   <div className="d-flex align-items-center mt-4">
//                     <div
//                       className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
//                       style={{ width: 50, height: 50, background: "#4B49AC" }}
//                     >
//                       <i className="bi bi-collection fs-4" />
//                     </div>
//                     <h6 className="mb-0 fw-bold">{data?.totalRequests ?? 0}</h6>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Pending */}
//             <div className="col-xxl-4 col-md-6 mb-4">
//               <div className="card info-card">
//                 <div className="card-body mb-4">
//                   <h5 className="card-title">Pending Requests</h5>
//                   <div className="d-flex align-items-center mt-4">
//                     <div
//                       className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
//                       style={{ width: 50, height: 50, background: "#FFC107" }}
//                     >
//                       <i className="bi bi-hourglass-split fs-4" />
//                     </div>
//                     <h6 className="mb-0 fw-bold">{data?.pendingRequests ?? 0}</h6>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Approved */}
//             <div className="col-xxl-4 col-md-6 mb-4">
//               <div className="card info-card">
//                 <div className="card-body mb-4">
//                   <h5 className="card-title">Approved Requests</h5>
//                   <div className="d-flex align-items-center mt-4">
//                     <div
//                       className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
//                       style={{ width: 50, height: 50, background: "#20C997" }}
//                     >
//                       <i className="bi bi-check-circle fs-4" />
//                     </div>
//                     <h6 className="mb-0 fw-bold">{data?.approvedRequests ?? 0}</h6>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Rejected */}
//             <div className="col-xxl-4 col-md-6 mb-4">
//               <div className="card info-card">
//                 <div className="card-body mb-4">
//                   <h5 className="card-title">Rejected Requests</h5>
//                   <div className="d-flex align-items-center mt-4">
//                     <div
//                       className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
//                       style={{ width: 50, height: 50, background: "#FF6B6B" }}
//                     >
//                       <i className="bi bi-x-circle fs-4" />
//                     </div>
//                     <h6 className="mb-0 fw-bold">{data?.rejectedRequests ?? 0}</h6>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* In Process */}
//             <div className="col-xxl-4 col-md-6 mb-4">
//               <div className="card info-card">
//                 <div className="card-body mb-4">
//                   <h5 className="card-title">In-Process / Under Review</h5>
//                   <div className="d-flex align-items-center mt-4">
//                     <div
//                       className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
//                       style={{ width: 50, height: 50, background: "#4D96FF" }}
//                     >
//                       <i className="bi bi-arrow-repeat fs-4" />
//                     </div>
//                     <h6 className="mb-0 fw-bold">{data?.inProcessRequests ?? 0}</h6>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Today */}
//             <div className="col-xxl-4 col-md-6 mb-4">
//               <div className="card info-card">
//                 <div className="card-body mb-4">
//                   <h5 className="card-title">Today’s New Requests</h5>
//                   <div className="d-flex align-items-center mt-4">
//                     <div
//                       className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
//                       style={{ width: 50, height: 50, background: "#00B8D9" }}
//                     >
//                       <i className="bi bi-calendar-event fs-4" />
//                     </div>
//                     <h6 className="mb-0 fw-bold">{data?.todayRequests ?? 0}</h6>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </>
//   );
// }

import { ScaleLoader } from "react-spinners";
import PageTitle from "../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";

export default function AdminDashboard() {
  const [load, setLoad] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    setLoad(true);
    ApiServices.Dashboard()
      .then((res) => {
        setData(res.data.data || {});
        setLoad(false);
      })
      .catch(() => {
        setLoad(false);
      });
  }, []);

  return (
    <>
      <main id="main" className="main">
        <PageTitle child="Dashboard" />

        {load && (
          <div className="container-fluid text-center mt-5">
            <ScaleLoader color="#6776f4" />
          </div>
        )}

        {!load && (
          <>
            {/* ================= EXPENSE STATS ================= */}
            <div className="row" style={{ cursor: "default" }}>
              {[
                {
                  title: "Total Requests / Complaints",
                  value: data.totalRequests,
                  color: "#4B49AC",
                  icon: "bi-collection",
                },
                {
                  title: "Pending Requests",
                  value: data.pendingRequests,
                  color: "#FFC107",
                  icon: "bi-hourglass-split",
                },
                {
                  title: "Approved Requests",
                  value: data.approvedRequests,
                  color: "#20C997",
                  icon: "bi-check-circle",
                },
                {
                  title: "Rejected Requests",
                  value: data.rejectedRequests,
                  color: "#FF6B6B",
                  icon: "bi-x-circle",
                },
                {
                  title: "In-Process / Under Review",
                  value: data.inProcessRequests,
                  color: "#4D96FF",
                  icon: "bi-arrow-repeat",
                },
                {
                  title: "Today’s New Requests",
                  value: data.todayRequests,
                  color: "#00B8D9",
                  icon: "bi-calendar-event",
                },
              ].map((card, i) => (
                <div key={i} className="col-xxl-4 col-md-6 mb-4">
                  <div className="card info-card">
                    <div className="card-body mb-4">
                      <h5 className="card-title">{card.title}</h5>
                      <div className="d-flex align-items-center mt-4">
                        <div
                          className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: 50, height: 50, background: card.color }}
                        >
                          <i className={`bi ${card.icon} fs-4`} />
                        </div>
                        <h6 className="mb-0 fw-bold">{card.value ?? 0}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= USER / ROLE STATS ================= */}
            <h4 className="mt-4 mb-3 fw-bold" style={{ color: "#012970" }}>
              System & Role Overview
            </h4>

            <div className="row">
              {[
                {
                  title: "Total Users",
                  value: data.totalUsers,
                  color: "#6F42C1",
                  icon: "bi-people",
                },
                {
                  title: "Facility Managers",
                  value: data.totalFacilityManagers,
                  color: "#198754",
                  icon: "bi-person-badge",
                },
                {
                  title: "CLMs",
                  value: data.totalCLMs,
                  color: "#FD7E14",
                  icon: "bi-building",
                },
                {
                  title: "Zonal Heads",
                  value: data.totalZonalHeads,
                  color: "#0D6EFD",
                  icon: "bi-diagram-3",
                },
              ].map((card, i) => (
                <div key={i} className="col-xxl-3 col-md-6 mb-4">
                  <div className="card info-card">
                    <div className="card-body mb-4">
                      <h5 className="card-title">{card.title}</h5>
                      <div className="d-flex align-items-center mt-4">
                        <div
                          className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: 50, height: 50, background: card.color }}
                        >
                          <i className={`bi ${card.icon} fs-4`} />
                        </div>
                        <h6 className="mb-0 fw-bold">{card.value ?? 0}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}

