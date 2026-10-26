import { useEffect, useState } from "react"
import { loadEvents } from "../api/customer";
import EventCard from "../components/EventCard";
import Input from "../components/Input";
import { useNavigate } from "react-router";
import Select from "../components/Select";
import { useSearchParams } from "react-router";

import { Search } from "lucide-react";
import Button from "../components/Button";


export default function Events(){

    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        category: "",
        date: "",
        city: "",
        startingPrice: ""
    });

   const [page, setPage] = useState(0);
    const [size] = useState(6);

    const [totalPages, setTotalPages] = useState(0);

    const categories = [
        { value: "Music Concert", label: "Music Concert" },
        { value: "Stand-up comedy show", label: "Stand-up comedy show" }
    ];

    const cities = [
        { value: "Hyderabad", label: "Hyderabad" },
        { value: "Mumbai", label: "Mumbai" },
        { value: "Banglore", label: "Banglore" },
        { value: "Chennai", label: "Chennai" },
        { value: "Delhi", label: "Delhi" }
    ];

    const startingPrices = [
        { value: "500", label: "₹500" },
        { value: "1000", label: "₹1000" },
        { value: "1500", label: "₹1500" },
        { value: "2000", label: "₹2000" }
    ];
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const [error, setError] = useState();

    function nextPage() {
        if (page < totalPages - 1) {
            setPage(prev => prev + 1);
        }
    }

    function previousPage() {
        if (page > 0) {
            setPage(prev => prev - 1);
        }
    }
    useEffect(()=>{
        async function fetchEvents() {
            try {
                if(!token){
                    navigate("/login")
                    return;
                }
                setError("");
                const data = await loadEvents(filters, page, size);
                setEvents(data.content);
                setTotalPages(data.totalPages);
                console.log(data);
            } catch (error) {
                setEvents([]);
                setError(error?.response?.data?.message || "Failed to load events");
            }
        }
        fetchEvents();
    },[page,size])

    

    function handleChange(name, value){
        if(typeof name === "object"){
            const {id,value} = name.target;
            setFilters(prev => ({
                ...prev,
                [id] : value
            }));
            return;
        }
        setFilters(prev =>({
            ...prev,
            [name] : value
        }))
    }
    

    async function applyFilters() {
        try {
            setError("");
            setPage(0);
            const data = await loadEvents(filters, 0, size);
            setEvents(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            setEvents([]);
            setError(error?.response?.data?.message || "Failed to load events");
        }
    }
    return(
        <div className="container">
            <div className="row g-md-3  align-items-center">
                <div className="col-12 col-md-6 col-lg-3">
                    <Input
                        type="text"
                        placeholder="Search by event names "
                        id="name"
                        value={filters.name}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                </div>

                <div className="col-12 col-md-6 col-lg-2">
                    <Input
                        type="date"
                        id="date"
                        value={filters.date}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                </div>

                <div className="col-12 col-md-6 col-lg-2">
                    <Select
                        id="category"
                        placeholder="All Categories"
                        isClearable
                        value={
                            categories.find(
                                option => option.value === filters.category) || null
                        }

                        onChange={(selectedOption)=> handleChange("category", selectedOption?.value || "")}
                        options={categories}
                    />
                </div>

                <div className="col-12 col-md-6 col-lg-2">
                    <Select
                        id="city"
                        placeholder="All Locations"
                        isClearable
                        initial="All Locations"
                        value={
                            cities.find(option => option.value === filters.city) || null
                        }
                        onChange={(selectedOption) =>
                            handleChange("city", selectedOption?.value || "")
                        }
                        options={cities}
                    />
                </div>

                <div className="col-12 col-md-6 col-lg-2">
                    <Select
                        id="startingPrice"
                        initial="Any Price"
                        placeholder="Any Price"
                        isClearable
                        value={
                            startingPrices.find(
                                option => option.value === filters.startingPrice) || null
                        }
                        onChange={(selectedOption) =>
                            handleChange(
                                "startingPrice",
                                selectedOption?.value || ""
                            )
                        }
                        options={startingPrices}
                    />
                </div>

                <div className="col-12 col-md-6 col-lg-1 ">
                    <Button
                        className="btn w-100 mt-1 btn-custom text-white"
                        // style={{
                        //     backgroundColor: "#554EE2",
                        //     height: "38px"
                        // }}
                        onClick={applyFilters}
                    >
                        Search
                    </Button>
                </div>

            </div>

            {error && (
                <div className="text-center text-danger mt-4">
                     <p>{error}</p>
                </div>
               
            )}

            <div className="row mt-2">
                {events.map((event)=>(
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                <Button
                    className="btn text-white btn-custom"
                    // style={{
                    //     backgroundColor:"#554EE2"
                    // }}
                    onClick={previousPage}
                    disabled={page === 0}
                >
                    {"<"}
                </Button>
                <span>
                     {page + 1}
                </span>

                <Button
                    className="btn text-white btn-custom"
                    // style={{
                    //     backgroundColor:"#554EE2 "
                    // }}
                    onClick={nextPage}
                    disabled={totalPages === 0 || page >= totalPages-1}
                >
                    {">"}
                </Button>
            </div>
            
        </div>
    )
}