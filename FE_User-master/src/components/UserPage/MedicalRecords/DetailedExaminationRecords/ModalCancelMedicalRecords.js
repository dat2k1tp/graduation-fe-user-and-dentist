import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import http from '../../../service/http-common'

export default function ModalCancelMedicalRecords({ booking,
    setActiveStep, activeStep, setUpdateStatus }) {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmitHandle = (data) => {
        const confirm = window.confirm("Bạn muốn hủy lịch khám này không ?");
        if (confirm === true) {
            onUpdateBooking(data);

        }
    }

    //PUT DATA
    const onUpdateBooking = (data) => {
        // console.log(booking);
        let formData = {
            ...booking,
            ghichu: data.ghichu
        }
        // console.log(formData);
        http({
            url: `http://localhost:8080/api/v1/booking/ghi-chu/` + booking.id,
            method: "PUT",
            data: formData,
        })
            .then((response) => {
                console.log("UPDATE LÝ DO THÀNH CÔNG");
                // document.getElementById('message-text').value = ""
                setActiveStep(3);
                updateStatus();

            })
            .catch((error) => {
                console.log(error, error.response);

            });
    };

    //GET DATA NGƯỜI DÙNG TỪ LOCAL STORAGE(ID,ROLE)
    const [auth, setAuth] = useState({});
    useEffect(() => {
        let json = localStorage.getItem("auth");
        if (json != null && typeof (json) !== 'undefined') {
            setAuth(JSON.parse(json));
        }
    }, [])

    //bookingId
    let id = Number(sessionStorage.getItem("bookingId"));

    const updateStatus = () => {
        if (auth.id !== null && typeof (auth.id) !== 'undefined') {
            http({
                url: '/booking/' + id + "/status/3/",
                method: 'PUT'
            })
                .then((response) => {
                    setUpdateStatus(true);
                    console.log("UPDATE STATUS SUCCESS");
                })
                .catch((error) => {
                    console.log(error, error.response);
                });
        }
    }



    return (
        <div>
            <div className="modal fade "
                id="exampleModalCancel" tabIndex="-1"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">

                                {
                                    activeStep !== 3 ? "Chọn lý do hủy lịch" : "Thông báo"
                                }
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmitHandle)}>
                            {
                                activeStep !== 3 ?
                                    (
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                {/* <label htmlFor="message-text" className="col-form-label">Lý do hủy:</label>
                                                <textarea className="form-control" id="message-text"
                                                    rows="3" {...register("ghichu", {
                                                        required: "Không để trống lý do",
                                                        maxLength: { value: 300, message: "Lý do không quá 300 ký tự" }
                                                    })}></textarea>
                                                {errors.ghichu && <span className="text-danger">{errors.ghichu.message}</span>} */}
                                                <p>Vui lòng chọn lý do để hủy lịch đặt:</p>
                                                <label htmlFor="field-1">
                                                    <input
                                                        {...register("ghichu", { required: true })}
                                                        type="radio"
                                                        name="ghichu"
                                                        value="Thủ tục quá rắc rối"
                                                        id="field-1"
                                                    />
                                                    <span> Thủ tục quá rắc rối</span>
                                                </label><br />
                                                <label htmlFor="field-2">
                                                    <input
                                                        {...register("ghichu", { required: true })}
                                                        type="radio"
                                                        name="ghichu"
                                                        value="Tìm thấy giá dịch vụ rẻ hơn ở chỗ khác"
                                                        id="field-2"
                                                    />
                                                    <span> Tìm thấy giá dịch vụ rẻ hơn ở chỗ khác</span>
                                                </label><br />
                                                <label htmlFor="field-3">
                                                    <input
                                                        {...register("ghichu", { required: true })}
                                                        type="radio"
                                                        name="ghichu"
                                                        value="Dịch vụ không được tốt"
                                                        id="field-3"
                                                    />
                                                    <span> Dịch vụ không được tốt</span>
                                                </label><br />
                                                <label htmlFor="field-4">
                                                    <input
                                                        {...register("ghichu", { required: true })}
                                                        type="radio"
                                                        name="ghichu"
                                                        value="Xác nhận lịch đặt quá chậm"
                                                        id="field-4"
                                                    />
                                                    <span> Xác nhận lịch đặt quá chậm</span>
                                                </label><br />
                                                <label htmlFor="field-5">
                                                    <input
                                                        {...register("ghichu", { required: true })}
                                                        type="radio"
                                                        name="ghichu"
                                                        value="Muốn thay đổi bác sĩ"
                                                        id="field-5"
                                                    />
                                                    <span> Muốn thay đổi bác sĩ</span>
                                                </label><br />
                                                {/* <label htmlFor="field-6">
                                                    <input
                                                        {...register("ghichu", { required: true })}
                                                        type="radio"
                                                        name="ghichu"
                                                        value="Lý do khác..."
                                                        id="field-6"
                                                    />
                                                    <span> Lý do khác...</span>
                                                </label><br /> */}
                                                {errors.ghichu && <span className="text-danger">Hãy chọn lý do</span>}
                                            </div>
                                        </div>
                                    ) :
                                    (
                                        <h4 className="text-center">
                                            Lịch khám đã hủy
                                        </h4>
                                    )
                            }

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                    data-bs-dismiss="modal">Đóng</button>
                                {
                                    activeStep !== 3 ? (
                                        <button type="submit" className="btn btn-primary" >
                                            Đồng ý
                                        </button>
                                    ) : ''
                                }

                            </div>
                        </form>

                    </div>
                </div>
            </div>


        </div>
    )
}

