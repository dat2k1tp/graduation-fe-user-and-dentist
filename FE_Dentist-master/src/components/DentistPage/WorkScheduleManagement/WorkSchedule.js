
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
    },
});

export default function WorkSchedule() {



    const classes = useStyles();
    const [tab, setTab] = React.useState(0);

    const handleChange = (event, newValue) => {
       
        setTab(newValue);

    };

    const[updateList,setUpdateList]=useState(0);


    return (
        <React.Fragment>
          <ImgHeaderWorkSchedule/>

            <Container style={{ maxWidth: '1400px' }}>
                <Typography component="div" className="mt-5"
                style={{  backgroundColor: 'white', minHeight: '100vh',
                 width: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }} >
                    <Paper className={classes.root}>
                        <Tabs
                            value={tab}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Danh sách lịch khám" />
                            {sessionStorage.getItem("bookingId")!==null ?
                            (<Tab label="Chi tiết lịch khám" />):''}
                            {sessionStorage.getItem("payment")!==null ? 
                            <Tab label="Thanh toán" />:""}
                           
                        </Tabs>
                    </Paper>
                    {tab===0&&(
                         
                         <TabWorkScheduleList updateList={updateList} 
                            setTab={setTab}
                        />
                                             
                    )}
                    {
                        tab===1&&sessionStorage.getItem("bookingId")!==null ?(
                            <TabDetailedWorkSchedule
                                setUpdateList={setUpdateList}
                                updateList={updateList} 
                                 setTab={setTab}/>
                                 
                        ):''
                    }
                    {
                        tab===2&&sessionStorage.getItem("payment")!==null ?(
                            <Payment/>
                        ):''
                    }


                </Typography>
            </Container>
        </React.Fragment>

    );
    







    
}


