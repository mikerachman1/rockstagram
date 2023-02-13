import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase/FirebaseInit";



const EditProfile = ({ currentUser, setOpenEditProfile, description, setDescription, setCurrentUserAvatar }) => {
  const [progress, setProgress] = useState(0);
  const [newAvatar, setNewAvatar] = useState(null)
  const [preview, setPreview] = useState();

  const handleFileChoice = (e) => {
    if(e.target.files[0]) {
      setNewAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    const userRef = doc(db, "users", `${currentUser.displayName}`);
    e.preventDefault();
    if (!newAvatar) { 
      console.log('update desc')
      await updateDoc(userRef, {
        description: description,
      });
      setOpenEditProfile(false)
      return 
    };

    const storageRef = ref(storage, `avatars/${currentUser.displayName}`);
    const uploadTask = uploadBytesResumable(storageRef, newAvatar);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (err) => {
        alert(err.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then((url) => {
          
          updateDoc(userRef, {
            avatar: url,
            description: description,
          });
          console.log('doc updated')
          setProgress(0);
          setOpenEditProfile(false);
          setCurrentUserAvatar(newAvatar);
        });
      }
    )
  }

  useEffect(() => {
    if (!newAvatar) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(newAvatar);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [newAvatar])

  return (
    <div>
      <div className="overlay" onClick={() => setOpenEditProfile(false)}></div>
      <div className="popup">
        <center>
          <h1>Edit Your Profile</h1>
        </center>
        <form className="app-form">
          <progress className="progress" value={progress} max='100' />
          <label htmlFor="description"></label>
          <input
            type="text"
            id="description"
            placeholder="Profile Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="avatar"></label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChoice(e)}
          />
          { newAvatar && 
            <div>
              <p>{newAvatar.name}</p>
              <img src={preview} alt="preview" className="preview-avatar" />
            </div>
          }
          <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;