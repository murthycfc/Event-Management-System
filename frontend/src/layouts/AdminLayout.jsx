import { Outlet } from "react-router";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import Footer from "../components/Footer";

export default function AdminLayout(){
    return (
        <div className="vh-100 d-flex flex-column ">
            <AdminHeader />
            <div className="d-flex flex-grow-1 overflow-hidden">
                <AdminSidebar />
                <main className="flex-grow-1 bg-light p-4 overflow-auto">
                    <Outlet />
                </main>
            </div>
            {/* <Footer /> */}
        </div>
    )
}