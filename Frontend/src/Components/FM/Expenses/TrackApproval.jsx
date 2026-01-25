// // import { useEffect, useState } from "react";
// // import ApiServices from "../../../ApiServices";
// // import PageTitle from "../../PageTitle";
// // import { ScaleLoader } from "react-spinners";
// // import Swal from "sweetalert2";

// // export default function TrackApproval() {
// //   const [data, setData] = useState([]);
// //   const [load, setLoad] = useState(true);

// //   useEffect(() => {
// //     const userId = sessionStorage.getItem("userId");

// //     if (!userId) {
// //       Swal.fire("Error", "User not logged in", "error");
// //       setLoad(false);
// //       return;
// //     }

// //     ApiServices.MyExpenses({ userId })
// //       .then((res) => {
// //         if (res?.data?.success) {
// //           setData(res.data.data || []);
// //         } else {
// //           setData([]);
// //         }
// //         setLoad(false);
// //       })
// //       .catch(() => {
// //         setData([]);
// //         setLoad(false);
// //       });
// //   }, []);

// //   return (
// //     <main className="main" id="main">
// //       <PageTitle child="Track Approval" />

// //       {load && (
// //         <ScaleLoader
// //           color="#6776f4"
// //           cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
// //         />
// //       )}

// //       {!load && (
// //         <div className="container-fluid mt-4">
// //           <div className="row g-4">

// //             {data.map((el) => (
// //               <div key={el._id} className="col-lg-4 col-md-6">
// //                 <div className="card shadow-sm p-4 h-100">

// //                   <h6 className="mb-3">
// //                     Ticket ID: {el.ticketId}
// //                   </h6>

// //                   <p className="mb-1 text-muted">
// //                     Store: {el.storeId?.storeName}
// //                   </p>

// //                   <p className="mb-1 text-muted">
// //                     Expense: {el.expenseHeadId?.name}
// //                   </p>

// //                   <h5 className="mt-2">₹ {el.amount}</h5>

// //                   <span
// //                     className={`badge mt-3 ${
// //                       el.status === "Approved"
// //                         ? "bg-success"
// //                         : el.status === "Pending"
// //                         ? "bg-warning"
// //                         : el.status === "Hold"
// //                         ? "bg-info"
// //                         : "bg-danger"
// //                     }`}
// //                   >
// //                     {el.status}
// //                   </span>

// //                 </div>
// //               </div>
// //             ))}

// //           </div>
// //         </div>
// //       )}
// //     </main>
// //   );
// // }

// import { useEffect, useState } from "react";
// import ApiServices from "../../../ApiServices";
// import PageTitle from "../../PageTitle";
// import { ScaleLoader } from "react-spinners";
// import Swal from "sweetalert2";
// import { Link } from "react-router-dom";

// export default function TrackExpenses() {
//   const [data, setData] = useState([]);
//   const [load, setLoad] = useState(true);

//   useEffect(() => {
//     const userId = sessionStorage.getItem("userId");

//     if (!userId) {
//       Swal.fire("Error", "User not logged in", "error");
//       setLoad(false);
//       return;
//     }

//     ApiServices.MyExpenses({ userId })
//       .then((res) => {
//         if (res?.data?.success) {
//           setData(res.data.data || []);
//         } else {
//           setData([]);
//         }
//         setLoad(false);
//       })
//       .catch(() => {
//         setData([]);
//         setLoad(false);
//       });
//   }, []);

//   return (
//     <main className="main" id="main">
//       <PageTitle child="Track Expenses" />

//       {/* 🔥 FIXED SPACING WRAPPER */}
//       <div style={{ paddingTop: "32px" }}>
//         {load && (
//           <ScaleLoader
//             color="#6776f4"
//             cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
//           />
//         )}

//         {!load && (
//           <div className="container-fluid">
//             <div className="row g-4">

//               {data.length === 0 && (
//                 <div className="text-center text-muted">
//                   No Expenses Found
//                 </div>
//               )}

//               {data.map((el) => (
//                 <div key={el._id} className="col-lg-4 col-md-6">
//                   <div className="card expense-card">
//                     <div className="card-body pt-2">

//                       <h6 className="ticket-id mb-3">
//                         Ticket ID: {el.ticketId}
//                       </h6>

//                       <p className="text-muted mb-1">
//                         <strong>Store:</strong> {el.storeId?.storeName}
//                       </p>

//                       <p className="text-muted mb-1">
//                         <strong>Expense:</strong> {el.expenseHeadId?.name}
//                       </p>

//                       <p className="text-muted mb-3">
//                         <strong>Date:</strong> {el.expenseHeadId?.createdAt.split("T")[0]}
//                       </p>

//                       <h5 className="amount-text">
//                         ₹ {el.amount}
//                       </h5>
//                       <div className="d-flex justify-content-end">
//                         {/* <button className="btn btn-sm btn-outline-primary">Track</button> */}
//                         <Link to={`/fm/expenseTrackingCard/${el._id}`}className="btn btn-sm btn-outline-primary">Track</Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function TrackExpenses() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [load, setLoad] = useState(true);

  // ================= PAGINATION =================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Adjust as needed

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    ApiServices.MyExpenses({ userId })
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
          setFilteredData(res.data.data || []);
        } else {
          setData([]);
          setFilteredData([]);
        }
        setLoad(false);
      })
      .catch(() => {
        setData([]);
        setFilteredData([]);
        setLoad(false);
      });
  }, []);

  // 🔍 Search by Ticket ID
  useEffect(() => {
    let result;
    if (!search.trim()) {
      result = data;
    } else {
      result = data.filter((el) =>
        el.ticketId?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when search changes
  }, [search, data]);

  // ================= PAGINATION LOGIC =================
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const showPagination = filteredData.length > itemsPerPage;

  const currentExpenses = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="main" id="main">
      <PageTitle child="Track Expenses" />

      {/* 🔍 SEARCH BAR */}
      <div className="container-fluid mt-4">
        <div className="row mb-3">
          <div className="col-lg-4 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Ticket ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ paddingTop: "12px" }}>
        {load && (
          <ScaleLoader
            color="#6776f4"
            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          />
        )}

        {!load && (
          <div className="container-fluid">
            <div className="row g-4">
              {currentExpenses.length === 0 && (
                <div className="text-center text-muted">No Expenses Found</div>
              )}

              {currentExpenses.map((el) => (
                <div key={el._id} className="col-lg-4 col-md-6">
                  <div className="card expense-card h-100">
                    <div className="card-body pt-2">
                      <h6 className="ticket-id mb-3">Ticket ID: {el.ticketId}</h6>

                      <p className="text-muted mb-1">
                        <strong>Store:</strong> {el.storeId?.storeName}
                      </p>

                      <p className="text-muted mb-1">
                        <strong>Expense:</strong> {el.expenseHeadId?.name}
                      </p>

                      <p className="text-muted mb-3">
                        <strong>Date:</strong> {el.createdAt?.split("T")[0]}
                      </p>

                      <h5 className="amount-text">₹ {el.amount}</h5>

                      <div className="d-flex justify-content-end">
                        <Link
                          to={`/fm/expenseTrackingCard/${el._id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Track
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= PAGINATION ================= */}
            {showPagination && (
              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn btn-secondary me-2"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn me-1 ${
                      currentPage === i + 1 ? "btn-primary" : "btn-light"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="btn btn-secondary ms-2"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}


