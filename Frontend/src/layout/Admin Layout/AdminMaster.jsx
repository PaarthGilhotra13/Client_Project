import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import AdminSidebar from "./AdminSidebar";
import { useEffect } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import AdminHeader from "./AdminHeader";


export default function AdminMaster() {
    var nav = useNavigate()
    useEffect(() => {
        var token = sessionStorage.getItem("token")
        var userType = sessionStorage.getItem("userType")
        if (!token || userType !== "1") {
            nav("/")
        }
        
    }, [])
    return (
        <>
            <AdminHeader />
            <AdminSidebar />
            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}