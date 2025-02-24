"use client";
import React, { useState, useRef, useEffect } from "react";
import "animate.css";
import { ToastContainer, toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient.js";
import Buttons from "../Butttons.jsx";
import "react-toastify/dist/ReactToastify.css";

// Notification functions
const notifySuccess = () => toast.success("Mail added successfully!");

  const notifyError = (message) => toast.error(`Error: ${message}`);
 

// Hook to fetch and sanitize officeID
const useOfficeID = () => {
  const [officeID, setOfficeID] = useState("");

  useEffect(() => {
    const storedOfficeID = sessionStorage.getItem("officeID");

    console.log(storedOfficeID);
    if (storedOfficeID) {
      setOfficeID(storedOfficeID.replace(/"/g, ""));
    }
  }, []);

  return officeID;
};

const TextInput = ({ label, value, onChange, placeholder, required = false }) => (
  <div className="w-full">
    <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default function AddMailForm() {
  const officeID = useOfficeID(); // Fetch the office ID here
  const [sender, setSender] = useState("");
  const [title, setTitle] = useState("");
  const [endorse, setEndorse] = useState("");
  const [dispatch, setDispatch] = useState("");
  const [currentL, setCurrentL] = useState("");
  const [remarks, setRemarks] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const generateUniqueID = () => {
    return [...Array(8)]
      .map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62)))
      .join("");
  };

  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const uploadFileToDrive = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const rawLog = reader.result.split(",")[1];
        const dataSend = {
          dataReq: { data: rawLog, name: file.name, type: file.type },
          fname: "uploadFilesToGoogleDrive",
        };
        try {
          const response = await fetch(
            "https://script.google.com/macros/s/AKfycby2l6Lw-c4pr3hUh8AZdA3sHjREfKFIZ4xm__8fU9h1ju6ZDecLevIJDDO4wQSROVV4Zg/exec",
            { method: "POST", body: JSON.stringify(dataSend) }
          );
          const result = await response.json();
          resolve(result.url);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Error reading the file"));
    });
  };

  const addRow = async (e) => {
    e.preventDefault();
    if (!officeID) {
      notifyError("Office ID is missing. Please log out and set it correctly.");
      return;
    }

    if (!sender || !title || !endorse || !dispatch || !currentL || !remarks || !description || !file) {
      notifyError("Please fill in all required fields and select a file.");
      return;
    }

    setIsSubmitting(true);
    try {
      const imageUrl = await uploadFileToDrive(file);
      const mailID = generateUniqueID();

      const { error } = await supabase.from(officeID).insert([
        {
          mail_id: mailID,
          sender,
          title,
          endorse_by: endorse,
          dispatch_to: dispatch,
          current_location: currentL,
          remarks,
          description,
          image_url: imageUrl,
        },
      ]);
      if (error) throw error;

 toast.success("Mail added successfully", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      clearForm();


 setTimeout(() => {
      toast.dismiss(); // Dismiss the specific toast after 5 seconds
    }, 5000); // 5000 ms = 5 seconds


    } catch (err) {
      notifyError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setSender("");
    setTitle("");
    setEndorse("");
    setDispatch("");
    setCurrentL("");
    setRemarks("");
    setDescription("");
    setFile(null);
  };

  return (
    <section className="bg-white pt-16">
            <ToastContainer/>

      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-sky-900">Add a new mail</h2>
        <form ><div className=" flex-col gap-6">
  <TextInput label="Sender*" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Sender" required />
  <TextInput className="block w-full" label="Title*" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
  <TextInput label="Endorsed by*" value={endorse} onChange={(e) => setEndorse(e.target.value)} placeholder="Endorsed by" required />
  <TextInput label="Dispatch to*" value={dispatch} onChange={(e) => setDispatch(e.target.value)} placeholder="Dispatch to" required />
  <TextInput label="Current Location*" value={currentL} onChange={(e) => setCurrentL(e.target.value)} placeholder="Current location" required />
  <TextInput label="Remarks*" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Remarks" required />
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-900">Description*</label>
    <textarea
      rows="6"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
      placeholder="Mail description"
      required
    ></textarea>
  </div>
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-900">Attachment*</label>
    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelection} required />
    {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
  </div>
  <button
  type="button"
  disabled={isSubmitting}
  onClick={addRow}
  className="inline-flex items-center px-8 py-2.5 mt-4 text-sm font-medium text-white bg-sky-900 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
>
  {isSubmitting ? "Submitting..." : "Submit"}
</button>


</div>

          <Buttons />
        </form>
      </div>
    </section>
  );
}
