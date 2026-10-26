import { useState } from "react";
import { useNavigate, useParams } from "react-router"
import { cancelBooking, myBookingDetails } from "../api/customer";
import { Building, Building2, Building2Icon, Calendar, Landmark, MapPin, Ticket, Timeline, Timer } from "lucide-react";
import formatDate from "../utils/dates/dateFormatter";
import { formatDate1 } from "../utils/dates/dateFormatter";
import timeFormatter from "../utils/dates/timeFormatter";
import Button from "../components/Button";
import CancelResponseModal from "../components/CancelResponseModal";
import CancelConfirmationModal from "../components/CancelConfirmationModal";
export default function BookingDetails(){

    const navigate = useNavigate();

    const {bookingId} = useParams();
    const [bookingData, setBookingData] = useState();
    // const [cancelResponse, setCancelResponse] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState();

    const [modal, setModal] = useState({
        show: false,
        type: null,
        data: null
    });

    useState(()=>{
        async function fetchBookingDetails() {
            setLoading(true);
            try {
                const data = await myBookingDetails(bookingId);
                setBookingData(data);
                console.log(data);
            } catch (error) {
                setError(error.response.data.message)
            }
            setLoading(false);
        }
        fetchBookingDetails();
    },[])

    function handleCancel(){
        setModal({
            show: true,
            type: "confirm",
            data: null
        })
    }

    async function confirmCancel() {
        try {
            const data = await cancelBooking(bookingId);
            setModal({
                show: true,
                type: "response",
                data: data
            });

        } catch (error) {
            setError(error.response.data.message);
        }
    }


    function handleCloseModal(){
        navigate("/events");
    }

    if(loading){
        return(
            <div className="mt-4 text-center">
                Loading Booking details
            </div>
        )
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
            <div className="d-flex flex-column flex-md-row mb-4">
                <div className="px-3 text-center mb-4">
                    <img 
                        src="/stand-up-comedy.jpg"
                        alt="event image"
                        style={{height:"200px"}}
                        className="rounded-3 "
                    />
                </div>
                <div className="mx-2">
                    <div className="d-flex justify-content-between mb-4">
                        <p className="mb-0 fw-semibold ">{bookingData?.eventName}</p>
                        <span className={ ` badge ${bookingData?.bookingStatus==="SUCCESSFUL" ? "text-success bg-success-subtle": "text-danger bg-danger-subtle"}`}>{bookingData?.bookingStatus}</span>
                    </div>
                    
                    <div className="d-flex flex-column flex-md-row gap-2 gap-md-5 mb-3">
                        <div className="d-flex gap-1">
                            <Calendar size={22}/>
                            <p>{formatDate1(bookingData?.date)}</p>
                        </div>

                        <div className="d-flex gap-1 ">
                            <Timer size={22}/>
                            <p>{timeFormatter(bookingData?.startTime)} - {timeFormatter(bookingData?.endTime)}</p>
                        </div>

                        <div className="d-flex gap-1">
                            <MapPin size={22}/>
                            <p>{bookingData?.venueName}</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-start gap-2">
                        <Building2Icon size={22}/>
                        <div className="d-flex flex-column flex-lg-row">
                            <p>{bookingData?.addressResponse?.place},</p>
                            <div className="d-flex">
                                <span>{bookingData?.addressResponse?.landmark}</span>{", "}
                                <span>{bookingData?.addressResponse?.city}{" "}</span>{", "}
                                <span>{bookingData?.addressResponse?.state}</span>{", "}
                                <span>{bookingData?.addressResponse?.pinCode}.</span>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>

            </div>
            <div className="card">
                <div className="d-flex align-items-center justify-content-around gap-4 mx-3">
                    <div className="d-flex justify-content-start align-items-center gap-5">
                        <Ticket className="ms-3"/>
                        <div className="d-flex flex-column align-items-center">
                            <p className="mt-2 mb-0">No.of Seats</p>
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

            {bookingData?.bookingStatus==="SUCCESSFUL" && (
                <div className="text-end m-4">
                    <Button 
                        className="btn btn-outline-danger"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </div>
            )}

            {modal.show && modal.type === "confirm" &&(
                <CancelConfirmationModal 
                    onConfirm={confirmCancel}
                    onClose={()=>{
                        setModal({
                            show: false,
                            type: null,
                            data: null
                        })
                    }}
                />
            )}            

            {modal.show && modal.type === "response" &&(
                <CancelResponseModal 
                    modal={modal}
                    onClose={handleCloseModal}
                />
            )}
            
        </div>
    )
}