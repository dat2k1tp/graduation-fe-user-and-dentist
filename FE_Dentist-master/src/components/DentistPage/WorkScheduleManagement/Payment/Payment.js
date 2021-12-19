import { useForm } from "react-hook-form";
import InfoService from "../DetailedWorkSchedule/InfoService";
import http from "../../../service/http-common"
import { useEffect, useState } from "react";
import { formatPrice } from "../../../../utils/moment-helper";
import moment from "moment";
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { dark } from '@material-ui/core/styles/createPalette';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: dark[900],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -35,
        marginLeft: -10,
    },
}));

export default function Payment() {

    const [updateVoucher, setUpdateVoucher] = useState(0);
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    // const [success, setSuccess] = React.useState(false);
    const timer = React.useRef();



    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmitHandle = (data) => {
        console.log(data.voucherId);
        checkVoucherExists(data.voucherId);
    }


    let id = Number(sessionStorage.getItem("bookingId"));

    // lấy thông tin đặt lịch(BOOKING)
    const [booking, setBooking] = useState({
        id: "",
        dentistProfile: {},
        customerProfile: {},
        bookingDate: "",
        description: "",
        status: "",
        scheduleTime: {
            dayOfWeek: "",
            end: "",
            start: ""
        }


    });
    useEffect(() => {
        // console.log("111");

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
    }, [id])




    //CALL API BOOKING DETAIL 
    const [bkDetail, setBkDetail] = useState([
        {
            id: "",
            bookingId: "",
            serviceId: "",
            voucherId: null,
            price: ""
        }
    ])
    useEffect(() => {

        http({
            url: '/booking/detail/all/' + id,
            method: 'GET'
        })
            .then((response) => {
                const { data } = response;
                setBkDetail(data.data);

            })
            .catch((error) => {
                console.log(error, error.response);
            });
    }, [id
        // ,updateVoucher
    ])

    const [voucherU, setVoucherU] = useState({
    });
    useEffect(() => {
        if (bkDetail[0].voucherId !== ""
            && typeof (bkDetail[0].voucherId) !== "undefined"
            && bkDetail[0].voucherId !== null) {
            http({
                method: 'GET',
                url: 'http://localhost:8080/api/v1/vouchers/byId/all-status/'
                    + bkDetail[0].voucherId,
            })
                .then((response) => {
                    const { data } = response;
                    setVoucherU(data.data)

                })
                .catch((error) => {
                    console.log(error, error.response)
                })
        }

    }, [bkDetail])
    // console.log(voucherU);


    //CHECK VOUCHER CÓ TỒN TẠI HAY KO
    const checkVoucherExists = (voucherId) => {
        http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/vouchers/byId/' + voucherId,
        })
            .then((response) => {
                const { data } = response;
                if (data.data !== null) {
                    checkVoucherDate(data.data);
                } else {
                    alert("Mã giảm giá không tồn tại")
                }
            })
            .catch((error) => {
                console.log(error, error.response)
            })
    }

    //CHECK HẠN SỬ DỤNG VOUCHER
    const checkVoucherDate = (voucher) => {
        let yourDate = new Date();
        // console.log(moment(yourDate).format("YYYY-MM-DD HH:mm:ss")
        // +"---"+moment("2021-11-26T13:59").format("YYYY-MM-DD HH:mm:ss"));

        http({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/vouchers/checkExprDate?endDate='
                + moment(voucher.end).format("YYYY-MM-DD HH:mm:ss")
                + "&nowDate=" + moment(yourDate).format("YYYY-MM-DD HH:mm:ss"),
        })
            .then((response) => {
                const { data } = response;
                const a = voucher;
                if (data.data.length > 0) {
                    setVoucherU({
                        ...voucherU,
                        a
                    });
                    onUpdateBookingDetail(voucher, bkDetail);

                } else {
                    alert("Mã giảm giá đã hết hạn");
                }
            })
            .catch((error) => {
                console.log(error, error.response)
            })
    }


    // CẬP NHẬT LÊN BOOKING DETAIL
    const onUpdateBookingDetail = (voucher, bookingDetail) => {
        let formData = {
            id: bookingDetail[0].id,
            bookingId: bookingDetail[0].bookingId,
            serviceId: bookingDetail[0].serviceId,
            voucherId: voucher.id,
            price: bookingDetail[0].price
        }
        http({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/booking/detail/' + bookingDetail[0].id,
            data: formData
        })
            .then((response) => {
                const { data } = response.data;
                setBkDetail([
                    data
                ]);
                //disable voucher
                onSoftDeleteVoucher(voucher);
            })
            .catch((error) => {
                console.log(error, error.response)
            })
    }

    // DISABLE VOUCHER 
    const onSoftDeleteVoucher = (voucher) => {
        http({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/vouchers/soft-delete/' + voucher.id,
        })
            .then((response) => {
                // const { data } = response;
                alert("Mã giảm giá đã được áp dụng");
                //load lại list service
                setUpdateVoucher((prevActiveStep) => prevActiveStep + 1);


            })
            .catch((error) => {
                console.log(error, error.response);
                console.log(error);
            })
    }

    //down load hóa đơn
    const btnIn = () => {
        http({
            method: 'GET',
            url: `http://localhost:8080/api/v1/export/download/${booking.id}`,
            responseType: 'blob',
        })
            .then((response) => {

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'hoa-don.docx'); //or any other extension
                document.body.appendChild(link);
                link.click();
                console.log("IN THANH CONG");

            })
            .catch((error) => {
                console.log(error, error.response);
            })

    }

    //button reload
    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleButtonClick = () => {
        btnIn();
        if (!loading) {
            // setSuccess(false);
            setLoading(true);
            timer.current = window.setTimeout(() => {
                // setSuccess(true);
                setLoading(false);
            },5000);
        }
    };

    // console.log(bkDetailNotVoucher.length>0?parseFloat(bkDetailNotVoucher[0].price) 
    //     -parseFloat(bkDetailNotVoucher[0].price)*parseFloat(voucherU.sale)/100:"");
    return (
        <div className="container mt-5">
            <div className="row">
                {/* SERVICE */}
                <div className="col-sm-12 border border-dark mb-2">
                    <InfoService updateVoucher={updateVoucher} />
                </div>

                {/* VOUCHER */}

                <div className="border border-dark mt-3">
                    <h3>Mã giảm giá</h3>

                    <div className="d-flex justify-content-center ">
                        <div className="card text-dark bg-light mb-3 col-8" >
                            <div className="card-header">Sử dụng mã giảm giá</div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmitHandle)}>
                                    <input type="text" className="form-control"
                                        id="voucher" placeholder="Nhập mã giảm giá"
                                        disabled={booking.status === 3 || booking.status === 2 ? true : false}
                                        {...register("voucherId", {
                                            required: "Không để trống mã giảm giá"
                                            , maxLength: { value: 255, message: "Mã giảm giá tối đa 255 ký tự" }
                                        })} />
                                    {errors.voucherId && <span className="text-danger">{errors.voucherId.message}</span>}
                                    <div className="d-flex justify-content-center">
                                        {
                                            booking.status === 3 || booking.status === 2 ?
                                                '' : (
                                                    <button type="submit" className="btn btn-info mt-2">
                                                        Áp dụng
                                                    </button>
                                                )
                                        }

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>



            {/* INFO PAYMENT */}
            <div className="text-center mt-3 fs-4">
                {
                    bkDetail[0].price !== ""
                        ?
                        (
                            <div>
                                <div >

                                    {
                                        bkDetail[0].voucherId !== null
                                            && bkDetail[0].voucherId !== ""
                                            && voucherU !== null ? (
                                            <div className="fs-5">

                                                <span >

                                                    Số tiền đã giảm là:
                                                    <b>{
                                                        formatPrice(
                                                            parseFloat(bkDetail[0].price)
                                                            * parseFloat(voucherU.sale) / 100)}</b>

                                                </span>
                                                <div>
                                                    Mã giảm giá đã sử dụng là:
                                                    <b>{voucherU.id}</b>
                                                </div>
                                            </div>
                                        ) : ""


                                    }

                                </div>

                                <div className="d-flex justify-content-center">Tổng số tiền phải thanh toán là:
                                    <span className="fw-bold ms-1">
                                        {
                                            bkDetail[0].voucherId !== null
                                                && bkDetail[0].voucherId !== ""
                                                && voucherU !== null ?
                                                (
                                                    <span>
                                                        {
                                                            formatPrice(parseFloat(bkDetail[0].price)
                                                                - parseFloat(bkDetail[0].price)
                                                                * parseFloat(voucherU.sale) / 100)}
                                                    </span>
                                                )

                                                : formatPrice(bkDetail[0].price)
                                        }
                                    </span>

                                    {/* dùng trên server */}
                                    {/* <a
                                            href={`https://pure-stream-96271.herokuapp.com/api/v1/export/download/${booking.id}`}
                                            className="text-decoration-none fs-5"> <i className='fas fa-print'></i> In ra hóa đơn </a> */}

                                    {/* dùng trên local */}
                                    <div className={classes.root}>
                                        <div className={classes.wrapper}>
                                            <button
                                                className="fs-6 btn-sm btn btn-outline-info ms-2 mb-5"
                                                disabled={loading}
                                                onClick={handleButtonClick}
                                            >
                                                <i className='fas fa-print'></i> In ra hóa đơn
                                            </button>
                                            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                        </div>
                                    </div>

                                </div>


                            </div>


                        ) : ''
                }
            </div>

        </div>
    )
}