import React from 'react'
import { logout } from "./authCompilation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import {useEffect } from "react";
import { auth } from "./firebase";



const notify1 = () =>
  toast.success("Logout Successfully  ", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
 // LOGOUT
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      notify1();
    } catch (error) {
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
    }
  };
function Butttons() {

     // CHECK AUTH
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            window.location.href = "/"; // Redirect only if user is not signed in
          } else {
            console.log("User is signed in:", user);
          }
        });
    
        return () => unsubscribe(); // Cleanup the listener
      }, []); 
  return (
    <div><div className=" absolute top-4 right-5 h-72">
          <button
            onClick={handleLogout}
            className=" relative mx-2 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Logout
          </button>
          <Link
            href="/Mails"
            className=" relative mx-2 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Database
          </Link>
          <Link
            href={"/Query"}
            className=" relative  mx-2 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
           Track mail
          </Link>

          <Link
            href={"/BQuery"}
            className=" relative mx-2 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
           Search
          </Link>
           <Link
            href={"/Update"}
            className=" relative mx-2 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
           Update
          </Link>
          
          </div>
          
          <ToastContainer/></div>
  )
}

export default Butttons