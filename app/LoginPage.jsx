"use client";
import React, { useEffect, useState } from "react";
import { signup } from "./authCompilation";
import { login } from "./authCompilation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
  const [showSigin, setShowSignin] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure the code only runs on the client
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = "/Dashboard"; // User is signed in
        console.log("User is signed in:", user);
      } else {
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  if (!isClient) return null; // Return nothing until it's mounted on the client

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
              setFeedback1(true)

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
                setFeedback1(false)

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
      <form className=" " onSubmit={handleSubmit}>
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
          <div className="flex w-full flex-col md:w-1/2">
            <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
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
                  {feedBack1? "Signing up..": "Sign up"}
                </button>
              </div>
            </div>
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
    const [feedBack, setFeedback] = useState(false);

    const handleSubmit1 = async (e) => {
      setFeedback(true);
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
      }
    };

    return (
      <form onSubmit={handleSubmit1}>
        <div className="flex w-screen flex-wrap text-slate-800">
          <div className="relative hidden h-screen select-none flex-col justify-center bg-sky-900 text-center md:flex md:w-1/2">
            <div className="mx-auto py-16 px-8 text-white xl:w-[40rem]">
              <span className="rounded-full bg-white px-10 py-1 font-medium text-sky-900 text-5xl ">
                Welcome Back
              </span>
              <p className="my-6 text-3xl font-semibold leading-10">
                <span className="mx-auto block w-auto whitespace-nowrap rounded-lg bg-orange-400 py-2 text-white">
                  Electronic Mail Management System
                </span>
              </p>
            </div>
            {/* <img className="mx-auto w-11/12 max-w-lg rounded-lg object-cover" src="/images/SoOmmtD2P6rjV76JvJTc6.png" /> */}
          </div>
          <div className="flex w-full flex-col md:w-1/2">
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
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 rounded-lg bg-sky-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition hover:bg-blue-700 focus:ring-2 md:w-32"
                >
                  {feedBack? "Signing in..": "Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </form>
    );
  };

  const handleClick1 = () => {
    setShowSignin(true);
  };

  const handleClick2 = () => {
    setShowSignin(false);
  };

  return (
    <div className="animate__animated  animate__fadeIn">
      {showSigin ? (
        <>
          <Signin className="animate__animated  animate__fadeInDown" />
          <button
            className=" absolute top-4 right-4 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            onClick={handleClick2}
          >
            Signup
          </button>
        </>
      ) : (
        <>
          <Signup className="animate__animated  animate__fadeIn" />{" "}
          {/* Render ComponentOne */}
          <button
            className=" absolute top-4 right-4 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            onClick={handleClick1}
          >
            Signin
          </button>
        </>
      )}
    </div>
  );
};
export default LoginPage;
