import { useEffect, useState } from "react";
import { useNavigate } from "react-router"
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Select from "../components/Select";
import { createEvent, getVenueDetails, getVenueOptions, getVenues } from "../api/admin";
import Button from "../components/Button";

export default function AddEvent(){
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [formData, setFormData] = useState({
        name:"",
        description: "",
        category: "",
        date: "",
        startTime: "",
        endTime: "",
        venueId: "",
        eventSeatPrices: {}
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        async function fetchvenues() {
            try {
                const data = await getVenueOptions();
                const venueOptions = data.map(venue => ({
                    value: venue.id,
                    label: venue.name
                }));

                setVenues(venueOptions);
                console.log(data);
            } catch (error) {
                setError(error?.response?.data?.message || "Failed to fetch venues");
            }
        }
        fetchvenues();
    },[]);

    function handleChange(e){
        const {id, value} = e.target;
        setFormData(prev=>({
            ...prev,
            [id]: value
        }));
    }

    async function handleVenueChange(selectedOption) {
        const venueId = selectedOption?.value || "";
        if (!venueId) {
            setFormData(prev => ({
                ...prev,
                venueId: "",
                eventSeatPrices: {}
            }));
            return;
        }
        try {
            setError("");
            const data = await getVenueDetails(venueId);
            console.log("Venue details:", data);
            console.log("Sections:", data.sections);
            const eventSeatPrices = {};
            data.sections.forEach(section => {
                eventSeatPrices[section] = {
                    price: ""
                };
            });
            setFormData(prev => ({
                ...prev,
                venueId,
                eventSeatPrices
            }));
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Failed to load venue details"
            );
        }
    }

    function handleChangePrice(section, value){
        setFormData(prev => ({
            ...prev,
            eventSeatPrices: {
                ...prev.eventSeatPrices,
                [section]: {
                    price: value
                }
            }
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            const data = await createEvent(formData);
            console.log(data);
            navigate("/admin/events");
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to create event")
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <h2 className="fw-bold mb-1">Create Event</h2>
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}
            <div className="card border-0 shadow-sm mt-2">
                <div className="card-body px-2">
                    <form onSubmit={handleSubmit}>
                        <h5 className="fw-semibold mb-3 px-2">
                            Event Details
                        </h5>
                        <div className="row px-2">
                            <div className="col-md-6">
                                <Input 
                                    label="Event Name"
                                    id="name"
                                    type="text"
                                    placeholder="Enter event name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    isRequired={true}
                                />
                            </div>

                            <div className="col-md-6">
                                <Input 
                                    label="Category"
                                    id="category"
                                    type="text"
                                    placeholder="e.g. Music, Comedy, Sports"
                                    value={formData.category}
                                    onChange={handleChange}
                                    isRequired={true}
                                />
                            </div>
                        </div>

                        <div className="px-2">
                            <TextArea 
                                label="Description"
                                id="description"
                                placeholder="Enter event description"
                                value={formData.description}
                                onChange={handleChange}
                                isRequired={true}
                            />
                        </div>
                        

                        <div className="row px-2">
                            <div className="col-md-4">
                                <Input
                                    label="Event Date"
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    isRequired={true}
                                />
                            </div>

                            <div className="col-md-4">
                                <Input
                                    label="Start Time"
                                    id="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    isRequired={true}
                                />
                            </div>

                            <div className="col-md-4">
                                <Input
                                    label="End Time"
                                    id="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    isRequired={true}
                                />
                            </div>
                        </div>

                        <div className="px-2">
                            <h5 className="fw-semibold ">Venue</h5>
                            <Select 
                                label="Select Venue"
                                id="venueId"
                                placeholder="Select Venue"
                                isClearable
                                value={
                                    venues.find(
                                        option => option.value === formData.venueId
                                    ) || null
                                }
                                onChange={handleVenueChange}
                                options={venues}
                            />
                        </div>

                        <div className="px-2">
                            {Object.keys(formData.eventSeatPrices).length>0 && (
                                <div>
                                    <h5 className="fw-semibold mt-4">Section Pricing</h5>
                                    <div className="row">
                                        {Object.keys(formData.eventSeatPrices).map(
                                            section => (
                                                <div className="col-md-6" key={section}>
                                                    <Input 
                                                        label={`${section}`}
                                                        type="number"
                                                        placeholder="Enter price"
                                                        value={formData.eventSeatPrices[section]?.price || ""}
                                                        onChange={e => handleChangePrice(section, e.target.value)}
                                                        isRequired={true}
                                                    />

                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                         <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button 
                                type="button"
                                className="btn btn-secondary"
                                onClick={()=>navigate("/admin/events")}
                            >Cancel</Button>
                            <Button 
                                type="submit"
                                className="btn text-white"
                                style={{
                                    backgroundColor: "#554EE2"
                                }}

                                disabled={loading}
                            >{loading ? 'Creating' : 'Create Event'}</Button>
                         </div>
                        
                    </form>
                </div>

            </div>
            
        </div>
    )
}