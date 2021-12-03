import { Link } from "react-router-dom";

export default function ErrorPage(){
    return(
        <div style={{backgroundImage: `URL("http://localhost:8080/api/v1/files/download/image?filename=background-error-page.jpg")`
		, height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
		<div style={{minHeight:"720px", paddingTop:"70px"}}>

			<div className="col-4 offset-4 mt-5 text-center">
				<div className="display-1" style={{color: "black"}}>
					<b style={{fontSize:"200px"}}>404</b>
					<h2 style={{fontSize:"30px"}}>Trang này không khả dụng</h2>
				</div>
				<div style={{color:"black"}} className="mt-5">
				<h4>Vui lòng kiểm tra lại đường dẫn</h4>
				</div>
				<Link className="btn btn-info btn-block" to="/">Trang chủ</Link>	
		</div>
		</div>
	</div>
    );
}