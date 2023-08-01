import {
    collection,
    query,
    where,
    getDocs,
    doc,
    addDoc,
  } from 'firebase/firestore';
  import db from '@/firebase/firebase';

  interface User {
    email?: string;
    id?: string;
    isAdmin?: boolean;
    name?: string;
    password?: string;
    [key: string]: string | boolean | undefined;
  }


export  const checkEmailExist = async (email: any)=>{
    let userObj
    const q = query(
        collection(db, 'users'),
        where('email', '==', email)
      );

      await getDocs(q).then((querySnapshot) => {
        const user = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        userObj =
          user.find((item: User) => {
            return item.email == email;
          }) || {};

        console.log("inside function",userObj);
       
  })
  return userObj;
};

