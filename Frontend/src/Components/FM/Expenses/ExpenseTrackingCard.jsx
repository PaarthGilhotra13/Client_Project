// ExpenseTracking.jsx
// import { useEffect, useState } from "react";
// import ApiServices from "../../../ApiServices";
// import Swal from "sweetalert2";
// import { ScaleLoader } from "react-spinners";
// import PageTitle from "../../PageTitle";

// const STEPS = ["Pending", "Approved", "Hold", "Declined"];

// export default function ExpenseTracking() {
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
//         setTimeout(() => setLoad(false), 500);
//       })
//       .catch(() => {
//         setData([]);
//         setTimeout(() => setLoad(false), 500);
//       });
//   }, []);

//   return (
//     <main className="main" id="main">
//       <PageTitle child="Track Approval" />

//       {/* Loader */}
//       {load && (
//         <div className="container-fluid">
//           <ScaleLoader
//             color="#6776f4"
//             cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
//             loading={load}
//           />
//         </div>
//       )}

//       {/* Content */}
//       {!load && (
//         <div className="container-fluid mt-3">
//           {data.length === 0 && (
//             <div className="text-center text-muted">
//               No Expenses Found
//             </div>
//           )}

//           {data.map((el) => {
//             const activeIndex = STEPS.indexOf(el.statusName || "Pending");

//             return (
//               <div
//                 key={el._id}
//                 className="card shadow-sm mb-3"
//                 style={{ maxWidth: "520px" }}
//               >
//                 <div className="card-body">

//                   {/* Optional heading */}
//                   <h6 className="mb-3">
//                     Ticket ID: {el.ticketId}
//                   </h6>

//                   {/* Status Tracking */}
//                   {STEPS.map((step, index) => {
//                     const active = index <= activeIndex;

//                     return (
//                       <div
//                         key={step}
//                         style={{ display: "flex", gap: 14 }}
//                       >
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                           }}
//                         >
//                           <div
//                             style={{
//                               width: 14,
//                               height: 14,
//                               borderRadius: "50%",
//                               background: active ? "#22c55e" : "#d1d5db",
//                             }}
//                           />
//                           {index !== STEPS.length - 1 && (
//                             <div
//                               style={{
//                                 width: 2,
//                                 height: 30,
//                                 background: active ? "#22c55e" : "#d1d5db",
//                               }}
//                             />
//                           )}
//                         </div>

//                         <div
//                           style={{
//                             fontWeight:
//                               index === activeIndex ? 600 : 400,
//                             color: active ? "#000" : "#9ca3af",
//                           }}
//                         >
//                           {step}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";

const STEPS = ["Pending", "Approved", "Hold", "Declined"];

export default function ExpenseTracking() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      Swal.fire("Error", "User not logged in", "error");
      setLoad(false);
      return;
    }

    ApiServices.GetAllExpense({ raisedBy:userId })
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
          console.log(res.data.data);
        } else {
          setData([]);
        }
        setTimeout(() => setLoad(false), 500);
      })
      .catch(() => {
        setData([]);
        setTimeout(() => setLoad(false), 500);
      });
  }, []);

  return (
    <main className="main" id="main">
      <PageTitle child="Track Approval" />

      {/* Loader — SAME AS WORKING */}
      {load && (
        <div className="container-fluid">
          <ScaleLoader
            color="#6776f4"
            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
            loading={load}
          />
        </div>
      )}

      {/* Content */}
      {!load && (
        <div className="container-fluid mt-3">
          {data.length === 0 && (
            <div className="text-center text-muted">
              No Expenses Found
            </div>
          )}

          {data.map((el) => {
            // ✅ FIX 1: correct status field
            const activeIndex = STEPS.indexOf(el.status || "Pending");

            return (
              <div
                key={el._id}
                className="card shadow-sm mb-3"
                style={{ maxWidth: "520px" }}
              >
                <div className="card-body">
                  <h6 className="mb-3">
                    Ticket ID: {el.ticketId}
                  </h6>

                  {STEPS.map((step, index) => {
                    // ✅ FIX 2: correct active logic
                    const completed = index < activeIndex;
                    const active = index === activeIndex;

                    return (
                      <div key={step} style={{ display: "flex", gap: 14 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              background:
                                active || completed
                                  ? "#22c55e"
                                  : "#d1d5db",
                            }}
                          />
                          {index !== STEPS.length - 1 && (
                            <div
                              style={{
                                width: 2,
                                height: 30,
                                background: completed
                                  ? "#22c55e"
                                  : "#d1d5db",
                              }}
                            />
                          )}
                        </div>

                        <div
                          style={{
                            fontWeight: active ? 600 : 400,
                            color: active ? "#000" : "#9ca3af",
                          }}
                        >
                          {step}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
