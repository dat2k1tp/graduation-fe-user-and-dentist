import InfoService from "./InfoService";
import StepByStep from "./StepByStep";
import ShowWorkingScheduleDetails from "./ShowWorkingScheduleDetails";
import InfoCustomer from "./InfoCustomer";
import ModalConclusion from "./ModalConclusion";
import { useEffect, useState } from "react";
import http from '../../../service/http-common'


export default function TabDetailedWorkSchedule({ setUpdateList, updateList, setTab }) {

    const btnThanhToan = () => {
        sessionStorage.setItem("payment", sessionStorage.getItem("bookingId"))
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
    }, [id, updateList])
    

    return (
        <div className="container mt-5">
            {/* Chi tiết hồ sơ khám */}
            <ShowWorkingScheduleDetails updateList={updateList} />
            {/*End Chi tiết hồ sơ khám */}

            {/* Trạng thái */}
            <div className="row border border-dark mt-5">
                <StepByStep setUpdateList={setUpdateList} />
            </div>
            {/* End Trạng thái */}

            {/* Thông Tin Khách Hàng*/}
            <InfoCustomer />
            {/*End Thông Tin Khách Hàng */}

            {/* Thông tin dịch vụ */}
            <InfoService />
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