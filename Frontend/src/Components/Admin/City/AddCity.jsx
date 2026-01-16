import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function AddCity() {
    const [zoneName, setZoneName] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [zones, setZones] = useState([]);

    const [stateName, setStateName] = useState("");
    const [stateId, setStateId] = useState("");
    const [states, setStates] = useState([]);

    const [cityName, setCityName] = useState("");
    const [cities, setCities] = useState([]);

    const [load, setLoad] = useState(false);
    const [cityLoading, setCityLoading] = useState(false); // ✅ NEW

    useEffect(() => {
        ApiServices.GetAllZone({ status: "true" })
            .then((res) => {
                setZones(res?.data?.data || []);
            })
            .catch((err) => console.log("Zone Error", err));
    }, []);

    const loadStatesByZone = (zId) => {
        ApiServices.GetAllState({ zoneId: zId })
            .then((res) => {
                setStates(res?.data?.data || []);
            })
            .catch(() => setStates([]));
    };

    // ✅ FIXED CITY LOADER
    const loadCities = (sName) => {
        setCityLoading(true);      // ✅ start loading
        setCities([]);             // clear old cities

        ApiServices.GetCitiesByState(sName)
            .then((res) => {
                setCities(res?.data?.data || []);
            })
            .catch(() => setCities([]))
            .finally(() => {
                setCityLoading(false); // ✅ stop loading
            });
    };

    const handleForm = (e) => {
        e.preventDefault();

        if (!zoneId || !stateId || !cityName) {
            Swal.fire({
                icon: "error",
                title: "Missing Fields",
                text: "Please select Zone, State and City",
                timer: 2000,
            });
            return;
        }

        setLoad(true);

        ApiServices.AddCity({
            zoneId,
            stateId,
            cityName,
        })
            .then((res) => {
                if (res?.data?.success) {
                    Swal.fire({
                        icon: "success",
                        title: "City Added Successfully",
                        timer: 2000,
                    });

                    setZoneName("");
                    setZoneId("");
                    setStateName("");
                    setStateId("");
                    setCityName("");
                    setStates([]);
                    setCities([]);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: res?.data?.message || "Failed",
                    });
                }
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                });
            })
            .finally(() => setLoad(false));
    };

    return (
        <main id="main" className="main">
            <PageTitle child="Add City" />

            {load && (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader
                                color="#6776f4"
                                cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                                size={200}
                                loading={load}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className={load ? "d-none" : ""}>
                <div className="col-lg-6 mx-auto mt-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">City Details</h5>

                            <form className="row g-3" onSubmit={handleForm}>

                                {/* ZONE */}
                                <div className="col-12">
                                    <label className="form-label">Zone Name</label>
                                    <div className="dropdown">
                                        <button className="form-control text-start dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                            {zoneName || "Select a Zone"}
                                        </button>

                                        <ul className="dropdown-menu w-100" style={{ maxHeight: 200, overflowY: "auto" }}>
                                            {zones.length > 0 ? zones.map((el) => (
                                                <li key={el._id}>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setZoneName(el.zoneName);
                                                            setZoneId(el._id);
                                                            setStateName("");
                                                            setStateId("");
                                                            setCityName("");
                                                            setCities([]);
                                                            loadStatesByZone(el._id);
                                                        }}
                                                    >
                                                        {el.zoneName}
                                                    </button>
                                                </li>
                                            )) : (
                                                <li className="dropdown-item text-muted">No Zones Found</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* STATE */}
                                <div className="col-12">
                                    <label className="form-label">State Name</label>
                                    <div className="dropdown">
                                        <button
                                            className="form-control text-start dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            disabled={!zoneId}
                                        >
                                            {stateName || "Select a State"}
                                        </button>

                                        <ul className="dropdown-menu w-100" style={{ maxHeight: 200, overflowY: "auto" }}>
                                            {states.length > 0 ? states.map((el) => (
                                                <li key={el._id}>
                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setStateName(el.stateName);
                                                            setStateId(el._id);
                                                            setCityName("");
                                                            loadCities(el.stateName);
                                                        }}
                                                    >
                                                        {el.stateName}
                                                    </button>
                                                </li>
                                            )) : (
                                                <li className="dropdown-item text-muted">No States Found</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* CITY */}
                                <div className="col-12">
                                    <label className="form-label">City Name</label>
                                    <div className="dropdown">
                                        <button
                                            className="form-control text-start dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            disabled={!stateId || cityLoading} 
                                        >
                                            {cityLoading ? "Loading cities..." : (cityName || "Select a City")}
                                        </button>

                                        <ul className="dropdown-menu w-100" style={{ maxHeight: 200, overflowY: "auto" }}>
                                            {cityLoading ? (
                                                <li className="dropdown-item text-muted">Loading cities...</li>
                                            ) : cities.length > 0 ? (
                                                cities.map((el, index) => (
                                                    <li key={index}>
                                                        <button
                                                            type="button"
                                                            className="dropdown-item"
                                                            onClick={() => setCityName(el)}
                                                        >
                                                            {el}
                                                        </button>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="dropdown-item text-muted">No Cities Found</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn" style={{ background: "#6776f4", color: "white" }}>
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
