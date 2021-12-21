import { Link } from "react-router-dom";

export default function FormConfirm() {
    return(
        <div className="text-center mt-5" 
        style={{ backgroundImage: `URL("http://localhost:8080/api/v1/files/download/image?filename=e2071e4e-d806-4ad7-aeea-17ac22f386bf.jpg")`,
        marginTop:'10rem', height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
        paddingTop: '5rem'}}>
            <h3 >Tài khoản của bạn đã được xác nhận !</h3>
            <Link to="/login" className="btn btn-info mt-2">Đăng nhập</Link>
        </div>
    )
}