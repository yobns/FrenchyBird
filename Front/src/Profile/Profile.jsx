import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import { Form } from 'react-bootstrap'
import { ModalContext } from '../Context/ModalsContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { handleUserLogout } = useContext(ModalContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const id = localStorage.getItem('id');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${id}`, {
          headers: {
            'x-auth-token': localStorage.getItem('userToken'),
          },
        })
        const userData = response.data;

        setFormData({
          email: userData.email || '',
          username: userData.username || '',
          password: '',
          confirmPassword: '',
        })
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    }
    loadUserData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const { email, username, password, confirmPassword } = formData;

    if (!email || !username)
      return setErrorMessage('All fields are required');

    if (password !== confirmPassword)
      return setErrorMessage("Passwords don't match");

    try {
      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/user/${id}`, formData, {
        headers: {
          'x-auth-token': localStorage.getItem('userToken'),
        },
      })
      localStorage.setItem('username', formData.username);
      navigate('/Game');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      if (error.response)
        setErrorMessage(error.response.data);
    }
  }

  const logoutAndRedirect = () => {
    handleUserLogout();
    navigate('/');
  }

  return (
    <div className='profile'>
      <h3 className='mb-3 titleProfile'>My Profile</h3>
      <div className='formContainer'>
        <Form onSubmit={handleUpdateProfile}>
          <Form.Group className='mb-3' controlId='Email'>
            <Form.Label>Email<span className="required-star">*</span></Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='username'>
            <Form.Label>Username<span className="required-star">*</span></Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter username'
              name='username'
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              name='password'
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='mb-4' controlId='PasswordConfirm'>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm Password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="text-center">
            <div className='text-danger mb-1'>{errorMessage}</div>
            <button type='submit' className='buttonUpdate mb-3'>Update</button>
          </div>
        </Form>
      </div>

        <h3 className='titleLogout'>Logout here👋</h3>
        <button className='buttonLogout' onClick={logoutAndRedirect}>Logout</button>
    </div>
  )
}

export default Profile