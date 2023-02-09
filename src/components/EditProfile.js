import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "../firebase/FirebaseInit";

let avatar = null;

const EditProfile = ({ currentUser, setOpenEditProfile }) => {
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChoice = (e) => {
    if(e.target.files[0]) {
      avatar = e.target.files[0];
      console.log(avatar)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `avatars/${currentUser.displayName}`);
    const uploadTask = uploadBytesResumable(storageRef, avatar);

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
          const userRef = doc(db, "users", `${currentUser.displayName}`);
          updateDoc(userRef, {
            avatar: url,
            description: description,
          });
          setProgress(0);
          avatar = null;
          setDescription("");
          setOpenEditProfile(false);
        });
      }
    )
  }
  return (
    <div>
      <div className="overlay" onClick={() => setOpenEditProfile(false)}></div>
      <div className="popup">
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
        <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
      </div>
    </div>
  );
};

export default EditProfile;