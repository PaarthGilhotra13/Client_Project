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
  const [modalContent, setModalContent] = useState([]);

  useEffect(() => {
    ApiServices.GetAllCity()
      .then((res) => {
        if (res?.data?.success) {
          setData(res?.data?.data || []);
        } else {
          setData([]);
        }
        setTimeout(() => setLoad(false), 500);
      })
      .catch(() => {
        setTimeout(() => setLoad(false), 1000);
      });
  }, []);

  /* ================= ACTIVE CITIES ================= */
  const activeCities = data.filter(el => el.status === true);

  /* ================= GROUP BY ZONE + STATE (STATE ARRAY FIX) ================= */
  const groupedData = Object.values(
    activeCities.reduce((acc, city) => {
      const zoneId = city?.zoneId?._id;
      const zoneName = city?.zoneId?.zoneName;
      const stateNames = city?.stateId?.stateName || [];

      if (!zoneId || !Array.isArray(stateNames)) return acc;

      // har state ke liye alag row
      stateNames.forEach((state) => {
        const key = `${zoneId}_${state}`;

        if (!acc[key]) {
          acc[key] = {
            _id: key,
            zoneName,
            stateName: state,
            cities: []
          };
        }

        acc[key].cities.push(city.cityName);
      });

      return acc;
    }, {})
  );
  function changeInactiveStatus(id) {
    // const id1=id.split("_")[0]
    // console.log(id1);
    
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

        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12 mt-5 table-responsive">
              {!load && (
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
                    {groupedData.length ? (
                      groupedData.map((el, index) => (
                        <tr key={el._id}>
                          <td>{index + 1}</td>
                          <td>{el.zoneName}</td>
                          <td>{el.stateName}</td>

                          <td>
                            <span
                              style={{ color: "blue", cursor: "pointer" }}
                              onClick={() => {
                                setModalZone(el.zoneName);
                                setModalState(el.stateName);
                                setModalContent(el.cities);
                                setModalOpen(true);
                              }}
                            >
                              View Cities
                            </span>
                          </td>

                          <td>
                            <div className="btn-group">
                              <Link
                                to={`/admin/editCity/${el?._id}`}
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
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-box position-relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-2"
              onClick={() => setModalOpen(false)}
            ></button>

            <h5 className="mb-1">
              Zone : <span className="fw-normal">{modalZone}</span>
            </h5>
            <h6 className="mb-3">
              State : <span className="fw-normal">{modalState}</span>
            </h6>

            <hr />

            <h6 className="mb-2">Cities</h6>

            {modalContent.length > 0 ? (
              <ul className="ps-3">
                {modalContent.map((city, index) => (
                  <li key={index}>{city}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0">No Cities Found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
