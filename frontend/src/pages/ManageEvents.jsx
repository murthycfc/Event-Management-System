import { MoreVertical, Plus, CalendarDays, MapPin, Tag, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { loadEvents } from "../api/customer";
import Button from "../components/Button";
import  { formatDate1 } from "../utils/dates/dateFormatter";
import timeFormatter from "../utils/dates/timeFormatter";
import { useNavigate } from "react-router";
import { deleteEvent, getAllEvents } from "../api/admin";

export default function ManageEvents() {

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [error, setError] = useState();
    const [activeMenu, setActiveMenu] = useState(null);


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const data = await getAllEvents();
                setEvents(data);
                console.log(data)
            } catch (error) {
                setError(error?.response?.data?.message || "Failed to load events");
            }
        }

        fetchEvents();
    }, []);

    function handleView(eventId) {
        navigate(`/admin/events/${eventId}`);
    }

    function handleEdit(eventId){
        navigate(`/admin/events/${eventId}/edit`)
    }

    function handleDelete(eventId){
        setShowDeleteModal(true);
        setDeleteEventId(eventId);
    }

    function cancelDelete(){
        setShowDeleteModal(false);
        setActiveMenu(null);
    }

    async function confirmDelete() {
        try {
            const data = await deleteEvent(deleteEventId);
            console.log(data);
            setEvents(prev => prev.filter(event => event.id !== deleteEventId));
            setShowDeleteModal(false);
            setDeleteEventId(null);
            setActiveMenu(null);

        } catch (error) {
            setError(error?.response?.data?.message || "Failed to delete event");
        }
    }
    return (
        <div className="container px-4 py-3">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold mb-1">
                        Manage Events
                    </h2>

                    <p className="text-muted mb-0">
                        Create and manage events, schedules and pricing
                    </p>
                </div>

                <Button
                    className="btn text-white px-3 py-2"
                    style={{
                        backgroundColor: "#554EE2",
                        borderRadius: "8px"
                    }}
                >
                    <div className="d-flex align-items-center gap-2">
                        <Plus size={18} />
                        <span onClick={()=>navigate("/admin/events/add")}>Create Event</span>
                    </div>
                </Button>

            </div>


            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div
                className="card border-0 shadow-sm p-1"
            >
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped  align-middle mb-0">
                            <thead>
                                <tr>
                                    <th className="px-2 py-3 text-muted  small fw-semibold">
                                        EVENT
                                    </th>

                                    <th className="py-3 text-muted small fw-semibold">
                                        DATE
                                    </th>

                                    <th className="py-3 text-muted small fw-semibold">
                                        START TIME
                                    </th>

                                    <th className="py-3 text-muted small fw-semibold">
                                        END TIME
                                    </th>

                                    <th className="py-3 text-muted small fw-semibold">
                                        CATEGORY
                                    </th>

                                    <th className="py-3 text-muted small fw-semibold">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {events.length === 0 && !error ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-5 text-muted"
                                        >
                                            No events found.
                                        </td>
                                    </tr>
                                ) : (

                                    events.map((event) => (
                                        <tr
                                            key={event.id}
                                            style={{cursor:"pointer"}}
                                            onClick={() => handleView(event.id)}
                                        >
                                            <td className="px-2 py-3">

                                                <div className="fw-semibold">
                                                    {event.name}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">

                                                    {/* <CalendarDays
                                                        size={16}
                                                        className="text-muted"
                                                    /> */}
                                                    <div>
                                                        <div className="">
                                                            {formatDate1(event.date)}
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>
                                                <div className="d-flex align-items-center gap-2">

                                                    {/* <Timer
                                                        size={16}
                                                        className="text-muted"
                                                    /> */}

                                                    <span>
                                                        {timeFormatter(event.startTime)}
                                                    </span>

                                                </div>

                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">

                                                    {/* <Timer
                                                        size={16}
                                                        className="text-muted"
                                                    /> */}

                                                    <span>
                                                        {timeFormatter(event.endTime)}
                                                    </span>

                                                </div>

                                            </td>
                                            <td>
                                                <div
                                                    className="badge px-3 py-2"
                                                    style={{
                                                        backgroundColor: "#eeeefe",
                                                        color: "#554EE2",
                                                        fontWeight: "500"
                                                    }}
                                                >
                                                    <Tag
                                                        size={13}
                                                        className="me-1"
                                                    />
                                                    {event.category}
                                                </div>
                                            </td>
                                            <td className="position-relative">
                                                <Button
                                                    className="btn"
                                                    style={{
                                                        borderRadius: "7px"
                                                    }}
                                                    onClick={(e)=>{
                                                        e.stopPropagation();
                                                        setActiveMenu(prev => prev=== event.id ? null : event.id)
                                                    }}
                                                >
                                                    <MoreVertical size={18} />
                                                </Button>
                                                {activeMenu === event.id && (
                                                    <div
                                                        className="position-absolute border rounded-3 shadow-sm p-2 bg-white"
                                                        style={{
                                                            right: "10px",
                                                            top: "100%",
                                                            zIndex: 1000,
                                                            minWidth: "200px"
                                                        }}
                                                    >
                                                        <Button 
                                                            className="btn btn-light w-100 text-start mb-1"
                                                            onClick={(e)=>{
                                                                e.stopPropagation();
                                                                handleEdit(event.id)
                                                            }}    
                                                        >
                                                            Edit Event
                                                        </Button>

                                                        <Button 
                                                            className="btn btn-light w-100 text-start"
                                                            onClick={(e)=>{
                                                                e.stopPropagation();
                                                                handleDelete(event.id)
                                                            }}    
                                                        >
                                                            Delete Event
                                                        </Button>
                                                    </div>
                                                )}

                                            </td>
                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
            {showDeleteModal && (
                <div
                    className="modal d-block bg-dark bg-opacity-75"
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 shadow-lg">
                            <div className="modal-header">
                                <h5 className="modal title">Delete Event</h5>
                                <Button
                                 className="btn-close"
                                 onClick={cancelDelete}
                                >
                                </Button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this event?
                            </div>
                            <div className="modal-footer">
                                <Button
                                    className="btn btn-secondary"
                                    onClick={cancelDelete}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="btn btn-danger"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </Button>

                            </div>
                        </div>
                    </div>

                </div>
            )}

        </div>
    );
}