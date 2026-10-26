import { useEffect, useState } from "react"
import { myBookingDetails, myBookings } from "../api/customer";
import { Calendar1, Locate, LocateIcon, MapPin, Timer } from "lucide-react";
import Button from "../components/Button";
import { useNavigate } from "react-router";
export default function MyBookings(){

    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    if(!token){
        navigate("/login");
    }
    useEffect(()=>{

        async function fetchMyBookings() {

            try {
                setLoading(true)
                const data = await myBookings();
                setBookings(data);
                console.log(data);

            } catch (error) {
                const status = error?.response?.status;
                if(status=== 404){
                    setBookings([])
                }else{
                    setError(error?.response?.data?.message || "Failed to load bookings");
                }
            }
            setLoading(false);
        }
        fetchMyBookings();
    },[])

    async function handleClick(bookingId) {
        try {
            navigate(`/myBookings/${bookingId}`)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    if(loading){
        return(
            <div className="mt-4">
                <p>Loading Your Bookings</p>
            </div>
        )
    }

    if(error){
        return(
            <div className="alert alert-danger mt-4 mx-auto "
                style={{width:"400px"}}
            >
                <p className="text-center my-auto">{error}</p>
            </div>
        )
    }

    if (!loading && bookings?.length === 0) {
        return(
            <div className="container py-5">
                <div className="d-flex flex-column align-items-center">
                    <img 
                        src="/no_bookings.png"
                        alt="No bookings"
                        style={{
                            width: "280px",
                            maxWidth: "100%"
                        }}
                        className="mb-4"
                    />

                    <Button
                        className="btn btn-sm px-3 py-2 rounded-2 text-white"
                        style={{backgroundColor: "#554EE2"}}
                        onClick={()=> navigate("/events")}
                    >
                        Explore Events &rarr;
                    </Button>
                </div>
                

                {/* <h3 className="fw-semibold">
                    No bookings yet
                </h3>

                <p className="text-muted">
                    You haven't booked any events yet.
                </p> */}

                

            </div>
        )
    }

    

    

    return(
        <div className="container my-4">

            <h2 className="fw-bold mb-4 text-center">My Bookings</h2>

            <div className="d-flex flex-column gap-3">

                {bookings.map((booking) => (
                    <Button
                        key={booking.bookingId}
                        className="card shadow-sm rounded-3"
                        onClick={()=>{handleClick(booking.bookingId)}}
                    >
                        <div className="card-body px-2 py-3">

                            <div className="d-flex justify-content-between align-items-center gap-4">

                                <div className="d-flex gap-2">
                                    <h5 className="fw-bold">
                                        {booking.eventName}
                                    </h5>

                                    {booking.bookingStatus ==="SUCCESSFUL" ? (
                                        <span 
                                            className="badge bg-success py-2"
                                            style={{height:"30px"}}
                                        >
                                            {booking.bookingStatus}
                                        </span>
                                    ): (
                                        <span 
                                            className="badge bg-danger py-2"
                                            style={{height:"30px"}}
                                        >
                                            {booking.bookingStatus}
                                        </span>
                                    )}
                                </div>

                                <p className="fw-bold fs-5">
                                    ₹{booking.totalAmount}
                                </p>

                            </div>

                            <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-2 text-muted">

                                <span className="d-flex gap-1">
                                    <Calendar1 size={22} />
                                    {booking.eventDate}
                                </span>

                                <span className="d-flex gap-1">
                                    <Timer size={22}/>
                                    {booking.startTime}
                                </span>

                                <span className="d-flex align-items-start gap-1">
                                    <MapPin size={22} className="flex-shrink-0 mt-1"/>
                                    <span className="flex-grow-1">
                                        {booking.venueName}, {booking.city}
                                    </span>
                                    
                                </span>
                            </div>
                        </div>
                    </Button>
                ))}
            </div>

        </div>
    )
}