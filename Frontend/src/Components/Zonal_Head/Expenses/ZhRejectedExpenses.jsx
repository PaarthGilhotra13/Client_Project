import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";

export default function ZhRejectedExpenses() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);

    const userId = sessionStorage.getItem("userId");

    /* ================= FETCH REJECTED (ZH) ================= */
    const fetchRejected = () => {
        if (!userId) {
            Swal.fire("Error", "User not logged in", "error");
            setLoad(false);
            return;
        }

        ApiServices.MyApprovalActions({
            userId: userId,
            action: "Rejected",
            level: "ZONAL_HEAD"
        })
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
    };

    useEffect(() => {
        fetchRejected();
    }, []);

    return (
        <>
            <main className="main" id="main">
                {/* ✅ FIXED TITLE */}
                <PageTitle child="Rejected Expenses (Zonal Head)" />

                <ScaleLoader
                    color="#6776f4"
                    cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                    size={200}
                    loading={load}
                />

                {!load && (
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-lg-12 mt-4 table-responsive">
                                <table className="table table-hover table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Sr. No</th>
                                            <th>Ticket ID</th>
                                            <th>Store</th>
                                            <th>Expense Head</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Comment</th>
                                            <th>Action Date</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.length > 0 ? (
                                            data.map((el, index) => (
                                                <tr key={el._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.expenseId?.ticketId}</td>
                                                    <td>{el.expenseId?.storeId?.storeName}</td>
                                                    <td>{el.expenseId?.expenseHeadId?.name}</td>
                                                    <td>₹ {el.expenseId?.amount}</td>
                                                    <td>
                                                        <span className="badge bg-danger">
                                                            Rejected
                                                        </span>
                                                    </td>
                                                    <td>{el.comment || "-"}</td>
                                                    <td>{new Date(el.actionAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center text-muted">
                                                    No Rejected Expenses Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
