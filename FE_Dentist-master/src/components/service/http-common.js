import axios from 'axios';



const defaultOptions = {
    baseURL: 'http://localhost:8080/api/v1/',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
};

// Create instance
let instance = axios.create(defaultOptions);


// Set the AUTH token for any request
instance.interceptors.request.use(
    function (config) {
        let token = JSON.parse(localStorage.getItem('token'));
        config.headers.Authorization = token ? `Bearer ${token}` : '';
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);



export default instance;

