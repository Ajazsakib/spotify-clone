'use client';
import React, { useState, useContext, useEffect } from 'react';
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
import { checkEmailExist } from '@/util/helperFunction';
import { removeAutoFillEmailPassword } from '@/util/removeAutoEmailPassword';
import Loader from '@/components/loader/Loader';
const RegistrationPage = () => {
  const { state, dispatch } = useContext(AppContext);

  interface State {
    name: string;
    email: string;
    password: string;
  }

  const [formState, setFormState] = useState<State>({
    name: '',
    email: '',
    password: '',
  });

  const [onChangeValidation, setOnChangeValidation] = useState(false);

  const [errorMessage, setErrorMessage] = useState<{
    [key: string]: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
  }>({});
  const router = useRouter();

  // Remove Autofill

  // validation function

  const validationFnction = async (callback) => {
    try {
      await callback();
      // setOnChangeValidation(false);
    } catch (errors: any) {
      // Validation failed, handle the errors
      setOnChangeValidation(true);
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
  };

  const handleChange = async (e: { target: { name: any; value: any } }) => {
    console.log('Handle Change >>>>>>>>>>>>>>>>>', e.target.name);
    const newState = {
      ...formState,
      [e.target.name]: e.target.value,
    };
    setFormState(newState);
    if (onChangeValidation) {
      validationFnction(async () => {
        await validationSchema.validate(newState, { abortEarly: false });
        setErrorMessage({
          name: '',
          email: '',
          password: '',
        });
      });
    }
  };

  interface Error {
    path: string;
    message: string;
  }

  interface User {
    email?: string;
    id?: string;
    isAdmin?: boolean;
    name?: string;
    password?: string;
    [key: string]: string | boolean | undefined;
  }
  const handleSubmit = async (state: State) => {
    // console.log(state.name, state.email, state.password);
    // await createUserWithEmailAndPassword(auth, state.email, state.password);

    // Form Validation Code
    validationFnction(async () => {
      await validationSchema.validate(formState, { abortEarly: false });
      dispatch({ type: 'SHOW_LOADER', payload: true });
      const userObj: User = await checkEmailExist(formState.email);

      if (userObj.email == formState.email) {
        alert('Email Already Exist');
      } else {
        // Validation passed, continue with form submission
        // Data to submit in databse
        const dataToSubmit = {
          name: formState.name,
          email: formState.email,
          password: formState.password,
          isAdmin: false,
        };

        addUser(dataToSubmit);
        alert('Form submitted successfully!');
        setFormState((prevState) => ({
          ...prevState,
          name: '',
          email: '',
          password: '',
        }));
        dispatch({ type: 'IS_LOGGED_IN', payload: true });

        localStorage.setItem('username', JSON.stringify(formState));
        router.push('/');
      }
      dispatch({ type: 'SHOW_LOADER', payload: false });
    });
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
          <h3>Sign up for free </h3>
        </div>
        {/* <div className="signup-with-google">
          <button className="btn btn-google-signup">
            <img src="images/google.png" />
            Sign Up With Google
          </button>
        </div> */}
        <div className="form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formState.name}
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
              value={formState.email}
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
              autoComplete="off"
              value={formState.password}
              onChange={handleChange}
            />
            {errorMessage?.password && <p>{errorMessage.password}</p>}
          </div>
          <div className="form-group">
            {/* <input
              type="submit"
              className="btn btn-secondary"
              onClick={() => {
                handleSubmit(formState);
              }}
            /> */}
            <button
              type="submit"
              className="btn btn-secondary"
              onClick={() => {
                handleSubmit(formState);
              }}
            >
              {' '}
              {state.showLoader ? <Loader /> : 'Submit'}
            </button>
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
