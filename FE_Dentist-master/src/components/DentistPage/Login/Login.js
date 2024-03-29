import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

// import { useEffect, useState } from 'react';
// import http from '../service/http-common'

export default function Login({ setIsLogin, isLogin,setAccount,setAuth }) {




    const { register, handleSubmit, formState: { errors } } = useForm();
    let token = localStorage.getItem('token');
    const onHandleSubmit = (data) => {
        btnLogin(data);
    }

    //LOGIN
    const btnLogin = (data) => {
 

        if (token === null ||
            typeof (token) === 'undefined') {
            const url = "http://localhost:8080/api/v1/user/auth"
            axios({
                url: url,
                method: 'POST',
                data: data,

            })
                .then((response) => {
                    const { data } = response;
                    setLocalStorage(data.data.token)

                })
                .catch((error) => {
                    console.log(error);
                    alert("Đăng nhập thất bại");
                })
        }
        else {
            setAccount({
                id: "",
                email: "",
                password: "",
                telephone: "",
                updateAt: "",
                rolesId: "",
                deleteAt: false
            });
            setIsLogin(false);
            setAuth({})
            localStorage.clear();
            sessionStorage.clear();
            alert("Đã kết thúc phiên của tài khoản trước. Vui lòng đăng nhập lại")
        }

    }



    //SAVE DATA NGƯỜI DÙNG SAU KHI ĐĂNG NHẬP
    let history = useHistory();
    const setLocalStorage = (to) => {
        console.log("save data")

        if (to !== null &&
            typeof (to) !== 'undefined') {
            axios({
                url: 'http://localhost:8080/api/v1/user/auth',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + to
                }
            })
                .then((response) => {
                    const { data } = response;
                    if (data.data.rolesId === 'ROLE_DENTIST') {
                        //save token
                        localStorage.setItem("token", JSON.stringify(to));
                        // SAVE DATA NGƯỜI DÙNG VÀO LOCALSTORAGE(ID,ROLE)
                        localStorage.setItem("auth", JSON.stringify(data.data));
                        setIsLogin(true)
                        alert('Đăng nhập thành công')
                        //chuyen huong trang
                        history.replace("/work-schedule")
                    } else {
                        setIsLogin(false);
                        alert('Đăng nhập thất bại')
                    }


                })
                .catch((error) => {
                    console.log(error, error.response);
                    alert("Đăng nhập thất bại");

                });
        }
    }







    return (

        <div
            style={{
                // backgroundImage: `URL("http://localhost:8080/api/v1/files/download/image?filename=background-img-login.jpg")`,
                height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
            }}>

            <h3 style={{
                color: '#00BCD5',
                fontWeight: 'bold'
            }} className="fs-1 text-center pt-5">Smile Dental</h3>
            <div className="d-flex justify-content-center mb-5 pb-5">

                <div style={{
                    marginTop: '5rem', width: '25rem', height: '20rem',
                    border: '1px solid gray', backgroundColor: 'rgb(246, 249, 249)',
                    boxShadow: '0 1rem 2rem 0 rgba(0, 0, 0, 0.2)'

                }}>


                    <form onSubmit={handleSubmit(onHandleSubmit)} className="card-body text-center">
                        <h3>Đăng nhập</h3>
                        <div className="mt-2 text-start">
                            <label htmlFor="emailDN" className="form-label ">Email:</label>
                            <input type="email" className="form-control" id="emailDN"
                                placeholder="simledental@gmail.com"
                                {...register("email", {
                                    required: "Không để trống email",
                                    pattern: { value: /\S+@\S+\.\S+/, message: "Nhập email đúng định dạng" }
                                })} />
                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                        </div><br />
                        <div className="text-start">
                            <label htmlFor="passwordDN" className="form-label text-start">Mật khẩu:</label>
                            <input type="password" className="form-control" id="passwordDN"
                                {...register("password", { required: true })} />
                            {errors.password && <span className="text-danger">Không để trống password</span>}
                        </div><br />
                        <button type="submit" className="btn btn-primary">Đăng nhập</button>
                    </form>
                </div>
            </div>



        </div>

    )
}