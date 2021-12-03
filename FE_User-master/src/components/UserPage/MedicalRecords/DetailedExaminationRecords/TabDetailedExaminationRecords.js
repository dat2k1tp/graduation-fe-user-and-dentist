import InfoService from "./InfoService";
import StepByStep from "./StepByStep";
import ShowDetailMedicalRecords from "./ShowDetailMedicalRecords";
import InfoDentist from "./InfoDentist";
import ModalConclusion from "./ModalConclusion";
import { useEffect, useState } from "react";
import http from '../../../service/http-common'

export default function TabDetailedExaminationRecords({updateStatus,setUpdateStatus,setTab}) {

    const btnThanhToan=()=>{
        
        sessionStorage.setItem("payment",sessionStorage.getItem("bookingId"))
        setTab(2);
    }

    //bookingId
    let id = Number(sessionStorage.getItem("bookingId"));
    // lấy thông tin đặt lịch
    const [booking, setBooking] = useState({
        id: "",
        dentistProfile: {},
        customerProfile: {
            id: "",
            accounts: {
                id: ""
            }
        },
        bookingDate: "",
        description: "",
        status: "",
        scheduleTime: {
            dayOfWeek: "",
            end: "",
            start: ""
        },
        ketqua:""


    });
    useEffect(() => {
        http({
            url: '/booking/' + id,
            method: 'GET'
        })
            .then((response) => {
                const { data } = response;
                setBooking(data.data);
            })
            .catch((error) => {
                console.log(error, error.response);
            });
    }, [id, updateStatus]);


    return (
        <div className="container mt-5">
            {/* Chi tiết hồ sơ khám */}
                <ShowDetailMedicalRecords/>
            {/*End Chi tiết hồ sơ khám */}
           
            <div className="row border border-dark mt-5">
                <StepByStep setUpdateStatus={setUpdateStatus}/>
            </div>

            {/* Thông Tin Nha Sĩ */}
                <InfoDentist/>
            {/*End Thông Tin Nha Sĩ */}

            {/* Thông tin dịch vụ */}
                <InfoService/>
            {/*End Thông tin dịch vụ */}

            <div className="d-flex justify-content-center">
                <button className="btn btn-info text-center mb-5" onClick={btnThanhToan}>
                    Thanh toán
                </button>
                {
                    booking.status === 2 ?
                        (
                            <button className="btn btn-dark text-center mb-5 ms-4"
                                data-bs-toggle="modal" 
                                data-bs-target="#exampleModalConclusion"
                               >
                                Kết luận của nha sĩ
                            </button>

                        ) : ''
                }
            </div>
            <ModalConclusion booking={booking} 
            setBooking={setBooking}/>

        </div>
    )
}