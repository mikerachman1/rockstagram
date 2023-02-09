import React, { useEffect, useState } from "react";
import { db, fb, storage } from "../firebase/FirebaseInit";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


const NewPost = ({ setOpenNewPost, user, fetchPosts }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState();
  const [progress, setProgress] = useState(0);

  const handleFileChoice = (e) => {
    if(e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault()
    const storageRef = ref(storage, `images/${image.name}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed", 
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (err) => {
        console.log(err);
        alert(err.message);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then((url) => {
          // put image in db
          db.collection("posts").add({
            timestamp: fb.firestore.FieldValue.serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: user.displayName,
            likes: [],
          });
          setProgress(0);
          setCaption("");
          setImage(null);
          setOpenNewPost(false);
          console.log('UPLOADED');
          fetchPosts();
        });
      }
    );
  };

  useEffect(() => {
    if (!image) {
        setPreview(undefined);
        return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    const fileBtn = document.querySelector('.custom-file-upload');
    fileBtn.innerHTML = 'Change File';

    return () => URL.revokeObjectURL(objectUrl);
}, [image])



  return (
    <div>
      <div className="overlay" onClick={() => setOpenNewPost(false)}></div>
      <div className="popup">
        <center>
          <h1>Rockstagram</h1>
        </center>
        <form className='app-form'>
          <progress className="progress" value={progress} max='100' />
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose File
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChoice(e)}
            />
          </label>
          {image && 
            <div>
              <p>{image.name}</p>
              <img src={preview} alt="preview" className="preview-image" />
            </div>
          }
          <input
            placeholder='Enter a caption...'
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button type='submit' onClick={(e) => handleUpload(e)}>Post</button>
        </form>
      </div>
    </div>
  );
};

export default NewPost;