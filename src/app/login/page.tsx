'use client';
import React, { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useRouter } from 'next/navigation';
import { AppContext } from '@/contexts/AppContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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
import loginValidationSchema from './formValidationSchema';
const LoginPage = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState<{
    [key: string]: string | undefined;

    email?: string | undefined;
    password?: string | undefined;
  }>({});

  const { dispatch } = useContext(AppContext);

  const router = useRouter();

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleSubmit = async () => {
  //   // console.log(state.name, state.email, state.password);
  //   try {
  //     const result = await signInWithEmailAndPassword(
  //       auth,
  //       state.email,
  //       state.password
  //     );
  //     console.log(result.user.accessToken, 'from login');
  //     if (result.user.accessToken) {
  //       router.push('/');
  //       dispatch({ type: 'IS_LOGGED_IN', payload: true });
  //       var sliceUsername = state.email.replace(/@.*$/, '');
  //       localStorage.setItem('username', sliceUsername);
  //     }
  //   } catch (err) {
  //     alert('Enter Proper Email and Passeword');
  //   }
  // };

  interface User {
    email?: string;
    id?: string;
    isAdmin?: boolean;
    name?: string;
    password?: string;
    [key: string]: string | boolean | undefined;
  }

  const handleSubmit = async () => {
    // login for validation
    try {
      await loginValidationSchema.validate(state, { abortEarly: false });
      // Validation passed, continue with form submission
      console.log('Form submitted successfully!', state);

      const q = query(
        collection(db, 'users'),
        where('email', '==', state.email)
      );

      await getDocs(q).then((querySnapshot) => {
        const user = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const userObj: User =
          user.find((item: User) => {
            return item.email == state.email;
          }) || {};

        console.log(userObj);

        if (userObj.email == state.email) {
          dispatch({ type: 'IS_LOGGED_IN', payload: true });
          localStorage.setItem('username', JSON.stringify(userObj));
          if (userObj.isAdmin == true) {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }
      });
    } catch (errors: any) {
      // Validation failed, handle the errors
      const errorMessages: {
        email?: string;
        password?: string;
        [key: string]: string | undefined;
      } = {};
      errors.inner.forEach(
        (error: { path: string | number; message: string }) => {
          errorMessages[error.path] = error.message;
        }
      );
      setErrorMessage(errorMessages);
      console.log('Form validation errors:', errorMessages);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const credential: any = GoogleAuthProvider.credentialFromResult(res);
    console.log(credential, 'from google login');
    if (credential.accessToken) {
      router.push('/');

      dispatch({ type: 'IS_LOGGED_IN', payload: true });
    }
  };

  return (
    <div className="register-page-wrap">
      <div className="register-page">
        <div className="heading">
          <h3>Login To Your Music App</h3>
        </div>
        <div className="signup-with-google">
          <button className="btn btn-google-signup" onClick={signInWithGoogle}>
            <img src="images/google.png" />
            Sign Up With Google
          </button>
        </div>
        <div className="form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              name="email"
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
              onChange={handleChange}
            />
            {errorMessage?.password && <p>{errorMessage.password}</p>}
          </div>
          <div className="form-group">
            <input
              type="submit"
              className="btn btn-secondary"
              onClick={handleSubmit}
            />
          </div>
          <div className="form-group">
            <Link href="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
