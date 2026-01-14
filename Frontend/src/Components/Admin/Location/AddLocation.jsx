// import { useEffect, useState } from "react"
// import { ScaleLoader } from "react-spinners"
// import PageTitle from "../../PageTitle"
// import ApiServices from "../../../ApiServices"
// import { toast } from "react-toastify"
// import Swal from "sweetalert2"

// export default function AddLocation() {
//     var [zoneName, setZoneName] = useState("")
//     var [cityName, setCityName] = useState("")
//     var [zones, setZones] = useState([])
//     var [cities, setCities] = useState([])
//     var [stateName, setStateName] = useState("")
//     var [states, setStates] = useState([])

//     var [load, setLoad] = useState(false)

//     useEffect(() => {
//         setLoad(true)
//         ApiServices.GetAllStates()
//             .then((res) => {
//                 if (res?.data?.success) {
//                     setStates(res.data.data.states);
//                 }
//             })
//             .catch((err) => {
//                 console.log("State fetch error", err);
//             });
//         setTimeout(() => {
//             setLoad(false)
//         }, 1000)
//     }, [])

//     function handleForm(e) {
//         e.preventDefault()
//         let data = {
//             cityName: cityName,
//             zoneName: zoneName,
//             stateName: stateName
//         }
//         if (!zoneId) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Oops...",
//                 text: "Please select a Zone before submitting.",
//                 timer: 3000,
//                 timerProgressBar: true,
//             });
//             return;
//         }
//         ApiServices.AddCity(data)
//             .then((res) => {
//                 setLoad(true)
//                 var message = res?.data?.message
//                 if (res?.data?.success) {
//                     Swal.fire({
//                         title: "City Added Successfully",
//                         icon: "success",
//                         draggable: true,
//                         confirmButtonText: 'Continue',
//                         timer: 2000,
//                         timerProgressBar: true,
//                     });
//                     setTimeout(() => {
//                         setLoad(false)
//                         setCityName("")
//                         setZoneName("")
//                     }, 2000)
//                 }
//                 else {
//                     Swal.fire({
//                         icon: "error",
//                         title: "Oops...",
//                         text: message,
//                         confirmButtonText: 'Continue',
//                         timer: 2000,
//                         timerProgressBar: true,
//                     });
//                     setTimeout(() => {
//                         setLoad(false)
//                     }, 2000)
//                 }
//             })
//             .catch((err) => {
//                 setLoad(true)
//                 Swal.fire({
//                     icon: "error",
//                     title: "Oops...",
//                     text: "Something went wrong!",
//                     confirmButtonText: 'Continue',
//                     timer: 2000,
//                     timerProgressBar: true,
//                 });
//                 setTimeout(() => {
//                     setLoad(false)
//                 }, 2000)
//                 console.log("Error is ", err);
//             })
//     }

//     return (
//         <>
//             <main id="main" className="main">
//                 <PageTitle child="Add Location" />
//                 <div className="container-fluid ">
//                     <div className="row">
//                         <div className="col-md-12">
//                             <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
//                         </div>
//                     </div>
//                 </div>
//                 <div className={load ? "display-screen" : ""}>


