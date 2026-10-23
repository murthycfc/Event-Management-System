import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import { getEventForEdit } from "../api/admin";
import Button from "../components/Button";
import { updateEvent } from "../api/admin";
export default function EditEvent(){
    const {eventId} = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",

        date: "",
        startTime: "",
        endTime: "",

        venueName: "",

        eventSeatPrices:{}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(()=>{
        async function fetchEvent() {
            try {
                setLoading(true)
                const data = await getEventForEdit(eventId);
                setFormData({
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    date: data.date,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    venueName: data.venueName,
                    eventSeatPrices: data.eventSeatPrices || {}
                })
                console.log(data);
            } catch (error) {
                setError(error?.response?.data?.message || "Failed to load event details")
            }
            finally{
                setLoading(false)
            }
        }
        fetchEvent();
    },[eventId]);

    function handleChange(e){
        const {id, value} = e.target;
        setFormData((prev)=>({
            ...prev,
            [id]: value
        }))
    };

    function handlePriceChange(sectionName, amount){
        setFormData((prev)=>({
            ...prev,
            eventSeatPrices: {
                ...prev.eventSeatPrices,
                [sectionName]: {
                    ...prev.eventSeatPrices[sectionName],
                    price: Number(amount)
                }
            }
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await updateEvent(eventId, formData);
            console.log(data);
            navigate("/admin/events");
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Failed to update event"
            );
        } finally {
            setLoading(false);
        }
    }

    if(loading){
        return <div className="mt-4 text-center">
            Loading...
        </div>
    }
    if(error){
        return <div className="text-center my-4 text-danger">
                {error}
            </div>
    }
    return (
        <div className="">
            <div className="card shadow-sm ">
                <div className="card-header  ">
                    <h4 className="mb-0 text-center">Edit Event Details</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <Input 
                            label="Event name"
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <TextArea 
                            label="Description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                        <div className="row">
                            <div className="col-md-6">
                                <Input 
                                    label="Category"
                                    type="text"
                                    id="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="col-md-6">
                                <Input 
                                    label="Date"
                                    type="date"
                                    id="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        
                        <div className="row">
                            <div className="col-md-6">
                                <Input 
                                    label="Start Time"
                                    type="time"
                                    id="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <Input 
                                    label="End Time"
                                    type="time"
                                    id="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* <Input 
                            label="Venue Name"
                            type="text"
                            id="venueId"
                            value={formData.venueId}
                            onChange={handleChange}
                        /> */}

                        <div className="mt-4">
                            <h5 className="px-1">Venue Name:</h5>
                            <p className="px-3">{formData.venueName}</p>
                        </div>


                        <h5 className="fw-semibold mt-4 mb-3">
                            Seat Pricing
                        </h5>
                        {
                            Object.entries(formData.eventSeatPrices).map(
                            ([sectionName, sectionData]) =>(
                                <div key={sectionName} className="row align-items-center mb-2">
                                    <div className="col-md-1 ms-5">
                                        <label className="form-label">
                                            {sectionName}
                                        </label>
                                    </div>
                                    <div className="col-md-3 ">
                                        <Input
                                            type="number"
                                            id={`${sectionName}`}
                                            value={sectionData.price}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    sectionName,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))
                        }
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button
                                type="button"
                                className="btn btn-light px-4"
                                onClick={() => navigate("/admin/events")}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                className="btn text-white px-4"
                                style={{
                                    backgroundColor: "#554EE2"
                                }}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>

                        </div>
                    </form>
                    
                </div>
            </div>
            
        </div>
    )
}