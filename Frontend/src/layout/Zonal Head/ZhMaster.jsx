import { Outlet } from "react-router-dom";
import ZhHeader from "./ZhHeader";
import ZhSidebar from "./ZhSidebar";

export default function ZhMaster() {
    return (
        <>
            <ZhHeader />
            <ZhSidebar />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}