//                     <div className="col-lg-6 mx-auto mt-3">
//                         <div className="card">
//                             <div className="card-body">
//                                 <h5 className="card-title">Location Details</h5>
//                                 {/* Vertical Form */}
//                                 <form className="row g-3" onSubmit={handleForm}>
//                                     <div className="col-12">
//                                         <label htmlFor="CategotyName" className="form-label">
//                                             Zones
//                                         </label>
//                                         <div className="dropdown text-center ">
//                                             <button
//                                                 className="form-control text-start dropdown-toggle"
//                                                 type="button"
//                                                 id="categoryDropdown"
//                                                 data-bs-toggle="dropdown"
//                                                 aria-expanded="false"
//                                             >
//                                                 {zoneName || "Select a Zone"}
//                                             </button>
//                                             <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
//                                                 <li >
//                                                     <button
//                                                         type="button"
//                                                         className="dropdown-item"
//                                                         onClick={() => setZoneName("East")}
//                                                     >
//                                                         East
//                                                     </button>
//                                                 </li>
//                                                 <li >
//                                                     <button
//                                                         type="button"
//                                                         className="dropdown-item"
//                                                         onClick={() => setZoneName("West")}
//                                                     >
//                                                         West
//                                                     </button>
//                                                 </li>
//                                                 <li >
//                                                     <button
//                                                         type="button"
//                                                         className="dropdown-item"
//                                                         onClick={() => setZoneName("North")}
//                                                     >
//                                                         North
//                                                     </button>
//                                                 </li>
//                                                 <li >
//                                                     <button
//                                                         type="button"
//                                                         className="dropdown-item"
//                                                         onClick={() => setZoneName("South 1")}
//                                                     >
//                                                         South 1
//                                                     </button>
//                                                 </li>
//                                                 <li >
//                                                     <button
//                                                         type="button"
//                                                         className="dropdown-item"
//                                                         onClick={() => setZoneName("South 2")}
//                                                     >
//                                                         South 2
//                                                     </button>
//                                                 </li>
//                                             </ul>
//                                         </div>
//                                     </div>
//                                     <div className="col-12">
//                                         <label htmlFor="CategotyName" className="form-label">
//                                             State Name
//                                         </label>

//                                         <div className="dropdown text-center">
//                                             <button
//                                                 className="form-control text-start dropdown-toggle"
//                                                 type="button"
//                                                 id="stateDropdown"
//                                                 data-bs-toggle="dropdown"
//                                                 aria-expanded="false"
//                                             >
//                                                 {stateName || "Select a State"}
//                                             </button>

//                                             <ul
//                                                 className="dropdown-menu w-100"
//                                                 aria-labelledby="stateDropdown"
//                                                 style={{ maxHeight: "200px", overflowY: "auto" }}
//                                             >
//                                                 {states && states.length > 0 ? (
//                                                     states.map((el, index) => (
//                                                         <li key={el.code || index}>
//                                                             <button
//                                                                 type="button"
//                                                                 className="dropdown-item"
//                                                                 onClick={() => {
//                                                                     setStateName(el.name);
//                                                                 }}
//                                                             >
//                                                                 {el.name}
//                                                             </button>
//                                                         </li>
//                                                     ))
//                                                 ) : (
//                                                     <li>
//                                                         <span className="dropdown-item text-muted">
//                                                             No States found
//                                                         </span>
//                                                     </li>
//                                                 )}
//                                             </ul>
//                                         </div>
//                                     </div>

//                                     <div className="col-12">
//                                         <label htmlFor="CategotyName" className="form-label">
//                                             City Name
//                                         </label>
//                                         <div className="dropdown text-center ">
//                                             <button
//                                                 className="form-control text-start dropdown-toggle"
//                                                 type="button"
//                                                 id="categoryDropdown"
//                                                 data-bs-toggle="dropdown"
//                                                 aria-expanded="false"
//                                             >
//                                                 {cityName || "Select a City"}
//                                             </button>
//                                             {zones?.map((el, index) => {
//                                                 return (
//                                                     <>
//                                                         <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
//                                                             {zones.length > 0 ? (
//                                                                 zones.map((el) => (
//                                                                     <li key={el._id}>
//                                                                         <button
//                                                                             type="button"
//                                                                             className="dropdown-item"
//                                                                             onClick={() => {
//                                                                                 setZoneName(el.zoneName);
//                                                                                 setZoneId(el._id);
//                                                                             }}

//                                                                         >
//                                                                             {el.zoneName}
//                                                                         </button>
//                                                                     </li>
//                                                                 ))
//                                                             ) : (
//                                                                 <li><span className="dropdown-item text-muted">No Zones found</span></li>
//                                                             )}
//                                                         </ul>

//                                                     </>
//                                                 )
//                                             })}
//                                         </div>
//                                     </div>
//                                     <div className="text-center">
//                                         <button type="submit" className="btn" style={{ background: "#6776f4", color: "white" }}>
//                                             Submit
//                                         </button>

//                                     </div>
//                                 </form>
//                                 {/* Vertical Form */}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>

//         </>
//     )
// }

