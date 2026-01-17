import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import ApiServices from "../../../ApiServices";

export default function ManageExpenseHead() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    ApiServices.GetAllExpenseHead()
      .then((res) => {
        if (res?.data?.success) {
          setData(res?.data?.data || []);
        } else {
          setData([]);
        }
        setTimeout(() => setLoad(false), 500);
      })
      .catch((err) => {
        console.log("Error is ", err);
        setTimeout(() => setLoad(false), 1000);
      });
  }, [load]);

  function changeInactiveStatus(id) {
    Swal.fire({
      title: "Confirm Status Change",
      text: "Are you sure you want to change the status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        let payload = { _id: id, status: "false" };
        ApiServices.ChangeStatusExpenseHead(payload)
          .then((res) => {
            setLoad(true);
            Swal.fire({
              title: res?.data?.message,
              icon: res.data.success ? "success" : "error",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => setLoad(false), 1500);
          })
          .catch((err) => {
            setLoad(true);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              timer: 2000,
              timerProgressBar: true,
            });
            setTimeout(() => setLoad(false), 2000);
            console.log("Error is", err);
          });
      }
    });
  }

  const truncateText = (text, limit = 50) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const activeData = data.filter((el) => el.status === true);

  return (
    <>
      <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
        <PageTitle child="Manage Expense Head" />

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
                      <th>Name</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeData.length ? (
                      activeData.map((el, index) => (
                        <tr key={el._id}>
                          <td>{index + 1}</td>
                          <td>{el?.name}</td>
                          <td>
                            {truncateText(el?.description, 50)}
                            {el?.description?.length > 50 && (
                              <span
                                style={{
                                  color: "blue",
                                  cursor: "pointer",
                                  marginLeft: "5px",
                                }}
                                onClick={() => {
                                  setModalTitle(el?.name);
                                  setModalContent(el?.description);
                                  setModalOpen(true);
                                }}
                              >
                                View More
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/admin/editExpenseHead/${el?._id}`}
                                className="btn"
                                style={{ background: "#197ce6ff", color: "white" }}
                              >
                                <i className="bi bi-pen"></i>
                              </Link>
                              <button
                                className="btn ms-2"
                                style={{ background: "#6c757d", color: "white" }}
                                onClick={() => changeInactiveStatus(el._id)}
                              >
                                <i className="bi bi-x-circle"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          No Active Expense Head Found
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
