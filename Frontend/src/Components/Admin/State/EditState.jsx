import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function EditState() {
    const [zoneName, setZoneName] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [zones, setZones] = useState([]);

    const [stateName, setStateName] = useState("");
    const [states, setStates] = useState([]);

    const [load, setLoad] = useState(false);
    var params = useParams()
    var nav = useNavigate()


    useEffect(() => {
        setLoad(true)
        // Get Zones
        ApiServices.GetAllZone({ status: "true" })
            .then((res) => {
                setZones(res?.data?.data || []);
            })
            .catch((err) => {
                console.error("Zone Fetch Error:", err);
            });

        // Get States
        ApiServices.GetAllStates()
            .then((res) => {
                setStates(res?.data?.data?.states || []);
            })
            .catch((err) => {
                console.error("State Fetch Error:", err);
            })

        let data = {
            _id: params.id
        }
        ApiServices.GetSingleState(data)
            .then((res) => {
                setStateName(res?.data?.data?.stateName)
                setZoneName(res?.data?.data?.zoneId?.zoneName)
                setTimeout(() => {
                    setLoad(false)
                }, 1000)

            })
            .catch((err) => {
                console.log("err is", err);
            })
    }, [])

    function handleForm(e) {
        e.preventDefault()
        let data = {
            _id: params.id,
            stateName: stateName,
            zoneId: zoneId
        }
        ApiServices.UpdateState(data)
            .then((res) => {
                setLoad(true)
                var message = res?.data?.message
                if (res?.data?.success) {
                    Swal.fire({
                        title: message,
                        icon: "success",
                        draggable: true,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                        nav("/admin/manageState")
                    }, 1000)
                }
                else {
                    console.log(message);

                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: message,
                        confirmButtonText: 'Continue',
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setTimeout(() => {
                        setLoad(false)
                    }, 1000)
                }
            })
            .catch((err) => {
                setLoad(true)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    confirmButtonText: 'Continue',
                    timer: 2000,
                    timerProgressBar: true,
                });
                setTimeout(() => {
                    setLoad(false)
                }, 2000)
                console.log("Error is ", err);

            })
    }

    return (
        <>
            <main id="main" className="main">
                <PageTitle child="Edit State" />
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                        </div>
                    </div>
                </div>
                <div className={load ? "display-screen" : ""}>


                    <div className={load ? "d-none" : ""}>
                        <div className="col-lg-6 mx-auto mt-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">State Details</h5>

                                    <form className="row g-3" onSubmit={handleForm}>
                                        {/* Zone Dropdown */}
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
                                                        zones.map((el) => (
                                                            <li key={el._id}>
                                                                <button
                                                                    type="button"
                                                                    className="dropdown-item"
                                                                    onClick={() => {
                                                                        setZoneName(el.zoneName);
                                                                        setZoneId(el._id);
                                                                    }}
                                                                >
                                                                    {el.zoneName}
                                                                </button>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="dropdown-item text-muted">
                                                            No Zones Found
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* State Dropdown */}
                                        <div className="col-12">
                                            <label className="form-label">State Name</label>
                                            <div className="dropdown">
                                                <button
                                                    className="form-control text-start dropdown-toggle"
                                                    type="button"
                                                    data-bs-toggle="dropdown"

                                                >
                                                    {stateName || "Select a State"}
                                                </button>

                                                <ul
                                                    className="dropdown-menu w-100"
                                                    style={{ maxHeight: "200px", overflowY: "auto" }}
                                                >
                                                    {states.length > 0 ? (
                                                        states.map((el) => (
                                                            <li key={el._id}>
                                                                <button
                                                                    type="button"
                                                                    className="dropdown-item"
                                                                    onClick={() => setStateName(el.name)}
                                                                >
                                                                    {el.name}
                                                                </button>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="dropdown-item text-muted">
                                                            No States Found
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Submit */}
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

        </>
    )
}