"use client";
import React, { useEffect, useState } from "react";
import { signup } from "./authCompilation";
import { login } from "./authCompilation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";

const LoginPage = () => {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Allow access to /Query, prevent unnecessary redirects
        if (
          window.location.pathname !== "/Query" &&
          window.location.pathname !== "/Dashboard"
        ) {
          window.location.href = "/Dashboard"; // Redirect signed-in users to /Dashboard
        }
        console.log("User is signed in:", user);
      } else {
        // Allow unauthenticated users to stay on "/" and "/Query"
        if (
          window.location.pathname !== "/" &&
          window.location.pathname !== "/Query"
        ) {
          window.location.href = "/"; // Redirect unauthenticated users to "/"
        }
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isClient) return null; // Prevent SSR issues

  const notify1 = () =>
    toast.success("Success  ", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  // First Component
  const Signup = () => {
    const [feedBack1, setFeedback1] = useState(false);

    const handleSubmit = async (e) => {
      setFeedback1(true);

      e.preventDefault(); // Prevent default form submission
      console.log("Email:", email, "Password:", password);

      try {
        await signup(email, password); // Assuming `signup` is your Firebase function
        toast.success("Sign-up successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "light",
        });
      } catch (error) {
        setFeedback1(false);

        // Handle Firebase errors and display user-friendly messages
        let customMessage;

        switch (error.code) {
          case "auth/email-already-in-use":
            customMessage =
              "This email is already in use. Please use a different one.";
            break;
          case "auth/weak-password":
            customMessage = "Password is too weak. Please use a stronger one.";
            break;
          case "auth/invalid-email":
            customMessage =
              "Invalid email address. Please check and try again.";
            break;
          case "auth/operation-not-allowed":
            customMessage = "Email/password accounts are not enabled.";
            break;
          default:
            customMessage = `Unexpected error: ${error.message}`;
            break;
        }

        // Display the custom message as a toast notification
        toast.error(customMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
      }
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
      <form className=" hidden" onSubmit={handleSubmit}>
        <div className="flex w-screen flex-wrap text-slate-800">
          <div className="relative hidden h-screen select-none flex-col justify-center bg-sky-900 text-center md:flex md:w-1/2">
            <div className="mx-auto py-16 px-8 text-white xl:w-[40rem]">
              <span className="rounded-full bg-white px-10 py-1 font-medium text-sky-900 text-5xl ">
                Welcome
              </span>
              <p className="my-6 text-3xl font-semibold leading-10">
                <span className="mx-auto block w-auto whitespace-nowrap rounded-lg bg-orange-400 py-2 text-white">
                  Electronic Mail Management System
                </span>
              </p>
            </div>
            {/* <img className="mx-auto w-11/12 max-w-lg rounded-lg object-cover" src="/images/SoOmmtD2P6rjV76JvJTc6.png" /> */}
          </div>
          <div className=" relative flex w-full flex-col md:w-1/2">
            <div className=" my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
              <p className="text-center text-3xl font-bold md:text-left md:leading-tight">
                Create an account
              </p>

              <div className="flex flex-col items-stretch pt-3 md:pt-8">
                <div className="flex flex-col pt-4"></div>
                <div className="flex flex-col pt-4">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Email
                  </label>
                  <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                    <input
                      type="email"
                      id="login-email"
                      className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-4 flex flex-col pt-4">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                    <input
                      type="password"
                      id="login-password"
                      className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                      placeholder="Password (minimum 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="block">
                  <input
                    className="mr-2 h-5 w-5 appearance-none rounded border border-gray-300 bg-contain bg-no-repeat align-top text-black shadow checked:bg-blue-600 focus:border-blue-600 focus:shadow"
                    type="checkbox"
                    id="remember-me"
                    defaultChecked
                  />
                  <label className="inline-block" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-6 rounded-lg bg-sky-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition hover:bg-blue-700 focus:ring-2 md:w-32"
                >
                  {feedBack1 ? "Signing up.." : "Sign up"}
                </button>
              </div>
            </div>
            <Link
              className="absolute top-0 left-0 mt-4 ml-4 rounded-lg bg-sky-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition hover:bg-blue-700 focus:ring-2 md:w-32"
              href="/Query"
            >
              Track Mail
            </Link>
          </div>
        </div>
        <ToastContainer />
      </form>
    );
  };

  // Second Component
  const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [officeID, setOfficeID] = useState("");

    const [feedBack, setFeedback] = useState(false);

    const handleSubmit1 = async (e) => {
 e.preventDefault();
   // Check if all required fields are filled
    if (email && password && officeID) {
      // All fields are filled, proceed with submission logic


      setFeedback(true);
      sessionStorage.setItem('officeID', JSON.stringify(officeID));
      console.log("Second component");
      e.preventDefault();

      try {
        await login(email, password);
        notify1();

        // alert("Sign-up successful!");
      } catch (error) {
        setFeedback(false);
        // Handle Firebase errors and display user-friendly messages
        let customMessage;

        switch (error.code) {
          case "auth/email-already-in-use":
            customMessage =
              "This email is already in use. Please use a different one.";
            break;
          case "auth/weak-password":
            customMessage = "Password is too weak. Please use a stronger one.";
            break;
          case "auth/invalid-email":
            customMessage =
              "Invalid email address. Please check and try again.";
            break;
          case "auth/operation-not-allowed":
            customMessage = "Email/password accounts are not enabled.";
            break;
          default:
            customMessage = `Unexpected error: ${error.message}`;
            break;
        }

        // Display the custom message as a toast notification
        toast.error(customMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
      }      // ... your submission code here (e.g., API call) ...
    } else {
      // At least one field is missing
      toast.error("Please fill in all required fields (Email, Password and Office ID).", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
     
    }



    };

    return (
      <form onSubmit={handleSubmit1}>
        <div className="flex w-screen flex-wrap text-slate-800">
          <div className="relative text-wrap hidden h-screen select-none flex-col justify-center bg-sky-900 text-center md:flex md:w-1/2">
            <div className="mx-auto py-16 px-8 text-white xl:w-[40rem] ">
              <span className="rounded-full bg-white px-10 py-1 font-medium text-sky-900 text-5xl ">
                Welcome Back
              </span>
              <p className="my-6 text-3xl font-semibold leading-10">
                <span className="mx-auto block w-auto rounded-lg bg-orange-400 py-2 text-white">
                  Electronic Mail Management System
                </span>
              </p>
            </div>
            {/* <img className="mx-auto w-11/12 max-w-lg rounded-lg object-cover" src="/images/SoOmmtD2P6rjV76JvJTc6.png" /> */}
          </div>
          <div className=" relative flex w-full flex-col md:w-1/2">
            <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
              <p className="text-center text-3xl font-bold md:text-left md:leading-tight">
                Login to your Account
              </p>

              <div className="flex flex-col items-stretch pt-3 md:pt-8">
                <div className="flex flex-col pt-4"></div>
                <div className="flex flex-col pt-4">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Email*
                  </label>
                  <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                    <input
                      type="email"
                      id="login-email"
                      className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-1 flex flex-col pt-4">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password*
                  </label>
                  <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                    <input
                      type="password"
                      id="login-password"
                      className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                 <div className="mb-4 flex flex-col pt-4">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                  Office ID*
                  </label>
                  <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                    <input
                      type="text"
                      id="officeID"
                      className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                      placeholder="Enter Office ID"
                      value={officeID}
                      onChange={(e) => setOfficeID(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 rounded-lg bg-sky-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition hover:bg-blue-700 focus:ring-2 md:w-32"
                >
                  {feedBack ? "Signing in.." : "Sign in"}
                </button>
              </div>
            </div>

            <Link
              className="absolute top-0 left-0 mt-4 ml-4 rounded-lg bg-sky-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition hover:bg-blue-700 focus:ring-2 md:w-32"
              href="/Query"
            >
              Track Mail
            </Link>
          </div>
        </div>
        <ToastContainer />
      </form>
    );
  };


  return (
    <div className="animate__animated  animate__fadeIn">
      
     
          <Signin className="animate__animated  animate__fadeIn" />{" "}
         
      
    
    </div>
  );
};
export default LoginPage;
