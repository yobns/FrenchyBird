import React, { useContext, useEffect } from 'react'
import './Login.css'
import { ModalContext } from '../Context/ModalsContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { handleLoginShow, handleSignupShow, isUserLoggedIn } = useContext(ModalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn)
      navigate('/Game');
  }, [isUserLoggedIn, navigate])

  return (
    <div className='login'>
      <div className="borderBg">
        <span className="title">Frenchy<span style={{ color: '#ffea88', fontStyle: 'italic' }}>Bird</span></span>
        {!isUserLoggedIn && (<>
          <div className="msgCard">
            <h1 className='msg'>Please login to access !</h1>
            <div className="btnContainer">
              <button className='btnLogin' onClick={handleLoginShow}>Login</button>
              <button className='btnLogin' onClick={handleSignupShow}>Signup</button>
            </div>
          </div>
        </>)}
      </div>
    </div>
  )
}

export default Login