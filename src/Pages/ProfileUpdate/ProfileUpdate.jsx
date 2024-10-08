import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assests from '../../assets/assests'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../Config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../Components/lib/upload';
import { AppContext } from '../../Context/AppContext';
const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("")
  const {setUserdata}=useContext(AppContext)
  const profileUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "users", uid)
      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          bio: bio,
          name: name
        })
        toast.success("Profile Updated Successfully!")
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name
        })
      }
      const snap = await getDoc(docRef);
      setUserdata(snap.data());
      navigate('/chat')
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data().name) {
          setName(docSnap.data().name)
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio)
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar)
        }
      } else {
        navigate('/')
      }
    })
  }, [])
  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={image ? URL.createObjectURL(image) : assests.avatar} alt="" />
            upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your Name' required />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Write Profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        <img src={image ? URL.createObjectURL(image) :prevImage? prevImage: assests.logo} alt="logo" className='profile-pic' />
      </div>
    </div>
  )
}
export default ProfileUpdate;