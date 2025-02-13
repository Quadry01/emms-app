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

// Update mail by mail ID
const updateMailById = async (officeID, mailId, updates) => {
  if (!officeID) {
    console.error("Office ID is missing");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(officeID)
      .update(updates)
      .eq("mail_id", mailId);

    if (error) {
      console.error("Error updating mail by ID:", error);
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
