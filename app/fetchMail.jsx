import { useState, useEffect } from 'react';
import { supabase } from './/lib/supabaseClient.js'; 

const fetchMailById = async (mailId) => {
   try {
      const { data, error } = await supabase
         .from('mails')
         .select('*')
         .eq('mail_id', mailId); // Assumes 'id' is the column for mail ID

      if (error) {
         console.error('Error fetching mail by ID:', error);
         return null;
      }

      return data;
   } catch (err) {
      console.error('Unexpected error:', err);
      return null;
   }
};

export const useMailById = (mailId) => {
   const [mailData, setMailData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const data = await fetchMailById(mailId);
         setMailData(data);
         setLoading(false);
      };

      if (mailId) fetchData();
   }, [mailId]);

   return { mailData, loading };
};