// import { useEffect, useState } from "react";
// import { ScaleLoader } from "react-spinners";
// import PageTitle from "../../PageTitle";
// import ApiServices from "../../../ApiServices";
// import Swal from "sweetalert2";

// export default function AddState() {
//     const [zoneName, setZoneName] = useState("");
//     const [zoneId, setZoneId] = useState("");
//     const [zones, setZones] = useState([]);

//     const [stateName, setStateName] = useState("");
//     const [states, setStates] = useState([]);

//     const [load, setLoad] = useState(false);

//     useEffect(() => {
//         setLoad(true);

//         // Get Zones
//         ApiServices.GetAllZone({ status: "true" })
//             .then((res) => {
//                 setZones(res?.data?.data || []);
//             })
//             .catch((err) => {
//                 console.error("Zone Fetch Error:", err);
//             });

//         // Get States
//         ApiServices.GetAllStates()
//             .then((res) => {
//                 setStates(res?.data?.data || []);
//             })
//             .catch((err) => {
//                 console.error("State Fetch Error:", err);
//             })
//             setTimeout(()=>{
//                 setLoad(false)
//             },1500)
//     }, []);

//     const handleForm = (e) => {
//         e.preventDefault();

//         if (!zoneId || !stateName) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Missing Fields",
//                 text: "Please select Zone and State",
//                 timer: 2000,
//                 timerProgressBar: true,
//             });
//             return;
//         }

//         setLoad(true);

//         ApiServices.AddState({ zoneId, stateName })
//             .then((res) => {
//                 if (res?.data?.success) {
//                     Swal.fire({
//                         icon: "success",
//                         title: "State Added Successfully",
//                         timer: 2000,
//                         timerProgressBar: true,
//                     });

//                     setZoneName("");
//                     setZoneId("");
//                     setStateName("");
//                 } else {
//                     Swal.fire({
//                         icon: "error",
//                         title: "Error",
//                         text: res?.data?.message || "Failed to add state",
//                     });
//                 }
//             })
//             .catch(() => {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Server Error",
//                     text: "Something went wrong",
//                 });
//             })
//             .finally(() => setLoad(false));
//     };

//     return (
//         <main id="main" className="main">
//             <PageTitle child="Add State" />

//             {/* Loader */}
//             {load && (
//                 <div className="container-fluid ">
//                     <div className="row">
//                         <div className="col-md-12">
//                             <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className={load ? "d-none" : ""}>
//                 <div className="col-lg-6 mx-auto mt-3">
//                     <div className="card">
//                         <div className="card-body">
//                             <h5 className="card-title">State Details</h5>

//                             <form className="row g-3" onSubmit={handleForm}>
//                                 {/* Zone Dropdown */}
//                                 <div className="col-12">
//                                     <label className="form-label">Zone Name</label>
//                                     <div className="dropdown">
//                                         <button
//                                             className="form-control text-start dropdown-toggle"
//                                             type="button"
//                                             data-bs-toggle="dropdown"
//                                         >
//                                             {zoneName || "Select a Zone"}
//                                         </button>

//                                         <ul
//                                             className="dropdown-menu w-100"
//                                             style={{ maxHeight: "200px", overflowY: "auto" }}
//                                         >
//                                             {zones.length > 0 ? (
//                                                 zones.map((el) => (
//                                                     <li key={el._id}>
//                                                         <button
//                                                             type="button"
//                                                             className="dropdown-item"
//                                                             onClick={() => {
//                                                                 setZoneName(el.zoneName);
//                                                                 setZoneId(el._id);
//                                                                 setStateName("");
//                                                             }}
//                                                         >
//                                                             {el.zoneName}
//                                                         </button>
//                                                     </li>
//                                                 ))
//                                             ) : (
//                                                 <li className="dropdown-item text-muted">
//                                                     No Zones Found
//                                                 </li>
//                                             )}
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 {/* State Dropdown */}
//                                 <div className="col-12">
//                                     <label className="form-label">State Name</label>
//                                     <div className="dropdown">
//                                         <button
//                                             className="form-control text-start dropdown-toggle"
//                                             type="button"
//                                             data-bs-toggle="dropdown"
//                                             disabled={!zoneId}
//                                             onClick={() => {
//                                                 if (!zoneId) {
//                                                     Swal.fire({
//                                                         icon: "warning",
//                                                         title: "Select Zone First",
//                                                         text: "Please select Zone before State",
//                                                         timer: 2000,
//                                                     });
//                                                 }
//                                             }}
//                                         >
//                                             {stateName || "Select a State"}
//                                         </button>

