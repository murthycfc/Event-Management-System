import { useNavigate } from "react-router";
import Button from "./Button";
export default function CancelResponseModal({modal, onClose}){
    const navigate = useNavigate();

    if(!modal.show){
        return null
    }

    const data = modal.data;
    console.log(modal);

    return(
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
                                onClose();
                            }}
                            className="btn btn-outline"
                        >
                            X
                        </Button>
                    </div>

                    <div className="modal-body p-4">
                        <div className="text-center mb-3">
                            <h3 className="text-danger">{data?.bookingStatus}!</h3>
                        </div>
                        <div className="mb-4">
                            <h2>{data?.eventName}</h2>
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-column">
                                        <div className="d-flex gap-2">
                                            <p>Amount Paid: </p>
                                            <p>{data?.paidAmount}</p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <p>Refund Percentage: </p>
                                            <p>{data?.refundPercentage}</p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <p>Refunded Amount: </p>
                                            <p>{data?.refundedAmount}</p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <p>Cancellation Fee: </p>
                                            <p>{data?.cancellationFee}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}