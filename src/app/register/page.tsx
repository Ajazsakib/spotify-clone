'use client';
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { AppContext } from '@/contexts/AppContext';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
} from 'firebase/firestore';
import db from '@/firebase/firebase';
import Link from 'next/link';
import validationSchema from './formValidationSchema';
const RegistrationPage = () => {
  const { globalState, dispatch } = useContext(AppContext);

  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState<{
    [key: string]: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
  }>({});
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  interface Error {
    path: string;
    message: string;
  }

  const handleSubmit = async () => {
    console.log(state.name, state.email, state.password);
    // await createUserWithEmailAndPassword(auth, state.email, state.password);

    // Form Validation Code
    try {
      await validationSchema.validate(state, { abortEarly: false });
      // Validation passed, continue with form submission
      console.log('Form submitted successfully!', state);
      alert('Form submitted successfully!');
    } catch (errors: any) {
      // Validation failed, handle the errors
      console.log(errors);
      const errorMessages: {
        name?: string;
        email?: string;
        password?: string;
        [key: string]: string | undefined;
      } = {};
      errors.inner.forEach((error: Error) => {
        errorMessages[error.path] = error.message;
      });
      setErrorMessage(errorMessages);
      console.log('Form validation errors:', errorMessages);
    }
    // Data to submit in databse
    const dataToSubmit = {
      name: state.name,
      email: state.email,
      password: state.password,
      isAdmin: false,
    };

    addUser(dataToSubmit);
    // router.push('/');
    // dispatch({ type: 'IS_LOGGED_IN', payload: true });
  };

  const addUser = async (data: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
  }) => {
    const docRef = await addDoc(collection(db, 'users'), {
      // username: userName,
      // item: productDetails,
      ...data,
    });
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
              autoComplete="off"
              name="name"
              value={state.name}
              onChange={handleChange}
            />
            {errorMessage?.name && <p>{errorMessage.name}</p>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              name="email"
              value={state.email}
              onChange={handleChange}
            />
            {errorMessage?.email && <p>{errorMessage.email}</p>}
          </div>
          <div className="form-group">
            <label>password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={state.password}
              onChange={handleChange}
            />
            {errorMessage?.password && <p>{errorMessage.password}</p>}
          </div>
          <div className="form-group">
            <input
              type="submit"
              className="btn btn-secondary"
              onClick={() => {
                handleSubmit(state);
              }}
            />
          </div>
          <div className="form-group">
            <Link href="/login" className="btn btn-secondary">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
