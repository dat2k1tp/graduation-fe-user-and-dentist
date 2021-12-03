import { useForm } from "react-hook-form";
import http from '../../../service/http-common'

export default function ModalConclusion({ booking,setBooking }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmitHandle = (data) => {

        onUpdateBooking(data);

    }
 
    //PUT DATA kết quả
    const onUpdateBooking = (data) => {
        // console.log(booking);
        let formData = {
            ...booking,
            ketqua: data.ketqua
        }
        console.log(formData);
        http({
            url: `http://localhost:8080/api/v1/booking/ghi-chu/` + booking.id,
            method: "PUT",
            data: formData,
        })
            .then((response) => {
                const {data}=response.data;
                setBooking({
                    ...booking,
                    data
                });
                console.log("UPDATE KẾT QUẢ  THÀNH CÔNG");
                alert("Lưu thành công")


            })
            .catch((error) => {
                console.log(error, error.response);

            });
    };
// console.log(booking);

    const formDataKetQua=register("ketqua", {
        required: "Không để trống kết quả",
        maxLength: { value: 300, message: "Kết quả không quá 300 ký tự" }
    })
    return (
        <div>
            <div className="modal fade "
                id="exampleModalConclusion" tabIndex="-1"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">


                                Nhập kết quả khám

                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmitHandle)}>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="message-text" className="col-form-label">Kết quả khám:</label>
                                    <textarea className="form-control" id="message-text"
                                        rows="3" {...formDataKetQua}
                                        value={booking.ketqua}
                                        onChange={(e)=>{
                                            formDataKetQua.onChange(e);
                                            setBooking({
                                                ...booking,
                                                ketqua:e.target.value
                                            })

                                        }}></textarea>
                                    {errors.ketqua && <span className="text-danger">{errors.ketqua.message}</span>}

                                </div>
                            </div>



                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                    data-bs-dismiss="modal">Đóng</button>

                                <button type="submit" className="btn btn-primary" >
                                    Lưu
                                </button>


                            </div>
                        </form>

                    </div>
                </div>
            </div>


        </div>
    )
}

