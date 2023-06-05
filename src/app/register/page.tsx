'use client';
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { AppContext } from '@/contexts/AppContext';
const RegistrationPage = () => {
  const { globalState, dispatch } = useContext(AppContext);

  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(state.name, state.email, state.password);
    await createUserWithEmailAndPassword(auth, state.email, state.password);
    console.log('Registration data submitted successfully.');
    router.push('/');
    dispatch({ type: 'IS_LOGGED_IN', payload: true });
  };

  return (
    <div className="register-page-wrap">
      <div className="register-page">
        <div className="heading">
          <h3>Sign up for free to start listening.</h3>
        </div>
        <div className="signup-with-google">
          <button className="btn btn-google-signup">
            <img src="images/google.png" />
            Sign Up With Google
          </button>
        </div>
        <div className="form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              className="btn btn-secondary"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;