import { useState, useRef, useEffect } from "react";
import PageTitle from "../../PageTitle";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";

export default function AddRequest() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  var [storeCategoryName, setStoreCategoryName] = useState("")
  var [storeCategories, setStoreCategories] = useState([])
  var [storeCategoryId, setStoreCategoryId] = useState("")

  var [storeName, setStoreName] = useState("")
  var [stores, setStores] = useState([])
  var [storeId, setStoreId] = useState("")

  var [expenseHeadName, setExpenseHeadName] = useState("")
  var [expenseHeads, setExpenseHeads] = useState([])
  var [expenseHeadId, setExpenseHeadId] = useState("")

  var [natureOfExpense, setNatureOfExpense] = useState("")
  var [expenseValue, setExpenseValue] = useState("")
  var [remark, setRemark] = useState("")
  var [rca, setRca] = useState("")
  var [policy, setPolicy] = useState("")
  var [ticketId, setTicketId] = useState("")
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
  var [load, setLoad] = useState(false)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoad(true)
    let data = {
      status: "true"
    }
    ApiServices.GetAllStoreCategory(data)
      .then((res) => {
        setStoreCategories(res?.data?.data);
      })
      .catch((err) => {
        console.log("Error is ", err);
      })

    ApiServices.GetAllStore(data)
      .then((res) => {
        setStores(res?.data?.data);
      })
      .catch((err) => {
        console.log("Error is ", err);
      })
    ApiServices.GetAllExpenseHead(data)
      .then((res) => {
        setExpenseHeads(res?.data?.data);
      })
      .catch((err) => {
        console.log("Error is ", err);
      })
    setTimeout(() => {
      setLoad(false)
    }, 1000)
  }, [])
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!subject || !description) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields!",
      });
      return;
    }

    setLoading(true);

    // Simulate saving locally (since frontend only)
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Complaint Added",
        text: "Your complaint has been submitted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
      setSubject("");
      setDescription("");
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setLoading(false);
    }, 1500);
  };

  return (
    <main className="main" id="main">
      <PageTitle child="Add Request" />

      <div className="container-fluid" style={{ cursor: "default" }}>
        <div className="col-lg-6 mx-auto mt-3" style={{ cursor: "default" }} >
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Store Expense Details</h5>

              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                  <label htmlFor="CategotyName" className="form-label">
                    Store
                  </label>
                  <div className="dropdown text-center ">
                    <button
                      className="form-control text-start dropdown-toggle"
                      type="button"
                      id="categoryDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {storeName || "Select a Store"}
                    </button>
                    {stores?.map((el, index) => {
                      return (
                        <>
                          <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                            {stores.length > 0 ? (
                              stores.map((el) => (
                                <li key={el._id}>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => {
                                      setStoreName(el.storeName);
                                      setStoreId(el._id);
                                    }}

                                  >
                                    {el.storeName}
                                  </button>
                                </li>
                              ))
                            ) : (
                              <li><span className="dropdown-item text-muted">No Store Category found</span></li>
                            )}
                          </ul>

                        </>
                      )
                    })}
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="CategotyName" className="form-label">
                    Store Category
                  </label>
                  <div className="dropdown text-center ">
                    <button
                      className="form-control text-start dropdown-toggle"
                      type="button"
                      id="categoryDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {storeCategoryName || "Select a Store Category"}
                    </button>
                    {storeCategories?.map((el, index) => {
                      return (
                        <>
                          <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                            {storeCategories.length > 0 ? (
                              storeCategories.map((el) => (
                                <li key={el._id}>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => {
                                      setStoreCategoryName(el.name);
                                      setStoreCategoryId(el._id);
                                    }}

                                  >
                                    {el.name}
                                  </button>
                                </li>
                              ))
                            ) : (
                              <li><span className="dropdown-item text-muted">No Store Category found</span></li>
                            )}
                          </ul>

                        </>
                      )
                    })}
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="CategotyName" className="form-label">
                    Expense Head
                  </label>
                  <div className="dropdown text-center ">
                    <button
                      className="form-control text-start dropdown-toggle"
                      type="button"
                      id="categoryDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {expenseHeadName || "Select a Expense Head"}
                    </button>
                    {expenseHeads?.map((el, index) => {
                      return (
                        <>
                          <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                            {expenseHeads.length > 0 ? (
                              expenseHeads.map((el) => (
                                <li key={el._id}>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => {
                                      setExpenseHeadName(el.name);
                                      setExpenseHeadId(el._id);
                                    }}

                                  >
                                    {el.name}
                                  </button>
                                </li>
                              ))
                            ) : (
                              <li><span className="dropdown-item text-muted">No Store Category found</span></li>
                            )}
                          </ul>

                        </>
                      )
                    })}
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="CategotyName" className="form-label">
                    Nature of Expense
                  </label>
                  <div className="dropdown text-center ">
                    <button
                      className="form-control text-start dropdown-toggle"
                      type="button"
                      id="categoryDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {natureOfExpense || "Select Type"}
                    </button>
                    <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                      <li >
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setNatureOfExpense("Opex")}
                        >
                          Opex
                        </button>
                      </li>
                      <li >
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setNatureOfExpense("Capex")}
                        >
                          Capex
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label">Expense Value</label>
                  <input
                    className="form-control"
                    value={expenseValue}
                    placeholder="Enter Amount"
                    onChange={(e) => setExpenseValue(e.target.value)}
                    required
                  ></input>
                </div>
                <div className="col-12">
                  <label className="form-label">Remark</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={remark}
                    placeholder="Add any additional notes..."
                    onChange={(e) => setRemark(e.target.value)}

                  ></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label">RCA</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={rca}
                    placeholder="Explain reason"
                    onChange={(e) => setRca(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="col-12">
                  <label htmlFor="CategotyName" className="form-label">
                    Policy
                  </label>
                  <div className="dropdown text-center ">
                    <button
                      className="form-control text-start dropdown-toggle"
                      type="button"
                      id="categoryDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {policy || "Select Policy"}
                    </button>
                    <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                      <li >
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setPolicy("REPIAR & MAINTAINENCE")}
                        >
                          REPIAR & MAINTAINENCE
                        </button>
                      </li>
                      <li >
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setPolicy("ADHOC MANPOWER")}
                        >
                          ADHOC MANPOWER
                        </button>
                      </li>
                      <li >
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setPolicy("FIRE AMC")}
                        >
                          FIRE AMC
                        </button>
                      </li>
                      <li >
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setPolicy("COLD ROOM R&M")}
                        >
                          COLD ROOM R&M
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label">Attachment</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="form-control"
                    onChange={(e) => setAttachment(e.target.files[0])}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Ticket ID</label>
                  <input
                    className="form-control"
                    value={ticketId}
                    placeholder="Enter ticket"
                    onChange={(e) => setTicketId(e.target.value)}
                    required
                  ></input>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn"
                    style={{ background: "#6776f4", color: "white" }}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
