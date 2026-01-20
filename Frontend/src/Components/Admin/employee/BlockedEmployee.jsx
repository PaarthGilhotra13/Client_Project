import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function BlockedEmployee() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // 🔹 MODAL (same as ManageEmployee)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const showPagination = filteredData.length > itemsPerPage;

  const currentEmployees = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    const filtered = data.filter((el) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        el?.name?.toLowerCase().includes(lowerSearch) ||
        el?.empcode?.toLowerCase().includes(lowerSearch)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  // ================= FETCH =================
  const fetchAllStaff = async () => {
    try {
      setLoad(true);

      const responses = await Promise.all([
        ApiServices.GetAllFm({ status: "false" }),
        ApiServices.GetAllClm({ status: "false" }),
        ApiServices.GetAllZh({ status: "false" }),
        ApiServices.GetAllBf({ status: "false" }),
        ApiServices.GetAllProcurement({ status: "false" }),
      ]);

      const allData = responses.flatMap(res =>
        res?.data?.success ? res.data.data : []
      );

      setData(allData);
    } catch (err) {
      console.log(err);
      setData([]);
    }
    setTimeout(() => setLoad(false), 1000);
  };

  useEffect(() => {
    fetchAllStaff();
  }, []);

  // ================= ACTIVATE =================
  function changeActiveStatus(id, designation) {
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
            let data = {
              _id: id,
              status: true
            };
    
            let apiCall;
            if (designation === "FM") {
              apiCall = ApiServices.ChangeStatusFm;
            }
            else if (designation === "CLM") {
              apiCall = ApiServices.ChangeStatusClm;
            }
            else if (designation === "Zonal_Head") {
              apiCall = ApiServices.ChangeStatusZh;
            }
            else if (designation === "Business_Finance") {
              apiCall = ApiServices.ChangeStatusBf;
            }
            else if (designation === "Procurement") {
              apiCall = ApiServices.ChangeStatusProcurement;
            }
            else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please select a valid designation",
              });
              return;
            }
    
            apiCall(data)
              .then((res) => {
                Swal.fire({
                  title: res?.data?.message,
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500,
                });
                fetchAllStaff(); // refresh list
              })
              .catch((err) => {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                });
                console.log("Error is", err);
              });
          }
        });
      }

  return (
    <>
      <main className={`main ${modalOpen ? "blur-background" : ""}`} id="main">
        <PageTitle child="Blocked Employee" />

        <ScaleLoader
          color="#6776f4"
          cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
          loading={load}
        />

        {!load && (
          <div className="container-fluid mb-3">
            <div className="row justify-content-end">
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Search by Name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="container-fluid">
          <div className="table-responsive">
            {!load && (
              <table className="table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Sr. No</th>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Store</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentEmployees.length ? (
                    currentEmployees.map((el, index) => (
                      <tr key={el._id}>
                        <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                        <td>{el.empcode}</td>
                        <td>{el.name}</td>
                        <td>{el.email}</td>
                        <td>{el.contact}</td>

                        {/* ✅ VIEW STORES */}
                        <td>
                          <span
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => {
                              setModalTitle(`${el.name} - Stores`);
                              setModalContent(el.storeId || []);
                              setModalOpen(true);
                            }}
                          >
                            View Stores
                          </span>
                        </td>

                        <td>{el.designation}</td>
                        <td>{el.status ? "Active" : "Inactive"}</td>
                        <td>
                          <Link
                            className="btn btn-success"
                            onClick={() => changeActiveStatus(el._id, el.designation)}
                          >
                            <i className="bi bi-check-circle"></i>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center text-muted">
                        No Blocked Employee Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        {showPagination && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`btn me-1 ${currentPage === idx + 1 ? "btn-primary" : "btn-light"
                  }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              className="btn btn-secondary ms-2"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* ===== MODAL (SAME UI) ===== */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-close position-absolute top-0 end-0 m-2"
              onClick={() => setModalOpen(false)}
            ></button>

            <h5>{modalTitle}</h5>
            <ul>
              {modalContent.map((s, i) => (
                <li key={i}>{s.storeName}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
