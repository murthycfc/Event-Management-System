import { Link, useNavigate } from "react-router"
import Button from "./Button";
import { logout } from "../api/authApi";
import { useState } from "react";
import { Modal } from "react-bootstrap";
export default function AdminHeader(){

    const [token, setToken] = useState(()=>localStorage.getItem("token")) ;
    const [logoutModal, setLogoutModal] =useState(false)

    const navigate = useNavigate();

    function handleLogout(){
        setLogoutModal(true);
    }
    async function confirmLogout() {
        const data = await logout();
        localStorage.clear();
        setToken(null);
        navigate("/");
    }

    return(
        <div 
            className="navbar flex-shrink-0 "
            style={{backgroundImage: "linear-gradient(90deg, #6e6af1 0%, #554EE2 100%)", height: "70px"}}
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
                    EventPlus
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
            <Modal
                show={logoutModal}
                onHide={()=>setLogoutModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Confirm Logout
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure want to logout?</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn btn-secondary"
                        onClick={()=>setLogoutModal(false)}
                    >
                        Close
                    </Button>

                    <Button
                        className="btn btn-danger"
                        onClick={confirmLogout}
                    >
                        Logout
                    </Button>
                </Modal.Footer>

            </Modal>
        </div>
    )
}