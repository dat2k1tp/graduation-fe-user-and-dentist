
export default function ImgHeaderNews(){
    return(
        <div style={{height: '180px',marginTop: '60px'}}>
            <div className="card bg-dark text-white">
            <img src="http://localhost:8080/api/v1/files/download/image?filename=f1490f90-e817-459e-b39f-fa00f65f78c5.jpg" className="card-img" alt="..." style={{height: '180px',opacity: '50%'}}/>
            <div className="card-img-overlay">
                <h5 className="card-title pt-5">TIN TỨC</h5>
            </div>
            </div>
        </div>
    )
    
}