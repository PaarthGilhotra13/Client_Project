import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditCity() {
    const [zoneName, setZoneName] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [zones, setZones] = useState([]);

    const [states, setStates] = useState([]);
    const [selectedStates, setSelectedStates] = useState([]);

    const [load, setLoad] = useState(false);

    const params = useParams();
    const nav = useNavigate();

    /* ================= INITIAL LOAD ================= */
    useEffect(() => {
        setLoad(true);

        // Zones
        ApiServices.GetAllZone({ status: "true" })
            .then(res => setZones(res?.data?.data || []))
            .catch(() => { });

        // All States list
        ApiServices.GetAllStates()
            .then(res => setStates(res?.data?.data || []))
            .catch(() => { });

        // Single State (EDIT DATA)
        ApiServices.GetSingleState({ _id: params.id })
            .then(res => {
                const data = res?.data?.data;

                setZoneName(data?.zoneId?.zoneName);
                setZoneId(data?.zoneId?._id);
                setSelectedStates(data?.stateName || []);

                setTimeout(() => setLoad(false), 1000);
            })
            .catch(() => setLoad(false));
    }, [params.id]);

    /* ================= STATE TOGGLE ================= */
    const handleStateToggle = (stateName) => {
        setSelectedStates(prev =>
            prev.includes(stateName)
                ? prev.filter(s => s !== stateName)
                : [...prev, stateName]
        );
    };

    /* ================= SUBMIT ================= */
    function handleForm(e) {
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

        ApiServices.UpdateState({
            _id: params.id,
            zoneId: zoneId,
            stateName: selectedStates
        })
            .then(res => {
                setLoad(false);
                if (res?.data?.success) {
                    Swal.fire("Success", res.data.message, "success");
                    nav("/admin/manageState");
                } else {
                    Swal.fire("Error", res?.data?.message, "error");
                }
            })
            .catch(() => {
                setLoad(false);
                Swal.fire("Error", "Something went wrong", "error");
            });
    }

    /* ================= BUTTON TEXT ================= */
    const stateButtonText =
        selectedStates.length === 0
            ? "Select State(s)"
            : selectedStates.length <= 2
                ? selectedStates.join(", ")
                : `${selectedStates.slice(0, 2).join(", ")} +${selectedStates.length - 2} more`;

    return (
        <main id="main" className="main">
            <PageTitle child="Edit State" />

            <div className="container-fluid">
                <ScaleLoader
                    color="#6776f4"
                    cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                    loading={load}
                />

                <div className={load ? "display-screen" : ""}>
                    {!load && (
                        <div className="col-lg-6 mx-auto mt-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">State Details</h5>

                                    <form className="row g-3" onSubmit={handleForm}>

                                        {/* ================= ZONE ================= */}
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
                                                    {zones.map(z => (
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
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* ================= STATE (ADD PAGE STYLE) ================= */}
                                        <div className="col-12">
                                            <label className="form-label">State Name</label>
                                            <div className="dropdown">
                                                <button
                                                    className="form-control text-start dropdown-toggle"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    disabled={!zoneId}
                                                >
                                                    {stateButtonText}
                                                </button>

                                                <ul
                                                    className="dropdown-menu w-100 p-2"
                                                    style={{ maxHeight: "220px", overflowY: "auto" }}
                                                >
                                                    {states.map(state => {
                                                        const index = selectedStates.indexOf(state.name);

                                                        return (
                                                            <li key={state._id}>
                                                                <div className="form-check d-flex justify-content-between align-items-center">
                                                                    <label className="form-check-label">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input me-2"
                                                                            checked={index !== -1}
                                                                            onChange={() => handleStateToggle(state.name)}
                                                                        />
                                                                        {state.name}
                                                                    </label>

                                                                    {index !== -1 && (
                                                                        <span
                                                                            className="badge"
                                                                            style={{ background: "#6776f4" }}
                                                                        >
                                                                            {index + 1}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* ================= SUBMIT ================= */}
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
                    )}
                </div>
            </div>
        </main>
    );
}
