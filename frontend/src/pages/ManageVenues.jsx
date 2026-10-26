import { useEffect, useState } from "react";
import Button from "../components/Button";
import { getVenues } from "../api/admin";
import AddvenueModal from "../components/AddvenueModal";
import VenueCard from "../components/VenueCard";

export default function ManageVenues(){
    const [venues, setVenues] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState();

    const [search, setSearch] = useState("");

    const [showAddVenue, setShowAddVenue] = useState(false);

    async function fetchVenues(name="", page) {
        try {
            setError("");
            const data = await getVenues(name, page);
            setVenues(data.content);
            setTotalElements(data.totalElements)
            setTotalPages(data.totalPages)
        } catch (error) {
            setError(error?.response?.data?.message);
        }
    }
        
    useEffect(()=>{
        fetchVenues(search.trim(),page);
    },[page])

    function handleSearch() {
        fetchVenues(search.trim(), page);
    }


    function handleAddVenue(){
        setShowAddVenue(true);
    }
    function handleClose() {
        setShowAddVenue(false);
    }
    return (
        <div className="container-md">
            <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
                <div>
                    <h4>Manage Venues</h4>
                     <p className="text-muted mb-0">
                        Create and manage venues, seats and coordinates
                    </p>
                </div>
                <div className="d-flex flex-column flex-md-row gap-2">
                    {/* <div> */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search venue by name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                height:"40px"
                            }}
                        /> 
                    {/* </div> */}
                    <div className="d-flex gap-2">
                        <Button
                            className="btn btn-secondary"
                            style={{
                                width:"150px",
                                height:"40px"
                            }}
                            onClick={handleSearch}
                        >
                            Search
                        </Button>

                        <Button
                            className="btn text-white btn-custom"
                            style={{ backgroundColor: "#554EE2",
                                width:"150px",
                                height:"40px"
                            }}
                            onClick={handleAddVenue}
                        >
                            Create Venue
                        </Button>
                    </div>
                    

                    

                </div>
                
                
            </div>

            <div className="text-end mb-2">
                <span className="me-3">Total Venues: {totalElements}</span>
            </div>

            <div className="row mb-3 g-3">
                
                {error ? (
                    <div className="col-12">
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    </div>
                ) : (
                    
                    venues.map((venue)=>(
                    <VenueCard 
                        key={venue.id}
                        venue={venue}
                        fetchVenues={fetchVenues}
                    />
                )))}
                
            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center p-3">

                    <div className="text-muted small">
                        Page {page + 1} of {totalPages}
                    </div>

                    <div className="d-flex gap-2">

                        <Button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page === 0}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Previous
                        </Button>

                        <Button
                            className="btn btn-outline-primary btn-sm"
                            disabled={page === totalPages - 1}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Next
                        </Button>

                    </div>

                </div>
            )}



            {showAddVenue && (
                <AddvenueModal 
                    onClose={handleClose}
                    onVenueCreated={fetchVenues}
                />
            )}
        </div>
    )
}