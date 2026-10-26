import { useNavigate } from "react-router";
import Button from "./Button";
import { Building2, CheckCircle, CheckCircle2, XCircle } from "lucide-react";


export default function BookingResultModal({modal, onClose}){

    const navigate = useNavigate();

    if(!modal.show){
        return null
    }

    const {type, data} = modal;
    const isSuccess = type === "success";


    function handleHome(){
        navigate("/events")
    }

    return (
        <div 
            className="modal d-block bg-dark bg-opacity-75"
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 shadow-lg">
                    <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 10 }}>
                        <Button
                            type="button"
                            onClick={() => {
                                console.log("CLICKED");
                                onClose();
                            }}
                            className="btn btn-outline"
                        >
                            <XCircle />
                        </Button>

                    </div>
                    <div className="modal-body p-4">
                        <div className="text-center mb-3">
                            {isSuccess ? (
                                <div 
                                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        backgroundColor: "#DCFCE7"
                                    }}
                                >
                                     <CheckCircle2 color="#16A34A" />
                                </div>
                            ):(
                                <div 
                                    className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        backgroundColor: "#FEE2E2"
                                    }}
                                >
                                    <XCircle color="#DC2626" />
                                </div>
                            )}
                        </div>

                        <h2 className="text-center fw-bold mb-2">
                            {isSuccess ? "Payment Successful!" : "Booking Cancelled"}
                        </h2>
                        { data?.bookingNumber && (
                            <div className="d-flex justify-content-center gap-3 mt-3">
                                <p className="mt-0 fs-5">Booking Id: </p>
                                <div className="text-primary fs-5 fw-bold mb-3">
                                 BKG - {data?.bookingNumber}
                            </div>
                            </div>
                            
                        )}

                        <div className="">
                            <h4>{data?.eventName}</h4>
                        </div>

                        <div>
                            <div className="d-flex align-items-center gap-3">
                                <Building2 />
                                <div>
                                    <span>{data?.addressResponse?.place}{", "}</span>
                                    <span>{data?.addressResponse?.landmark}{", "}</span>
                                    <span>{data?.addressResponse?.city}</span>
                                </div>
                                
                            </div>
                        </div>

                        <hr />
                        <div className="mx-3 mb-3">
                            {data?.seatDetails && (<p className="mb-0">Seats</p>)}
                            <div className="d-flex flex-wrap gap-2">
                            
                                {data?.seatDetails?.map((seat => (
                                    <div
                                        key={`${seat.section}-${seat.seatNo}`}
                                        className="px-1 py-2 rounded-pill"

                                    >
                                        <strong>
                                            {seat.seatNo}
                                        </strong>
                                        <span
                                            className="ms-2 text-muted"
                                        >
                                            {seat.section}
                                        </span>
                                    </div>
                                )))}
                            </div>
                        </div>
                        
                        <div className="mx-4 mb-3">
                            {isSuccess && (
                                data?.totalAmount!=null && (
                                    <div className="d-flex justify-content-between align-items-center">
                                        <p>Total Amount Paid</p>
                                        <strong style={{color:"#554EE2"}}>₹{data?.totalAmount}</strong>
                                    </div>
                                )
                            )}
                        </div>
                        

                        <div className="text-center mb-3">
                            <Button 
                                onClick={handleHome}
                                className="btn btn-primary w-75"
                            > 
                                Home
                            </Button>
                        </div>
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    );
}