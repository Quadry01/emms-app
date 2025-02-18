import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient.js"; 

// Utility function to remove double quotes
const removeDoubleQuotes = (str) => (typeof str === "string" ? str.replace(/"/g, "") : "");

// Hook to fetch officeID from sessionStorage
const useOfficeID = () => {
  const [officeID, setOfficeID] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOfficeID = sessionStorage.getItem("officeID");
      console.log("Stored Office ID:", storedOfficeID); // Log the retrieved office ID
      setOfficeID(removeDoubleQuotes(storedOfficeID));
    }
  }, []);

  return officeID;
};

// Fetch mail by mail ID
const fetchMailById = async (officeID, mailId) => {
  if (!officeID) {
    console.error("Office ID is missing");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(officeID)
      .select("*")
      .eq("mail_id", mailId);

    if (error) {
      console.error("Error fetching mail by ID:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};



// Custom hook to fetch mail data by ID
export const useMailById = (mailId) => {
  const officeID = useOfficeID();
  const [mailData, setMailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mailId || !officeID) return;

    const fetchData = async () => {
      setLoading(true);
      const data = await fetchMailById(officeID, mailId);
      setMailData(data);
      setLoading(false);
    };

    fetchData();
  }, [mailId, officeID]);

  return { mailData, loading, updateMailById: (updates) => updateMailById(officeID, mailId, updates) };
};

// Component that calls the update function
const YourComponent = () => {
  const [updates, setUpdates] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mailId, setMailId] = useState("06Ny5mj9"); // Example mail ID for testing
  const officeID = useOfficeID();

  const handleUpdateChange = (e) => {
    setUpdates({ ...updates, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);

    if (mailId && Object.keys(updates).length > 0) {
      console.log("Office ID:", officeID);
      console.log("Mail ID:", mailId);
      console.log("Updates:", updates);

      // Check if the mail record exists
      const existingRecord = await supabase
        .from(officeID)
        .select("*")
        .eq("mail_id", mailId);
      
      console.log("Existing Record:", existingRecord);

      // Call the update function
      const updatedData = await updateMailById(officeID, mailId, updates);

      if (updatedData && updatedData.length > 0) {
        console.log("Updated data:", updatedData); // Ensure this logs correctly
        notify1(); // Assuming this is a function to notify the user
      } else {
        console.error("No records were updated.");
      }

      setIsSubmitting(false);
    } else {
      console.error("Invalid parameters: mailId or updates are missing.");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Render your UI here */}
      <button onClick={handleUpdate}>Update Mail</button>
    </div>
  );
};

export default YourComponent;
