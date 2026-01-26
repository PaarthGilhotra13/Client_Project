import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";
import { ScaleLoader } from "react-spinners";

export default function FacilityManagerDashboard() {

    const [load, setLoad] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        setLoad(true);

        ApiServices.FMDashboard()
            .then((res) => {
                console.log("FM DASHBOARD RESPONSE 👉", res.data);
                setData(res?.data?.data || {});
                setLoad(false);
            })
            .catch((err) => {
                console.log("FM DASHBOARD ERROR ❌", err);
                setLoad(false);
            });

    }, []);

    return (
        <>
            <main id="main" className="main" style={{ position: "relative" }}>

                {/* 🔥 Loader (UI hide nahi karega) */}
                {load && (
                    <div
                        style={{
                            position: "absolute",
                            top: "40%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 10
                        }}
                    >
                        <ScaleLoader color="#6776f4" />
                    </div>
                )}

                {/* 🔥 UI ALWAYS RENDER HOGI */}
                <div className="container-fluid my-4" style={{ cursor: "default" }}>

                    <h3 style={{ color: "#012970" }}>
                        <strong>Facility Manager Dashboard</strong>
                    </h3>

                    <div className="row justify-content-center mt-4">

                        {/* Assigned Requests */}
                        <div className="col-xxl-4 col-md-6 mb-4">
                            <div className="card info-card">
                                <div className="card-body mb-4 position-relative">
                                    <h5 className="card-title">Assigned Requests</h5>
                                    <div className="d-flex align-items-center mt-4">
                                        <div
                                            className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{ width: 50, height: 50, backgroundColor: "#4B49AC" }}
                                        >
                                            <i className="bi bi-kanban-fill fs-4" />
                                        </div>
                                        <h6 className="fw-bold mb-0">
                                            {data?.assignedRequests ?? 0}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* In Process */}
                        <div className="col-xxl-4 col-md-6 mb-4">
                            <div className="card info-card">
                                <div className="card-body mb-4 position-relative">
                                    <h5 className="card-title">In Process</h5>
                                    <div className="d-flex align-items-center mt-4">
                                        <div
                                            className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{ width: 50, height: 50, backgroundColor: "#FFA500" }}
                                        >
                                            <i className="bi bi-clock-history fs-4" />
                                        </div>
                                        <h6 className="fw-bold mb-0">
                                            {data?.inProcess ?? 0}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="col-xxl-4 col-md-6 mb-4">
                            <div className="card info-card">
                                <div className="card-body mb-4 position-relative">
                                    <h5 className="card-title">Pending Approvals</h5>
                                    <div className="d-flex align-items-center mt-4">
                                        <div
                                            className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{ width: 50, height: 50, backgroundColor: "#17A2B8" }}
                                        >
                                            <i className="bi bi-hourglass-split fs-4" />
                                        </div>
                                        <h6 className="fw-bold mb-0">
                                            {data?.pendingApprovals ?? 0}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Approved */}
                        <div className="col-xxl-4 col-md-6 mb-4">
                            <div className="card info-card">
                                <div className="card-body mb-4 position-relative">
                                    <h5 className="card-title">Approved</h5>
                                    <div className="d-flex align-items-center mt-4">
                                        <div
                                            className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{ width: 50, height: 50, backgroundColor: "#28A745" }}
                                        >
                                            <i className="bi bi-check-circle-fill fs-4" />
                                        </div>
                                        <h6 className="fw-bold mb-0">
                                            {data?.approved ?? 0}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rejected */}
                        <div className="col-xxl-4 col-md-6 mb-4">
                            <div className="card info-card">
                                <div className="card-body mb-4 position-relative">
                                    <h5 className="card-title">Rejected</h5>
                                    <div className="d-flex align-items-center mt-4">
                                        <div
                                            className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{ width: 50, height: 50, backgroundColor: "#DC3545" }}
                                        >
                                            <i className="bi bi-x-circle-fill fs-4" />
                                        </div>
                                        <h6 className="fw-bold mb-0">
                                            {data?.rejected ?? 0}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Missed Deadlines */}
                        <div className="col-xxl-4 col-md-6 mb-4">
                            <div className="card info-card">
                                <div className="card-body mb-4 position-relative">
                                    <h5 className="card-title">Missed Deadlines</h5>
                                    <div className="d-flex align-items-center mt-4">
                                        <div
                                            className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{ width: 50, height: 50, backgroundColor: "#DC3545" }}
                                        >
                                            <i className="bi bi-exclamation-circle fs-4" />
                                        </div>
                                        <h6 className="fw-bold mb-0">
                                            {data?.missedDeadlines ?? 0}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}
