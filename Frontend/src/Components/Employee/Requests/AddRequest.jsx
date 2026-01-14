// import { useState, useRef, useEffect } from "react";
// import PageTitle from "../../PageTitle";
// import Swal from "sweetalert2";
// import ApiServices from "../../../ApiServices";

// export default function AddRequest() {
//   var [storeCategoryName, setStoreCategoryName] = useState("")
//   var [storeCategories, setStoreCategories] = useState([])
//   var [storeCategoryId, setStoreCategoryId] = useState("")

//   var [storeName, setStoreName] = useState("")
//   var [stores, setStores] = useState([])
//   var [storeId, setStoreId] = useState("")

//   var [expenseHeadName, setExpenseHeadName] = useState("")
//   var [expenseHeads, setExpenseHeads] = useState([])
//   var [expenseHeadId, setExpenseHeadId] = useState("")

//   var [natureOfExpense, setNatureOfExpense] = useState("")
//   var [expenseValue, setExpenseValue] = useState("")
//   var [remark, setRemark] = useState("")
//   var [rca, setRca] = useState("")
//   var [policy, setPolicy] = useState("")
//   var [policyId, setPolicyId] = useState("")
//   var [ticketId, setTicketId] = useState("")
//   const [attachment, setAttachment] = useState(null);
//   const fileInputRef = useRef(null);
//   var [load, setLoad] = useState(false)
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoad(true)
//     let data = {
//       status: "true"
//     }
//     ApiServices.GetAllStoreCategory(data)
//       .then((res) => {
//         setStoreCategories(res?.data?.data);
//       })
//       .catch((err) => {
//         console.log("Error is ", err);
//       })

//     ApiServices.GetAllStore(data)
//       .then((res) => {
//         setStores(res?.data?.data);
//       })
//       .catch((err) => {
//         console.log("Error is ", err);
//       })
//     ApiServices.GetAllExpenseHead(data)
//       .then((res) => {
//         setExpenseHeads(res?.data?.data);
//       })
//       .catch((err) => {
//         console.log("Error is ", err);
//       })
//     setTimeout(() => {
//       setLoad(false)
//     }, 1000)
//   }, [])
//   function handleForm(e) {
//     e.preventDefault();
//     setLoad(true);
//     let data = new FormData()
//     data.append("storeId", storeId)
//     data.append("storeCategoryId", storeCategoryId)
//     data.append("expenseHeadId", expenseHeadId)
//     data.append("natureOfExpense", natureOfExpense)
//     data.append("amount", expenseValue)
//     data.append("remark", remark)
//     data.append("rca", rca)
//     data.append("policy", policy)
//     data.append("attachment", attachment)
//     data.append("ticketId", ticketId)
//     ApiServices.AddExpense(data)
//       .then((res) => {
//         var message = res?.data?.message;
//         setLoad(true);
//         if (res?.data?.success) {
//           Swal.fire({
//             title: message,
//             icon: "success",
//             draggable: true,
//             confirmButtonText: "Continue",
//             timer: 3000,
//             timerProgressBar: true,
//           });
//           setTimeout(() => {
//             setLoad(false);
//             nav("/admin/addExpense");
//             setName("");
//             setEmail("");
//             setPassword("");
//             setStoreName("")
//             setDesignation("")
//             setContact("");
//           }, 3000);
//         } else {
//           Swal.fire({
//             icon: "error",
//             title: "Oops...",
//             text: message,
//             confirmButtonText: "Continue",
//             timer: 3000,
//             timerProgressBar: true,
//           });
//           setTimeout(() => {
//             setLoad(false);
//             nav("/admin/addExpense");
//           }, 3000);
//         }
//       })
//       .catch((err) => {
//         setLoad(true);
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Something went wrong!",
//           confirmButtonText: "Continue",
//           timer: 2000,
//           timerProgressBar: true,
//         });
//         setTimeout(() => {
//           setLoad(false);
//         }, 2000);
//         console.log("Error is", err);
//       });
//   }

