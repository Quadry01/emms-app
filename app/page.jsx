"use client"
import React, { useEffect, useState } from "react";
import SignUp from "./LoginPage"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../app/firebase.jsx";




function Welcome() {


  // CHECK AUTH
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          window.location.href = "/Dashboard"; // Redirect only if user is not signed in
        } else {
          console.log("User is signed in:", user);
        }
      });
  
      return () => unsubscribe(); // Cleanup the listener
    }, []); // Add empty dependency array to avoid reinitialization

  return<SignUp/>
}
export default Welcome;