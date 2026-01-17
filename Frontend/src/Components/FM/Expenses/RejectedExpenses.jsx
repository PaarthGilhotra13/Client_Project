import { useEffect, useState } from "react";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

export default function RejectedExpenses() {

    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        const userId = sessionStorage.getItem("userId");

        if (!userId) {
            Swal.fire("Error", "User not logged in", "error");
            setLoad(false);
            return;
        }

        ApiServices.MyExpenses({
            userId: userId,
            currentStatus: "Rejected"  
        })
            .then((res) => {
                if (res?.data?.success) {
                    setData(res?.data?.data || []);
                } else {
                    setData([]);
                }
                setTimeout(() => setLoad(false), 500);
            })
            .catch(() => {
                setData([]);
                setTimeout(() => setLoad(false), 500);
            });

    }, []);

    return (
        <>
            <main className="main" id="main">
                <PageTitle child="Rejected Expenses" /> 

                {/* Loader */}
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

                {/* Table */}
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
                                            <th>Created At</th>
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
                                                    <td>
                                                        <span className="badge bg-danger">
                                                            Rejected 
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {new Date(el.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted">
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
