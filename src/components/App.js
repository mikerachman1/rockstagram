import React, { useState } from 'react';
import Header from './Header';
import Post from './Post';
import '../styles/App.css'
import initialPosts from '../helpers/initialPosts';

function App() {
  const [posts, setPosts] = useState(initialPosts);

  return (
    <div className='app'>
      <Header />
      <div className='timeline'>
        {posts.map((post) => (
          <Post
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
