import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentuser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePercent] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // console.log(userListings);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadErr(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentuser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentuser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {}
  };
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentuser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }
      
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className="pd-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentuser.avatar}
          alt="profile"
          className="rounded-full h-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadErr ? (
            <span className="text-red-700">Error in uploading</span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePer}`}</span>
          ) : filePer === 100 ? (
            <span className="text-green-700">Successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentuser.username}
          placeholder="username"
          onChange={handleChange}
        />
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentuser.email}
          placeholder="email"
          onChange={handleChange}
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 uppercase disabled:opacity-80"
        >
          {loading ? "loading..." : "update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 my-2">{error ? error : ""}</p>
      <p className="text-green-700 my-2">
        {updateSuccess ? "User Update Successfully!" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listing
      </button>
      <p className="text-red-700">
        {" "}
        {showListingsError ? "Error showing listings" : ""}{" "}
      </p>
      {userListings && userListings.length > 0 && (
        <div>
        <h1 className="font-semibold text-2xl mt-7 mb-2 text-center">Your Listings</h1>
          {userListings.map((listing) => {
            return (
              <div
                key={listing._id}
                className="border border-lg p-3 flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    className="h-16 w-16 object-contain"
                    alt="listing cover"
                  />
                </Link>
                <Link className="text-gray-700 font-semibold flex-1 hover:underline truncate">
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button onClick={() => handleListingDelete(listing._id)} className="text-red-700">Delete</button>
                  <button className="text-green-700">Edit</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
