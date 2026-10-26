import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getEventForEdit } from "../api/admin";
import Button from "../components/Button";
import { formatDate1 } from "../utils/dates/dateFormatter";
import timeFormatter from "../utils/dates/timeFormatter";
import { loadSeats } from "../api/customer";

export default function AdminEventDetails() {

    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [error, setError] = useState("");
    const [seats, setSeats] = useState([]);

    useEffect(() => {
        async function fetchEvent() {
            try {
                setError("");
                const data = await getEventForEdit(eventId);
                const eventSeats = await loadSeats(eventId);
                setEvent(data);
                setSeats(eventSeats.eventSeats);
                console.log(data);
                console.log(eventSeats);
            } catch (error) {
                setError(
                    error?.response?.data?.message ||
                    "Failed to load event details"
                );
            }
        }
        fetchEvent();
    }, [eventId]);

    if (error) {
        return (
            <div className="container mt-4">
                <p className="text-danger">
                    {error}
                </p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mt-4 text-center">
                Loading...
            </div>
        );
    }

    function getSeat(x,y){
        return seats.find(
            seat => 
                seat.xCoordinate===x && 
                seat.yCoordinate===y
        );
    }

    const sections = [...new Set(seats.map(seat => seat.section))]
    .map(section => ({
        name: section,
        minX: Math.min(
            ...seats
                .filter(seat => seat.section === section)
                .map(seat => seat.xCoordinate)
        )
    }))
    .sort((a, b) => a.minX - b.minX);


    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">
                        {event.name}
                    </h3>
                    <p className="text-muted mb-0">
                        Event Details
                    </p>
                </div>

                <div className="d-flex gap-2">

                    <Button
                        className="btn btn-light"
                        onClick={() =>
                            navigate(`/admin/events/${event.id}/edit`)
                        }
                    >
                        Edit Event
                    </Button>
                    <Button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/admin/events")
                        }
                    >
                        Back
                    </Button>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">
                        Event Information
                    </h5>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="text-muted small">
                                Event Name
                            </div>

                            <div className="fw-semibold">
                                {event.name}
                            </div>
                        </div>

                        <div className="col-md-6">

                            <div className="text-muted small">
                                Category
                            </div>
                            <div className="fw-semibold">
                                {event.category}
                            </div>
                        </div>


                        <div className="col-12">
                            <div className="text-muted small">
                                Description
                            </div>
                            <div>
                                {event.description}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="text-muted small">
                                Date
                            </div>
                            <div className="fw-semibold">
                                {formatDate1(event.date)}
                            </div>
                        </div>


                        <div className="col-md-4">
                            <div className="text-muted small">
                                Start Time
                            </div>
                            <div className="fw-semibold">
                                {timeFormatter(event.startTime)}
                            </div>
                        </div>


                        <div className="col-md-4">
                            <div className="text-muted small">
                                End Time
                            </div>
                            <div className="fw-semibold">
                                {timeFormatter(event.endTime)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">
                        Venue
                    </h5>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="text-muted small">
                                Venue Name
                            </div>

                            <div className="fw-semibold">
                                {event.venueName}
                            </div>
                        </div>

                        <Button
                            className="btn btn-light"
                            onClick={() =>
                                navigate(`/admin/venues/${event.venueId}`)
                            }
                        >
                            View Venue
                        </Button>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">
                        Seat Pricing
                    </h5>
                    <div className="row g-3">
                        {Object.entries(event.eventSeatPrices || {}).map(
                            ([sectionName, sectionData]) => (
                                <div
                                    className="col-12 col-md-4"
                                    key={sectionName}
                                >
                                    <div className="border rounded-3 p-3">

                                        <div className="text-muted small">
                                            Section
                                        </div>

                                        <div className="fw-semibold">
                                            {sectionName}
                                        </div>

                                        <div className="mt-2">
                                            <span className="text-muted">
                                                Price:
                                            </span>
                                            <span className="fw-bold ms-1">
                                                ₹{sectionData.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}

                    </div>
                </div>
            </div>

            <div className="card  border-0 shadow-sm mb-4">
                <div className="card-body d-flex flex-column align-item-center p-4">

                    {sections.map(section => {
                        const sectionSeats = seats.filter(
                            seat => seat.section === section.name
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
                                key={section.name}
                                className="mb-4 d-flex flex-column justify-content-center"
                            >   
                                <p className="text-center">₹{sectionPrice }{' '} {section.name}</p>
                                <div>

                                </div>
                                
                                    {rows.map(x => (
                                        <div 
                                            key={x}
                                            className="d-flex align-items-center justify-content-center gap-2 mb-2"
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

                                                let seatClass = "btn btn-sm ";
                                                if(seat.eventSeatStatus === "BOOKED"){
                                                    seatClass+= "btn-secondary";
                                                }

                                                else if(seat.eventSeatStatus === "PENDING"){
                                                    seatClass+= "btn-warning";
                                                }
                                                else {
                                                    seatClass+="btn-outline-primary"
                                                }

                                                return (
                                                    <div
                                                        key={seat.id}
                                                        className={seatClass}
                                                        style={{
                                                            width: "45px",
                                                            height: "45px",
                                                            paddingTop: "10px"
                                                        }}
                                                    >
                                                        {seat.seatNo}
                                                    </div>
                                                )
                                            })}
                                            
                                        </div>

                                    ))}

                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}