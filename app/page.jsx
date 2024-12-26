"use client"
import Nav from "./Components/NavBar/page";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut} from "firebase/auth";
import SignUp from "./LoginPage"



function Welcome() {
 const [user, setUser] = useState(null);

  return<SignUp/>
}
export default Welcome;