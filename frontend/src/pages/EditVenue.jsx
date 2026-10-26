
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Plus, Trash2 } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import {activate, deactivate, getVenueForEdit, updateVenue} from "../api/admin";
// import Select from "react-select";


const rowOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" }
];


export default function EditVenue() {

    const { venueId } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [name, setName] = useState("");

    const [address, setAddress] = useState({
        place: "",
        landmark: "",
        city: "",
        state: "",
        pinCode: "",
        country: ""
    });

    // Existing sections
    const [existingSections, setExistingSections] = useState([]);

    // New sections
    const [newSections, setNewSections] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function fetchVenue() {
        try {
            setLoading(true);
            setError("");
            const data = await getVenueForEdit(venueId);
            setVenue(data);
            setName(data.name);

            setAddress({
                place: data.addressResponse?.place || "",
                landmark: data.addressResponse?.landmark || "",
                city: data.addressResponse?.city || "",
                state: data.addressResponse?.state || "",
                pinCode: data.addressResponse?.pinCode || "",
                country: data.addressResponse?.country || ""
            });

            setExistingSections(
                (data.sections || []).map(section => ({
                    section: section.section,
                    seats: (section.seats || []).map(seat => ({
                        id: seat.id,
                        row: seat.row,
                        seatNo: seat.seatNo,
                        xCoordinate: seat.xCoordinate,
                        yCoordinate: seat.yCoordinate,
                        active: seat.active
                    }))
                }))
            );

        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Failed to load venue"
            );
        } finally {
            setLoading(false);
        }
    }
        
    useEffect(() => {
        fetchVenue();
    }, [venueId]);


    function handleAddressChange(e) {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function deactivateSeat(seatId) {
        try {
            setError("");

            await deactivate(seatId);
            setExistingSections(prev =>
                prev.map(section => ({
                    ...section,
                    seats: section.seats.map(seat =>
                        seat.id === seatId
                            ? { ...seat, active: false }
                            : seat
                    )
                }))
            );
        } catch (error) {
            setError(
                error?.response?.data?.message || "Failed to deactivate seat"
            );
        }
    }

    async function activateSeat(seatId) {
        try {
            setError("");

            await activate(seatId);

            setExistingSections(prev =>
                prev.map(section => ({
                    ...section,
                    seats: section.seats.map(seat =>
                        seat.id === seatId
                            ? { ...seat, active: true }
                            : seat
                    )
                }))
            );

        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Failed to activate seat"
            );
        }
    }


    function handleSeatChange(sectionIndex,seatIndex,field,value) {
        setExistingSections(prev => {
            const updated = [...prev];
            const seats = [...updated[sectionIndex].seats];
            seats[seatIndex] = {
                ...seats[seatIndex],
                [field]: field === "xCoordinate" || field === "yCoordinate" ? Number(value) : value
            };

            updated[sectionIndex] = {
                ...updated[sectionIndex],
                seats
            };
            return updated;
        });
    }

    // Add seat to existing section
    function addSeat(sectionIndex) {
        setExistingSections(prev => {
            const updated = [...prev];
            updated[sectionIndex] = {
                ...updated[sectionIndex],
                seats: [
                    ...updated[sectionIndex].seats,
                    {
                        id: null,
                        row: "",
                        seatNo: "",
                        xCoordinate: "",
                        yCoordinate: ""
                    }
                ]
            };
            return updated;
        });
    }

    function removeSeat(sectionIndex, seatIndex) {
        setExistingSections(prev => {
            const updated = [...prev];
            updated[sectionIndex] = {
                ...updated[sectionIndex],
                seats: updated[sectionIndex].seats.filter(
                    (_, index) => index !== seatIndex
                )
            };
            return updated;
        });
    }

    function addNewSection() {
        setNewSections(prev => [
            ...prev,
            {
                section: "",
                rows: [
                    {
                        row: "",
                        rowNumber: "",
                        rowCount: ""
                    }
                ]
            }
        ]);
    }

    function handleNewSectionNameChange(sectionIndex,value) {
        setNewSections(prev => {
            const updated = [...prev];
            updated[sectionIndex] = {
                ...updated[sectionIndex],
                section: value
            };
            return updated;
        });
    }

    function handleNewRowChange(sectionIndex,rowIndex,field,value) {
        setNewSections(prev => {
            const updated = [...prev];
            const rows = [...updated[sectionIndex].rows];
            rows[rowIndex] = {
                ...rows[rowIndex],
                [field]: field === "rowNumber" || field === "rowCount" ? Number(value) : value
            };

            updated[sectionIndex] = {
                ...updated[sectionIndex],
                rows
            };
            return updated;
        });
    }

    function addRow(sectionIndex) {
        setNewSections(prev => {
            const updated = [...prev];
            updated[sectionIndex] = {
                ...updated[sectionIndex],
                rows: [
                    ...updated[sectionIndex].rows,
                    {
                        row: "",
                        rowNumber: "",
                        rowCount: 1
                    }
                ]
            };
            return updated;
        });
    }

    function removeRow(sectionIndex, rowIndex) {
        setNewSections(prev => {
            const updated = [...prev];
            updated[sectionIndex] = {
                ...updated[sectionIndex],
                rows: updated[sectionIndex].rows.filter(
                    (_, index) => index !== rowIndex
                )
            };
            return updated;
        });
    }

    function removeNewSection(sectionIndex) {
        setNewSections(prev =>
            prev.filter((_, index) => index !== sectionIndex)
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setSaving(true);
            setError("");
            const request = {
                name,
                address,
                existingSections,
                newSections
            };
            const data = await updateVenue(venueId, request);
            console.log("sadasbj");
            console.log(data);
            navigate("/admin/venues");
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to update venue");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                Loading venue...
            </div>
        );
    }
    if (error && !venue) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Edit Venue</h3>

                    <p className="text-muted mb-0">
                        Update venue information, seats and sections
                    </p>
                </div>
                <Button
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/venues")}
                >
                    Back
                </Button>
            </div>
            

            <form onSubmit={handleSubmit}>
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">
                            Venue Information
                        </h5>

                        <div className="row g-3">
                            <div className="col-12">
                                <Input
                                    id="name"
                                    label="Venue Name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">Address</h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <Input
                                    name="place"
                                    label="Place"
                                    value={address.place}
                                    onChange={handleAddressChange}
                                />
                            </div>

                            <div className="col-md-6">

                                <Input
                                    name="landmark"
                                    label="Landmark"
                                    value={address.landmark}
                                    onChange={handleAddressChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <Input
                                    name="city"
                                    label="City"
                                    value={address.city}
                                    onChange={handleAddressChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <Input
                                    name="state"
                                    label="State"
                                    value={address.state}
                                    onChange={handleAddressChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <Input
                                    name="pinCode"
                                    label="Pin Code"
                                    value={address.pinCode}
                                    onChange={handleAddressChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <Input
                                    name="country"
                                    label="Country"
                                    value={address.country}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-bold mb-1">
                                    Existing Sections
                                </h5>
                            </div>
                        </div>

                        {existingSections.map(
                            (section, sectionIndex) => (
                                <div
                                    className="border rounded-3 p-3 mb-4"
                                    key={section.section}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="fw-bold mb-0">
                                            {section.section}
                                        </h6>

                                        <Button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                addSeat(sectionIndex)
                                            }
                                        >
                                            <Plus size={16} className="me-1" />
                                            Add Seat
                                        </Button>
                                    </div>

                                    <div className="">
                                        <table className="table align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Row</th>
                                                    <th>Seat No</th>
                                                    <th>Row Number</th>
                                                    <th>Seat Position</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {section.seats.map(
                                                    (seat, seatIndex) => {
                                                        const isExisting = !!seat.id;
                                                        console.log(seat);
                                                    return(
                                                        <tr key={
                                                            seat.id ||
                                                            `${sectionIndex}-${seatIndex}`
                                                        }>
                                                            <td style={{ minWidth: "120px" }}>
                                                                {isExisting ? (<span>{seat.row}</span>): (
                                                                    <Select
                                                                        isClearable
                                                                        placeholder=""
                                                                        value={rowOptions.find(
                                                                            option => option.value=== seat.row) || null
                                                                        }
                                                                        onChange={(selectedOption) =>
                                                                            handleSeatChange(
                                                                                sectionIndex,
                                                                                seatIndex,
                                                                                "row",
                                                                                selectedOption?.value || ""
                                                                            )
                                                                        }
                                                                        options={rowOptions}
                                                                    />
                                                                )}
                                                            </td>

                                                            <td style={{ minWidth: "140px" }}>
                                                                {isExisting ? (<span>{seat.seatNo}</span>) : (
                                                                    <Input
                                                                    value={seat.seatNo}
                                                                    placeholder="Enter seat number"
                                                                    onChange={(e) =>
                                                                        handleSeatChange(
                                                                            sectionIndex,
                                                                            seatIndex,
                                                                            "seatNo",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                                )}
                                                                
                                                            </td>
                                                            <td style={{ minWidth: "140px" }}>
                                                                {isExisting ? (<span>{seat.xCoordinate}</span>) : (
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="Enter x coordinate"
                                                                        value={seat.xCoordinate}
                                                                        onChange={(e) =>
                                                                            handleSeatChange(
                                                                                sectionIndex,
                                                                                seatIndex,
                                                                                "xCoordinate",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                                
                                                            </td>

                                                            <td style={{ minWidth: "140px" }}>
                                                                {isExisting ? (
                                                                    <span>{seat.yCoordinate}</span>
                                                                ) : (
                                                                    <Input
                                                                    type="number"
                                                                    value={seat.yCoordinate}
                                                                    placeholder="Enter x coordinate"
                                                                    onChange={(e) =>
                                                                        handleSeatChange(
                                                                            sectionIndex,
                                                                            seatIndex,
                                                                            "yCoordinate",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                                )}
                                                                
                                                            </td>

                                                            <td>
                                                                {isExisting ? (
                                                                    <Button 
                                                                        type="button"
                                                                        className={`btn btn-sm ${
                                                                            seat.active ? "btn-outline-danger": "btn-outline-success"
                                                                        }`}
                                                                        onClick={()=>
                                                                            seat.active ? deactivateSeat(seat.id) : activateSeat(seat.id)
                                                                        }
                                                                    >
                                                                        {seat.active ? ("Deactive") : ("Active")}

                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger mt-1"
                                                                    onClick={() =>
                                                                        removeSeat(
                                                                            sectionIndex,
                                                                            seatIndex
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
})}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-bold mb-1">
                                    Add New Sections
                                </h5>
                            </div>

                            <Button
                                type="button"
                                className="btn btn-primary"
                                onClick={addNewSection}
                            >
                                <Plus size={17} className="me-1" />
                                Add Section
                            </Button>

                        </div>
                        {newSections.length === 0 && (
                            <div className="text-muted text-center py-4">
                                No new sections added
                            </div>
                        )}
                        {newSections.map(
                            (section, sectionIndex) => (
                                <div
                                    className="border rounded-3 p-3 mb-4"
                                    key={sectionIndex}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h6 className="fw-bold mb-0">
                                            New Section
                                        </h6>
                                        <Button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                removeNewSection(sectionIndex)
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>

                                    <div className="mb-4">
                                        <Input
                                            label="Section Name"
                                            value={section.section}
                                            onChange={(e) =>
                                                handleNewSectionNameChange(
                                                    sectionIndex,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="SILVER"
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">
                                            Rows
                                        </h6>
                                        <Button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                addRow(sectionIndex)
                                            }
                                        >
                                            <Plus size={16} className="me-1" />
                                            Add Row
                                        </Button>
                                    </div>

                                    {section.rows.map(
                                        (row, rowIndex) => (
                                            <div
                                                className="row g-3 align-items-center mb-3"
                                                key={rowIndex}
                                            >
                                                <div className="col-md-3">
                                                    <Select
                                                        label="Row"
                                                        isClearable
                                                        placeholder="Select row"
                                                        value={rowOptions.find(
                                                            option => option.value === row.row) || null
                                                        }
                                                        onChange={(selectedOption) =>
                                                            handleNewRowChange(
                                                                sectionIndex,
                                                                rowIndex,
                                                                "row",
                                                                selectedOption?.value || ""
                                                            )
                                                        }
                                                        options={rowOptions}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <Input
                                                        label="Row Number"
                                                        type="number"
                                                        value={row.rowNumber}
                                                        onChange={(e) =>
                                                            handleNewRowChange(
                                                                sectionIndex,
                                                                rowIndex,
                                                                "rowNumber",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter valid row number"
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <Input
                                                        label="Seats"
                                                        type="number"
                                                        placeholder="Enter number of seats"
                                                        value={row.rowCount}
                                                        onChange={(e) =>
                                                            handleNewRowChange(
                                                                sectionIndex,
                                                                rowIndex,
                                                                "rowCount",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-3 ">
                                                    <Button
                                                        type="button"
                                                        className="btn btn-outline-danger mt-3"
                                                        onClick={() =>removeRow(sectionIndex,rowIndex)}
                                                    >
                                                        <Trash2 size={16}  />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}
                <div className="d-flex justify-content-end gap-2">
                    <Button
                        type="button"
                        className="btn btn-light"
                        onClick={() =>
                            navigate("/admin/venues")
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
