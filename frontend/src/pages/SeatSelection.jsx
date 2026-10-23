import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router";
import { continueBooking, loadSeats } from "../api/customer";
import Button from "../components/Button";
import ImageComponent from "../components/ImageComponent";
import { Calendar, Clock, MapPin } from "lucide-react";
import formatDate from "../utils/dates/dateFormatter";
import timeFormatter from "../utils/dates/timeFormatter";
export default function SeatSelection(){
    const {eventId} = useParams();
    console.log(eventId);


    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [error, setError] = useState("");
    const [event, setEvent] = useState();

    const navigate = useNavigate();

    useEffect(()=>{
        async function fetchSeats() {
            try {
                const data = await loadSeats(eventId);
                setSeats(data.eventSeats)
                setEvent(data);
                console.log(data);
            } catch (error) {
                setError(error?.response?.data?.message || "Failed to load seats")
            }
        }
        fetchSeats();
    },[eventId])

    function handleClick(seat){

        if(seat.eventSeatStatus!=="AVAILABLE"){
            return;
        }

        setSelectedSeats(prev =>{
            const alreadySelected = prev.some(selectedSeat => selectedSeat.id === seat.id);
            if(alreadySelected){
                return prev.filter(selectedSeat => selectedSeat.id!==seat.id)
            }
            return [...prev,seat];
        })
        console.log(selectedSeats);
    }

    if(error){
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        )
    }

    function getSeat(x,y){
        return seats.find(
            seat => 
                seat.xCoordinate===x && 
                seat.yCoordinate===y
        );
    }

    const sections = [...new Set(
        seats.map(seat => seat.section)
    )];

    const totalPrice = selectedSeats.reduce((total, seat)=>{
        return total+seat.price;
    },0)

    const sectionCount = selectedSeats.reduce((sectionWise, seat)=>{
        const section = seat.section;

        sectionWise[section] = (sectionWise[section] || 0) +1;
        return sectionWise;
    },{})



    async function handleContinue(){
        try {
            setError("");
            if(selectedSeats.length<1){
                setError("Select atleast one seat");
                return;
            }
            const data = await continueBooking(selectedSeats);
            const bookingId = data.bookingId;
            navigate(`/booking/confirmation/${bookingId}`)
        } catch (error) {
            setError(error.response.data.message || "Failed to book seats")
        }
        
    }
    
    
    return(
        <div className="container py-4">
            <div className="row">
                <div className="col-12 col-md-8">
                    <div className="d-flex flex-column align-items-center">
                        {sections.map(section => {
                            const sectionSeats = seats.filter(
                                seat => seat.section === section
                            );

                            const sectionPrice = sectionSeats[0]?.price;

                            const rows = [
                                ...new Set(
                                    sectionSeats.map(
                                        seat => seat.xCoordinate
                                    )
                                )
                            ].sort((a, b) => a - b);

                            const columns = [
                                ...new Set(
                                    sectionSeats.map(
                                        seat => seat.yCoordinate
                                    )
                                )
                            ].sort((a, b) => a - b);



                            return (
                                <div
                                    key={section}
                                    className="mb-4"
                                >   
                                    <p className="text-center">₹{sectionPrice }{' '} {section}</p>
                                    <div>

                                    </div>
                                        {rows.map(x => (
                                            <div 
                                                key={x}
                                                className="d-flex gap-2 mb-2"
                                            >
                                                {columns.map(y=> {
                                                    const seat = getSeat(x,y);

                                                    if(!seat){
                                                        return (
                                                            <div
                                                                key={`${x}-${y}`}
                                                                style={{width: "45px", height:"45px"}}
                                                            >
                                                            </div>
                                                        )
                                                    }

                                                    const isSelected = selectedSeats.some(
                                                        selectedSeat => selectedSeat.id === seat.id
                                                    );

                                                    let seatClass = "btn btn-sm ";

                                                    if(seat.eventSeatStatus === "BOOKED"){
                                                        seatClass+= "btn-secondary";
                                                    }

                                                    else if(seat.eventSeatStatus === "PENDING"){
                                                        seatClass+= "btn-warning";
                                                    }

                                                    else if(isSelected){
                                                        seatClass+= "btn-success";
                                                    }
                                                    else {
                                                        seatClass+="btn-outline-primary"
                                                    }

                                                    return (
                                                        <Button
                                                            key={seat.id}
                                                            type="button"
                                                            className={seatClass}
                                                            style={{
                                                                width: "45px",
                                                                height: "45px"
                                                            }}
                                                            disabled={seat.eventSeatStatus!=="AVAILABLE"}
                                                            onClick={()=> handleClick(seat)}
                                                        >
                                                            {seat.seatNo}
                                                        </Button>
                                                    )
                                                })}
                                                
                                            </div>

                                        ))}

                                </div>
                            )
                        })}
                        <div className="d-flex justify-content-between align-items-center mt-4 gap-3">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body px-4 py-3">
                                    <div className="d-flex align-items-center gap-4">
                                        <div>
                                            <h6 className="mb-2">
                                                Selected Seats
                                            </h6>
                                            {Object.entries(sectionCount).map(([sectionName, count]) => (
                                                <div key={sectionName} className="text-muted small">
                                                    {sectionName} × {count}
                                                </div>
                                            ))}
                                        </div>
                                        <div
                                            className="vr"
                                            style={{ minHeight: "20px" }}
                                        ></div>

                                        <div>
                                            <small className="text-muted d-block">
                                                Total Amount
                                            </small>

                                            <span
                                                className="fw-bold fs-4"
                                                style={{ color: "#554EE2" }}
                                            >
                                                ₹{totalPrice}
                                            </span>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <Button
                                className="btn text-white px-4 py-2"
                                style={{ backgroundColor: "#554EE2" }}
                                onClick={handleContinue}
                            >
                                Continue to Pay
                            </Button>

                        </div>
                        
                        
                    </div>

                </div>
                <div className="col-12 col-md-4 ">
                    <div className="d-flex flex-column">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className=" text-center">
                                <div className="">
                                    <ImageComponent 
                                        className=""
                                    />
                                </div>
                                <div className="card-body">
                                    <h5>{event?.eventName}</h5>
                                    <div className="d-flex flex-column">
                                        <div className="d-flex justify-content-center  gap-4 mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <Calendar size={22}/>
                                                <span>{formatDate(event?.date)}</span>
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                <Clock size={22}/>
                                                <span>{timeFormatter(event?.time)}</span>
                                            </div>
                                            
                                        </div>
                                        {/* <div className="d-flex justify-content-start  mb-2">
                                            
                                        </div> */}
                                        <div className="d-flex justify-content-center align-items-center gap-1 mb-2">
                                            <MapPin size={22}/>
                                            <span>{event?.venueName}</span>
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                </div>

            </div>

            
            
        </div>
    )
}