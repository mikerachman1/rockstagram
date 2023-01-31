import React, { useEffect, useState } from 'react';
import Header from './Header';
import Post from './Post';
import '../styles/App.css'
// import initialPosts from '../helpers/initialPosts';
import { db } from '../firebase/FirebaseInit';
import { collection, getDocs } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

import { makeStyles } from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import Signup from './Signup';

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles(() => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: "rgba(255,255,255,1)",
    boxShadow: 24,
    padding: "30px 60px",
    borderRadius: "12px",
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedPosts = [];
      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => {
        const postObj = { id: doc.id, data: doc.data() }
        fetchedPosts.push(postObj)
      });
      setPosts(fetchedPosts)
    }
    fetchData();
  }, [posts]);

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
  
  return (
    <div className='app'>
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
      {/* <Modal open={openSignup} onClose={() => setOpenSignup(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <h1>Rockstagram</h1>
          </center>
          <form className='app-form'>
            <input 
              placeholder='Username'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              placeholder='Email'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              placeholder='Password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit' onClick={signUp}>Sign up</button>
          </form>
        </div>
      </Modal>
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <h1>Rockstagram</h1>
          </center>
          <form className='app-form'>
            <input 
              placeholder='Email'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              placeholder='Password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit' onClick={login}>Log in</button>
          </form>
        </div>
      </Modal> */}
      <Header 
        user={user}
        logout={logout}
        setOpenSignup={setOpenSignup}
        setOpenLogin={setOpenLogin}
      />
      
      <button onClick={() => console.log(posts)}>log posts</button>
      <button onClick={() => console.log(user)}>log user</button>

      <div className='timeline'>
        {posts.map((post) => (
          <Post
            key={post.id}
            postId={post.id}
            currentUser={user}
            username={post.data.username}
            caption={post.data.caption}
            imageUrl={post.data.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
