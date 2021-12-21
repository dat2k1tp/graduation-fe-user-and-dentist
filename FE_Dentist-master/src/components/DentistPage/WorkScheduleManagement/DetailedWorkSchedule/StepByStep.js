import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Typography from '@material-ui/core/Typography';
import http from '../../../service/http-common'
import { useEffect } from 'react'
import ModalCancelWorkSchedule from './ModalCancelWorkSchedule';
import StepConnector from '@material-ui/core/StepConnector';
import clsx from 'clsx';
import StepLabel from '@material-ui/core/StepLabel';
import PropTypes from 'prop-types';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AssignmentIcon from '@material-ui/icons/Assignment';

//css
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

//STATUS
function getSteps() {
    return ['Chờ xác nhận', 'Chờ khám', 'Đã khám'];
}

//MÔ TẢ STATUS
function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return 'Vui lòng xác nhận lịch khám';
        case 1:
            return 'Xác nhận thành công! Bạn nhớ xem lịch và đến đúng giờ.';
        case 2:
            return 'Đã khám';
        default:
            return 'Hủy lịch khám';
    }
}

export default function StepByStep({ setUpdateList, booking, updateList }) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    let id = Number(sessionStorage.getItem("bookingId"));







    useEffect(() => {
        setActiveStep(Number(booking.status))
    }, [booking.status])


    // // -đang chờ xác nhận(0)-chờ khám (1)
    // // -đã khám(hoàn thành(2)-huy(3)
    // cập nhật trạng thái đặt lịch 
    const handleNext = () => {
        const confirm = window.confirm("Bạn muốn cập nhật lịch khám này không ?");
        if (confirm === true) {

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            updateStatus(activeStep + 1);
            // setUpdateList(activeStep+1);

        }
    };

    // console.log(updateList);
    //UPDATE STATUS
    const updateStatus = (status) => {
        console.log(status)
        if (
            booking.customerProfile.accounts !== null &&
            typeof (booking.customerProfile.accounts) !== 'undefined') {
            // console.log(booking.customerProfile.accounts);
            http({
                url: '/booking/' + id + "/status/" + status,
                method: 'PUT'
            })
                .then((response) => {
                    console.log("UPDATE STATUS SUCCESS");
                    setUpdateList((prevActiveStep) => prevActiveStep + 1);
                    if (status === 2) {
                        alert("Vui lòng cập nhật kết quả khám")
                    }

                })
                .catch((error) => {
                    console.log(error, error.response);
                });
        }
    }


    // const handleStep = (step) => () => {
    //     setActiveStep(step);
    // };



    //SET UP CSS THANH TRẠNG THÁI
    const ColorlibConnector = withStyles({
        alternativeLabel: {
            top: 22,
        },
        active: {
            '& $line': {
                borderColor: '#00BCD5',
            },
        },
        completed: {
            '& $line': {
                borderColor: '#00BCD5',
            },
        }
        ,
        line: {
            borderColor: '#eaeaf0',
            borderTopWidth: 3,
            borderRadius: 1,
        },
    })(StepConnector);

    const useColorlibStepIconStyles = makeStyles({
        root: {
            backgroundColor: '#ccc',
            zIndex: 1,
            color: '#fff',
            width: 50,
            height: 50,
            display: 'flex',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        active: {
            color: 'white',
            backgroundColor: '#00BCD5',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        },
        completed: {
            color: 'white',
            backgroundColor: '#00BCD5'
        },
    });

    function ColorlibStepIcon(props) {
        const classes = useColorlibStepIconStyles();
        const { active, completed } = props;

        const icons = {
            1: <AssignmentIcon style={{ fontSize: 27 }} />,
            2: <LocalHospitalIcon style={{ fontSize: 29 }} />,
            3: <CheckBoxIcon style={{ fontSize: 27 }} />,
        };

        return (
            <div
                className={clsx(classes.root, {
                    [classes.active]: active,
                    [classes.completed]: completed,
                })}
            >
                {icons[String(props.icon)]}
            </div>
        );
    }

    ColorlibStepIcon.propTypes = {
        /**
         * Whether this step is active.
         */
        active: PropTypes.bool,
        /**
         * Mark the step as completed. Is passed to child components.
         */
        completed: PropTypes.bool,
        /**
         * The label displayed in the step icon.
         */
        icon: PropTypes.node,
    };
    //END SET UP CSS THANH TRẠNG THÁI



    return (
        <div className={classes.root}>
            <h3>Trạng thái</h3>
            {
                activeStep !== 3 ? (


                    <Stepper activeStep={activeStep} connector={<ColorlibConnector />}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel  StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                ) : ''
            }

            <div>
                {activeStep === steps.length - 1 ? (
                    <div className="d-flex justify-content-center">
                        <Typography className={classes.instructions}>Đã hoàn thành dịch vụ !</Typography>
                    </div>
                ) : (
                    <div>
                        <div className="d-flex justify-content-center mb-2">
                            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                        </div>
                        <div className="d-flex justify-content-center mb-2">
                            {
                                activeStep !== 3 && activeStep !== 2 ? (
                                    <button className="btn btn-info"
                                        onClick={handleNext}>
                                        {activeStep === 1 ? 'Kết thúc' : 'Tiếp tục'}
                                    </button>
                                ) : ""
                            }


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
            <ModalCancelWorkSchedule booking={booking}
                setActiveStep={setActiveStep}
                updateStatus={updateStatus}
                activeStep={activeStep}
            />
        </div>
    );
}
