
import React, { useState } from 'react'
import './Sign.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [imageFile,setImageFile]=useState(null);
  const [passwordError, setPasswordError] = useState('');
const [popupMessage, setPopupMessage] = useState('');
const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
const validatePassword = (pwd) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!regex.test(pwd)) {
    setPasswordError('Password must be 8+ characters, include uppercase, lowercase, number, and special character.');
    return false;
  }
  setPasswordError('');
  return true;
};

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!role) {
    alert('Please select a role before signing up');
    return;
  }
  if(!validatePassword(password)){
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('role', role);
  if(imageFile){
  formData.append('profileImage', imageFile);
  }
  axios.post('https://freelancer-finder.onrender.com/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  .then(result => {
    console.log(result);
    navigate('/Login');
  })
  .catch(err => {
  const message = err.response?.data?.message || "Signup failed. Please try again.";
  setPopupMessage(message);
  setShowPopup(true);
});
};


  return (
    <div className='d-flex justify-content-center align-items-center vh-100 sin'>
    {showPopup && (
  <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header bg-danger text-white">
          <h5 className="modal-title">Signup Error</h5>
          <button type="button" className="btn-close" onClick={() => setShowPopup(false)}></button>
        </div>
        <div className="modal-body">
          <p>{popupMessage}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowPopup(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      <div className='box p-3 rounded'>
        <h2 className='text-center' style={{ marginBottom: "30px", fontSize: "34px", color: "blue" }}>
          SignUp
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className='mb-3'>
    <label htmlFor='profileImage'><strong className='st'>Profile Image</strong></label>
    <input
      type='file'
      accept='image/*'
      name='profileImage'
      className='form-control la'
      onChange={(e) => setImageFile(e.target.files[0])}
      required
    />
  </div>
          
          <div className='mb-3'>
            <label htmlFor='name' style={{ display: 'block', marginBottom: '5px' }}>
              <strong className='st'>Name</strong>
            </label>
            <input
              type='text'
              placeholder='Enter name'
              autoComplete='off'
              name='name'
              className='form-control-rounded-8 la'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-3'>
  <label htmlFor='password' style={{ display: 'block', marginBottom: '5px' }}>
    <strong className='st'>Password</strong>
  </label>
  <input
    type='password'
    placeholder='Enter password'
    autoComplete='off'
    name='password'
    className='form-control-rounded-8 la'
    value={password}
    onChange={(e) => {
      setPassword(e.target.value);
      validatePassword(e.target.value); // validate as user types
    }}
    required
  /><br></br>
  {passwordError && (
    <small style={{ color: 'red' }}>{passwordError}</small>
  )}
</div>


          <div className="mb-3 d-flex gap-2">
            <button
              type='button'
              className={`btn ${role === "client" ? "btn-primary" : "btn-outline-primary"} w-50`}
              onClick={() => setRole("client")}
           >
              <p style={{fontSize:"17px",color:"black"}} >  Signup as Client
          </p>
            </button>
            <button
              type='button'
              className={`btn ${role === "freelancer" ? "btn-primary" : "btn-outline-primary"} w-50  `}
              onClick={() => setRole("freelancer")}
            >
            <p style={{fontSize:"17px",color:"black"}}>  Signup as Freelancer
          </p>  
          </button>
          </div>
<label className='mt-3 d-block' style={{fontSize:"16px"}}>
            <input type='checkbox' required /> Accept all terms and conditions.
          </label>
          <button
            type='submit'
            className='btn btn-success w-100 rounded-2 mt-2'
            disabled={!role}
            style={{ fontSize: "18px" }}
          >
            Signup
          </button>

          
        </form>
        <br />
        <p>Already Have an Account?</p>
        <a href='/Login' className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>
          Login
        </a>
      </div>
    </div>
  );
}

export default Signup;
