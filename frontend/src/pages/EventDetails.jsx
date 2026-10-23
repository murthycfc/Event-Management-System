import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router";
import { loadEventDetails } from "../api/customer";
import Button from "../components/Button";
import { Building, Building2, Building2Icon, Calendar, Landmark, MapPin, Tag, Timeline, Timer } from "lucide-react";
import timeFormatter from "../utils/dates/timeFormatter";
import formatDate, { formatDate1 } from "../utils/dates/dateFormatter";
import ImageComponent from "../components/ImageComponent";

export default function EventDetails(){
    const {eventId} = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState();
    const [error, setError] = useState();

    useEffect(()=>{
        async function fetchEvent() {
            try {
                const data = await loadEventDetails(eventId);
                setEvent(data);
                console.log(data);
            } catch (error) {
                setError(error.response.data.message || "Failed to load event");
            }
        }
        fetchEvent()
    },[eventId]);

    function handleClick(){
        navigate(`/events/${eventId}/seats`)
    }

    if(!event){
        return (
            <div className="text-center my-4">
                Loading...
            </div>
        )  
    }
    return(
        <div className="container">
            {error && (
                <div className="text-center my-4 text-danger">
                    {error}
                </div>
            )}

            <div className="card shadow-sm m-2 ">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            {/* <img 
                                src="/stand-up-comedy.jpg"
                                alt={event.name}
                                className="img-fluid border-md w-100"
                                style={{
                                    height:"300px",
                                    objectFit: "cover",
                                }}
                            /> */}
                            <div className="text-center">
                                <ImageComponent />
                            </div>
                            
                        </div>
                        <div className="col-md-9">
                            <h3 className="fw-bold">
                                {event.name}
                            </h3>
                            <p className="text-muted">{event.category}</p>

                            <p className="text-muted">
                                {event.description}
                            </p>

                            <div className="row ">
                                <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex">
                                                <Calendar size={20} className="mt-3"/>
                                                <div className="mx-4">
                                                    <p className="mb-0">Date: </p>
                                                    <p className=" fw-bold">{formatDate(event.date)}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="d-flex">
                                                     <Timer size={20} className="mt-3"/>
                                                     <div className="mx-4">
                                                        <p className="mb-0">Time: </p>
                                                        <p className="fw-bold">{timeFormatter(event.startTime)} - {timeFormatter(event.endTime)}</p>
                                                     </div>
                                                </div>
                                            </div>
                                            <div >
                                                <div className="d-flex ms-2">
                                                    <MapPin size={20} className="mt-3"/>
                                                    <div className="mx-4">
                                                        <p className="mb-0">Venue: </p>
                                                        <p className="fw-bold">{event.venueName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                </div>
                                
                                <div className="col-12 mt-3">
                                    {/* <div >
                                        <div className="d-flex">
                                            <MapPin size={20} className="mt-3"/>
                                            <div className="mx-4">
                                                <p className="mb-0">Location: </p>
                                                <p className="">{event.address.place}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <Landmark size={20} className="mt-3"/>
                                        <div className="mx-4">
                                            <p className="mb-0">Landmark: </p>
                                            <p className="">{event.address.landmark}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex">
                                            <div className="d-flex">
                                                <Building2 size={20} className="mt-3"/>
                                                <div className="mx-4">
                                                    <p className="mb-0">City: </p>
                                                    <p className="">{event.address.city}</p>
                                                </div>
                                            </div>

                                            <div className="d-flex">
                                                <Tag size={20} className="mt-3"/>
                                                <div className="mx-4">
                                                    <p className="mb-0">PIN Code: </p>
                                                    <p className="">{event.address.pinCode}</p>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>                                     */}
                                    <div className="d-flex gap-2">
                                        <Landmark size={20} />
                                        <p>{event?.address?.place},</p>
                                        <p>{event?.address?.landmark},</p>
                                        <p>{event?.address?.city},</p>
                                        <p>{event?.address?.state},</p>
                                        <p>{event?.address?.pinCode}.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    

                    <hr />

                    <div className="d-flex justify-content-end mx-5">
                        {/* <div>
                            <h5>Booking Period</h5>
                            <p>
                                <p className="text-muted">Booking ends: </p>
                                <div className="d-flex mt-1 gap-2">
                                    <Timer size={20} className=""/>
                                    {formatDate1(event.bookingEndDate)} at {timeFormatter(event.bookingEndTime)}
                                </div>
                            </p>
                        </div> */}

                        <div className="mt-2">
                            <Button 
                                onClick={handleClick}
                                className="btn text-white me-1"
                                style={{backgroundColor: "#554EE2"}}

                            >
                                Book Tickets
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
            
            
        </div>
    )
}