import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function AddLocation() {

    var [zoneName, setZoneName] = useState("");
    var [cityName, setCityName] = useState("");
    var [stateName, setStateName] = useState("");

    var [states, setStates] = useState([]);
    var [cities, setCities] = useState([]);

    var [load, setLoad] = useState(false);
    var [cityLoading, setCityLoading] = useState(false);

    /* ================= FETCH STATES ================= */
    useEffect(() => {
        setLoad(true);
        ApiServices.GetAllStates()
            .then((res) => {
                console.log("FULL RESPONSE 👉", res);
                console.log("DATA 👉", res?.data);
                console.log("STATES 👉", res?.data?.data?.states);
                if (res?.data?.success) {
                    setStates(res.data.data.states);
                }
            })
            .catch((err) => {
                console.log("State fetch error", err);
            })
            .finally(() => setLoad(false));
    }, []);

    /* ================= STATE SELECT ================= */
    const handleStateSelect = (name) => {
        setStateName(name);
        setCityName("");      // reset city
        setCities([]);        // clear old cities
        setCityLoading(true);

        ApiServices.GetCitiesByState(name)
            .then((res) => {
                if (res?.data?.success) {
                    setCities(res.data.data.cities);
                }
            })
            .catch((err) => console.log("City fetch error", err))
            .finally(() => setCityLoading(false));
    };

    /* ================= SUBMIT ================= */
    function handleForm(e) {
        e.preventDefault();

        if (!zoneName || !stateName || !cityName) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please select Zone, State and City",
            });
            return;
        }

        let data = {
            zoneName,
            stateName,
            cityName
        };

        console.log("Submit Data:", data);

        Swal.fire({
            icon: "success",
            title: "Location Added",
            timer: 1500
        });
    }

    return (
        <>
            <main id="main" className="main">
                <PageTitle child="Add Location" />

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader
                                color="#6776f4"
                                cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                                loading={load}
                            />
                        </div>
                    </div>
                </div>

                <div className={load ? "display-screen" : ""}>
                    <div className="col-lg-6 mx-auto mt-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Location Details</h5>

                                <form className="row g-3" onSubmit={handleForm}>

                                    {/* ================= ZONE ================= */}
                                    <div className="col-12">
                                        <label className="form-label">Zones</label>
                                        <div className="dropdown">
                                            <button className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown">
                                                {zoneName || "Select a Zone"}
                                            </button>
                                            <ul className="dropdown-menu w-100">
                                                {["East", "West", "North", "South 1", "South 2"].map((z) => (
                                                    <li key={z}>
                                                        <button
                                                            type="button"
                                                            className="dropdown-item"
                                                            onClick={() => setZoneName(z)}
                                                        >
                                                            {z}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* ================= STATE ================= */}
                                    <div className="col-12">
                                        <label className="form-label">State Name</label>
                                        <div className="dropdown">
                                            <button className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown">
                                                {stateName || "Select a State"}
                                            </button>
                                            <ul className="dropdown-menu w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                {states.length > 0 ? (
                                                    states.map((el, index) => (
                                                        <li key={el.code || index}>
                                                            <button
                                                                type="button"
                                                                className="dropdown-item"
                                                                onClick={() => handleStateSelect(el.name)}
                                                            >
                                                                {el.name}
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>
                                                        <span className="dropdown-item text-muted">No States found</span>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* ================= CITY ================= */}
                                    <div className="col-12">
                                        <label className="form-label">City Name</label>
                                        <div className="dropdown">
                                            <button
                                                className="form-control dropdown-toggle text-start"
                                                data-bs-toggle="dropdown"
                                                disabled={!stateName || cityLoading}
                                            >
                                                {!stateName
                                                    ? "Select State First"
                                                    : cityLoading
                                                        ? "Loading Cities..."
                                                        : cityName || "Select a City"}
                                            </button>
                                            <ul className="dropdown-menu w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                {cities.length > 0 ? (
                                                    cities.map((el, index) => (
                                                        <li key={index}>
                                                            <button
                                                                type="button"
                                                                className="dropdown-item"
                                                                onClick={() => setCityName(el.name)}
                                                            >
                                                                {el.name}
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>
                                                        <span className="dropdown-item text-muted">
                                                            {stateName ? "No Cities found" : "Select State First"}
                                                        </span>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button className="btn" style={{ background: "#6776f4", color: "white" }}>
                                            Submit
                                        </button>
                                    </div>

                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
