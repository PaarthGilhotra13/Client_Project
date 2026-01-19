import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function BlockedState() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");

    useEffect(() => {
        ApiServices.GetAllState()
            .then((res) => {
                if (res?.data?.success) {
                    setData(res.data.data || []);
                } else {
                    setData([]);
                }
                setTimeout(() => setLoad(false), 500);
            })
            .catch(() => {
                setData([]);
                setTimeout(() => setLoad(false), 500);
            });
    }, [load]);

    const blockedStates = data.filter((el) => el.status === false);

    function changeActiveStatus(id) {
        Swal.fire({
            title: "Unblock State?",
            text: "Do you want to unblock this state?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#198754",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Unblock",
        }).then((result) => {
            if (result.isConfirmed) {
                let payload = { _id: id, status: true };
                ApiServices.ChangeStatusState(payload)
                    .then((res) => {
                        if (res?.data?.success) {
                            Swal.fire({
                                icon: "success",
                                title: res.data.message,
                                showConfirmButton: false,
                                timer: 1200,
                            });
                            setLoad(true);
                        }
                    })
                    .catch(() => {
                        Swal.fire("Error", "Something went wrong!", "error");
                    });
            }
        });
    }

    const truncateText = (text, limit = 50) => {
        if (!text) return "";
        if (text.length <= limit) return text;
        return text.slice(0, limit) + "...";
    };

    return (
        <>
            <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
                <PageTitle child="Blocked State" />

                <div className="container-fluid">
                    <ScaleLoader
                        color="#6776f4"
                        cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                        size={200}
                        loading={load}
                    />
                </div>

                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 mt-5 table-responsive">
                            {!load && (
                                <table className="table table-hover table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Zone</th>
                                            <th>States</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blockedStates.length ? (
                                            blockedStates.map((el, index) => (
                                                <tr key={el._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.zoneId?.zoneName}</td>
                                                    <td>
                                                        {truncateText(el.stateName.join(", "), 50)}
                                                        {el.stateName.join(", ").length > 50 && (
                                                            <span
                                                                style={{
                                                                    color: "blue",
                                                                    cursor: "pointer",
                                                                    marginLeft: "5px",
                                                                }}
                                                                onClick={() => {
                                                                    setModalTitle(el.zoneId?.zoneName || "States");
                                                                    setModalContent(el.stateName.join(", "));
                                                                    setModalOpen(true);
                                                                }}
                                                            >
                                                                View More
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-danger">Blocked</span>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group">
                                                            {/* Unblock Button */}
                                                            <button
                                                                className="btn ms-2"
                                                                style={{ background: "#198754", color: "white" }}
                                                                onClick={() => changeActiveStatus(el._id)}
                                                            >
                                                                <i className="bi bi-check-circle"></i> Unblock
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center text-muted">
                                                    No Blocked State Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div
                        className="modal-box position-relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="btn-close btn-close-red btn-close-large position-absolute top-0 end-0 m-2"
                            aria-label="Close"
                            onClick={() => setModalOpen(false)}
                        ></button>

                        <h5 className="pe-4">{modalTitle}</h5>
                        <p style={{ textAlign: "justify" }}>{modalContent}</p>
                    </div>
                </div>
            )}
        </>
    );
}
