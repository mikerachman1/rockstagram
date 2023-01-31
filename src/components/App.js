import React, { useEffect, useState } from 'react';
import Header from './Header';
import Post from './Post';
import '../styles/App.css'
// import initialPosts from '../helpers/initialPosts';
import { db } from '../firebase/FirebaseInit';
import { collection, getDocs } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

import Signup from './Signup';
import Login from './Login';



function App() {  
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

  const signUp = (e) => {
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
