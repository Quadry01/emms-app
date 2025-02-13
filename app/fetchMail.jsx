"use client";
import { useState, useEffect } from 'react';
import { supabase } from './/lib/supabaseClient.js';

function removeDoubleQuotesAndLeaveChars(str) {
  if (typeof str !== 'string') {
    return ''; // Or handle the non-string case appropriately
  }
  return str.replace(/"/g, '');
}

// Custom hook to fetch mails by sender
export const useMailsBySender = (sender) => {
  const [mailData, setMailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [officeID, setOfficeID] = useState(null); // Store officeID in state

  useEffect(() => {
    if (typeof window !== 'undefined') { // Check if window is defined
      const storedOfficeID = sessionStorage.getItem('officeID');
      setOfficeID(storedOfficeID);
    }
  }, []); // Get officeID from sessionStorage once on mount

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (sender && officeID) { // Check if sender and officeID are available
        const filteredOfficeID = removeDoubleQuotesAndLeaveChars(officeID);
        try {
          const { data, error } = await supabase
            .from(filteredOfficeID)
            .select('*')
            .ilike('sender', `%${sender}%`);

          if (error) {
            console.error('Error fetching mails by sender:', error);
            setMailData(null); // Clear data on error
          } else {
            setMailData(data);
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          setMailData(null); // Clear data on error
        }
      } else {
        setMailData(null); // Clear data if sender or officeID is missing
      }
      setLoading(false);
    };

    fetchData(); // Call fetchData immediately, not conditionally
  }, [sender, officeID]); // Now depends on both sender and officeID

  return { mailData, loading };
};