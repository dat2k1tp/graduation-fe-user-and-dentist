
import ImgHeaderWorkSchedule from "./ImgHeaderWorkSchedule";
import { useState } from "react";
import TabWorkScheduleList from "./WorkScheduleList/TabWorkScheduleList";
import TabDetailedWorkSchedule from "./DetailedWorkSchedule/TabDetailedWorkSchedule";
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Payment from "./Payment/Payment";


const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        width: "100%",
    },
});

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        "aria-controls": `scrollable-auto-tabpanel-${index}`
    };
}

export default function WorkSchedule() {



    const classes = useStyles();
    const [tab, setTab] = React.useState(0);

    const handleChange = (event, newValue) => {

        setTab(newValue);

    };

    const [updateList, setUpdateList] = useState(0);


    return (
        <React.Fragment>
            <ImgHeaderWorkSchedule />

            <Container style={{ maxWidth: '1400px' }}>
                <Typography component="div" className="mt-5"
                    style={{
                        backgroundColor: 'white', minHeight: '100vh',
                        width: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'
                    }} >
                    <div className={classes.root}>
                        <Paper className="d-flex justify-content-center">
                            <Tabs
                                value={tab}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                            >
                                <Tab label="Danh sách lịch khám" {...a11yProps(1)}/>
                                {sessionStorage.getItem("bookingId") !== null ?
                                    (<Tab label="Chi tiết lịch khám" {...a11yProps(2)}/>) : ''}
                                {sessionStorage.getItem("payment") !== null ?
                                    <Tab label="Thanh toán" {...a11yProps(3)}/> : ""}

                            </Tabs>
                        </Paper>
                        {tab === 0 && (

                            <TabWorkScheduleList updateList={updateList}
                                setTab={setTab}
                            />

                        )}
                        {
                            tab === 1 && sessionStorage.getItem("bookingId") !== null ? (
                                <TabDetailedWorkSchedule
                                    setUpdateList={setUpdateList}
                                    updateList={updateList}
                                    setTab={setTab} />

                            ) : ''
                        }
                        {
                            tab === 2 && sessionStorage.getItem("payment") !== null ? (
                                <Payment />
                            ) : ''
                        }
                    </div>



                </Typography>
            </Container>
        </React.Fragment>

    );









}


