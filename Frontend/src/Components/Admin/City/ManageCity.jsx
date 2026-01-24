import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import Swal from "sweetalert2";

export default function ManageCity() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalZone, setModalZone] = useState("");
  const [modalState, setModalState] = useState("");
  const [modalCities, setModalCities] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    ApiServices.GetAllCity()
      .then((res) => {
        if (res?.data?.success) {
          setData(res.data.data || []);
        } else {
          setData([]);
        }
      })
      .finally(() => setLoad(false));
  }, []);

  /* ================= ACTIVE ONLY ================= */
  const activeCities = data.filter(el => el.status === true);

  /* ================= BLOCK ================= */
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
        ApiServices.ChangeStatusCity(payload)
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
          .catch(() => {
            setLoad(true);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              timer: 2000,
              timerProgressBar: true,
            });
            setTimeout(() => setLoad(false), 2000);
          });
      }
    });
  }

  return (
    <>
      <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
        <PageTitle child="Manage City" />

        <div className="container-fluid">
          <ScaleLoader
            color="#6776f4"
            cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
            loading={load}
          />
        </div>

        {!load && (
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No</th>
                      <th>Zone</th>
                      <th>State</th>
                      <th>Cities</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {activeCities.length > 0 ? (
                      activeCities.map((el, index) => (
                        <tr key={el._id}>
                          <td>{index + 1}</td>
                          <td>{el.zoneId?.zoneName}</td>
                          <td>{el?.stateId?.stateName}</td>

                          <td>
                            <span
                              style={{ color: "blue", cursor: "pointer" }}
                              onClick={() => {
                                setModalZone(el?.zoneId?.zoneName);
                                setModalState(el?.stateId?.stateName);
                                setModalCities(el?.cityName || []);
                                setModalOpen(true);
                              }}
                            >
                              View Cities ({el?.cityName?.length || 0})
                            </span>
                          </td>

                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/admin/editCity/${el._id}`}
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
                        <td colSpan={5} className="text-center text-muted">
                          No Active City Found
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

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-2"
              onClick={() => setModalOpen(false)}
            />

            <h6>Zone : {modalZone}</h6>
            <h6>State : {modalState}</h6>
            <hr />

            {modalCities.length > 0 ? (
              <ul>
                {modalCities.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No Cities Found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
