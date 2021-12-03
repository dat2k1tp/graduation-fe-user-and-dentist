
export default function ModalConclusion({ booking }) {

    return (
        <div>
            <div className="modal fade "
                id="exampleModalConclusion" tabIndex="-1"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Kết quả khám
                            </h5>
                            <button type="button" className="btn-close" 
                            data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>


                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="message-text" className="col-form-label">Kết quả khám:</label>
                                <textarea className="form-control" id="message-text"
                                    rows="3"
                                    value={booking.ketqua} readOnly></textarea>

                            </div>
                        </div>



                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                data-bs-dismiss="modal">Đóng</button>
                        </div>

                    </div>
                </div>
            </div>


        </div>
    )
}