//   return (
//     <main className="main" id="main">
//       <PageTitle child="Add Request" />

//       <div className="container-fluid" style={{ cursor: "default" }}>
//         <div className="col-lg-6 mx-auto mt-3" style={{ cursor: "default" }} >
//           <div className="card">
//             <div className="card-body">
//               <h5 className="card-title">Store Expense Details</h5>

//               <form className="row g-3" onSubmit={handleForm}>
//                 <div className="col-12">
//                   <label htmlFor="CategotyName" className="form-label">
//                     Store
//                   </label>
//                   <div className="dropdown text-center ">
//                     <button
//                       className="form-control text-start dropdown-toggle"
//                       type="button"
//                       id="categoryDropdown"
//                       data-bs-toggle="dropdown"
//                       aria-expanded="false"
//                     >
//                       {storeName || "Select a Store"}
//                     </button>
//                     {stores?.map((el, index) => {
//                       return (
//                         <>
//                           <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
//                             {stores.length > 0 ? (
//                               stores.map((el) => (
//                                 <li key={el._id}>
//                                   <button
//                                     type="button"
//                                     className="dropdown-item"
//                                     onClick={() => {
//                                       setStoreName(el.storeName);
//                                       setStoreId(el._id);
//                                     }}

//                                   >
//                                     {el.storeName}
//                                   </button>
//                                 </li>
//                               ))
//                             ) : (
//                               <li><span className="dropdown-item text-muted">No Store Category found</span></li>
//                             )}
//                           </ul>

//                         </>
//                       )
//                     })}
//                   </div>
//                 </div>
//                 <div className="col-12">
//                   <label htmlFor="CategotyName" className="form-label">
//                     Store Category
//                   </label>
//                   <div className="dropdown text-center ">
//                     <button
//                       className="form-control text-start dropdown-toggle"
//                       type="button"
//                       id="categoryDropdown"
//                       data-bs-toggle="dropdown"
//                       aria-expanded="false"
//                     >
//                       {storeCategoryName || "Select a Store Category"}
//                     </button>
//                     {storeCategories?.map((el, index) => {
//                       return (
//                         <>
//                           <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
//                             {storeCategories.length > 0 ? (
//                               storeCategories.map((el) => (
//                                 <li key={el._id}>
//                                   <button
//                                     type="button"
//                                     className="dropdown-item"
//                                     onClick={() => {
//                                       setStoreCategoryName(el.name);
//                                       setStoreCategoryId(el._id);
//                                     }}

//                                   >
//                                     {el.name}
//                                   </button>
//                                 </li>
//                               ))
//                             ) : (
//                               <li><span className="dropdown-item text-muted">No Store Category found</span></li>
//                             )}
//                           </ul>

//                         </>
//                       )
//                     })}
//                   </div>
//                 </div>
//                 <div className="col-12">
//                   <label htmlFor="CategotyName" className="form-label">
//                     Expense Head
//                   </label>
//                   <div className="dropdown text-center ">
//                     <button
//                       className="form-control text-start dropdown-toggle"
//                       type="button"
//                       id="categoryDropdown"
//                       data-bs-toggle="dropdown"
//                       aria-expanded="false"
//                     >
//                       {expenseHeadName || "Select a Expense Head"}
//                     </button>
//                     {expenseHeads?.map((el, index) => {
//                       return (
//                         <>
//                           <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
//                             {expenseHeads.length > 0 ? (
//                               expenseHeads.map((el) => (
//                                 <li key={el._id}>
//                                   <button
//                                     type="button"
//                                     className="dropdown-item"
//                                     onClick={() => {
//                                       setExpenseHeadName(el.name);
//                                       setExpenseHeadId(el._id);
//                                     }}

//                                   >
//                                     {el.name}
//                                   </button>
//                                 </li>
//                               ))
//                             ) : (
//                               <li><span className="dropdown-item text-muted">No Store Category found</span></li>
//                             )}
//                           </ul>

