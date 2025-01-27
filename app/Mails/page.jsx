"use client";
import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import Buttons from "../Butttons.jsx"

function Mails() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("mails").select("*");
      if (error) console.error("Error fetching data:", error);
      else {
        setData(data), console.log(data);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1 style={{ textAlign: "center", margin: "20px 0", fontSize: "20px" }}>
          Mail Data
        </h1>
        <table className="min-w-full bg-white border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead className="bg-sky-900 text-white">
            <tr>
              {[
                "S/N",
                "Date",
                "Mail ID",
                "Sender",
                "Title",
                "Endorse By",
                "Dispatch To",
                "Current Location",
                "Remarks",
                "Description",
                "Image URL",
              ].map((header) => (
                <th
                  key={header}
                  className="py-3 px-4 text-left text-sm font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4 text-sm">{index + 1}</td>
                <td className="py-3 px-4 text-sm">
                  {item.created_at.slice(0, 10)}
                </td>
                <td className="py-3 px-4 text-sm">{item.mail_id}</td>
                <td className="py-3 px-4 text-sm">{item.sender}</td>
                <td className="py-3 px-4 text-sm">{item.title}</td>
                <td className="py-3 px-4 text-sm">{item.endorse_by}</td>
                <td className="py-3 px-4 text-sm">{item.dispatch_to}</td>
                <td className="py-3 px-4 text-sm">{item.current_location}</td>
                <td className="py-3 px-4 text-sm">{item.remarks}</td>
                <td className="py-3 px-4 text-sm">{item.description}</td>
                <td className="py-3 px-4 text-sm">
                  <a
                    href={item.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-900 hover:underline"
                  >
                    View Image
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     <Buttons/>
    </>
  );
}

export default Mails;
