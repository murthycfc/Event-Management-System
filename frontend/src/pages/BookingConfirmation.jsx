import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { bookingDetails, cancelSeletedSeats, confirmPay } from "../api/customer";
import { Calendar, MapPin, Timer, WorkflowIcon, WormIcon, XCircle } from "lucide-react";
import formatDate from "../utils/dates/dateFormatter";
import timeFormatter from "../utils/dates/timeFormatter";
import Button from "../components/Button";
import BookingResultModal from "../components/BookingResultModal";
import ImageComponent from "../components/ImageComponent";

export default function BookingConfirmation(){
    const {bookingId} = useParams();
    const [bookingData, setBookingData] = useState({}); 
    const [error, setError] = useState("");

    const [modal, setModal] = useState({
        show: false,
        type: "",
        data: null
    });

    const navigate = useNavigate();



    useEffect(()=>{
        async function fetchBooking() {
            setError("");
            try {
                const data = await  bookingDetails(bookingId);
                // const data = ""
                setBookingData(data);
                console.log(data);
            } catch (error) {
                setError(error?.response?.data?.message || "Failed to load booking data")
            }
        }
        fetchBooking();
    },[])
    if(!bookingData){
        return (
            <div className="mt-3">
                Loading data
            </div>
        )
    }

    async function handlePay() {
        setError("");
        try {
            const data = await confirmPay(bookingId);
            
            setModal({
                show: true,
                type: "success",
                data: data
            })

        } catch (error) {
            setError(error.response.data.message)
        }
    }

    function handleCloseModal(){
        setModal({
            show: false,
            type: "",
            data: null
        })
        navigate("/events")
    }

    async function handleCancel() {
        setError("");
        try {
            const data = await cancelSeletedSeats(bookingId);
            
            setModal({
                show: true,
                type: "cancel",
                data: data
            })
            
            
        } catch (error) {
            setError(error.response.data.message)
        }
    }
    if(error){
        return(
            <div className="alert alert-danger mt-4 mx-auto " style={{width:"500px"}}>
                {error}
            </div>
        )
    }
    return(
        <div className="container mt-3">
            <div className="">
                <h2>Review Your Booking</h2>
                <p>Check your booking details brefore proceeding to payment</p>
            </div>
            <div className="row">
                <div className="col-md-7">
                    <div className="card">
                        <div className="row">
                            <div className="col-4">
                                <div className="p-2">
                                    {/* <img 
                                        src="/stand-up-comedy.jpg"
                                        alt="poster"
                                        height="300px"
                                    /> */}
                                    <ImageComponent />
                                </div>
                            </div>
                            <div className="col-8">
                                <div className="m-3 px-2">
                                    <h3>{bookingData.eventName}</h3>
                                    <div className="d-flex justify-content-between mt-4">
                                        <div className="d-flex gap-2">
                                            <Calendar size={20} className="mt-1"/>
                                            <p>{formatDate(bookingData.date)}</p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Timer size={20} className="mt-1"/>
                                            <p>{timeFormatter(bookingData?.startTime)}</p> -
                                            <p>{timeFormatter(bookingData?.endTime)}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 mt-3">
                                        <MapPin size={20}/>
                                        <div className="">
                                            <p>{bookingData.venueName}</p>
                                            <p>{bookingData?.addressResponse?.place}</p>
                                            <p>{bookingData?.addressResponse?.city}, {bookingData?.addressResponse?.state}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card">
                        <div className="m-2 px-2">
                            <h4>Booking summary</h4>
                            <p>Your seats are temporarily Pending. Complete payment to confirm your booking.</p>
                            <div className="mx-2">
                                <p>Selected seats</p>
                                {bookingData?.seatDetails?.map(seat =>(
                                    <div className="p-3 mb-2 rounded-3 " style={{backgroundColor:"#F1F2FF"}}>
                                        <span className="mx-2 fw-bold">{seat?.seatNo}</span>
                                        <span className="mx-2 ">{seat?.section}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 mx-2">
                                <div className="d-flex justify-content-between">
                                    <span>Total seats</span>
                                    <span className="me-3 fw-bold">{bookingData?.seatDetails?.length}</span>
                                </div>
                            </div>

                            <hr />
                            <div className="m-2">
                                <div className="d-flex justify-content-between">
                                    <span>Total Amount</span>
                                    <span className="fw-bold">{bookingData.totalAmount}</span>
                                </div>
                            </div>

                            <div className="d-flex flex-column justify-content-center m-3">
                                <Button
                                    className="btn text-white mb-3 mx-auto"
                                    style={{backgroundColor:"#554EE2", width:"300px"}}
                                    onClick={handlePay}
                                >
                                    Pay ₹{bookingData.totalAmount} 
                                </Button>

                                <Button
                                    className="btn btn-outline-danger mx-auto"
                                    style={{width:"300px"}}
                                    onClick={handleCancel}
                                >
                                    <XCircle/>  Cancel Booking
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BookingResultModal 
                modal={modal}
                onClose={handleCloseModal}
            />
        </div>
    )
}