//                         </>
//                       )
//                     })}
//                   </div>
//                 </div>
//                 <div className="col-12">
//                   <label htmlFor="CategotyName" className="form-label">
//                     Nature of Expense
//                   </label>
//                   <div className="dropdown text-center ">
//                     <button
//                       className="form-control text-start dropdown-toggle"
//                       type="button"
//                       id="categoryDropdown"
//                       data-bs-toggle="dropdown"
//                       aria-expanded="false"
//                     >
//                       {natureOfExpense || "Select Type"}
//                     </button>
//                     <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
//                       <li >
//                         <button
//                           type="button"
//                           className="dropdown-item"
//                           onClick={() => setNatureOfExpense("Opex")}
//                         >
//                           Opex
//                         </button>
//                       </li>
//                       <li >
//                         <button
//                           type="button"
//                           className="dropdown-item"
//                           onClick={() => setNatureOfExpense("Capex")}
//                         >
//                           Capex
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="col-12">
//                   <label className="form-label">Expense Value</label>
//                   <input
//                     className="form-control"
//                     value={expenseValue}
//                     placeholder="Enter Amount"
//                     onChange={(e) => setExpenseValue(e.target.value)}
//                     required
//                   ></input>
//                 </div>
//                 <div className="col-12">
//                   <label className="form-label">Remark</label>
//                   <textarea
//                     className="form-control"
//                     rows="4"
//                     value={remark}
//                     placeholder="Add any additional notes..."
//                     onChange={(e) => setRemark(e.target.value)}

//                   ></textarea>
//                 </div>
//                 <div className="col-12">
//                   <label className="form-label">RCA</label>
//                   <textarea
//                     className="form-control"
//                     rows="4"
//                     value={rca}
//                     placeholder="Explain reason"
//                     onChange={(e) => setRca(e.target.value)}
//                     required
//                   ></textarea>
//                 </div>
//                 <div className="col-12">
//                   <label htmlFor="CategotyName" className="form-label">
//                     Policy
//                   </label>
//                   <div className="dropdown text-center ">
//                     <button
//                       className="form-control text-start dropdown-toggle"
//                       type="button"
//                       id="categoryDropdown"
//                       data-bs-toggle="dropdown"
//                       aria-expanded="false"
//                     >
//                       {policy || "Select Policy"}
//                     </button>
//                     <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
//                       <li >
//                         <button
//                           type="button"
//                           className="dropdown-item"
//                           onClick={() => setPolicy("REPIAR & MAINTAINENCE")}
//                         >
//                           REPIAR & MAINTAINENCE
//                         </button>
//                       </li>
//                       <li >
//                         <button
//                           type="button"
//                           className="dropdown-item"
//                           onClick={() => setPolicy("ADHOC MANPOWER")}
//                         >
//                           ADHOC MANPOWER
//                         </button>
//                       </li>
//                       <li >
//                         <button
//                           type="button"
//                           className="dropdown-item"
//                           onClick={() => setPolicy("FIRE AMC")}
//                         >
//                           FIRE AMC
//                         </button>
//                       </li>
//                       <li >
//                         <button
//                           type="button"
//                           className="dropdown-item"
//                           onClick={() => setPolicy("COLD ROOM R&M")}
//                         >
//                           COLD ROOM R&M
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="col-12">
//                   <label className="form-label">Attachment</label>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     className="form-control"
//                     onChange={(e) => setAttachment(e.target.files[0])}
//                     required
//                   />
//                 </div>
//                 <div className="col-12">
//                   <label className="form-label">Ticket ID</label>
//                   <input
//                     className="form-control"
//                     value={ticketId}
//                     placeholder="Enter ticket"
//                     onChange={(e) => setTicketId(e.target.value)}
//                     required
//                   ></input>
//                 </div>
//                 <div className="text-center">
//                   <button
//                     type="submit"
//                     className="btn"
//                     style={{ background: "#6776f4", color: "white" }}
//                     disabled={loading}
//                   >
//                     {loading ? "Submitting..." : "Submit"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


