

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

// Hook to persist state in localStorage
const usePersistentState = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      return storedValue !== null ? storedValue : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

// Hook to fetch and sanitize officeID
const useOfficeID = () => {
  const [officeID, setOfficeID] = useState("");

  useEffect(() => {
    const storedOfficeID = sessionStorage.getItem("officeID");
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
  const officeID = useOfficeID();
  const [sender, setSender] = usePersistentState("sender", "");
  const [title, setTitle] = usePersistentState("title", "");
  const [endorse, setEndorse] = usePersistentState("endorse", "");
  const [dispatch, setDispatch] = usePersistentState("dispatch", "");
  const [currentL, setCurrentL] = usePersistentState("currentL", "");
  const [remarks, setRemarks] = usePersistentState("remarks", "");
  const [description, setDescription] = usePersistentState("description", "");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const generateUniqueID = () => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    let numbers = "0123456789";

    let id = [...Array(6)]
      .map(() => numbers.charAt(Math.floor(Math.random() * numbers.length)))
      .join("");

    let letter = chars.charAt(Math.floor(Math.random() * chars.length));

    return (id + letter).split("").sort(() => 0.5 - Math.random()).join("");
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
            "https://script.google.com/macros/s/AKfycbwG3lRqQvVGz2W0iR6yO-FNEIjTkOH3ZZYP-baDyhPXeYMX9iHzrIJWDfOuPcs-0h_jig/exec",
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

      toast.success("Mail added successfully!", { autoClose: 5000 });

      clearForm();
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
    localStorage.removeItem("sender");
    localStorage.removeItem("title");
    localStorage.removeItem("endorse");
    localStorage.removeItem("dispatch");
    localStorage.removeItem("currentL");
    localStorage.removeItem("remarks");
    localStorage.removeItem("description");
  };

  return (
    <section className="bg-white pt-16">
      <ToastContainer />
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-sky-900">Add a new mail</h2>
        <form>
          <div className="flex-col gap-6  space-y-2">
            <TextInput label="Sender*" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Sender" required />
            <TextInput label="Title*" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
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
    className="block w-full mb-4 p-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 resize-none"
    placeholder="Mail description"
    required
  ></textarea>
</div>            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelection} required />
            <button type="button" disabled={isSubmitting} onClick={addRow} className=" block
 px-8 py-2.5 mt-4 text-sm font-medium text-white bg-sky-900 rounded-lg">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          <Buttons />
        </form>
      </div>
    </section>
  );
}






