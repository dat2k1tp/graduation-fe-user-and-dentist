import React from "react"
export default function ImgHeaderMedicalRecords(){
    return(
        <div style={{height: '180px',marginTop: '60px'}}>
            <div className="card bg-dark text-white">
            <img src="http://localhost:8080/api/v1/files/download/image?filename=a890556e-d0f8-46c9-aac4-796392f805ed.jpg" className="card-img" alt="..." style={{height: '180px',opacity: '50%'}}/>
            <div className="card-img-overlay">
                <h5 className="card-title pt-5 text-center">HỒ SƠ KHÁM</h5>
            </div>
            </div>
        </div>
    )
    
}