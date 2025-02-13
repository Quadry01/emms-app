"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabaseClient.js";

// Hook to fetch officeID once and store it
const useOfficeID = () => {
  const [officeID, setOfficeID] = useState("");

  useEffect(() => {
    // Get and sanitize the office ID from session storage
    const storedOfficeID = sessionStorage.getItem("officeID");
    if (storedOfficeID) {
      setOfficeID(storedOfficeID.replace(/"/g, ""));
    }
  }, []);

  return [officeID, setOfficeID];
};

// Fetch mail function
const fetchMailById = async (officeID, mailId) => {
  if (!officeID || !mailId) return null;

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

// Custom hook for fetching mail data
export const useMailById = (officeID, mailId) => {
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

  return { mailData, loading };
};

const MailDetails = () => {
  const [mailId, setMailId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = useMemo(() => ["RMO", "Bursar"], []);

  // Use the custom hook to manage officeID state
  const [officeID, setOfficeID] = useOfficeID();
  const { mailData, loading } = useMailById(officeID, mailId);

  const handleInputChange = (e) => setMailId(e.target.value);

  const handleOfficeChange = (event) => {
    setInputValue(event.target.value);
    setIsDropdownOpen(true);
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    sessionStorage.setItem("officeID", option.toLowerCase());
    setOfficeID(option.toLowerCase()); // Update the state
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <form className="max-w-lg mx-auto mt-44">
        <div className="text-center mb-4">
          <h3 className="mb-4 text-3xl text-center font-bold text-sky-900">Select Office</h3>
          <input
            type="text"
            value={inputValue}
            onChange={handleOfficeChange}
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Select an Office"
            onClick={() => setIsDropdownOpen(true)}
          />
          {isDropdownOpen && (
            <ul className="absolute z-10 bg-white text-gray-700 rounded shadow-lg mt-1 w-48">
              {options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        <h2 className="mb-4 text-3xl text-center font-bold text-sky-900">Enter Mail ID</h2>
        <div className="relative w-full">
          <input
            type="search"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search mails..."
            value={mailId}
            onChange={handleInputChange}
            required
          />
        </div>
      </form>

      {loading && mailId && <p>Loading...</p>}

      {mailData && mailData.length > 0 ? (
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
          {mailData.map((item) => (
            <div key={item.id} className="w-full flex-col justify-start items-start lg:gap-10 gap-8 inline-flex">
              <h2 className="text-center text-sky-900 text-3xl font-bold font-manrope leading-normal">
                Mail Tracking
              </h2>
              <div className="w-full flex-col justify-start items-start gap-3 flex">
                <h3 className="text-sky-900 text-2xl font-semibold font-manrope leading-9">
                  Mail ID: <span className="font-medium">{item.mail_id}</span>
                </h3>
                <h4 className="text-sky-900 text-xl font-medium leading-loose">
                  Date created: {item.created_at.slice(0, 10)}
                </h4>
              </div>
              <ol className="flex flex-row space-x-4 w-full">
                {item.current_location?.split(",").map((location, index) => (
                  <li key={index} className="flex items-center space-x-4 text-sky-900 text-base font-semibold">
                    <div className="flex flex-col items-center">
                      <span className="w-6 h-6 bg-sky-900 text-center border-2 border-transparent rounded-full flex justify-center items-center mb-1 text-base font-bold text-white lg:w-10 lg:h-10">
                        {index + 1}
                      </span>
                      <span className="text-center">{location.trim()}</span>
                    </div>
                    {index < item.current_location.split(",").length - 1 && (
                      <div className="w-48 h-1 bg-gray-300 mb-6"></div>
                    )}
                  </li>
                ))}
              </ol>
              <div className="w-full flex-col justify-start items-start gap-8 flex">
                <div className="w-full flex-col gap-1.5">
                  <label className="text-gray-600 text-base font-medium">Sender</label>
                  <input
                    defaultValue={item.sender}
                    type="text"
                    className="w-full focus:outline-none px-5 py-3 h-14 rounded-lg border border-gray-200 text-gray-900 text-lg"
                    readOnly
                  />
                </div>
                <div className="w-full flex-col gap-1.5">
                  <label className="text-gray-600 text-base font-medium">Mail ID</label>
                  <input
                    defaultValue={item.mail_id}
                    type="text"
                    className="w-full focus:outline-none px-5 py-3 h-14 rounded-lg border border-gray-200 text-gray-900 text-lg"
                    readOnly
                  />
                </div>
                <div className="w-full flex-col gap-1.5">
                  <label className="text-gray-600 text-base font-medium">Description</label>
                  <input
                    defaultValue={item.description}
                    type="text"
                    className="w-full focus:outline-none px-5 py-3 h-14 rounded-lg border border-gray-200 text-gray-900 text-lg"
                    readOnly
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        mailId && <p>No mails found for the ID "{mailId}"</p>
      )}
    </div>
  );
};

export default MailDetails;
