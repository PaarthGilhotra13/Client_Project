import { ScaleLoader } from "react-spinners";
import PageTitle from "../../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../../ApiServices";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddStore() {
    const [storeName, setStoreName] = useState("");
    const [storeCode, setStoreCode] = useState("");

    const [storeCategoryName, setStoreCategoryName] = useState("");
    const [storeCategories, setStoreCategories] = useState([]);
    const [storeCategoryId, setStoreCategoryId] = useState("");

    const [address, setAddress] = useState("");

    const [cityName, setCityName] = useState("");
    const [cities, setCities] = useState([]);
    const [cityId, setCityId] = useState("");

    const [stateName, setStateName] = useState("");
    const [stateId, setStateId] = useState("");
    const [states, setStates] = useState([]);

    const [zoneName, setZoneName] = useState("");
    const [zones, setZones] = useState([]);
    const [zoneId, setZoneId] = useState("");

    const [load, setLoad] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        setLoad(true);
        ApiServices.GetAllStoreCategory({ status: "true" })
            .then((res) => setStoreCategories(res?.data?.data || []))
            .finally(() => setLoad(false));
    }, []);

    useEffect(() => {
        ApiServices.GetAllZone({ status: "true" })
            .then((res) => setZones(res?.data?.data || []));
    }, []);

    const loadStatesByZone = (zId) => {
        ApiServices.GetAllState({ zoneId: zId })
            .then((res) => setStates(res?.data?.data || []))
            .catch(() => setStates([]));
    };

    const loadCities = (sId) => {
        ApiServices.GetAllCity({ stateId: sId })
            .then((res) => setCities(res?.data?.data || []))
            .catch(() => setCities([]));
    };

    function handleForm(e) {
        e.preventDefault();
        setLoad(true);

        const data = {
            storeName: storeName,
            storeCode: storeCode,
            storeCategoryId: storeCategoryId,
            cityId: cityId,
            stateId: stateId,
            zoneId: zoneId,
            address: address
        };

        ApiServices.AddStore(data)
            .then((res) => {
                if (res?.data?.success) {
                    Swal.fire({
                        title: res.data.message,
                        icon: "success",
                        timer: 3000,
                        timerProgressBar: true
                    });
                    setTimeout(() => {
                        setLoad(false);
                        nav("/admin/addStore");
                        setStoreName("");
                        setStoreCode("");
                        setStoreCategoryName("");
                        setZoneName("");
                        setStateName("");
                        setCityName("");
                        setAddress("");
                    }, 3000);
                } else {
                    Swal.fire("Error", res.data.message, "error");
                    setLoad(false);
                }
            })
            .catch(() => {
                Swal.fire("Error", "Something went wrong!", "error");
                setLoad(false);
            });
    }

    return (
        <main id="main" className="main">
            <PageTitle child="Add Store" />

            <ScaleLoader
                color="#6776f4"
                cssOverride={{ marginLeft: "45%", marginTop: "20%" }}
                size={200}
                loading={load}
            />

            <div className={load ? "display-screen" : ""}>
                <div className="col-lg-6 mx-auto mt-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Store Details</h5>

                            <form className="row g-3" onSubmit={handleForm}>

                                <div className="col-12">
                                    <label className="form-label">Store Name</label>
                                    <input className="form-control" value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)} required />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Store Code</label>
                                    <input className="form-control" value={storeCode}
                                        onChange={(e) => setStoreCode(e.target.value)} required />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Store Category</label>
                                    <div className="dropdown">
                                        <button type="button" className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown">
                                            {storeCategoryName || "Select Store Category"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {storeCategories.map((el) => (
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

                                {/* ZONE */}
                                <div className="col-12">
                                    <label className="form-label">Zone Name</label>
                                    <div className="dropdown">
                                        <button type="button" className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown">
                                            {zoneName || "Select a Zone"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {zones.map((el) => (
                                                <li key={el._id}>
                                                    <button type="button" className="dropdown-item"
                                                        onClick={() => {
                                                            setZoneName(el.zoneName);
                                                            setZoneId(el._id);
                                                            setStateName("");
                                                            setCityName("");
                                                            setCities([]);
                                                            loadStatesByZone(el._id);
                                                        }}>
                                                        {el.zoneName}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* STATE */}
                                <div className="col-12">
                                    <label className="form-label">State Name</label>
                                    <div className="dropdown">
                                        <button type="button" className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown" disabled={!zoneId}>
                                            {stateName || "Select a State"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {states.map((el) => (
                                                <li key={el._id}>
                                                    <button type="button" className="dropdown-item"
                                                        onClick={() => {
                                                            setStateName(el.stateName);
                                                            setStateId(el._id);
                                                            setCityName("");
                                                            loadCities(el._id);
                                                        }}>
                                                        {el.stateName}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* CITY */}
                                <div className="col-12">
                                    <label className="form-label">City Name</label>
                                    <div className="dropdown">
                                        <button type="button" className="form-control dropdown-toggle text-start" data-bs-toggle="dropdown" disabled={!stateId}>
                                            {cityName || "Select a City"}
                                        </button>
                                        <ul className="dropdown-menu w-100">
                                            {cities.length > 0 ? cities.map((el) => (
                                                <li key={el._id}>
                                                    <button type="button" className="dropdown-item"
                                                        onClick={() => {
                                                            setCityName(el.cityName);
                                                            setCityId(el._id);
                                                        }}>
                                                        {el.cityName}
                                                    </button>
                                                </li>
                                            )) : (
                                                <li className="dropdown-item text-muted">No Cities Found</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* ADDRESS */}
                                <div className="col-12">
                                    <label className="form-label">Store Location</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="btn" style={{ background: "#6776f4", color: "white" }}>
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
