import { Link, useNavigate } from "react-router"
import Button from "./Button";
import { logout } from "../api/authApi";
import { useState } from "react";
export default function AdminHeader(){

    const [token, setToken] = useState(()=>localStorage.getItem("token")) ;

    const navigate = useNavigate();

    async function handleLogout() {
        const data = await logout();
        localStorage.clear();
        setToken(null);
        navigate("/");
    }

    return(
        <div 
            className="navbar navbar-expand-lg flex-shrink-0 "
            style={{backgroundColor: "#554EE2", height: "70px"}}
        >
            <div className="container">
                <Link
                    className="navbar-brand"
                    to="/"
                >
                    <img 
                        src="/logo1.jpg"
                        alt = "my logo"
                        height="50"
                    />
                </Link>

                <span 
                    className="text-white fs-5">
                    Event Management System
                </span>

                <div className="ms-auto d-flex align-items-center gap-5">

                    <h5 className=" text-white mb-0">
                        Admin
                    </h5>
                    {token && (
                        <Button
                            className="btn btn-light"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    )}

                    {!token && (
                        <Link
                            to="/login"
                            className="btn btn-light"
                        >
                            Login
                        </Link>
                    )}
                </div>
                

            </div>
        </div>
    )
}