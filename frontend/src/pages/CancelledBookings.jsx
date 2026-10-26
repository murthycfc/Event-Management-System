import { useEffect, useState } from "react"
import { getBookings } from "../api/admin";
import {EyeIcon, Trash2Icon } from "lucide-react";
import  { formatDate1 } from "../utils/dates/dateFormatter";
import timeFormatter from "../utils/dates/timeFormatter";
import Button from "../components/Button";
import { useNavigate } from "react-router";

export default function CancelledBookings(){
    const [bookings, setBookings] = useState();
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState();
    const[loading, setLoading] = useState();

    const navigate = useNavigate();

    async function fetchBookings(page){
        try {
            setError("");
            setLoading(true)
            const data = await getBookings("CANCELLED",page, 10);
            setBookings(data.content);
            setTotalPages(data.totalPages)
            setTotalElements(data.totalElements)
            console.log(data);
        } catch (error) {
            setError(error?.response?.data?.message || "Failded to fetch bookings")
        }
        finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchBookings(page);
    },[page])

    function handleView(bookingId){
        navigate(`/admin/bookings/${bookingId}`);
    }

    return(
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1">
                        Cancelled Bookings
                    </h4>

                    <p className="text-muted mb-0 small">
                        View and manage all event bookings
                    </p>
                </div>

                <div className="text-muted">
                    {bookings?.length} bookings
                </div>
            </div>
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <div className="table table-striped align-middle">
                            <colgroup>
                                <col style={{width:"16%"}} />
                                <col style={{ width: "22%" }} />
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "16%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "20%" }} />
                            </colgroup>
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 text-muted small fw-semibold">
                                        BOOKING ID
                                    </th>
                                    <th className="py-3 text-muted small fw-semibold">
                                        EVENT
                                    </th>

                                    <th className="py-3 text-muted small fw-semibold">
                                        VENUE
                                    </th>
                                    
                                    <th className="py-3 text-muted small fw-semibold">
                                        DATE & TIME
                                    </th>
                                    <th className="py-3 text-muted small fw-semibold">
                                        USER
                                    </th>
                                    <th className="py-3 text-muted small fw-semibold">
                                        STATUS
                                    </th>
                                    <th className="py-3 text-muted small fw-semibold">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="12" className="py-5 text-center">
                                                <span>Loading...</span>
                                        </td>
                                    </tr>
                                )}
                                {bookings?.length === 0 ? (
                                    <tr>
                                        <td 
                                            colSpan="12"
                                            className="mt-5 text-muted">
                                                <div className="text-muted text-center">
                                                No cancelled bookings recorded yet
                                            </div>
                                        </td>
                                    </tr>
                                ): (
                                    bookings?.map((booking)=>(
                                        <tr
                                            key={booking.id}
                                        >
                                            <td className="px-4">
                                                 <div className="fw-semibold">
                                                    {booking.bookingNumber}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">
                                                    {booking.event}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-muted small">
                                                    {booking.venue}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    <div className="fw-medium">
                                                        {formatDate1(booking.date)}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {timeFormatter(booking.startTime)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-truncate">
                                                    {booking.user}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-2 bg-danger-subtle text-danger`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="pe-3">
                                                <div className="d-flex gap-1">
                                                    <Button 
                                                        className="btn text-primary"
                                                        onClick={()=>handleView(booking?.id)}
                                                    >
                                                        <EyeIcon size={18}/>
                                                    </Button>

                                                    
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </div>
                    </div>
                </div>
           </div>
           {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center p-3">

                    <div className="text-muted small">
                        Page {page + 1} of {totalPages}
                    </div>

                    <div className="d-flex gap-2">

                        <Button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page === 0 || loading}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Previous
                        </Button>

                        <Button
                            className="btn btn-outline-primary btn-sm"
                            disabled={page === totalPages - 1 || loading}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Next
                        </Button>

                    </div>

                </div>
            )}
        </div>
    )
}