"use client";
import React from "react";
import { logout } from "./authCompilation";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import { supabase } from "../app/lib/supabaseClient.js";
import { useState, useRef } from "react";
import axios from "axios";

const notify1 = () =>
  toast.success("Success ✅ ", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

// MAIL ID GENERATOR
function generateUniqueID() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueID = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueID += characters[randomIndex];
  }
  return uniqueID;
}

// CHECK AUTH
const unsubscribe = onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/";
    console.log("No user is signed in");
  } else {
    console.log("User is signed in:", user);
  }
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

// ADD MAIL

export default function AddMailForm() {
  const [mailID, setMailID] = useState(generateUniqueID());
  const [sender, setSender] = useState("");
  const [title, setTitle] = useState("");
  const [endorse, setEndorse] = useState("");
  const [dispatch, setDispatch] = useState("");
  const [currentL, setCurrentL] = useState("");
  const [remarks, setRemarks] = useState("");
  const [description, setDescription] = useState("");
 
  

  const fileInputRef = useRef(null); // Ref to trigger file input
  const [file, setFile] = useState(null); // Store selected file

  // Trigger file input when the submit button is clicked
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0]; // Get the selected file
    if (selectedFile) {
      setFile(selectedFile); // Update state with the selected file
    }
triggerFileInput()
  };

  // Function to upload the file to Google Drive
  const guardarArchivo = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to base64

      reader.onload = () => {
        const rawLog = reader.result.split(',')[1]; // Extract the base64 part

        const dataSend = {
          dataReq: { data: rawLog, name: file.name, type: file.type },
          fname: "uploadFilesToGoogleDrive",
        };

        fetch('https://script.google.com/macros/s/AKfycbylrfp00ZXiaKoa-FEEnJpW644OxP7tki3GP32tDcvy-oe3vtHjJrMEYuu8vBADIHmhag/exec', {
          method: "POST",
          body: JSON.stringify(dataSend),
        })
          .then(res => res.json())
          .then((response) => {
            console.log("File uploaded:", response);
            resolve(response.url); // Resolve the promise with the file URL
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
            reject(error); // Reject the promise if an error occurs
          });
      };
    });
  };

function notifyAndReload() {
  notify1(); // Call your notification function
  window.location.reload(); // Reload the page
}

  // Function to add a row to the database with the image URL
  const addRow = async (e) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      // First, upload the file to Google Drive and get the file URL
      const imageUrl = await guardarArchivo(file);

      // Then, insert a row into the database with the image URL
      const { data, error } = await supabase.from("mails").insert([
        {
          mail_id: mailID,
          sender: sender,
          title: title,
          endorse_by: endorse,
          dispatch_to: dispatch,
          current_location: currentL,
          remarks: remarks,
          description: description,
          image_url: imageUrl, // Use the URL of the uploaded file
        },
      ]);

      if (error) {
        throw error;
      }

      console.log("Row added successfully:", data);
      notifyAndReload()

    } catch (err) {
      console.error("Error:", err.message);

    }

  };

  

  return (
    <section className="bg-white pt-20">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Add a new mail</h2>
        <form action="#">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Sender*
              </label>
              <input
                type="text"
                name="sender"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Sender"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Title"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="brand"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Endorsed by*
              </label>
              <input
                type="text"
                name="endorse"
                value={endorse}
                onChange={(e) => setEndorse(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder=" Endorsed by"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Dispatch to*
              </label>
              <input
                type="text"
                name="price"
                value={dispatch}
                onChange={(e) => setDispatch(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder=" Dispatch to"
                required
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Current Location*
              </label>

              <input
                type="text"
                name="current-location"
                value={currentL}
                onChange={(e) => setCurrentL(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder=" Dispatch to"
                required
              />
            </div>
            <div>
              <label
                htmlFor="item-weight"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Remarks*
              </label>
              <input
                type="text"
                name="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Remarks"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="8"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your description here"
              ></textarea>
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-900 "
                htmlFor="file_input"
              >
                Attachment
              </label>
              <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelection}
      />

      {/* Submit button to upload file and add row */}
      <button
        onClick={addRow}
        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-sky-900 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
      >
        Submit
      </button>
              
            </div>
          </div>
         

          <button
            onClick={handleLogout}
            className=" absolute top-4 right-4 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Logout
          </button>
           <Link
          href="/Mails"
            className=" absolute top-4 right-52 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Database</Link>
          <Link
           href={"/"}
            className=" absolute top-4 right-28 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Images
          </Link>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}
