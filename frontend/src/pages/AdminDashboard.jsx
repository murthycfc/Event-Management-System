import { useEffect, useState } from "react"
import { getDashboard } from "../api/admin";

export default function AdminDashboard(){
    const [summary, setSummary] = useState();
    const [error, setError] = useState();

    useEffect(()=>{
        async function fetchSummary() {
            try {
                const data = await getDashboard();
                setSummary(data);
            } catch (error) {
                setError(error?.response?.data?.message);
            }
        }
        fetchSummary()
    },[])
    return (
        <div className="container">
            
            <h3 className="mb-4">Admin dashboard</h3>
            <div className="row g-4 mb-4">
                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <p className="text-muted mb-1">Total Events</p>
                            <h3 className="fw-bold">{summary?.totalEvents}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <p className="text-muted mb-1">Total Venues</p>
                            <h3 className="fw-bold">{summary?.totalVenues}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <p className="text-muted mb-1">Total Bookings</p>
                            <h3 className="fw-bold">{summary?.totalBookings}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <p className="text-muted mb-1">Total Revenue</p>
                            <h3 className="fw-bold">₹{summary?.totalRevenue}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}