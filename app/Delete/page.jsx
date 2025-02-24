"use client";
import React, { useState, useEffect } from "react";
import Buttons from "../Butttons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../lib/supabaseClient";

const notifySuccess = (message) =>
  toast.success(message, {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

const notifyError = (message) =>
  toast.error(message, {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

const useOfficeID = () => {
  const [officeID, setOfficeID] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOfficeID = sessionStorage.getItem("officeID");
      setOfficeID(storedOfficeID?.replace(/"/g, ""));
    }
  }, []);

  return officeID;
};

const deleteMailById = async (officeID, mailId) => {
  if (!officeID || !mailId) {
    notifyError("Error: Enter Mail ID");
    return;
  }

  const confirmDelete = window.confirm(
    `Are you sure you want to delete mail with ID: ${mailId}? 
    
    This action cannot be undone.`
  );

  if (!confirmDelete) return;

  try {
    const { error } = await supabase.from(officeID).delete().eq("mail_id", mailId);

    if (error) {
      console.error("Error deleting record:", error.message);
      notifyError("Failed to delete mail.");
      return;
    }

    notifySuccess("Mail deleted successfully.");
  } catch (err) {
    console.error("Unexpected error:", err);
    notifyError("An error occurred while deleting the mail.");
  }
};

const MailDeletion = () => {
  const officeID = useOfficeID();
  const [mailId, setMailId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    await deleteMailById(officeID, mailId);
    setIsSubmitting(false);
  };

  return (
    <div>
        <ToastContainer />  
      <form className="max-w-lg mx-auto mt-80">
        <h2 className="mb-2 text-3xl text-center font-bold text-sky-900">
          Enter Mail ID to Delete
        </h2>
        <input
          type="search"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Mail ID"
          value={mailId}
          onChange={(e) => setMailId(e.target.value)}
          required
        />
      </form>

      <div className="flex justify-center mt-4">
        <button
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg focus:ring-4 focus:ring-red-200 hover:bg-red-800"
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Deleting..." : "Delete Mail"}
        </button>
      </div>

      <Buttons />
   </div>
  );
};

export default MailDeletion;
