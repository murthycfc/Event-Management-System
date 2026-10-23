import { NavLink, Outlet } from "react-router";

export default function ManageBookings() {
    return (
        <div className="container">

            <div className="mb-4">
                <h4>Manage Bookings</h4>
                <p className="text-muted mb-0">
                    View and manage all customer bookings
                </p>
            </div>

            <div className="mb-4">
                <div className="row g-2">
                    <div className="col-4">
                        <NavLink
                            to=""
                            className="btn w-100 btn-outline-primary"
                        >
                            All Bookings
                        </NavLink>
                    </div>
                    <div className="col-4">
                        <NavLink
                            to="completed"
                            className="btn w-100 btn-outline-success"
                        >
                            Completed
                        </NavLink>
                    </div>
                    <div className="col-4">
                        <NavLink
                            to="cancelled"
                            className="btn w-100 btn-outline-danger"
                        >
                            Cancelled
                        </NavLink>
                    </div>
                    

                    

                </div>
            </div>

            <Outlet />

        </div>
    );
}