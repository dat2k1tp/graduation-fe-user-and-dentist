import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Typography from '@material-ui/core/Typography';
import http from '../../../service/http-common'
import { useEffect, useState } from 'react'
import ModalCancelMedicalRecords from "./ModalCancelMedicalRecords"
//css
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));
//end css

//STATUS
function getSteps() {
    return [ 'Chờ xác nhận','Chờ khám', 'Đã khám'];


}

//MÔ TẢ STATUS
function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return 'Vui lòng chờ xác nhận của nha sĩ.';
        case 1:
            return 'Xác nhận thành công! Bạn nhớ xem lịch và đến khám đúng giờ.';
        case 2:
            return 'Đã khám';
        default:
            return 'Hủy lịch khám';
    }
}

export default function StepByStep({ setUpdateStatus }) {



    // let status = query.get('status');
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const completed = {}
    const steps = getSteps();


    



    //bookingId
    let id = Number(sessionStorage.getItem("bookingId"));
    // lấy thông tin đặt lịch
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


    useEffect(() => {
        setActiveStep(Number(booking.status))
    }, [booking.status])


    // -đang chờ xác nhận(0)-chờ khám (1)
    // -đã khám(hoàn thành(2)-huy(3)
    
    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    // //TEST
    // const handleNext = () => {
    //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //   };

    return (
        <div className={classes.root}>
            <h3>Trạng thái</h3>
            {
                activeStep !== 3 ? (


                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepButton onClick={handleStep(index)} completed={completed[index]}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>

                ) : ''
            }

            <div>
                {activeStep === steps.length - 1 ? (
                    <div className="d-flex justify-content-center">
                        <Typography className={classes.instructions}>Cảm ơn đã sử dụng dịch vụ !</Typography>
                    </div>
                ) : (
                    <div>
                        <div className="d-flex justify-content-center mb-2">
                            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                        </div>
                        <div className="d-flex justify-content-center mb-2">
                            {/* {
                                activeStep !== 3 && activeStep !== 2 ? (
                                    <button className="btn btn-info" onClick={handleNext}>
                                        {activeStep === 1 ? 'Kết thúc' : 'Tiếp tục'}
                                    </button>
                                ) : ""
                            } */}


                            {
                                activeStep === 0 ? (
                                    <div>
                                        <button
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModalCancel"
                                            className="ms-3 btn btn-outline-danger"
                                        >
                                            Hủy lịch khám
                                        </button>
                                    </div>


                                ) : ''

                            }

                        </div>
                    </div>
                )}
            </div>
            <ModalCancelMedicalRecords booking={booking}
                setActiveStep={setActiveStep}
                setUpdateStatus={setUpdateStatus}
                activeStep={activeStep}
            />
        </div>
    );
}