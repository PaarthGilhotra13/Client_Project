import { toast } from "react-toastify";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";

export default function ManageEmployee() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  // Fetch employees
  const fetchAllStaff = async () => {
    try {
      setLoad(true);
      const responses = await Promise.all([
        ApiServices.GetAllFm(),
        ApiServices.GetAllClm(),
        ApiServices.GetAllZh(),
        ApiServices.GetAllBf(),
        ApiServices.GetAllProcurement(),
      ]);

      const allData = responses.flatMap(res => (res?.data?.success ? res.data.data : []));
      setData(allData || []);
    } catch (err) {
      console.log("Error is", err);
      setData([]);
    }
    setTimeout(() => setLoad(false), 500);
  };

  useEffect(() => {
    fetchAllStaff();
  }, []);

  // Filter active employees based on search term
  useEffect(() => {
    const filtered = data
      .filter(emp => emp.status) // Only active
      .filter(emp => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          emp?.name?.toLowerCase().includes(lowerSearch) ||
          emp?.empcode?.toLowerCase().includes(lowerSearch)
        );
      });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const currentEmployees = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changeInactiveStatus = (id, designation) => {
    Swal.fire({
      title: "Confirm Status Change",
      text: "Are you sure you want to change the status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(result => {
      if (result.isConfirmed) {
        let payload = { _id: id, status: "false" };
        let apiCall;

        if (designation === "FM") apiCall = ApiServices.ChangeStatusFm;
        else if (designation === "CLM") apiCall = ApiServices.ChangeStatusClm;
        else if (designation === "Zonal_Head") apiCall = ApiServices.ChangeStatusZh;
        else if (designation === "Business_Finance") apiCall = ApiServices.ChangeStatusBf;
        else if (designation === "Procurement") apiCall = ApiServices.ChangeStatusProcurement;
        else {
          Swal.fire({ icon: "error", title: "Oops...", text: "Invalid designation" });
          return;
        }

        apiCall(payload)
          .then(res => {
            Swal.fire({
              title: res?.data?.message,
              icon: res?.data?.success ? "success" : "error",
              showConfirmButton: false,
              timer: 1500,
            });
            fetchAllStaff(); // Refresh after change
          })
          .catch(err => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              timer: 2000,
            });
            console.log("Error is", err);
          });
      }
    });
  };

  // CSV export
  const csvData = filteredData.map((emp, idx) => ({
    srNo: idx + 1,
    empcode: emp.empcode,
    name: emp.name,
    email: emp.email,
    contact: emp.contact,
    storeName: emp?.storeId?.storeName || "",
    jobDesignation: emp.designation,
  }));
  const csvHeaders = [
    { label: "Sr No", key: "srNo" },
    { label: "ID", key: "empcode" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Contact", key: "contact" },
    { label: "Store Name", key: "storeName" },
    { label: "Designation", key: "jobDesignation" },
  ];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <main className="main" id="main">
      <PageTitle child="Manage Employee" />

      <div className="container-fluid mb-3">
        <div className="row align-items-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name or ID"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6 text-end">
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename={`Employee_Report_${new Date().toISOString().slice(0, 10)}.csv`}
              className="btn btn-sm btn-primary"
            >
              Download CSV
            </CSVLink>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-12 table-responsive">
            <ScaleLoader
              color="#6776f4"
              cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
              size={200}
              loading={load}
            />

            {!load && (
              <table className="table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Sr. No</th>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Store Name</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.length ? (
                    currentEmployees.map((el, idx) => (
                      <tr key={el._id}>
                        <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                        <td>{el.empcode}</td>
                        <td>{el.name}</td>
                        <td>{el.email}</td>
                        <td>{el.contact}</td>
                        <td>{el?.storeId?.storeName || ""}</td>
                        <td>{el.designation}</td>
                        <td>{el.status ? "Active" : "Inactive"}</td>
                        <td>
                          <div className="btn-group">
                            <Link
                              to={`/admin/editEmployee/${el._id}`}
                              state={{ designation: el.designation }}
                              className="btn"
                              style={{ background: "#197ce6ff", color: "white" }}
                            >
                              <i className="bi bi-pen"></i>
                            </Link>
                            <button
                              className="btn ms-2"
                              style={{ background: "#6c757d", color: "white" }}
                              onClick={() => changeInactiveStatus(el._id, el.designation)}
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center text-muted">
                        No Active Employee Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
              className={`btn me-1 ${currentPage === idx + 1 ? "btn-primary" : "btn-light"}`}
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
  );
}
