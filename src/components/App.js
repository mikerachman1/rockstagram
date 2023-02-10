/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Header from './Header';
import '../styles/App.css'
import { db } from '../firebase/FirebaseInit';
import { collection, getDocs, setDoc, doc, query, orderBy } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

import Signup from './Signup';
import Login from './Login';
import NewPost from './NewPost';
import Timeline from './Timeline';
import User from './User';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {  
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openNewPost, setOpenNewPost] = useState(false);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const fetchedPosts = [];
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const postObj = { id: doc.id, data: doc.data() };
      fetchedPosts.push(postObj);
    });
    setPosts(fetchedPosts);
    console.log('Posts FETCHED');
  };

  const signUp = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        updateProfile(user, {
          displayName: username,
        })
        setUser(user)
      })
      .catch((err) => alert(err.message));
    setOpenSignup(false);
    setUsername("");
    setEmail("");
    setPassword("");

    await setDoc(doc(db, "users", `${username}`), {
      username: username,
      followers: [],
      description: "",
      avatar:"",  
    });
  };

  const login = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setUser(user)
      })
      .catch((err) => alert(err.message));
    setOpenLogin(false);
    setEmail("");
    setPassword("");
  };

  const logout = () => setUser(null);

  useEffect(() => {
    fetchPosts();
  }, [])
  
  return (
    <div className='app'>
      <BrowserRouter>
        { openSignup &&
          <Signup
            setOpenSignup={setOpenSignup}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            signUp={signUp}
          />
        }
        { openLogin &&
          <Login
            setOpenLogin={setOpenLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            login={login}
          />
        }
        { openNewPost &&
          <NewPost
            setOpenNewPost={setOpenNewPost}
            user={user}
            fetchPosts={fetchPosts}
          />
        }
        <Header 
          user={user}
          logout={logout}
          setOpenSignup={setOpenSignup}
          setOpenLogin={setOpenLogin}
          setOpenNewPost={setOpenNewPost}
        />
        <Routes>
          <Route 
            path="/" 
            element={ <Timeline posts={posts} currentUser={user} /> } 
          />
          <Route 
            path='/user/:username'
            element={ <User currentUser={user} /> }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
