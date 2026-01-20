// import { ScaleLoader } from "react-spinners";
// import PageTitle from "../../PageTitle";
// import { useEffect, useRef, useState } from "react";
// import ApiServices from "../../../ApiServices";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// export default function AddEmployee() {
//   var [name, setName] = useState("");
//   var [email, setEmail] = useState("");
//   var [password, setPassword] = useState("");
//   var [contact, setContact] = useState("");
//   var [designation, setDesignation] = useState("");

//   var [storeName, setStoreName] = useState("")
//   var [stores, setStores] = useState([])
//   var [storeId, setStoreId] = useState("")

//   var [load, setLoad] = useState(false);
//   var nav = useNavigate();
//   useEffect(() => {
//     setLoad(true);
//     setTimeout(() => {
//       setLoad(false);
//     }, 1000);

//     let data = {
//       status: "true"
//     }
//     ApiServices.GetAllStore(data)
//       .then((res) => {
//         setStores(res?.data?.data);
//       })
//       .catch((err) => {
//         console.log("Error is ", err);
//       })
//   }, []);
//   function handleForm(e) {
//     e.preventDefault();
//     setLoad(true);
//     let data = {
//       name: name,
//       email: email,
//       password: password,
//       contact: contact,
//       storeId: storeId
//     }
//     let apiCall;

//     if (designation === "FM") {
//       apiCall = ApiServices.AddFm;
//     }
//     else if (designation === "CLM") {
//       apiCall = ApiServices.AddClm;
//     }
//     else if (designation === "Zonal_Head") {
//       apiCall = ApiServices.AddZh;
//     }
//     else if (designation === "Business_Finance") {
//       apiCall = ApiServices.AddBf;
//     }
//     else if (designation === "Procurement") {
//       apiCall = ApiServices.AddProcurement;
//     }
//     else {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Please select a valid designation",
//       });
//       setLoad(false);
//       return;
//     }
//     apiCall(data)
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
//             nav("/admin/addEmployee");
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
//             nav("/admin/addEmployee");
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
//     <>
//       <main id="main" className="main">
//         <PageTitle child="Add Employee" />
//         <div className="container-fluid ">
//           <div className="row">
//             <div className="col-md-12">
//               <ScaleLoader
//                 color="#6776f4"
//                 cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
//                 size={200}
//                 loading={load}
//               />
//             </div>
//           </div>
//         </div>
//         <div className={load ? "display-screen" : ""} style={{ cursor: "default" }}>
//           <div className="col-lg-6 mx-auto mt-3">
//             <div className="card">
//               <div className="card-body">
//                 <h5 className="card-title">Employee Details</h5>
//                 {/* Vertical Form */}
//                 <form className="row g-3" onSubmit={handleForm}>
//                   <div className="col-12  form-group">
//                     <label className="form-label">Name</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="inputNanme4"
//                       value={name}
//                       onChange={(e) => {
//                         setName(e.target.value);
//                       }}
//                       required
//                     />
//                   </div>
//                   <div className="col-12">
//                     <label className="form-label">Email</label>
//                     <input
//                       type="email"
//                       className="form-control"
//                       id="inputNanme4"
//                       value={email}
//                       onChange={(e) => {
//                         setEmail(e.target.value);
//                       }}
//                       required
//                     />
//                   </div>
//                   <div className="col-12">
//                     <label className="form-label">Password</label>
//                     <input
//                       type="password"
//                       className="form-control"
//                       id="inputNanme4"
//                       value={password}
//                       onChange={(e) => {
//                         setPassword(e.target.value);
//                       }}
//                       required
//                     />
//                   </div>
//                   <div className="col-12">
//                     <label className="form-label">Contact</label>
//                     <input
//                       type="tel"
//                       pattern="[0-9]{10}"
//                       maxLength="10"
//                       className="form-control"
//                       id="inputNanme4"
//                       value={contact}
//                       onChange={(e) => {
//                         setContact(e.target.value);
//                       }}
//                       required
//                     />
//                   </div>
//                   <div className="col-12">
//                     <label htmlFor="CategotyName" className="form-label">
//                       Designation
//                     </label>
//                     <div className="dropdown text-center ">
//                       <button
//                         className="form-control text-start dropdown-toggle"
//                         type="button"
//                         id="categoryDropdown"
//                         data-bs-toggle="dropdown"
//                         aria-expanded="false"
//                       >
//                         {designation || "Select a Designation"}
//                       </button>
//                       <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
//                         <li >
//                           <button
//                             type="button"
//                             className="dropdown-item"
//                             onClick={() => setDesignation("FM")}
//                           >
//                             FM
//                           </button>
//                         </li>
//                         <li >
//                           <button
//                             type="button"
//                             className="dropdown-item"
//                             onClick={() => setDesignation("CLM")}
//                           >
//                             CLM
//                           </button>
//                         </li>
//                         <li >
//                           <button
//                             type="button"
//                             className="dropdown-item"
//                             onClick={() => setDesignation("Zonal_Head")}
//                           >
//                             Zonal_Head
//                           </button>
//                         </li>
//                         <li >
//                           <button
//                             type="button"
//                             className="dropdown-item"
//                             onClick={() => setDesignation("Business_Finance")}
//                           >
//                             Business_Finance
//                           </button>
//                         </li>
//                         <li >
//                           <button
//                             type="button"
//                             className="dropdown-item"
//                             onClick={() => setDesignation("Procurement")}
//                           >
//                             Procurement
//                           </button>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="col-12">
//                     <label htmlFor="CategotyName" className="form-label">
//                       Store
//                     </label>
//                     <div className="dropdown text-center ">
//                       <button
//                         className="form-control text-start dropdown-toggle"
//                         type="button"
//                         id="categoryDropdown"
//                         data-bs-toggle="dropdown"
//                         aria-expanded="false"
//                       >
//                         {storeName || "Select a Store "}
//                       </button>
//                       {stores?.map((el, index) => {
//                         return (
//                           <>
//                             <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
//                               {stores.length > 0 ? (
//                                 stores.map((el) => (
//                                   <li key={el._id}>
//                                     <button
//                                       type="button"
//                                       className="dropdown-item"
//                                       onClick={() => {
//                                         setStoreName(el.storeName);
//                                         setStoreId(el._id);
//                                       }}

