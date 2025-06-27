import React, { useState } from 'react'
import './Sign.css'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
const Login = () => {
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const navigate=useNavigate();
     const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const showNotification = (message, success) => {
        setPopupMessage(message);
        setIsSuccess(success);
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };
    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post('https://freelancer-finder.onrender.com/login',{email,password})
        .then(result=>{
           if (result.data.status === "success") {

            const userData=result.data.user;
            const userEmail=result.data.email|| result.data.user.email;
            localStorage.setItem("email",userEmail);
  localStorage.setItem("user", JSON.stringify(userData)); 
   showNotification("Login successful!", true);
                    setTimeout(() => {
                        navigate('/Home');
                        window.location.reload();
                    }, 1000);
}
            else{
                showNotification("Invalid login credentials", false);
            }
            
    })
        .catch(err=>console.log(err))
    }
  return (
    <>
    {showPopup && (
                <div className={`popup-notification ${isSuccess ? 'success' : 'error'}`}>
                    {popupMessage}
                </div>
            )}
<div className='d-flex justify-content-center align-items-center  vh-100  sin'>
    <div className='box p-3 rounded ' style={{height:"600px"}}>
        <h2 className='text-center' style={{marginBottom:"30px",fontSize:"34px",color:"blue"}}>Login</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                 <label htmlFor='email' style={{ display: 'block', marginBottom: '5px' }}>
                    <strong className='st'>Email</strong>
                </label>
                <input
                type='email'
                placeholder='Enter email'
                autoComplete='off'
                name='email'
                className='form-control-rounded-8 la'
                onChange={(e)=>setEmail(e.target.value)}
                />
            </div>
             <div className='mb-3'>
                 <label htmlFor='email' style={{ display: 'block', marginBottom: '5px' }}>
                    <strong className='st'>Password</strong>
                </label>
                <input
                type='password'
                placeholder='Enter password'
                autoComplete='off'
                name='password'
                className='form-control-rounded-8 la'
                onChange={(e)=>setPassword(e.target.value)}
                />
            </div>
                       <button type='submit' className='btn btn-primary w-100 rounded-2' style={{marginBottom:"10px",fontSize:"20px"}}>Login</button>
            
            </form><br></br>
            <p>Don't Have an Account</p>
            <a href="/Signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>
                Signup
            </a>
        
    </div>
</div>
    </>
  )
}

export default Login;