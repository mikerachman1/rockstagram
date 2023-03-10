/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Header from './Header';
import '../styles/App.css'
import { db } from '../firebase/FirebaseInit';
import { collection, getDocs, getDoc, setDoc, doc, query, orderBy, deleteDoc } from "firebase/firestore"; 
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

  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);

  const fetchCurrentUserAvatar = async () => {
    if (!user) { return };
    const userRef = doc(db, "users", `${user.displayName}`);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.avatar) { setCurrentUserAvatar(userData.avatar) };
    };
  };

  const fetchPosts = async () => {
    const fetchedPosts = [];
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const postObj = { id: doc.id, data: doc.data() };
      fetchedPosts.push(postObj);
    });
    setPosts(fetchedPosts);
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

  const logout = () => {
    setUser(null);
    setCurrentUserAvatar(null);
  };

  const deletePost = async (postId) => {
    //confirm deletePost then remove from db and posts state
    const question = "Are you sure you want to delete this post?";
    // eslint-disable-next-line no-restricted-globals
    const result = confirm(question);
    if (!result) { return };
    await deleteDoc(doc(db, "posts", `${postId}`));
    const filteredPosts = posts.filter((post) => post.id !== postId)
    setPosts(filteredPosts);
  };

  useEffect(() => {
    fetchPosts();
    fetchCurrentUserAvatar();
  }, [user])
  
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

          currentUserAvatar={currentUserAvatar}
        />
        <Routes>
          <Route 
            path="/" 
            element={ <Timeline posts={posts} currentUser={user} deletePost={deletePost} currentUserAvatar={currentUserAvatar}/> } 
          />
          <Route 
            path='/user/:username'
            element={ <User currentUser={user} deletePost={deletePost} currentUserAvatar={currentUserAvatar} setCurrentUserAvatar={setCurrentUserAvatar} /> }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
