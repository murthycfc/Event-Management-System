import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { XCircle, Trash2, Plus } from "lucide-react";
import { createVenue } from "../api/admin";

export default function AddvenueModal({ onClose, onVenueCreated }) {

    const [error, setError] = useState("");
    const [step, setStep] = useState(1);

    const [venue, setVenue] = useState({
        name: "",
        address: {
            place: "",
            landmark: "",
            city: "",
            state: "",
            pinCode: "",
            country: ""
        }
    });

    const [sections, setSections] = useState([]);

    function handleVenueChange(e) {

        const { name, value } = e.target;

        setVenue(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleAddressChange(e) {

        const { name, value } = e.target;

        setVenue(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    }

    function handleAddSections() {
        setStep(2);
    }

    function handleAddSection() {

        setSections(prev => [
            ...prev,
            {
                section: "",
                rows: []
            }
        ]);
    }

    function handleRemoveSection(sectionIndex) {

        setSections(prev =>
            prev.filter((_, index) => index !== sectionIndex)
        );
    }

    function handleSectionNameChange(sectionIndex, value) {

        setSections(prev =>
            prev.map((section, index) =>
                index === sectionIndex
                    ? {
                        ...section,
                        section: value
                    }
                    : section
            )
        );
    }

    function handleAddRow(sectionIndex) {

        setSections(prev =>
            prev.map((section, index) =>
                index === sectionIndex
                    ? {
                        ...section,
                        rows: [
                            ...section.rows,
                            {
                                row: "",
                                rowNumber: "",
                                rowCount: ""
                            }
                        ]
                    }
                    : section
            )
        );
    }

    function handleRemoveRow(sectionIndex, rowIndex) {

        setSections(prev =>
            prev.map((section, index) =>
                index === sectionIndex
                    ? {
                        ...section,
                        rows: section.rows.filter(
                            (_, index) => index !== rowIndex
                        )
                    }
                    : section
            )
        );
    }

    function handleRowChange(
        sectionIndex,
        rowIndex,
        field,
        value
    ) {

        setSections(prev =>
            prev.map((section, sIndex) => {

                if (sIndex !== sectionIndex) {
                    return section;
                }

                return {
                    ...section,

                    rows: section.rows.map((row, rIndex) =>
                        rIndex === rowIndex
                            ? {
                                ...row,
                                [field]: value
                            }
                            : row
                    )
                };
            })
        );
    }

    async function handleCreateVenue() {
        setError("");
        try {
            const requestData = {
                name: venue.name,
                address: venue.address,
                sections: sections
            };

            console.log("Request Data:", requestData);

            const data = await createVenue(requestData);
            console.log("Response:", data);
            await onVenueCreated();
            onClose();

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Failed to create venue"
            );
        }
    }

    return (
        <div
            className="modal d-block bg-dark bg-opacity-75"
            tabIndex="-1"
        >

            <div className="modal-dialog modal-lg modal-dialog-centered">

                <div className="modal-content rounded-4 shadow-lg">

                    {/* HEADER */}

                    <div className="modal-header">

                        <h5 className="modal-title fw-bold">
                            Add Venue
                        </h5>

                        <Button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline-secondary border-0 ms-auto"
                        >
                            <XCircle />
                        </Button>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="alert alert-danger mx-3 mt-3 mb-0">
                            {error}
                        </div>
                    )}


                    {/* BODY */}

                    <div className="modal-body">

                        {step === 1 && (
                            <div>

                                <div className="mb-3">

                                    <Input
                                        label="Venue Name"
                                        type="text"
                                        name="name"
                                        value={venue.name}
                                        onChange={handleVenueChange}
                                        className="form-control"
                                        placeholder="Enter venue name"
                                    />

                                </div>


                                <h6 className="fw-bold mt-4 mb-3">
                                    Address
                                </h6>


                                <div className="row g-3">

                                    <div className="col-md-4">

                                        <Input
                                            label="Place"
                                            type="text"
                                            name="place"
                                            value={venue.address.place}
                                            onChange={handleAddressChange}
                                            className="form-control"
                                            placeholder="Enter place"
                                        />

                                    </div>


                                    <div className="col-md-4">

                                        <Input
                                            label="Landmark"
                                            type="text"
                                            name="landmark"
                                            value={venue.address.landmark}
                                            onChange={handleAddressChange}
                                            className="form-control"
                                            placeholder="Enter landmark"
                                        />

                                    </div>


                                    <div className="col-md-4">

                                        <Input
                                            label="City"
                                            type="text"
                                            name="city"
                                            value={venue.address.city}
                                            onChange={handleAddressChange}
                                            className="form-control"
                                            placeholder="Enter city"
                                        />

                                    </div>


                                    <div className="col-md-4">

                                        <Input
                                            label="State"
                                            type="text"
                                            name="state"
                                            value={venue.address.state}
                                            onChange={handleAddressChange}
                                            className="form-control"
                                            placeholder="Enter state"
                                        />

                                    </div>


                                    <div className="col-md-4">

                                        <Input
                                            label="Pincode"
                                            type="text"
                                            name="pinCode"
                                            value={venue.address.pinCode}
                                            onChange={handleAddressChange}
                                            className="form-control"
                                            placeholder="Enter pincode"
                                        />

                                    </div>


                                    <div className="col-md-4">

                                        <Input
                                            label="Country"
                                            type="text"
                                            name="country"
                                            value={venue.address.country}
                                            onChange={handleAddressChange}
                                            className="form-control"
                                            placeholder="Enter country"
                                        />

                                    </div>

                                </div>

                            </div>
                        )}


                        {step === 2 && (
                            <div>

                                <div className="mb-3">

                                    <h5 className="fw-bold">
                                        Venue Sections
                                    </h5>

                                    <p className="text-muted mb-0">
                                        Add sections and define the rows.
                                    </p>

                                </div>


                                {/* SECTIONS */}

                                {sections.map((section, sectionIndex) => (

                                    <div
                                        key={sectionIndex}
                                        className="border rounded-3 p-3 mb-3"
                                    >

                                        {/* SECTION HEADER */}

                                        <div className="d-flex justify-content-between align-items-center mb-3">

                                            <h6 className="fw-bold mb-0">
                                                Section {sectionIndex + 1}
                                            </h6>

                                            <Button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    handleRemoveSection(
                                                        sectionIndex
                                                    )
                                                }
                                            >
                                                <Trash2 size={16} />
                                            </Button>

                                        </div>


                                        <div className="mb-3">

                                            <Input
                                                label="Section Name"
                                                type="text"
                                                className="form-control"
                                                placeholder="Example: VIP"
                                                value={section.section}
                                                onChange={(e) =>
                                                    handleSectionNameChange(
                                                        sectionIndex,
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        {section.rows.length > 0 && (

                                            <div>

                                                <div className="row fw-bold small text-muted mb-2">

                                                    <div className="col-md-4">
                                                        Row
                                                    </div>

                                                    <div className="col-md-3">
                                                        Row Number
                                                    </div>

                                                    <div className="col-md-4">
                                                        Number of Seats
                                                    </div>

                                                    <div className="col-md-1">
                                                    </div>

                                                </div>



                                                {section.rows.map(
                                                    (row, rowIndex) => (

                                                        <div
                                                            key={rowIndex}
                                                            className="row g-2 mb-2"
                                                        >


                                                            <div className="col-md-4">

                                                                <Input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="A"
                                                                    value={row.row}
                                                                    onChange={(e) =>
                                                                        handleRowChange(
                                                                            sectionIndex,
                                                                            rowIndex,
                                                                            "row",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />

                                                            </div>


                                                            <div className="col-md-3">

                                                                <Input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="1"
                                                                    value={row.rowNumber}
                                                                    onChange={(e) =>
                                                                        handleRowChange(
                                                                            sectionIndex,
                                                                            rowIndex,
                                                                            "rowNumber",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />

                                                            </div>


                                                            <div className="col-md-4">

                                                                <Input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="10"
                                                                    value={row.rowCount}
                                                                    onChange={(e) =>
                                                                        handleRowChange(
                                                                            sectionIndex,
                                                                            rowIndex,
                                                                            "rowCount",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />

                                                            </div>



                                                            <div className="col-md-1 d-flex align-items-center mt-3">

                                                                <Button
                                                                    type="button"
                                                                    className="btn btn-outline-danger"
                                                                    onClick={() =>
                                                                        handleRemoveRow(
                                                                            sectionIndex,
                                                                            rowIndex
                                                                        )
                                                                    }
                                                                >

                                                                    <Trash2
                                                                        size={16}
                                                                    />

                                                                </Button>

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        )}


                                        {/* ADD ROW */}

                                        <Button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary mt-2"
                                            onClick={() =>
                                                handleAddRow(sectionIndex)
                                            }
                                        >

                                            <Plus
                                                size={16}
                                                className="me-1"
                                            />

                                            Add Row

                                        </Button>

                                    </div>

                                ))}


                                {/* ADD SECTION */}

                                <Button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={handleAddSection}
                                >

                                    <Plus
                                        size={17}
                                        className="me-1"
                                    />

                                    Add Section

                                </Button>

                            </div>
                        )}

                    </div>


                    {/* FOOTER */}

                    <div className="modal-footer">

                        <Button
                            type="button"
                            className="btn btn-secondary"
                            onClick={
                                step === 1
                                    ? onClose
                                    : () => setStep(1)
                            }
                        >
                            {step === 1 ? "Cancel" : "Back"}
                        </Button>


                        {/* STEP 1 BUTTON */}

                        {step === 1 && (

                            <Button
                                type="button"
                                className="btn text-white"
                                style={{
                                    backgroundColor: "#554EE2"
                                }}
                                onClick={handleAddSections}
                            >
                                Add Sections
                            </Button>

                        )}


                        {/* STEP 2 BUTTON */}

                        {step === 2 && (

                            <Button
                                type="button"
                                className="btn text-white"
                                style={{
                                    backgroundColor: "#554EE2"
                                }}
                                onClick={handleCreateVenue}
                            >
                                Create Venue
                            </Button>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}