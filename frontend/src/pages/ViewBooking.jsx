import { useNavigate, useParams } from "react-router";
import Button from "../components/Button";
import { viewBookingDetails } from "../api/admin";
import { useEffect, useState } from "react";
import { Building2Icon, Calendar, MapPin, Ticket, Timer } from "lucide-react";
import { formatDate1 } from "../utils/dates/dateFormatter";
import timeFormatter from "../utils/dates/timeFormatter";

export default function ViewBooking(){

    const navigate = useNavigate();

    const {bookingId} = useParams();
    const [bookingData, setBookingData] = useState();
    const [error, setError] = useState();

    useEffect(()=>{
        async function fetchBookingDetails() {
            try {
                const data = await viewBookingDetails(bookingId);
                setBookingData(data);
                console.log(data);
            } catch (error) {
                setError(error.response.data.message)
            }
        }
        fetchBookingDetails();
    },[])

    function handleBack(){
        navigate(-1)
    }

    if(error){
        return (
            <div className="alert alert-danger mt-4" style={{width:"400px"}}>
                {error}
            </div>
        )
    }

    return(
        <div className="container mt-4 ">
            <h3 className="mb-4">Booking Details</h3>
            <div className="d-flex mb-4">
                <div className="px-3">
                    <img 
                        src="/stand-up-comedy.jpg"
                        alt="event image"
                        style={{height:"200px"}}
                        className="rounded-3"
                    />
                </div>
                <div className="mx-2">
                    <div className="d-flex align-items-center gap-3 mb-3">
                         <h2 >
                            {bookingData?.eventName}
                        </h2>
                         <span
                            className={`badge rounded-pill px-3 py-2 ${
                                bookingData?.bookingStatus === "SUCCESSFUL"
                                    ? "bg-success-subtle text-success"
                                    : bookingData?.bookingStatus === "CANCELLED"
                                    ? "bg-danger-subtle text-danger"
                                    : "bg-secondary-subtle text-secondary"
                            }`}
                        >
                            {bookingData?.bookingStatus}
                        </span>
                    </div>
                
                    <div className="d-flex gap-5">
                        <div className="d-flex gap-1">
                            <Calendar />
                            <p>{formatDate1(bookingData?.date)}</p>
                        </div>

                        <div className="d-flex gap-1 ">
                            <Timer />
                            <p>{timeFormatter(bookingData?.startTime)} - {timeFormatter(bookingData?.endTime)}</p>
                        </div>

                        <div className="d-flex gap-1">
                            <MapPin />
                            <p>{bookingData?.venueName}</p>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Building2Icon />
                        <p>{bookingData?.addressResponse?.place},</p>
                        <p>{bookingData?.addressResponse?.landmark},</p>
                        <p>{bookingData?.addressResponse?.city},</p>
                        <p>{bookingData?.addressResponse?.state},</p>
                        <p>{bookingData?.addressResponse?.pinCode}.</p>
                    </div>
                </div>

            </div>
            <div className="card">
                <div className="d-flex align-items-center justify-content-around gap-4 mx-3">
                    <div className="d-flex align-items-center gap-5">
                        <Ticket className="ms-3"/>
                        <div className="d-flex flex-column align-items-center">
                            <p className="mt-2 mb-0">Seats</p>
                            <p className="">{bookingData?.seatDetails.length} seats</p>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gap-3">
                        {bookingData?.seatDetails.map((seat)=>(
                            <div 
                                key={seat.id}
                                className="d-flex gap-2 p-2 rounded text-white" 
                                style={{backgroundColor:"#554EE2"}}
                            >
                                <p className="my-auto">{seat.seatNo}</p>
                                <p className="my-auto">{seat.section}</p>
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end m-4">
                <Button
                    className="btn btn-secondary"
                    onClick={handleBack}
                >Back</Button>
            </div>
        </div>
    )
}