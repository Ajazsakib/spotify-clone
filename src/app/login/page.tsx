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

const LoginPage = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const { dispatch } = useContext(AppContext);

  const router = useRouter();

  const handleChange = (e) => {
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

  const handleSubmit = async () => {
    const q = query(collection(db, 'users'), where('email', '==', state.email));

    await getDocs(q).then((querySnapshot) => {
      const user = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const userObj = user.find((item) => {
        return item.email == state.email;
      });

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
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(res);
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

export default LoginPage;
