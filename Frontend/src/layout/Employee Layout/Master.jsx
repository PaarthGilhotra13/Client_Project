import { Outlet, useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import EmployeeSidebar from "./EmployeeSideBar";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

export default function Master() {
    var nav = useNavigate()
    useEffect(() => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        if (!token || userType !== "2") {
            nav("/")
        }
    }, [])
    return (
        <>
            <Header />
            <ToastContainer/>
            <EmployeeSidebar />
            <Outlet />
            {/* <Footer />a */}
        </>
    )
}