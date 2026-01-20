import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditEmployee() {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [designation, setDesignation] = useState("");

    // STORE (ARRAY + ORDER)
    const [stores, setStores] = useState([]);
    const [storeIds, setStoreIds] = useState([]);
    const [storeOrder, setStoreOrder] = useState([]);

    // ZONE
    const [zones, setZones] = useState([]);
    const [zoneId, setZoneId] = useState("");

    const [load, setLoad] = useState(false);
    const nav = useNavigate();
    const params = useParams();
    const location = useLocation();
    const oldDesignation = location?.state?.designation;

    // ================= LOAD =================
    useEffect(() => {
        setLoad(true);

        let apiCall;
        if (oldDesignation === "FM") apiCall = ApiServices.GetSingleFm;
        else if (oldDesignation === "CLM") apiCall = ApiServices.GetSingleClm;
        else if (oldDesignation === "Zonal_Head") apiCall = ApiServices.GetSingleZh;
        else if (oldDesignation === "Business_Finance") apiCall = ApiServices.GetSingleBf;
        else if (oldDesignation === "Procurement") apiCall = ApiServices.GetSingleProcurement;
        else return;

        apiCall({ _id: params.id }).then((res) => {
            const emp = res?.data?.data;
            setName(emp?.name);
            setContact(emp?.contact);
            setEmail(emp?.email);
            setDesignation(emp?.designation);

            // ✅ STORE ARRAY PREFILL
            const ids = emp?.storeId?.map(s => s._id) || [];
            setStoreIds(ids);
            setStoreOrder(ids);

            // ✅ ZONE PREFILL
            if (emp?.zoneId) setZoneId(emp.zoneId);

            setTimeout(() => setLoad(false), 800);
        });

        ApiServices.GetAllStore({ status: "true" })
            .then(res => setStores(res?.data?.data || []))
            .catch(() => { });

        ApiServices.GetAllZone?.({ status: "true" })
            .then(res => setZones(res?.data?.data || []))
            .catch(() => { });
    }, []);

    // ================= STORE TOGGLE =================
    const handleStoreToggle = (store) => {
        let ids = [...storeIds];
        let order = [...storeOrder];

        if (ids.includes(store._id)) {
            ids = ids.filter(id => id !== store._id);
            order = order.filter(id => id !== store._id);
        } else {
            ids.push(store._id);
            order.push(store._id);
        }

        setStoreIds(ids);
        setStoreOrder(order);
    };

    const getStoreNumber = (id) => {
        const index = storeOrder.indexOf(id);
        return index !== -1 ? index + 1 : null;
    };

    // ================= SUBMIT =================
    function handleForm(e) {
        e.preventDefault();
        setLoad(true);

        let payload = {
            _id: params.id,
            name,
            contact,
            storeId: storeIds, // ARRAY
            newDesignation: designation,
            oldDesignation,
        };

        if (designation === "Zonal_Head") {
            payload.zoneId = zoneId;
        }

        let apiCall;
        if (oldDesignation !== designation) {
            apiCall = ApiServices.ChangeDesignation;
        } else {
            const updateMap = {
                FM: ApiServices.UpdateFm,
                CLM: ApiServices.UpdateClm,
                Zonal_Head: ApiServices.UpdateZh,
                Business_Finance: ApiServices.UpdateBf,
                Procurement: ApiServices.UpdateProcurement,
            };
            apiCall = updateMap[oldDesignation];
        }

        apiCall(payload)
            .then((res) => {
                Swal.fire("Success", res.data.message, "success");
                setTimeout(() => {
                    setLoad(false);
                    nav("/admin/manageEmployee");
                }, 2000);
            })
            .catch(() => {
                Swal.fire("Error", "Something went wrong", "error");
                setLoad(false);
            });
    }

    return (
        <main id="main" className="main">
            <PageTitle child="Edit Employee" />

            <ScaleLoader
                color="#6776f4"
                cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                loading={load}
            />

            <div className={load ? "display-screen" : ""}>
                <div className="col-lg-6 mx-auto mt-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Employee Details</h5>

                            <form className="row g-3" onSubmit={handleForm}>
                                <div className="col-12">
                                    <label>Name</label>
                                    <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                                </div>

                                <div className="col-12">
                                    <label>Email</label>
                                    <input className="form-control" value={email} disabled />
                                </div>

                                <div className="col-12">
                                    <label>Contact</label>
                                    <input className="form-control" value={contact} onChange={e => setContact(e.target.value)} required />
                                </div>

                                {/* DESIGNATION */}
                                <div className="col-12">
                                    <label>Designation</label>
                                    <div className="dropdown">
                                        <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                                            {designation}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {["FM", "CLM", "Zonal_Head", "Business_Finance", "Procurement"].map(d => (
                                                <li key={d}>
                                                    <button className="dropdown-item" type="button" onClick={() => setDesignation(d)}>
                                                        {d}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* STORE MULTI SELECT */}
                                <div className="col-12">
                                    <label>Store</label>
                                    <div className="dropdown">
                                        <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                                            {storeIds.length > 0
                                                ? `${storeIds.length} Store${storeIds.length > 1 ? "s" : ""} Selected`
                                                : "Select Store"}
                                        </button>

                                        <ul className="dropdown-menu w-100">
                                            {stores.map(el => (
                                                <li key={el._id} className="dropdown-item d-flex justify-content-between">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input me-2"
                                                            checked={storeIds.includes(el._id)}
                                                            onChange={() => handleStoreToggle(el)}
                                                        />
                                                        {el.storeName}
                                                    </div>
                                                    {getStoreNumber(el._id) && (
                                                        <span className="badge bg-primary">
                                                            {getStoreNumber(el._id)}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* ZONE */}
                                {designation === "Zonal_Head" && (
                                    <div className="col-12">
                                        <label>Zone</label>
                                        <div className="dropdown">
                                            <button className="form-control text-start dropdown-toggle" data-bs-toggle="dropdown">
                                                {zoneId
                                                    ? zones.find(z => z._id === zoneId)?.zoneName
                                                    : "Select Zone"}
                                            </button>
                                            <ul className="dropdown-menu w-100">
                                                {zones.map(z => (
                                                    <li key={z._id}>
                                                        <button className="dropdown-item" type="button" onClick={() => setZoneId(z._id)}>
                                                            {z.zoneName}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <div className="text-center">
                                    <button className="btn" style={{ background: "#6776f4", color: "white" }}>
                                        Submit
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
