import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

export default function PendingExpense() {
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);

    /* ================= FETCH PENDING EXPENSE ================= */
    useEffect(() => {
        setLoad(true);

        ApiServices.MyExpenses({
            userId: sessionStorage.getItem("userId"),
            currentStatus: "Pending"
        })
            .then((res) => {
                if (res?.data?.success) {
                    setData(res.data.data || []);
                } else {
                    setData([]);
                }
                setTimeout(() => setLoad(false), 500);
            })
            .catch((err) => {
                console.log("Error is ", err);
                setTimeout(() => setLoad(false), 1000);
            });
    }, []);

    return (
        <main className="main" id="main">
            <PageTitle child="Pending Expenses" />

            {/* Loader */}
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

            {/* Table */}
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-12 mt-5 table-responsive">
                        {!load && (
                            <table className="table table-hover table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Sr. No</th>
                                        <th>Ticket ID</th>
                                        <th>Store</th>
                                        <th>Expense Head</th>
                                        <th>Amount</th>
                                        <th>Policy</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.length > 0 ? (
                                        data.map((el, index) => (
                                            <tr key={el._id}>
                                                <td>{index + 1}</td>
                                                <td>{el.ticketId}</td>
                                                <td>{el.storeId?.storeName}</td>
                                                <td>{el.expenseHeadId?.name}</td>
                                                <td>₹ {el.amount}</td>
                                                <td>{el.policy}</td>
                                                <td>
                                                    <span className="badge bg-warning text-dark">
                                                        Pending
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted">
                                                No Pending Expenses Found
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
    );
}