import { useState, useRef, useEffect } from "react";
import PageTitle from "../../PageTitle";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { useNavigate } from "react-router-dom";

export default function AddRequest() {

  const nav = useNavigate();

  /* ================= STATES ================= */

  // Store
  const [storeName, setStoreName] = useState("");
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [searchStore, setSearchStore] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);

  // Store Category
  const [storeCategoryName, setStoreCategoryName] = useState("");
  const [storeCategories, setStoreCategories] = useState([]);
  const [storeCategoryId, setStoreCategoryId] = useState("");

  // Expense Head
  const [expenseHeadName, setExpenseHeadName] = useState("");
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [expenseHeadId, setExpenseHeadId] = useState("");

  // Expense
  const [natureOfExpense, setNatureOfExpense] = useState("");
  const [expenseValue, setExpenseValue] = useState("");
  const [remark, setRemark] = useState("");
  const [rca, setRca] = useState("");
  const [policy, setPolicy] = useState("");
  const [ticketId, setTicketId] = useState("");

  // Attachment
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const [load, setLoad] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    setLoad(true);

    ApiServices.GetAllStore({ status: "true" })
      .then(res => setStores(res?.data?.data || []));

    ApiServices.GetAllStoreCategory({ status: "true" })
      .then(res => setStoreCategories(res?.data?.data || []));

    ApiServices.GetAllExpenseHead({ status: "true" })
      .then(res => setExpenseHeads(res?.data?.data || []));

    setTimeout(() => setLoad(false), 800);
  }, []);

  /* ================= SUBMIT ================= */
  function handleForm(e) {
    e.preventDefault();

    if (
      !storeId ||
      !storeCategoryId ||
      !expenseHeadId ||
      !natureOfExpense ||
      !expenseValue ||
      !policy ||
      !ticketId ||
      !attachment
    ) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    let data = new FormData();
    data.append("storeId", storeId);
    data.append("storeCategoryId", storeCategoryId);
    data.append("expenseHeadId", expenseHeadId);
    data.append("natureOfExpense", natureOfExpense);
    data.append("amount", expenseValue);
    data.append("remark", remark);
    data.append("rca", rca);
    data.append("policy", policy);
    data.append("ticketId", ticketId);
    data.append("attachment", attachment);

    setLoad(true);

    ApiServices.AddExpense(data)
      .then(res => {
        setLoad(false);
        if (res?.data?.success) {
          Swal.fire("Success", res.data.message, "success");
          nav("/fm/myExpenses");
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      })
      .catch(() => {
        setLoad(false);
        Swal.fire("Error", "Something went wrong", "error");
      });
  }

  return (
    <main className="main" id="main">
      <PageTitle child="Add Request" />

      <div className="container-fluid">
        <div className="col-lg-6 mx-auto mt-3">
          <div className="card">
            <div className="card-body">

              <h5 className="card-title">Store Expense Details</h5>

              <form className="row g-3" onSubmit={handleForm}>

                {/* ================= STORE ================= */}
                <div className="col-12">
                  <label className="form-label">Store</label>

                  {/* SEARCH BAR */}
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Search for store name..."
                    value={searchStore}
                    onChange={(e) => setSearchStore(e.target.value)}
                  />

                  <div className="dropdown text-center">
                    <button
                      className="form-control text-start dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      {storeName || "Select a Store"}
                    </button>

                    <ul
                      className="dropdown-menu w-100"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {stores
                        .filter(el =>
                          el.storeName.toLowerCase().includes(searchStore.toLowerCase())
                        )
                        .map(el => (
                          <li key={el._id}>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setStoreName(el.storeName);
                                setStoreId(el._id);
                                setSelectedStore(el);
                              }}
                            >
                              {el.storeName}
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* ================= STORE INFO CARD ================= */}
                {selectedStore && (
                  <div className="col-12">
                    <div className="card mt-2">
                      <div className="card-body p-3">
                        <div className="row">
                          <div className="col-6"><b>State</b><div>{selectedStore.state}</div></div>
                          <div className="col-6"><b>City</b><div>{selectedStore.cityId.cityName}</div></div>
                          <div className="col-6 mt-2"><b>Store Code</b><div>{selectedStore.storeCode}</div></div>
                          <div className="col-6 mt-2"><b>Zone</b><div>{selectedStore.zoneId.zoneName}</div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STORE CATEGORY ================= */}
                <div className="col-12">
                  <label className="form-label">Store Category</label>
                  <div className="dropdown text-center">
                    <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                      {storeCategoryName || "-- Select Type --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      {storeCategories.map(el => (
                        <li key={el._id}>
                          <button className="dropdown-item"
                            onClick={() => {
                              setStoreCategoryName(el.name);
                              setStoreCategoryId(el._id);
                            }}>
                            {el.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ================= EXPENSE HEAD ================= */}
                <div className="col-12">
                  <label className="form-label">Expense Head</label>
                  <div className="dropdown text-center">
                    <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                      {expenseHeadName || "-- Select Type --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      {expenseHeads.map(el => (
                        <li key={el._id}>
                          <button className="dropdown-item"
                            onClick={() => {
                              setExpenseHeadName(el.name);
                              setExpenseHeadId(el._id);
                            }}>
                            {el.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ================= NATURE & AMOUNT ================= */}
                <div className="col-6">
                  <label className="form-label">Nature of Expense</label>
                  <div className="dropdown text-center">
                    <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                      {natureOfExpense || "-- Select Type --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      <li><button className="dropdown-item" onClick={() => setNatureOfExpense("Opex")}>Opex</button></li>
                      <li><button className="dropdown-item" onClick={() => setNatureOfExpense("Capex")}>Capex</button></li>
                    </ul>
                  </div>
                </div>

                <div className="col-6">
                  <label className="form-label">Expense Value</label>
                  <input className="form-control"
                    value={expenseValue}
                    onChange={(e) => setExpenseValue(e.target.value)} />
                </div>

                {/* ================= REMARK & RCA ================= */}
                <div className="col-6">
                  <label className="form-label">Remark</label>
                  <textarea className="form-control" value={remark} onChange={(e) => setRemark(e.target.value)} />
                </div>

                <div className="col-6">
                  <label className="form-label">RCA</label>
                  <textarea className="form-control" value={rca} onChange={(e) => setRca(e.target.value)} />
                </div>

                {/* ================= POLICY ================= */}
                <div className="col-12">
                  <label className="form-label">Policy</label>
                  <div className="dropdown text-center">
                    <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                      {policy || "-- Select Policy --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      <li><button className="dropdown-item" onClick={() => setPolicy("REPAIR & MAINTENANCE")}>REPAIR & MAINTENANCE</button></li>
                      <li><button className="dropdown-item" onClick={() => setPolicy("ADHOC MANPOWER")}>ADHOC MANPOWER</button></li>
                      <li><button className="dropdown-item" onClick={() => setPolicy("FIRE AMC")}>FIRE AMC</button></li>
                      <li><button className="dropdown-item" onClick={() => setPolicy("COLD ROOM R&M")}>COLD ROOM R&M</button></li>
                    </ul>
                  </div>
                </div>

                {/* ================= ATTACHMENT ================= */}
                <div className="col-12">
                  <label className="form-label">Attachment</label>
                  <input type="file" ref={fileInputRef} className="form-control"
                    onChange={(e) => setAttachment(e.target.files[0])} />
                </div>

                {/* ================= TICKET ================= */}
                <div className="col-12">
                  <label className="form-label">Ticket ID</label>
                  <input className="form-control"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)} />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn"
                    style={{ background: "#6776f4", color: "white" }}>
                    Submit Expense
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
