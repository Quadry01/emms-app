"use client";
import React, { useState, useEffect } from "react";
import { useMailById } from "../updateMail";
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

const updateMailById = async (officeID, mailId, updates) => {
  if (!officeID || !mailId || !Object.keys(updates).length) {
    console.error("Error: Missing parameters.");
    return null;
  }

  try {
    const { data: existingData, error: fetchError } = await supabase
      .from(officeID)
      .select("*")
      .eq("mail_id", mailId)
      .single();

    if (fetchError) {
      console.error("Error fetching existing data:", fetchError.message);
      return null;
    }

    const { data, error } = await supabase
      .from(officeID)
      .update(updates)
      .eq("mail_id", mailId)
      .select()
      .single();

    if (error) {
      console.error("Error updating record:", error.message);
      return null;
    }

    console.log("Updated data:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

const MailDetails = () => {
  const officeID = useOfficeID();
  const [mailId, setMailId] = useState("");
  const [updates, setUpdates] = useState({});
  const { mailData, loading } = useMailById(mailId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    if (!mailId || !Object.keys(updates).length) {
      ()=> toast.error("Invalid parameters: mailId or updates are missing.");
      // console.error("Invalid parameters: mailId or updates are missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedData = await updateMailById(officeID, mailId, updates);
      if (updatedData) notifySuccess("Updated Successfully");
    } catch (error) {
      console.error("Error during update operation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
            <ToastContainer />

      <form className="max-w-lg mx-auto mt-80">
        <h2 className="mb-2 text-3xl text-center font-bold text-sky-900">
          Search by Mail ID to Update Mail
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

      {loading && mailId && <p>Loading...</p>}
      {!loading && mailId && (!mailData || mailData.length === 0) && (
        <p>No mail found.</p>
      )}
      {!loading && mailData && mailData.length > 0 && (
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <p className="mb-4 text-xl font-bold text-sky-900">
            Only Current Location can be edited
          </p>
          <form>
            <div className="flex sm:flex-col gap-6">
              {Object.entries(mailData[0]).map(([key, value]) => (
                <div key={key}>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    {key.replace(/_/g, " ")}
                  </label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    name={key}
                    value={updates[key] || value}
                    onChange={(e) =>
                      setUpdates((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    readOnly={[
                      "id",
                      "created_at",
                      "mail_id",
                      "sender",
                      "title",
                      "endorse_by",
                    ].includes(key)}
                  />
                </div>
              ))}
            </div>
          </form>
          <button
            className="inline-flex items-center px-5 py-2.5 mt-4 text-sm font-medium text-white bg-sky-900 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
            onClick={handleUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Mail"}
          </button>
        </div>
      )}

      <Buttons />
    </div>
  );
};

export default MailDetails;
