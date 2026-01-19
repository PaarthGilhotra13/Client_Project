import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

export default function EditState() {
    const [zoneId, setZoneId] = useState("");
    const [zones, setZones] = useState([]);

    const [stateName, setStateName] = useState("");
    const [states, setStates] = useState([]);

    const [load, setLoad] = useState(false);

    const params = useParams();
    const nav = useNavigate();

    useEffect(() => {
        setLoad(true);

        // Get Zones
        ApiServices.GetAllZone({ status: "true" })
            .then((res) => setZones(res?.data?.data || []))
            .catch((err) => console.error("Zone Fetch Error:", err));

        // Get States
        ApiServices.GetAllStates()
            .then((res) => setStates(res?.data?.data?.states || []))
            .catch((err) => console.error("State Fetch Error:", err));

        // Get Single State
        ApiServices.GetSingleState({ _id: params.id })
            .then((res) => {
                const currentState = res?.data?.data;
                setStateName(currentState?.stateName || "");
                setZoneId(currentState?.zoneId?._id || "");
                setLoad(false);
            })
            .catch((err) => {
                console.error("Single State Fetch Error:", err);
                setLoad(false);
            });
    }, []);

    const handleForm = (e) => {
        e.preventDefault();

        if (!stateName || !zoneId) {
            Swal.fire("Error", "State and Zone are required", "error");
            return;
        }

        setLoad(true);
        const data = {
            _id: params.id,
            stateName,
            zoneId,
        };

        ApiServices.UpdateState(data)
            .then((res) => {
                setLoad(false);
                if (res?.data?.success) {
                    Swal.fire("Success", res.data.message, "success");
                    nav("/admin/manageState");
                } else {
                    Swal.fire("Error", res.data.message || "Update failed", "error");
                }
            })
            .catch((err) => {
                setLoad(false);
                Swal.fire("Error", "Something went wrong", "error");
                console.error("UpdateState Error:", err);
            });
    };

    // Ensure current state is included in the list
    const stateList = stateName && !states.find((s) => s.name === stateName)
        ? [{ _id: "current", name: stateName }, ...states]
        : states;

    return (
        <main id="main" className="main">
            <PageTitle child="Edit State" />

            <div className="container-fluid">
                <ScaleLoader
                    color="#6776f4"
                    cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                    size={200}
                    loading={load}
                />

                <div className={load ? "display-screen" : ""}>
                    <div className="col-lg-6 mx-auto mt-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">State Details</h5>

                                <form className="row g-3" onSubmit={handleForm}>

                                    {/* Zone Selection */}
                                    <div className="col-12">
                                        <label className="form-label">Select Zone</label>
                                        <div className="border rounded p-2" style={{ maxHeight: "150px", overflowY: "auto" }}>
                                            {zones.length > 0 ? (
                                                zones.map((zone) => (
                                                    <div
                                                        key={zone._id}
                                                        className={`p-1 border-bottom ${zone._id === zoneId ? "bg-light" : ""}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => setZoneId(zone._id)}
                                                    >
                                                        {zone.zoneName}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-muted">No Zones Found</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* State Selection */}
                                    <div className="col-12">
                                        <label className="form-label">Select State</label>
                                        <div className="border rounded p-2" style={{ maxHeight: "150px", overflowY: "auto" }}>
                                            {stateList.length > 0 ? (
                                                stateList.map((st) => (
                                                    <div
                                                        key={st._id}
                                                        className={`p-1 border-bottom ${st.name === stateName ? "bg-light" : ""}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => setStateName(st.name)}
                                                    >
                                                        {st.name}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-muted">No States Found</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn"
                                            style={{ background: "#6776f4", color: "white" }}
                                        >
                                            Update
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
