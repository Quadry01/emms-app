"use client";
import React from "react";
import "animate.css";
import { ToastContainer, toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient.js";
import { useState, useRef } from "react";
import Buttons from "../Butttons.jsx"

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

const notify2 = () =>
  toast.error("Form is Incomplete  ", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

// ADD MAIL
export default function AddMailForm() {
  // const [mailID, setMailID] = useState(generateUniqueID());
  const [sender, setSender] = useState("");
  const [title, setTitle] = useState("");
  const [endorse, setEndorse] = useState("");
  const [dispatch, setDispatch] = useState("");
  const [currentL, setCurrentL] = useState("");
  const [remarks, setRemarks] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null); // Ref to trigger file input
  const [file, setFile] = useState(null); // Store selected file
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  // Trigger file input when the submit button is clicked
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

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

  // Handle file selection
  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0]; // Get the selected file
    if (selectedFile) {
      setFile(selectedFile); // Update state with the selected file
    }
    triggerFileInput();
  };

  // Function to upload the file to Google Drive
  const guardarArchivo = (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const rawLog = reader.result.split(",")[1];
          const dataSend = {
            dataReq: { data: rawLog, name: file.name, type: file.type },
            fname: "uploadFilesToGoogleDrive",
          };

          try {
            const response = await fetch(
              "https://script.google.com/macros/s/AKfycbylrfp00ZXiaKoa-FEEnJpW644OxP7tki3GP32tDcvy-oe3vtHjJrMEYuu8vBADIHmhag/exec",
              {
                method: "POST",
                body: JSON.stringify(dataSend),
              }
            );

            const result = await response.json();
            console.log("File uploaded:", result);
            resolve(result.url); // Resolve the promise with the file URL
          } catch (error) {
            console.error("Error uploading file:", error);
            reject(error); // Reject the promise if fetch fails
          }
        };

        reader.onerror = () => {
          reject(new Error("Error reading the file"));
        };
      } catch (error) {
        console.error("Error in guardarArchivo:", error);
        reject(error);
      }
    });
  };

  function notifyAndClearInput() {
    notify1(); // Call your notification function
    setIsSubmitting(false);
    // setMailID(generateUniqueID());
    setSender("");
    setTitle("");
    setEndorse("");
    setDispatch("");
    setCurrentL("");
    setRemarks("");
    setDescription("");
    setFile(null);
  }

  // Function to add a row to the database with the image URL
  const addRow = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!file) {
      notify2();
      console.error("No file selected");
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    try {
      // Upload the file to Google Drive and get the file URL
      const imageUrl = await guardarArchivo(file); // Get the file URL from guardarArchivo
      console.log("Uploaded file URL:", imageUrl);

      const mailID = generateUniqueID(); // Generate a unique mail ID

      // Insert a row into the database with the uploaded file URL
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
          image_url: imageUrl, // Use the uploaded file URL
        },
      ]);

      if (error) {
        throw error; // Handle Supabase errors
      }

      console.log("Row added successfully:", data);
      notifyAndClearInput(); // Clear input and notify the user
    } catch (err) {
      console.error("Error adding row:", err.message);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <section className="bg-white pt-20">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-sky-900">Add a new mail</h2>
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
                Description*
              </label>
              <textarea
                id="description"
                rows="8"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Mail description here"
              ></textarea>
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-900 "
                htmlFor="file_input"
              >
                Attachment*
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
                disabled={isSubmitting} // Disable the button while submitting
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-sky-900 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
<Buttons/>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}
