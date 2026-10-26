import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getVenue, getVenueDetailsPage } from "../api/admin";
import Button from "../components/Button";

export default function VenueDetails() {

    const { venueId } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [venueData, setVenueData] = useState(null)
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchVenue() {
            try {
                setError("");
                const data = await getVenueDetailsPage(venueId);
                const result = await getVenue(venueId);
                setVenue(data);
                setVenueData(result);
                console.log(result);

            } catch (error) {
                setError(
                    error?.response?.data?.message ||
                    "Failed to load venue"
                );
            }
        }

        fetchVenue();
    }, [venueId]);

    const sections = venueData?.sections
    .map(section => ({
        ...section,
        minX: Math.min(
            ...section.seats.map(seat => seat.xCoordinate)
        )
    }))
    .sort((a, b) => a.minX - b.minX);

    function getSeat(seats, x, y) {
        return seats.find(
            seat =>
                seat.xCoordinate === x &&
                seat.yCoordinate === y
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    if (!venue || !venueData) {
        return (
            <div className="container mt-4">
                Loading...
            </div>
        );
    }


    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">
                        {venue.name}
                    </h3>

                    <p className="text-muted mb-0">
                        Venue Details
                    </p>
                </div>

                <Button
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/venues")}
                >
                    Back
                </Button>

            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">
                        Location
                    </h5>
                    <div className="row g-4">

                        <div className="col-md-6">
                            <div className="text-muted small">
                                Place
                            </div>
                            <div className="fw-semibold">
                                {venue.addressResponse.place}
                            </div>
                        </div>


                        <div className="col-md-6">
                            <div className="text-muted small">
                                Landmark
                            </div>

                            <div className="fw-semibold">
                                {venue.addressResponse.landmark}
                            </div>
                        </div>


                        <div className="col-md-6">
                            <div className="text-muted small">
                                City
                            </div>

                            <div className="fw-semibold">
                                {venue.addressResponse.city}
                            </div>
                        </div>


                        <div className="col-md-6">
                            <div className="text-muted small">
                                State
                            </div>

                            <div className="fw-semibold">
                                {venue.addressResponse.state}
                            </div>
                        </div>


                        <div className="col-md-6">
                            <div className="text-muted small">
                                PIN Code
                            </div>

                            <div className="fw-semibold">
                                {venue.addressResponse.pinCode}
                            </div>
                        </div>


                        <div className="col-md-6">
                            <div className="text-muted small">
                                Country
                            </div>

                            <div className="fw-semibold">
                                {venue.addressResponse.country}
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">

                    <h5 className="fw-bold mb-4">
                        Venue Capacity
                    </h5>

                    <div className="row g-3">

                        <div className="col-md-6">

                            <div className="border rounded-3 p-3">
                                <div className="text-muted small">
                                    Total Sections
                                </div>
                                <div className="fs-4 fw-bold">
                                    {venue.totalSections}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">

                            <div className="border rounded-3 p-3">
                                <div className="text-muted small">
                                    Total Seats
                                </div>

                                <div className="fs-4 fw-bold">
                                    {venue.totalSeats}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body p-4">

                    <h5 className="fw-bold mb-4">
                        Seat Distribution
                    </h5>

                    <div className="row g-3">

                        {Object.entries(venue.sectionSeatCounts).map(
                            ([section, seatCount]) => (
                                <div
                                    className="col-12 col-md-4"
                                    key={section}
                                >
                                    <div className="border rounded-3 p-3">

                                        <div className="d-flex justify-content-between align-items-center">

                                            <span className="fw-semibold">
                                                {section}
                                            </span>

                                            <span className="badge bg-primary">
                                                {seatCount} seats
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">
                        Seat Layout
                    </h5>

                    {sections.map(section => {
                        const sectionSeats = section.seats;
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
                                key={section.section}
                                className="mb-5"
                            >
                                <div className="text-center mb-3">
                                    <h6 className="fw-bold mb-1">
                                        {section.section}
                                    </h6>

                                    <span className="text-muted small">
                                        {/* {sectionSeats.length} seats */}
                                    </span>
                                </div>

                                <div
                                    className="d-flex flex-column align-items-center"
                                >
                                    {rows.map(x => (
                                        <div
                                            key={x}
                                            className="d-flex gap-2 mb-2"
                                        >
                                            {columns.map(y => {
                                                const seat = getSeat(
                                                    sectionSeats,
                                                    x,
                                                    y
                                                );
                                                if (!seat) {
                                                    return (
                                                        <div
                                                            key={`${x}-${y}`}
                                                            style={{
                                                                width: "45px",
                                                                height: "45px",
                                                                backgroundColor:"grey"
                                                            }}
                                                            className="rounded"
                                                        />
                                                    );
                                                }

                                                return (
                                                    <div
                                                        key={seat.id}
                                                        className="d-flex align-items-center justify-content-center border rounded"
                                                        style={{
                                                            width: "45px",
                                                            height: "45px",
                                                            backgroundColor: "#f8f9fa",
                                                            borderColor: "#dee2e6",
                                                            fontSize: "12px",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        {seat.seatNo}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}