//                                         <ul
//                                             className="dropdown-menu w-100"
//                                             style={{ maxHeight: "200px", overflowY: "auto" }}
//                                         >
//                                             {states.length > 0 ? (
//                                                 states.map((el) => (
//                                                     <li key={el._id}>
//                                                         <button
//                                                             type="button"
//                                                             className="dropdown-item"
//                                                             onClick={() => setStateName(el.name)}
//                                                         >
//                                                             {el.name}
//                                                         </button>
//                                                     </li>
//                                                 ))
//                                             ) : (
//                                                 <li className="dropdown-item text-muted">
//                                                     No States Found
//                                                 </li>
//                                             )}
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 {/* Submit */}
//                                 <div className="text-center">
//                                     <button
//                                         type="submit"
//                                         className="btn"
//                                         style={{ background: "#6776f4", color: "white" }}
//                                     >
//                                         Submit
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// }

import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function AddState() {
    const [zoneName, setZoneName] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [zones, setZones] = useState([]);

    const [states, setStates] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]);

    const [load, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);

        ApiServices.GetAllZone({ status: "true" })
            .then(res => setZones(res?.data?.data || []))
            .catch(() => {});

        ApiServices.GetAllStates()
            .then(res => setStates(res?.data?.data || []))
            .catch(() => {});

        setTimeout(() => setLoad(false), 1000);
    }, []);

    const handleStateToggle = (stateName) => {
        if (selectedStates.includes(stateName)) {
            setSelectedStates(prev => prev.filter(s => s !== stateName));
        } else {
            setSelectedStates(prev => [...prev, stateName]);
        }
    };

    const handleForm = (e) => {
        e.preventDefault();

        if (!zoneId) {
            Swal.fire("Error", "Please select Zone", "error");
            return;
        }

        if (selectedStates.length === 0) {
            Swal.fire("Error", "Select at least one State", "error");
            return;
        }

        setLoad(true);

        ApiServices.AddState({
            zoneId,
            stateName: selectedStates
        })
            .then(res => {
                setLoad(false);
                if (res?.data?.success) {
                    Swal.fire("Success", "State Added Successfully", "success");
                    setZoneName("");
                    setZoneId("");
                    setSelectedStates([]);
                } else {
                    Swal.fire("Error", res?.data?.message, "error");
                }
            })
            .catch(() => {
                setLoad(false);
                Swal.fire("Error", "Something went wrong", "error");
            });
    };

    return (
        <main id="main" className="main">
            <PageTitle child="Add State" />

            <div className="container-fluid">
                <ScaleLoader
                    color="#6776f4"
                    cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                    loading={load}
                />

                <div className={load ? "display-screen" : ""}>
                    <div className="col-lg-6 mx-auto mt-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">State Details</h5>

                                <form className="row g-3" onSubmit={handleForm}>

                                    {/* Zone Dropdown Button */}
                                    <div className="col-12">
                                        <label className="form-label">Zone Name</label>
                                        <div className="dropdown">
                                            <button
                                                className="form-control text-start dropdown-toggle"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                            >
                                                {zoneName || "Select a Zone"}
                                            </button>
                                            <ul
                                                className="dropdown-menu w-100"
                                                style={{ maxHeight: "200px", overflowY: "auto" }}
                                            >
                                                {zones.length > 0 ? (
                                                    zones.map(z => (
                                                        <li key={z._id}>
                                                            <button
                                                                type="button"
                                                                className="dropdown-item"
                                                                onClick={() => {
                                                                    setZoneName(z.zoneName);
                                                                    setZoneId(z._id);
                                                                    setSelectedStates([]);
                                                                }}
                                                            >
                                                                {z.zoneName}
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="dropdown-item text-muted">No Zones Found</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* States Checkbox (ApprovalPolicy Style) */}
                                    <div className="col-12">
                                        <label className="form-label">State Name</label>
                                        <div className="border rounded p-2">
                                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                {states.length > 0 ? (
                                                    states.map(state => {
                                                        const index = selectedStates.indexOf(state.name);
                                                        return (
                                                            <div
                                                                key={state._id}
                                                                className="form-check d-flex align-items-center gap-2"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    checked={index !== -1}
                                                                    disabled={!zoneId}
                                                                    onChange={() => handleStateToggle(state.name)}
                                                                />
                                                                <label className="form-check-label">
                                                                    {state.name}
                                                                    {index !== -1 && (
                                                                        <span
                                                                            className="badge ms-2"
                                                                            style={{ background: "#6776f4" }}
                                                                        >
                                                                            {index + 1}
                                                                        </span>
                                                                    )}
                                                                </label>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-muted mb-0">No States Found</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn"
                                            style={{ background: "#6776f4", color: "white" }}
                                        >
                                            Submit
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}


