import { useState, useRef, useEffect } from "react";
import PageTitle from "../../PageTitle";
import Swal from "sweetalert2";
import ApiServices from "../../../ApiServices";
import { useNavigate } from "react-router-dom";

export default function AddExpenses() {

  const nav = useNavigate();

  /* ================= STATES ================= */

  // Store
  const [storeName, setStoreName] = useState("");
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [searchStore, setSearchStore] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Store Category
  const [storeCategoryName, setStoreCategoryName] = useState("");
  const [storeCategories, setStoreCategories] = useState([]);
  const [storeCategoryId, setStoreCategoryId] = useState("");

  // Expense Head
  const [expenseHeadName, setExpenseHeadName] = useState("");
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [expenseHeadId, setExpenseHeadId] = useState("");

  // Expense
  const [natureOfExpense, setNatureOfExpense] = useState("");
  const [expenseValue, setExpenseValue] = useState("");
  const [remark, setRemark] = useState("");
  const [rca, setRca] = useState("");
  const [policy, setPolicy] = useState("");
  const [ticketId, setTicketId] = useState("");

  // Attachment
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const [load, setLoad] = useState(false);

  const userId=sessionStorage.getItem("userId")

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    setLoad(true);

    Promise.all([
      ApiServices.GetAllStore({ status: "true" }),
      ApiServices.GetAllStoreCategory({ status: "true" }),
      ApiServices.GetAllExpenseHead({ status: "true" })
    ])
      .then(([storeRes, catRes, headRes]) => {
        setStores(storeRes?.data?.data || []);
        setStoreCategories(catRes?.data?.data || []);
        setExpenseHeads(headRes?.data?.data || []);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to load initial data", "error");
      })
      .finally(() => setLoad(false));
  }, []);

  /* ================= SUBMIT ================= */
  function handleForm(e) {
    e.preventDefault();
    if (load) return;

    if (
      !storeId ||
      !storeCategoryId ||
      !expenseHeadId ||
      !natureOfExpense ||
      !expenseValue ||
      !policy ||
      !ticketId ||
      !attachment
    ) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    const amount = Number(expenseValue);
    if (isNaN(amount) || amount <= 0) {
      Swal.fire("Error", "Expense value must be a valid number", "error");
      return;
    }

    const data = new FormData();
    data.append("storeId", storeId);
    data.append("storeCategoryId", storeCategoryId);
    data.append("expenseHeadId", expenseHeadId);
    data.append("natureOfExpense", natureOfExpense);
    data.append("amount", amount);
    data.append("remark", remark);
    data.append("rca", rca);
    data.append("policy", policy);
    data.append("ticketId", ticketId);
    data.append("raisedBy", userId);
    data.append("attachment", attachment);

    setLoad(true);

    ApiServices.AddExpense(data)
      .then(res => {
        setLoad(false);
        var message = res?.data?.message
        if (res?.data?.success) {
          Swal.fire({
            title: "Expense Added Successfully",
            icon: "success",
            draggable: true,
            confirmButtonText: 'Continue',
            timer: 2000,
            timerProgressBar: true,
          });
          nav("/fm/addExpenses");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
            confirmButtonText: 'Continue',
            timer: 2000,
            timerProgressBar: true,
          });
        }
      })
      .catch(() => {
        setLoad(false);
        Swal.fire("Error", "Something went wrong", "error");
      });
  }

  return (
    <main className="main" id="main">
      <PageTitle child="Add Expenses" />

      <div className="container-fluid">
        <div className="col-lg-6 mx-auto mt-3">
          <div className="card">
            <div className="card-body">

              <h5 className="card-title">Store Expense Details</h5>

              <form className="row g-3" onSubmit={handleForm}>

                {/* ================= STORE ================= */}
                <div className="col-12 position-relative">
                  <label className="form-label">Store</label>

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Search for store name..."
                    value={searchStore}
                    onChange={(e) => {
                      setSearchStore(e.target.value);
                      setShowSearchDropdown(true);
                    }}
                  />

                  {showSearchDropdown && searchStore && (
                    <ul
                      className="list-group position-absolute w-100"
                      style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                    >
                      {stores
                        .filter(el =>
                          el.storeName.toLowerCase().includes(searchStore.toLowerCase())
                        )
                        .map(el => (
                          <li
                            key={el._id}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setStoreName(el.storeName);
                              setStoreId(el._id);
                              setSelectedStore(el);
                              setSearchStore(el.storeName);
                              setShowSearchDropdown(false);

                              // RESET DEPENDENT FIELDS
                              setStoreCategoryName("");
                              setStoreCategoryId("");
                              setExpenseHeadName("");
                              setExpenseHeadId("");
                              setPolicy("");
                            }}
                          >
                            {el.storeName}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                {/* ================= STORE INFO ================= */}
                {selectedStore && (
                  <div className="col-12">
                    <div className="card mt-2">
                      <div className="card-body p-3">
                        <div className="row">
                          <div className="col-6"><b>State</b><div>{selectedStore?.stateId?.stateName}</div></div>
                          <div className="col-6"><b>City</b><div>{selectedStore?.cityId?.cityName}</div></div>
                          <div className="col-6 mt-2"><b>Store Code</b><div>{selectedStore?.storeCode}</div></div>
                          <div className="col-6 mt-2"><b>Zone</b><div>{selectedStore?.zoneId?.zoneName}</div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= STORE CATEGORY ================= */}
                <div className="col-12">
                  <label className="form-label">Store Category</label>
                  <div className="dropdown">
                    <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                      {storeCategoryName || "-- Select Type --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      {storeCategories.map(el => (
                        <li key={el._id}>
                          <button type="button" className="dropdown-item"
                            onClick={() => {
                              setStoreCategoryName(el.name);
                              setStoreCategoryId(el._id);
                            }}>
                            {el.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ================= EXPENSE HEAD ================= */}
                <div className="col-12">
                  <label className="form-label">Expense Head</label>
                  <div className="dropdown">
                    <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                      {expenseHeadName || "-- Select Type --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      {expenseHeads.map(el => (
                        <li key={el._id}>
                          <button type="button" className="dropdown-item"
                            onClick={() => {
                              setExpenseHeadName(el.name);
                              setExpenseHeadId(el._id);
                            }}>
                            {el.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ================= NATURE & AMOUNT ================= */}
                <div className="col-6">
                  <label className="form-label">Nature of Expense</label>
                  <div className="dropdown">
                    <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                      {natureOfExpense || "-- Select Type --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      <li><button type="button" className="dropdown-item" onClick={() => setNatureOfExpense("Opex")}>Opex</button></li>
                      <li><button type="button" className="dropdown-item" onClick={() => setNatureOfExpense("Capex")}>Capex</button></li>
                    </ul>
                  </div>
                </div>

                <div className="col-6">
                  <label className="form-label">Expense Value</label>
                  <input
                    type="number"
                    className="form-control"
                    value={expenseValue}
                    onChange={(e) => setExpenseValue(e.target.value)}
                  />
                </div>

                {/* ================= REMARK & RCA ================= */}
                <div className="col-6">
                  <label className="form-label">Remark</label>
                  <textarea className="form-control" value={remark} onChange={(e) => setRemark(e.target.value)} />
                </div>

                <div className="col-6">
                  <label className="form-label">RCA</label>
                  <textarea className="form-control" value={rca} onChange={(e) => setRca(e.target.value)} />
                </div>

                {/* ================= POLICY ================= */}
                <div className="col-12">
                  <label className="form-label">Policy</label>
                  <div className="dropdown">
                    <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                      {policy || "-- Select Policy --"}
                    </button>
                    <ul className="dropdown-menu w-100">
                      <li><button type="button" className="dropdown-item" onClick={() => setPolicy("REPAIR & MAINTENANCE")}>REPAIR & MAINTENANCE</button></li>
                      <li><button type="button" className="dropdown-item" onClick={() => setPolicy("ADHOC MANPOWER")}>ADHOC MANPOWER</button></li>
                      <li><button type="button" className="dropdown-item" onClick={() => setPolicy("FIRE AMC")}>FIRE AMC</button></li>
                      <li><button type="button" className="dropdown-item" onClick={() => setPolicy("COLD ROOM R&M")}>COLD ROOM R&M</button></li>
                    </ul>
                  </div>
                </div>

                {/* ================= ATTACHMENT ================= */}
                <div className="col-12">
                  <label className="form-label">Attachment</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="form-control"
                    onChange={(e) => setAttachment(e.target.files[0])}
                  />
                </div>

                {/* ================= TICKET ================= */}
                <div className="col-12">
                  <label className="form-label">Ticket ID</label>
                  <input className="form-control" value={ticketId} onChange={(e) => setTicketId(e.target.value)} />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn" style={{ background: "#6776f4", color: "white" }}>
                    {load ? "Submitting..." : "Submit Expense"}
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
