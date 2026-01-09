import { ScaleLoader } from "react-spinners";
import PageTitle from "../PageTitle";
import { useEffect, useState } from "react";
import ApiServices from "../../ApiServices";

export default function AdminDashboard() {
    var [load, setLoad] = useState(false)
    var [data, setData] = useState([])

    useEffect(() => {
        ApiServices.Dashboard()
            .then((res) => {
                setData(res?.data)
            })
            .catch((err) => {
                console.log("Error is ", err)
            })
    })
    return (
        <>
            <main id="main" className="main">
                <PageTitle child="Dashboard" />
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-md-12">
                            <ScaleLoader color="#6776f4" cssOverride={{ marginLeft: "45%", marginTop: "20%" }} size={200} loading={load} />
                        </div>
                    </div>
                </div>
                <div className="row" style={{cursor: "default"}} >
                    <div className="col-xxl-4 col-md-6 mb-4">
                        
                        <div className="card info-card">
                            <div className="card-body position-relative mb-4">
                              

                                <h5 className="card-title"> Total Department<span className="text-muted"></span></h5>

                                <div className="d-flex align-items-center mt-4">
                                    <div className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: '#4B49AC' }}>
                                        <i className="bi bi-collection fs-4" />
                                    </div>
                                    <div>
                                        <h6 className="card-title mb-0">{data?.totalCategories}</h6>
                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-md-6 mb-4">
                        <div className="card info-card">
                            <div className="card-body mb-4 position-relative">
                                

                                <h5 className="card-title">Total Technologies <span className="text-muted"></span></h5>

                                <div className="d-flex align-items-center mt-4">
                                    <div className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px',backgroundColor: '#20C997' }}>
                                        <i className="bi bi-folder fs-4" />
                                    </div>
                                    <div>
                                        <h6 className="card-title mb-0">{data?.totalSubCategories}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customers Card */}
                    <div className="col-xxl-4 col-md-6 mb-4">
                        <div className="card info-card">
                            <div className="card-body mb-4 position-relative">
                                <h5 className="card-title">Total Projects <span className="text-muted"></span></h5>

                                <div className="d-flex align-items-center mt-4">
                                    <div className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px',background:'#FF6B6B' }}>
                                        <i className="bi bi-graph-up fs-4" />
                                    </div>
                                    <div>
                                        <h6 className="card-title mb-0">{data?.totalProject}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xxl-4 col-md-6 mb-4">
                        <div className="card info-card">
                            <div className="card-body mb-4 position-relative">
                                <h5 className="card-title">Total Project Team <span className="text-muted"></span></h5>

                                <div className="d-flex align-items-center mt-4">
                                    <div className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', background:'#4D96FF' }}>
                                        <i className="bi bi-people fs-4" />
                                    </div>
                                    <div>
                                        <h6 className="card-title mb-0">{data?.totalProjectTeam}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-md-6 mb-4">
                        <div className="card info-card">
                            <div className="card-body mb-4 position-relative">
                                <h5 className="card-title">Total Task <span className="text-muted"></span></h5>

                                <div className="d-flex align-items-center mt-4">
                                    <div className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px',background:'#B23EFF' }}>
                                        <i className="bi bi-card-checklist fs-4" />
                                    </div>
                                    <div>
                                        <h6 className="card-title mb-0">{data?.totalTask}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-md-6 mb-4">
                        <div className="card info-card">
                            <div className="card-body mb-4 position-relative">
                                <h5 className="card-title">Total Employee <span className="text-muted"></span></h5>

                                <div className="d-flex align-items-center mt-4">
                                    <div className="card-icon text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px',background:'#00B8D9' }}>
                                        <i className="bi bi-person-vcard fs-4" />
                                    </div>
                                    <div>
                                        <h6 className="card-title mb-0">{data?.totalEmployee}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>





            </main>
        </>
    )
}