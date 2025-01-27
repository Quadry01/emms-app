"use client";

import { useState } from "react";
import { useMailById } from "../fetchMail";
import Link from "next/link";
import Buttons from "../Butttons"


const MailDetails = () => {
  const [mailId, setMailId] = useState("");
  const { mailData, loading } = useMailById(mailId);

 
 

  const handleInputChange = (e) => {
    
    setMailId(e.target.value);
     

  };



  // Check if mailData is not null and is an array
  if (!mailData || !Array.isArray(mailData)) {
    return (
      <form className="max-w-lg mx-auto mt-44">
                <h2 className="mb-4 text-3xl text-center font-bold text-gray-900">Enter Mail ID</h2>

        <div className="relative w-full">
          <input
            type="search"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg  border-5 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search mails..."
            value={mailId}
            onChange={handleInputChange}
            required
          />
        </div>
        <Buttons/>
      </form>
    ); // Show a loading or fallback message
  }

  return (
    <div>
      <form className="max-w-lg mx-auto mt-44">
                <h2 className="mb-4 text-3xl text-center font-bold text-sky-900">Enter Mail ID</h2>

        <div className="relative w-full">
          <input
            type="search"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg  border-5 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search mails..."
             value={mailId}
             
            onChange={handleInputChange}
            required
          />
          
        </div>
    
    </form>

      {loading && mailId && <p>Loading...</p>}
      
      {mailData.length > 0 ? (
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        {mailData.map((item) => (
          <div
            key={item.id}
            className="w-full flex-col justify-start items-start lg:gap-10 gap-8 inline-flex"
          >
            <h2 className="text-center text-sky-900 text-3xl font-bold font-manrope leading-normal">
              Mail Tracking
            </h2>
            {/* Mail Details */}
            <div className="w-full flex-col justify-start items-start gap-3 flex">
              <h3 className="text-sky-900 text-2xl font-semibold font-manrope leading-9">
                Mail ID: <span className="font-medium">{item.mail_id}</span>
              </h3>
              <h4 className="text-sky-900 text-xl font-medium leading-loose">
                Date created : {item.created_at.slice(0, 10)}
              </h4>
            </div>
         <ol className="flex flex-row space-x-4 w-full">
  {item.current_location
    ? item.current_location.split(",").map((location, index) => (
        <li
          key={index}
          className="flex items-center space-x-4 text-sky-900 text-base font-semibold"
        >
          {/* Step Content */}
          <div className="flex flex-col items-center">
            <span className="w-6 h-6 bg-sky-900 text-center border-2 border-transparent rounded-full flex justify-center items-center mb-1 text-base font-bold text-white lg:w-10 lg:h-10">
              {index + 1}
            </span>
            <span className="text-center str">{location.trim()}</span>
            <span className="text-sky-900 text-base font-normal text-center">
            
            </span>
          </div>
          {/* Divider Line */}
          {index < item.current_location.split(",").length - 1 && (
            <div className="w-48 h-1 bg-gray-300 mb-6"></div>
          )}
        </li>
      ))
    : null}
</ol>
 {/* If no location, don't render anythingitem.current_location */}
           
            <div className="w-full flex-col justify-start items-start gap-8 flex">
              <div className="w-full justify-start items-start lg:gap-8 gap-4 flex sm:flex-row flex-col">
                <div className="w-full flex-col justify-start items-start flex gap-1.5">
                  <label className="text-gray-600 text-base font-medium leading-relaxed">
                    Sender
                  </label>
                  <input
                    defaultValue={item.sender}
                    type="text"
                    className="w-full focus:outline-none px-5 py-3 h-14 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed"
                    placeholder="Engle Express"
                    readOnly
                  />
                </div>
                <div className="w-full flex-col justify-start items-start flex gap-1.5">
                  <label className="text-gray-600 text-base font-medium leading-relaxed">
                    Mail ID
                  </label>
                  <input
                    type="text"
                    defaultValue={item.mail_id}
                    className="w-full focus:outline-none px-5 py-3 h-14 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed"
                    placeholder="#125410215452"
                    readOnly
                  />
                </div>
              </div>
              <div className="w-full flex-col justify-start items-start flex gap-1.5">
                <label className="text-gray-600 text-base font-medium leading-relaxed">
                  Description
                </label>
                <input
                  defaultValue={item.description}
                  readOnly
                  type="text"
                  className="w-full focus:outline-none px-5 py-3 h-14 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] border border-gray-200 text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed"
                  placeholder="https://www.shipmentlink.com/TDB1_CargoTracking.do"
                />
              </div>
            </div>
          </div>
        )
        
        )}
      </div>


) : ( 
        <p >No mails found for the ID "{mailId}"</p>
      )}

      <Buttons/>
    </div>
  );
};

export default MailDetails;
