// import { useEffect, useState } from "react";
// import PageTitle from "../../PageTitle";
// import { ScaleLoader } from "react-spinners";
// import Swal from "sweetalert2";
// import ApiServices from "../../../ApiServices";

// export default function ZhPendingExpenses() {

//   const [data, setData] = useState([]);
//   const [load, setLoad] = useState(true);

//   const userId = sessionStorage.getItem("userId");

//   /* ================= FETCH PENDING ================= */
//   const fetchPending = () => {
//     if (!userId) {
//       Swal.fire("Error", "User not logged in", "error");
//       setLoad(false);
//       return;
//     }

//     ApiServices.GetClmPendingExpenses({ userId:userId })
//       .then((res) => {
//         if (res?.data?.success) {
//           setData(res.data.data || []);
//         } else {
//           setData([]);
//         }
//         setTimeout(() => setLoad(false), 500);
//       })
//       .catch(() => {
//         setData([]);
//         setTimeout(() => setLoad(false), 500);
//       });
//   };

//   useEffect(() => {
//     fetchPending();
//   }, []);

//   /* ================= ACTION HANDLER ================= */
//   const takeAction = (type, expenseId) => {
//     Swal.fire({
//       title: `Confirm ${type}`,
//       input: "textarea",
//       inputPlaceholder: "Enter comment (optional)",
//       showCancelButton: true,
//       confirmButtonText: type
//     }).then(result => {
//       if (!result.isConfirmed) return;

//       const payload = {
//         expenseId,
//         approverId: userId,
//         comment: result.value || ""
//       };

//       setLoad(true);

//       let apiCall;
//       if (type === "Approve") apiCall = ApiServices.ApproveExpense;
//       if (type === "Hold") apiCall = ApiServices.HoldExpense;
//       if (type === "Reject") apiCall = ApiServices.RejectExpense;

//       apiCall(payload)
//         .then(res => {
//           setLoad(false);
//           if (res?.data?.success) {
//             Swal.fire("Success", res.data.message, "success");
//             fetchPending(); // refresh list
//           } else {
//             Swal.fire("Error", res.data.message, "error");
//           }
//         })
//         .catch(() => {
//           setLoad(false);
//           Swal.fire("Error", "Something went wrong", "error");
//         });
//     });
//   };

//   return (
//     <>
//       <main className="main" id="main">
//         <PageTitle child="Pending Expenses (CLM)" />

//         {/* Loader */}
//         <ScaleLoader
//           color="#6776f4"
//           cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
//           size={200}
//           loading={load}
//         />

//         {!load && (
//           <div className="container-fluid">
//             <div className="row justify-content-center">
//               <div className="col-lg-12 mt-4 table-responsive">

//                 <table className="table table-hover table-striped">
//                   <thead className="table-dark">
//                     <tr>
//                       <th>Sr. No</th>
//                       <th>Ticket ID</th>
//                       <th>Store</th>
//                       <th>Expense Head</th>
//                       <th>Amount</th>
//                       <th>Status</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {data.length > 0 ? (
//                       data.map((el, index) => (
//                         <tr key={el._id}>
//                           <td>{index + 1}</td>
//                           <td>{el.ticketId}</td>
//                           <td>{el.storeId?.storeName}</td>
//                           <td>{el.expenseHeadId?.name}</td>
//                           <td>₹ {el.amount}</td>
//                           <td>
//                             <span className="badge bg-warning">
//                               Pending
//                             </span>
//                           </td>
//                           <td>
//                             <div className="btn-group">
//                               <button
//                                 className="btn btn-success btn-sm"
//                                 onClick={() => takeAction("Approve", el._id)}
//                               >
//                                 Approve
//                               </button>

//                               <button
//                                 className="btn btn-secondary btn-sm ms-1"
//                                 onClick={() => takeAction("Hold", el._id)}
//                               >
//                                 Hold
//                               </button>

//                               <button
//                                 className="btn btn-danger btn-sm ms-1"
//                                 onClick={() => takeAction("Reject", el._id)}
//                               >
//                                 Reject
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="7" className="text-center text-muted">
//                           No Pending Expenses Found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>

//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </>
//   );
// }


import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";

export default function ZhPendingExpenses() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  const userId = sessionStorage.getItem("userId");

  /* ================= FETCH PENDING (ZH) ================= */
  const fetchPending = () => {
    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }
    console.log(userId);

    // ✅ ZH pending API (zone based)
    ApiServices.GetZhPendingExpenses({ userId })    
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
        setTimeout(() => setLoad(false), 500);
      })
      .catch(() => {
        setData([]);
        setTimeout(() => setLoad(false), 500);
      });
  };

  useEffect(() => {
    fetchPending();
  }, []);

  /* ================= ACTION HANDLER ================= */
  const takeAction = (type, expenseId) => {
    Swal.fire({
      title: `Confirm ${type}`,
      input: "textarea",
      inputPlaceholder: "Enter comment (optional)",
      showCancelButton: true,
      confirmButtonText: type
    }).then((result) => {
      if (!result.isConfirmed) return;

      const payload = {
        expenseId,
        approverId: userId,
        comment: result.value || ""
      };

      setLoad(true);

      let apiCall;
      if (type === "Approve") apiCall = ApiServices.ApproveExpense;
      if (type === "Hold") apiCall = ApiServices.HoldExpense;
      if (type === "Reject") apiCall = ApiServices.RejectExpense;

      apiCall(payload)
        .then((res) => {
          setLoad(false);
          if (res?.data?.success) {
            Swal.fire("Success", res.data.message, "success");
            fetchPending(); // refresh
          } else {
            Swal.fire("Error", res.data.message, "error");
          }
        })
        .catch(() => {
          setLoad(false);
          Swal.fire("Error", "Something went wrong", "error");
        });
    });
  };

  return (
    <>
      <main className="main" id="main">
        {/* ✅ Correct title */}
        <PageTitle child="Pending Expenses (Zonal Head)" />

        <ScaleLoader
          color="#6776f4"
          cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          size={200}
          loading={load}
        />

        {!load && (
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-lg-12 mt-4 table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No</th>
                      <th>Ticket ID</th>
                      <th>Store</th>
                      <th>Expense Head</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.length > 0 ? (
                      data.map((el, index) => (
                        <tr key={el._id}>
                          <td>{index + 1}</td>
                          <td>{el.ticketId}</td>
                          <td>{el.storeId?.storeName}</td>
                          <td>{el.expenseHeadId?.name}</td>
                          <td>₹ {el.amount}</td>
                          <td>
                            <span className="badge bg-warning">Pending</span>
                          </td>
                          <td>
                            <div className="btn-group">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => takeAction("Approve", el._id)}
                              >
                                Approve
                              </button>

                              <button
                                className="btn btn-secondary btn-sm ms-1"
                                onClick={() => takeAction("Hold", el._id)}
                              >
                                Hold
                              </button>

                              <button
                                className="btn btn-danger btn-sm ms-1"
                                onClick={() => takeAction("Reject", el._id)}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No Pending Expenses Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
