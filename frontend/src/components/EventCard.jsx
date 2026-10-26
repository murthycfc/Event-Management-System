import { useNavigate } from "react-router";
import Button from "./Button";
import formatDate from "../utils/dates/dateFormatter";
import { Calendar, MapPin } from "lucide-react";
export default function EventCard({event}){
    const navigate = useNavigate();

    async function handleClick() {
        navigate(`/events/${event.id}`)
    }
    return(
        <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card shadow">
                <img 
                    src="/music.jpg"
                    className="card-img-top"
                />
                <span 
                    className="badge position-absolute top-0 start-0 my-3 mx-2" 
                    style={{backgroundColor: "#554EE2"}}>
                    {event.category}
                </span>
                <div className="card-body d-flex flex-column">
                        
                    <h5 className="card-title mb-3">{event.name}</h5>
                    <div className="d-flex justify-content-between px-2">
                        <div className="d-flex gap-2">

                            <Calendar size={18} className="mt-1"/>
                            <p>{formatDate(event.date)}</p>
                        </div>
                        <div className="d-flex gap-2">  
                            <MapPin size={18} className="mt-1"/>
                            <p>{event.city}</p>
                        </div>
                    </div>
                    
                    <div className="d-flex gap-2 "> 
                        <p style={{color: "#554EE2"}}
                            className="fw-bold fs-5"
                        >
                            ₹{event.startingPrice} 
                        </p>
                        <p className="text-muted mt-1">Onwards</p>
                       
                    </div>

                    <Button
                        className="btn btn-custom text-white"
                        // style={{backgroundColor: "#554EE2"}}
                        onClick={handleClick}
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </div>
        
    )
}