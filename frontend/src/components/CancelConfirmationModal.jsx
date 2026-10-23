import Button from "./Button"

export default function CancelConfirmationModal({onConfirm, onClose}){
    return (
        <div className="modal d-block bg-dark bg-opacity-75">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 shadow-lg">
                    <div className="modal-header">

                        <h5 className="modal-title">
                            Cancel Booking
                        </h5>

                        <Button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        />

                    </div>
                    <div className="modal-body p-4">
                        <h5 className="mb-3">
                            Are you sure you want to cancel this booking?
                        </h5>

                        <div className="d-flex justify-content-center gap-3">
                            <Button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                No
                            </Button>

                            <Button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                            >
                                Yes, Cancel Booking
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}