import { MoreHorizontal, MoreVertical } from "lucide-react";
import { useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router";
import { deleteVenue } from "../api/admin";

export default function VenueCard({ venue, fetchVenues }) {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    function handleEdit(){
        setShowMenu(false);
        navigate(`${venue.id}/edit`)
    }

    function handleDelete(){
        setShowDeleteModal(true);
        setShowMenu(false);
    }
    function cancelDelete() {
        setShowDeleteModal(false);
    }
    async function confirmDelete(){
        
        const data = await deleteVenue(venue.id)
        console.log(data);
        setShowDeleteModal(false);
        await fetchVenues();
    }
    function handleVenueClick(){
        navigate(`/admin/venues/${venue.id}`);
    }
    return (
        <div className="col-12 col-md-6">
            <div 
                className="card h-100 border-0 shadow-sm rounded-3"
                style={{cursor: "pointer"}}
                onClick={handleVenueClick}
            >

                <div className="card-body p-3">

                    <div className="d-flex flex-column h-100 justify-content-between">
                        <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2 position-relative">
                                <h5 className="fw-bold text-dark mb-1">
                                    {venue?.name}
                                </h5>

                                <Button 
                                    className="btn btn-sm border-0"
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        setShowMenu(prev => !prev)
                                    }}
                                >
                                    <MoreVertical size={18} />
                                </Button>
                                {showMenu && (
                                    <div
                                        className="position-absolute bg-white border rounded-3 shadow-sm"
                                        style={{
                                            right: 0,
                                            top:"100%",
                                            zIndex: 1,
                                            minWidth: "150px"
                                        }}
                                    >
                                    
                                        <Button
                                            className="dropdown-item px-3 py-2"
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                handleEdit()
                                            }}
                                        >
                                            Edit Venue
                                        </Button>
                                        <Button
                                            className="dropdown-item px-3 py-2"
                                            onClick={(e)=>{
                                                e.stopPropagation();
                                                handleDelete()
                                            }}
                                        >
                                            Delete Venue
                                        </Button>
                                      
                                    </div>
                                )}
                                
                            </div>

                            

                            <div className="d-flex justify-content-between">
                                <span>{venue?.city}</span>
                                <span>{venue?.state}</span>
                            </div>

                        </div>

                        <div className="d-flex justify-content-between">
                            <div>
                                <span className="fw-semibold text-dark">
                                    {venue?.totalSections}
                                </span>

                                <small className="text-muted ms-1">
                                    Sections
                                </small>
                            </div>
                            <div>
                                <span className="fw-semibold text-dark">
                                    {venue?.totalSeats}
                                </span>

                                <small className="text-muted ms-1">
                                    Seats
                                </small>
                            </div>

                        </div>

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
                                <h5 className="modal title">Delete Venue</h5>
                                <Button
                                    className="btn-close"
                                    onClick={cancelDelete}
                                >
                                </Button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this venue?
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