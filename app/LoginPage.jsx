"use client";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signup } from "./authCompilation";
import { login } from "./authCompilation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';



const unsubscribe = onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = '/Dashboard'; // User is signed in
    console.log("User is signed in:", user);
  } else {
    console.log("No user is signed in");
  }
});

// Unsubscribe when no longer needed

// First Component
const Signup = () => {
  const handleSubmit = async (e) => {
    console.log(email, password)

  e.preventDefault();
  try {
    await signup(email, password);

    alert("Sign-up successful!");
  } catch (error) {
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  }
};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-10 md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0  ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Sign up
            </h1>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                
               
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Sign up
            </button>

            <div className="w-full text-white   font-medium rounded-lg text-sm px-5  text-center ">
            </div>
           
          </div>
        </div>
      </div>
    </form>
  );
};

// Second Component

const handleSubmit1 = async (e) => {
  console.log("Second component")
  e.preventDefault();
  try {
    await login(email, password);

    alert("Sign-up successful!");
  } catch (error) {
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  }
};

const Signin = () => {
  const handleSubmit1 = async (e) => {
  console.log("Success")
  e.preventDefault();
  try {
    await login(email, password);

    alert("Sign-up successful!");
  } catch (error) {
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  }
};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form onSubmit={handleSubmit1}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-10 md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0  ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Sign in to your account
            </h1>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300  "
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              {/* <a
                href="#"
                className="text-sm font-medium text-black hover:underline "
              >
                Forgot password?
              </a> */}
            </div>
            <button
              type="submit"
              className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Sign in
            </button>

            <div className="w-full text-white   font-medium rounded-lg text-sm px-5  text-center ">
            </div>
            
          </div>
        </div>
      </div>
    </form>
  );
};


  
  
const LoginPage = () => {
  
  const [showSigin, setShowSignin] = useState(false);

 
  const handleClick1 = () => {
    setShowSignin(true);
  };

   
  const handleClick2 = () => {
    setShowSignin(false);
  };

  return (
    <div>
      {showSigin ? (<>
        <Signin />
          <button className=" absolute top-4 right-4 text-white py-2text-white bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center " onClick={handleClick2}>
           Signup
          </button></>
      ) : (
        <>
          <Signup /> {/* Render ComponentOne */}
          <button className=" absolute top-4 right-4 text-white py-2text-white bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center " onClick={handleClick1}>
           Signin
          </button>
        </>
      )}
    </div>
  );
};
export default LoginPage;

