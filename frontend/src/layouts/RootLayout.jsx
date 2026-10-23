import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout(){
    return(
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <main className="flex-grow-1">
                <Outlet />
            </main>
            
            <Footer />
        </div>
    )
}