
  "use client"

  import React from 'react'
  
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';





   
   function Mails() {

    const [data, setData] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         const { data, error } = await supabase
            .from('mails')
            .select('*');
         if (error) console.error('Error fetching data:', error);
         else {setData(data), console.log(data)};
      };

      fetchData();
   }, []);
    
     return (
       <>
        <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>Mail Data</h1>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontFamily: "Arial, sans-serif",
        }}
        border="1"
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th style={{ padding: "10px", textAlign: "left" }}>S/N</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Mail ID</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Sender</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Title</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Endorse By</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Dispatch To</th>
            <th style={{ padding: "10px", textAlign: "left" }}>
              Current Location
            </th>
            <th style={{ padding: "10px", textAlign: "left" }}>Remarks</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Description</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Image URL</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
              }}
            >
              <td style={{ padding: "10px" }}>{index + 1}</td>
              <td style={{ padding: "10px" }}>{item.created_at.slice(0, 10)}</td>
              <td style={{ padding: "10px" }}>{item.mail_id}</td>
              <td style={{ padding: "10px" }}>{item.sender}</td>
              <td style={{ padding: "10px" }}>{item.title}</td>
              <td style={{ padding: "10px" }}>{item.endorse_by}</td>
              <td style={{ padding: "10px" }}>{item.dispatch_to}</td>
              <td style={{ padding: "10px" }}>{item.current_location}</td>
              <td style={{ padding: "10px" }}>{item.remarks}</td>
              <td style={{ padding: "10px" }}>{item.description}</td>
              <td style={{ padding: "10px" }}>{item.image_url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
     
{/* <div>
         <h1>Data from Supabase</h1>
         <pre>{JSON.stringify(data, null, 2)}</pre>
      </div> */}

       </>
     )
   }
   
   export default Mails




