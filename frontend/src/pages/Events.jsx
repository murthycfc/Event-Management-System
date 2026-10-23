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

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 0;
    const size = Number(searchParams.get("size")) || 6;

    const [totalPages, setTotalPages] = useState(0);

    const categories = [
        "Music Concert",
        "Stand-up comedy show"
    ];

    const cities = [
        "Hyderabad",
        "Mumbai",
        "Banglore",
        "Chennai",
        "Delhi"
    ]

    const startingPrices = [
        "500",
        "1000",
        "1500",
        "2000"
    ]
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const [error, setError] = useState();
    useEffect(() => {
        if (!searchParams.has("page") || !searchParams.has("size")) {
            setSearchParams({
                page: "0",
                size: "6"
            });
        }
    }, [searchParams, setSearchParams]);

    function nextPage() {
        setSearchParams({
            page: String(page + 1),
            size: String(size)
        });
    }

    function previousPage() {
        if (page > 0) {
            setSearchParams({
                page: String(page - 1),
                size: String(size)
            });
        }
    }
    useEffect(()=>{
        async function fetchEvents() {
            try {
                if(!token){
                    navigate("/login")
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

    

    function handleChange(e){
        const {id, value} = e.target;
        setFilters({
            ...filters,
            [id] : value
        })
    }
    

    async function applyFilters() {

        try {
            setError("");
            setSearchParams({
                page:"0",
                size: String(size)
            })
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
            <div className="row g-3">
                <div className="col-12 col-md-6 col-lg-3">
                    <Input
                        icon={<Search size={20} />}
                        type="text"
                        placeholder="Search by event names"
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
                        initial="All Categories"
                        value={filters.category}
                        onChange={handleChange}
                        options={categories}
                    />
                </div>

                <div className="col-12 col-md-6 col-lg-2">
                    <Select
                        id="city"
                        initial="All Locations"
                        value={filters.city}
                        onChange={handleChange}
                        options={cities}
                    />
                </div>

                <div className="col-12 col-md-6 col-lg-2">
                    <Select
                        id="startingPrice"
                        initial="Any Price"
                        value={filters.startingPrice}
                        onChange={handleChange}
                        options={startingPrices}
                    />
                </div>

                <div className="col-12 col-md-6 col-lg-1 d-flex align-items-center">
                    <Button
                        className="btn btn-primary w-100"
                        style={{
                            backgroundColor: "#554EE2",
                            height: "35px"
                        }}
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
                    className="btn text-white"
                    style={{
                        backgroundColor:"#554EE2"
                    }}
                    onClick={previousPage}
                    disabled={page === 0}
                >
                    {"<"}
                </Button>
                <span>
                     {page + 1}
                </span>

                <Button
                    className="btn text-white"
                    style={{
                        backgroundColor:"#554EE2 "
                    }}
                    onClick={nextPage}
                    disabled={totalPages === 0 || page >= totalPages-1}
                >
                    {">"}
                </Button>
            </div>
            
        </div>
    )
}