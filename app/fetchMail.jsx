import { useState, useEffect } from 'react';
import { supabase } from './/lib/supabaseClient.js'; 


function removeDoubleQuotesAndLeaveChars(str) {
  return str.replace(/"/g, '');
}
 const officeID = sessionStorage.getItem('officeID');

  const filteredOfficeID = removeDoubleQuotesAndLeaveChars(officeID)


// const fetchMailById = async (mailId) => {

  

//    try {
//       const { data, error } = await supabase
//          .from(filteredOfficeID)
//          .select('*')
//          .eq('mail_id', mailId); // Assumes 'id' is the column for mail ID

//       if (error) {
//          console.error('Error fetching mail by ID:', error);
//          return null;
//       }

//       return data;
//    } catch (err) {
//       console.error('Unexpected error:', err);
//       return null;
//    }
// };

// export const useMailById = (mailId) => {
//    const [mailData, setMailData] = useState(null);
//    const [loading, setLoading] = useState(true);

//    useEffect(() => {
//       const fetchData = async () => {
//          setLoading(true);
//          const data = await fetchMailById(mailId);
//          setMailData(data);
//          setLoading(false);
//       };

//       if (mailId) fetchData();
//    }, [mailId]);

//    return { mailData, loading };
// };


// FOR BATCH QUERY
// Fetch mails by sender
const fetchMailsBySender = async (sender) => {
   try {
      const { data, error } = await supabase
         .from(filteredOfficeID)
         .select('*')
         .ilike('sender', `%${sender}%`); // Use ilike for case-insensitive search

      if (error) {
         console.error('Error fetching mails by sender:', error);
         return null;
      }

      return data;
   } catch (err) {
      console.error('Unexpected error:', err);
      return null;
   }
};

// Custom hook to fetch mails by sender
export const useMailsBySender = (sender) => {
   const [mailData, setMailData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const data = await fetchMailsBySender(sender);
         setMailData(data);
         setLoading(false);
      };

      if (sender) fetchData();
   }, [sender]); // Only rerun if the sender changes

   return { mailData, loading };
};
