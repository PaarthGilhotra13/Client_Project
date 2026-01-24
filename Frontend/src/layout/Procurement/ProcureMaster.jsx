import { Outlet } from "react-router-dom";
import BfHeader from "./ProcureHeader";
import BfSidebar from "./ProcureSidebar";

export default function ProcureMaster() {
    return (
        <>
            <BfHeader />
            <BfSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}