//                                     >
//                                       {el.storeName}
//                                     </button>
//                                   </li>
//                                 ))
//                               ) : (
//                                 <li><span className="dropdown-item text-muted">No Store found</span></li>
//                               )}
//                             </ul>

//                           </>
//                         )
//                       })}
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <button
//                       type="submit"
//                       className="btn"
//                       style={{ background: "#6776f4", color: "white" }}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//                 {/* Vertical Form */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddEmployee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [designation, setDesignation] = useState("");

  // STORE (ARRAY + ORDER)
  const [stores, setStores] = useState([]);
  const [storeIds, setStoreIds] = useState([]);
  const [storeOrder, setStoreOrder] = useState([]);

  // ZONE
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState("");

  const [load, setLoad] = useState(false);
  const nav = useNavigate();

  // ================= LOAD DATA =================
  useEffect(() => {
    setLoad(true);

    ApiServices.GetAllStore({ status: "true" })
      .then((res) => setStores(res?.data?.data || []))
      .catch(() => {});

    ApiServices.GetAllZone?.({ status: "true" })
      .then((res) => setZones(res?.data?.data || []))
      .catch(() => {});

    setTimeout(() => setLoad(false), 800);
  }, []);

  // ================= STORE TOGGLE =================
  const handleStoreToggle = (store) => {
    let ids = [...storeIds];
    let order = [...storeOrder];

    if (ids.includes(store._id)) {
      ids = ids.filter((id) => id !== store._id);
      order = order.filter((id) => id !== store._id);
    } else {
      ids.push(store._id);
      order.push(store._id); // order maintain
    }

    setStoreIds(ids);
    setStoreOrder(order);
  };

  const getStoreNumber = (id) => {
    const index = storeOrder.indexOf(id);
    return index !== -1 ? index + 1 : null;
  };

  // ================= SUBMIT =================
  const handleForm = (e) => {
    e.preventDefault();
    setLoad(true);

    let data = {
      name,
      email,
      password,
      contact,
      storeId: storeIds, // ARRAY
    };

    if (designation === "Zonal_Head") {
      data.zoneId = zoneId;
    }

    let apiCall;
    if (designation === "FM") apiCall = ApiServices.AddFm;
    else if (designation === "CLM") apiCall = ApiServices.AddClm;
    else if (designation === "Zonal_Head") apiCall = ApiServices.AddZh;
    else if (designation === "Business_Finance") apiCall = ApiServices.AddBf;
    else if (designation === "Procurement") apiCall = ApiServices.AddProcurement;
    else {
      Swal.fire("Error", "Please select designation", "error");
      setLoad(false);
      return;
    }

    apiCall(data)
      .then((res) => {
        if (res?.data?.success) {
          Swal.fire("Success", res.data.message, "success");
          setTimeout(() => {
            nav("/admin/addEmployee");
            setName("");
            setEmail("");
            setPassword("");
            setContact("");
            setDesignation("");
            setStoreIds([]);
            setStoreOrder([]);
            setZoneId("");
            setLoad(false);
          }, 2000);
        } else {
          Swal.fire("Error", res.data.message, "error");
          setLoad(false);
        }
      })
      .catch(() => {
        Swal.fire("Error", "Something went wrong", "error");
        setLoad(false);
      });
  };

  return (
    <main id="main" className="main">
      <PageTitle child="Add Employee" />

      <ScaleLoader
        color="#6776f4"
        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
        loading={load}
      />

      <div className={load ? "display-screen" : ""}>
        <div className="col-lg-6 mx-auto mt-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Employee Details</h5>

              <form className="row g-3" onSubmit={handleForm}>
                <div className="col-12">
                  <label>Name</label>
                  <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="col-12">
                  <label>Email</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="col-12">
                  <label>Password</label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div className="col-12">
                  <label>Contact</label>
                  <input type="tel" maxLength="10" className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} required />
                </div>

                {/* DESIGNATION */}
                <div className="col-12">
                  <label>Designation</label>
                  <div className="dropdown">
                    <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                      {designation || "Select Designation"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      {["FM", "CLM", "Zonal_Head", "Business_Finance", "Procurement"].map((d) => (
                        <li key={d}>
                          <button type="button" className="dropdown-item" onClick={() => setDesignation(d)}>
                            {d}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* STORE MULTI SELECT */}
                <div className="col-12">
                  <label>Store</label>
                  <div className="dropdown">
                    <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                      {storeIds.length > 0
                        ? `${storeIds.length} Store${storeIds.length > 1 ? "s" : ""} Selected`
                        : "Select Store"}
                    </button>

                    <ul className="dropdown-menu w-100">
                      {stores.map((el) => (
                        <li key={el._id} className="dropdown-item d-flex justify-content-between align-items-center">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input me-2"
                              checked={storeIds.includes(el._id)}
                              onChange={() => handleStoreToggle(el)}
                            />
                            <label className="form-check-label">
                              {el.storeName}
                            </label>
                          </div>

                          {getStoreNumber(el._id) && (
                            <span className="badge bg-primary">
                              {getStoreNumber(el._id)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ZONE DROPDOWN (SAME UI) */}
                {designation === "Zonal_Head" && (
                  <div className="col-12">
                    <label>Zone</label>
                    <div className="dropdown">
                      <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                        {zoneId
                          ? zones.find((z) => z._id === zoneId)?.zoneName
                          : "Select Zone"}
                      </button>
                      <ul className="dropdown-menu w-100">
                        {zones.map((z) => (
                          <li key={z._id}>
                            <button type="button" className="dropdown-item" onClick={() => setZoneId(z._id)}>
                              {z.zoneName}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button className="btn" style={{ background: "#6776f4", color: "#fff" }}>
                    Submit
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
