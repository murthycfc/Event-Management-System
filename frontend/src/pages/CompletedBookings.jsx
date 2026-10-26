import { useEffect, useState } from "react"
import { cancelBookingByAdmin, getBookings } from "../api/admin";
import {EyeIcon, Trash2Icon } from "lucide-react";
import  { formatDate1 } from "../utils/dates/dateFormatter";
import timeFormatter from "../utils/dates/timeFormatter";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { Modal } from "react-bootstrap";

export default function CompletedBookings(){
    const [bookings, setBookings] = useState();
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState();
    const[loading, setLoading] = useState();

    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [result, setResult] = useState(null);

    const navigate = useNavigate();
    async function fetchBookings(page){
        try {
            setError("");
            setLoading(true);
            const data = await getBookings("SUCCESSFUL", page, 10);
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

    function handleCancelClick(booking) {
        setSelectedBooking(booking);
        setShowModal(true);
    }

    async function handleConfirmCancel() {
        try {
            setShowModal(false);
            const data = await cancelBookingByAdmin(selectedBooking.id);
            setSelectedBooking(null);
            setResult(data);
            setShowResultModal(true);
            await fetchBookings();
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to cancel booking");
        }
        
    }

    return(
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1">
                        Completed Bookings
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
                        <table className="table table-striped align-middle">
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
                                        <td colSpan="7" className="py-5 text-center">
                                            <span>Loading...</span>
                                        </td>
                                    </tr>
                                )}
                                {totalElements === 0 ? (
                                    <tr>
                                        <td 
                                            colSpan="12"
                                            className="mt-4 text-muted text-center">
                                                <div className="text-muted">
                                                No completed bookings recorded yet
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
                                                <span className={`badge rounded-pill px-3 py-2 bg-success-subtle text-success`}>
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

                                                   <Button
                                                        className="btn btn-sm btn-outline-danger my-auto py-0 "
                                                        style={{height:"25px"}}
                                                        onClick={() => handleCancelClick(booking)}
                                                    >
                                                        <span>Cancel</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
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

           <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Cancel Booking
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to cancel this booking?</p>
                    {selectedBooking && (
                        <div className="bg-light rounded p-3">
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">
                                    Booking
                                </span>

                                <strong>
                                    #{selectedBooking.bookingNumber}
                                </strong>
                            </div>
                        </div>
                    )}
                    <div className="alert alert-warning mt-3 mb-0">
                        The customer will receive a 100% refund.
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </Button>
                    <Button
                        className="btn btn-danger"
                        onClick={handleConfirmCancel}
                    >
                        Confirm Cancellation
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showResultModal}
                onHide={() => setShowResultModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Booking Cancelled
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {result && (
                        <>
                            <div className="text-center mb-4">
                                <h5 className="mb-1">
                                    Booking cancelled successfully
                                </h5>
                            </div>

                            <div className="bg-light rounded p-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">
                                        Booking ID
                                    </span>
                                    <strong>
                                        #{result.bookingNumber}
                                    </strong>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">
                                        Event
                                    </span>
                                    <strong>
                                        {result.eventName}
                                    </strong>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">
                                        Status
                                    </span>

                                    <span className="badge bg-danger-subtle text-danger mt-1">
                                        {result.bookingStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="border rounded p-3 mt-3">
                                <h6 className="fw-semibold mb-3">
                                    Refund Details
                                </h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">
                                        Paid Amount
                                    </span>

                                    <strong>
                                        ₹{result.paidAmount}
                                    </strong>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">
                                        Refund Percentage
                                    </span>
                                    <strong>
                                        {result.refundPercentage}%
                                    </strong>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">
                                        Refunded Amount
                                    </span>
                                    <strong className="text-success">
                                        ₹{result.refundedAmount}
                                    </strong>
                                </div>
                            </div>
                        </>
                    )}

                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className="btn btn-secondary"
                        onClick={() => setShowResultModal(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}