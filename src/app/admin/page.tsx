'use client';
import React, { useState, useContext, useEffect } from 'react';
import './admin.css';
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
import { useRouter } from 'next/navigation';
import { app } from '@/firebase/firebase';
import { storage } from '@/firebase/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const AdminPage = () => {
  const { state, dispatch } = useContext(AppContext);

  const [adminFormstate, setAdminFormState] = useState({
    artist: '',
    category: '',
    title: '',
    songUrl: '',
  });

  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);

  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState('');

  const handleChange = (e) => {
    setAdminFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  console.log(file);
  useEffect(() => {
    if (file) {
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgresspercent(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgUrl(downloadURL);
          });
        }
      );
    }
  }, [file]);
  console.log(imgUrl);
  const songsCategoryRef = collection(db, 'category');

  const getCategory = async () => {
    const data = await getDocs(songsCategoryRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    dispatch({ type: 'FETCH_CATEGORY', payload: filteredData });
  };

  useEffect(() => {
    getCategory();
    // if (!state.isLoggedIn) {
    //   router.push('/login');
    // }
    const username = localStorage.getItem('username');
    const userObject = JSON.parse(username);

    if (userObject.name != '' && userObject.isAdmin == true) {
      dispatch({ type: 'IS_LOGGED_IN', payload: true });
    } else {
      dispatch({ type: 'IS_LOGGED_IN', payload: false });

      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const getSingleCategory = state?.category.find((item) => {
      return item.name == adminFormstate.category;
    });
    setSelectedCategory(getSingleCategory);
  }, [adminFormstate.category]);

  const handleSubmit = () => {
    var dataToSubmit = {
      artist: adminFormstate.artist,
      category_id: selectedCategory?.id,
      title: adminFormstate.title,
      src: imgUrl,
    };

    addSong(dataToSubmit);
  };

  const addSong = async (data) => {
    const docRef = await addDoc(collection(db, 'songs'), {
      // username: userName,
      // item: productDetails,
      ...data,
      created_by: 'Saquib',
    });
    alert('Data has been Submitted Succesfully');
  };

  const handleLogout = () => {
    dispatch({ type: 'IS_LOGGED_IN', payload: false });
    localStorage.setItem('username', '');
    router.push('/login');
  };

  return (
    <div className="admin-panel-form-wrap">
      <h1>Admin Panel</h1>
      <button onClick={handleLogout}>LOGOUT</button>
      <div className="admin-panel-form">
        <div className="form-group">
          <label>Artist</label>
          <input
            type="text"
            className="form-control"
            name="artist"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>category</label>
          <select name="category" onChange={handleChange}>
            <option>Select category</option>
            {state.category.map((item) => {
              return (
                <>
                  <option id={item.id}>{item.name}</option>
                </>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Song URL</label>
          <input
            type="file"
            className="form-control"
            name="songUrl"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            className="btn btn-secondary"
            value="Submit"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
