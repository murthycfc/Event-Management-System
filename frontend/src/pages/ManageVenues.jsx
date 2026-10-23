import { useEffect, useState } from "react";
import Button from "../components/Button";
import { getVenues } from "../api/admin";
import AddvenueModal from "../components/AddvenueModal";
import VenueCard from "../components/VenueCard";

export default function ManageVenues(){
    const [venues, setVenues] = useState([]);
    const [error, setError] = useState();

    const [search, setSearch] = useState("");

    const [showAddVenue, setShowAddVenue] = useState(false);

    async function fetchVenues(name="") {
        try {
            setError("");
            const data = await getVenues(name);
            setVenues(data);
        } catch (error) {
            setError(error?.response?.data?.message);
        }
    }
        
    useEffect(()=>{
        fetchVenues();
    },[])

    function handleSearch() {
        fetchVenues(search.trim());
    }


    function handleAddVenue(){
        setShowAddVenue(true);
    }
    function handleClose() {
        setShowAddVenue(false);
    }
    return (
        <div className="container">
            <div className="d-flex justify-content-between mb-3">
                <div>
                    <h4>Manage Venues</h4>
                     <p className="text-muted mb-0">
                        Create and manage venues, seats and coordinates
                    </p>
                </div>
                <div className="d-flex gap-2">

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

                    <Button
                        className="btn btn-secondary"
                        style={{
                            width:"200px",
                            height:"40px"
                        }}
                        onClick={handleSearch}
                    >
                        Search
                    </Button>

                    <Button
                        className="btn text-white"
                        style={{ backgroundColor: "#554EE2",
                            width:"200px",
                            height:"40px"
                         }}
                        onClick={handleAddVenue}
                    >
                        Add Venue
                    </Button>

                </div>
                
            </div>

            <div className="row mb-3 g-3">
                {error ? (
                    <div className="col-12">
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    </div>
                ) : (venues.map((venue)=>(
                    <VenueCard 
                        key={venue.id}
                        venue={venue}
                        fetchVenues={fetchVenues}
                    />
                )))}
                
            </div>
            {showAddVenue && (
                <AddvenueModal 
                    onClose={handleClose}
                    onVenueCreated={fetchVenues}
                />
            )}
        </div>
    )
}