"use client";
import React, { useState } from "react";
import { useMailById } from "../updateMail";
import Buttons from "../Butttons"



const MailDetails = () => {
  const [mailId, setMailId] = useState("");
  const [updates, setUpdates] = useState({});
  const { mailData, loading, updateMailById } = useMailById(mailId);
      const [isSubmitting, setIsSubmitting] = useState(false);





  const handleInputChange = (e) => {
    setMailId(e.target.value);
  };

  const handleUpdateChange = (e) => {
    setUpdates({ ...updates, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {

    setIsSubmitting(true)
    if (mailId && Object.keys(updates).length > 0) {
      const updatedData = await updateMailById(mailId, updates);
      console.log("Updated data:", updatedData);
      notify1()
          setIsSubmitting(false)

    }
  };

  return (
    <div>
      <form className="max-w-lg mx-auto mt-80">
                    <h2 className="mb-2 text-3xl text-center font-bold text-sky-900">Search by Mail ID to Update Mail</h2>

        <div className="relative w-full">
          <input
            type="search"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg  border-5 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Mail ID"
            value={mailId}
            onChange={handleInputChange}
            required
          />
        </div>
      </form>

      {loading && mailId && <p>Loading...</p>}
      {!loading && mailId && (!mailData || mailData.length === 0) && (
        <p>No mail found.</p>
      )}
      {!loading && mailData && mailData.length > 0 && (
        <div>
          <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          

            <h2 className="mb-2 text-3xl text-center font-bold text-sky-900"> Search by Mail ID to Update Mail</h2>
<p className="mb-4 text-xl font-bold text-gray-900">Only Current Location can be edited</p>
            <form>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="sm:col-span-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      ID
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      type="text"
                      name="id"
                      defaultValue={mailData[0].id}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Created At
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      type="text"
                      name="created_at"
                      defaultValue={mailData[0].created_at}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Mail ID
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      type="text"
                      name="mail_id"
                      defaultValue={mailData[0].mail_id}
                      onChange={handleUpdateChange}
                       readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Sender
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      type="text"
                      name="sender"
                      defaultValue={mailData[0].sender}
                      onChange={handleUpdateChange}
                       readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Title
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      type="text"
                      name="title"
                      defaultValue={mailData[0].title}
                      onChange={handleUpdateChange}
                       readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Endorsed By
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      type="text"
                      name="endorse_by"
                      defaultValue={mailData[0].endorse_by}
                      onChange={handleUpdateChange}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Dispatch To
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      name="dispatch_to"
                      defaultValue={mailData[0].dispatch_to}
                      onChange={handleUpdateChange} 
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Current Location
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      type="text"
                      name="current_location"
                      defaultValue={mailData[0].current_location}
                      onChange={handleUpdateChange}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Remarks
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      type="text"
                      name="remarks"
                      defaultValue={mailData[0].remarks}
                      onChange={handleUpdateChange}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Description
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      type="text"
                      name="description"
                      defaultValue={mailData[0].description}
                      onChange={handleUpdateChange} 
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Image URL
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      type="text"
                      name="image_url"
                      defaultValue={mailData[0].image_url}
                      onChange={handleUpdateChange}  
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </form>

            <button
              className=" inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-sky-900 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
              onClick={handleUpdate}
            >
                          {isSubmitting ? "Updating..." : "Update Mail"}

              
            </button>
          </div>
        </div>
      )}

    <Buttons/>

    </div>
  );
};

export default MailDetails;
