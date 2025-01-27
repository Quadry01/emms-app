"use client";
import React, { useState } from "react";
import { useMailsBySender } from "../fetchMail";
import { logout } from "../authCompilation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
// Declare the notify1 function outside of the onClick handler
const notify1 = (mailId) => {
  toast.success(`Viewing mail with ID: ${mailId}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const ButtonGroup = ({ handleLogout }) => (
  <div className="absolute top-4 right-4 h-72">
    <button
      onClick={handleLogout}
      className="relative mx-2 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Logout
    </button>
    <Link
      href="/Mails"
      className="relative mx-2 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Database
    </Link>
    <Link
      href={"/"}
      className="relative mx-2 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Images
    </Link>
    <Link
      href={"/Query"}
      className="relative mx-2 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Search
    </Link>
    <Link
      href={"/Update"}
      className="relative mx-2 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Update
    </Link>
  </div>
);

const MailDetails = () => {
  const [sender, setSender] = useState("");
  const { mailData, loading } = useMailsBySender(sender);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      notify1();
    } catch (error) {
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
    }
  };

  const handleInputChange = (e) => setSender(e.target.value);

  const renderTable = () => (
    <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto mt-8">
      {mailData.length > 0 ? (
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-sky-900 text-white">
            {console.log(mailData)}

            <tr>
              {[
                "S/N",
                "Sender",
                "Title",
                "Description",
                "Created At",
                "Remarks",
                "Image",
                "Action",
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
            {mailData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4 text-sm">{item.id}</td>
                <td className="py-3 px-4 text-sm">{item.sender}</td>
                <td className="py-3 px-4 text-sm">{item.title}</td>
                <td className="py-3 px-4 text-sm">{item.description}</td>
                <td className="py-3 px-4 text-sm">{item.created_at}</td>
                <td className="py-3 px-4 text-sm">{item.remarks}</td>
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
                <td className="py-3 px-4 text-sm">
                  <button
                    onClick={() => notify1(item.mail_id)}
                    className="bg-sky-900 text-white py-2 px-4 rounded hover:bg-sky-600"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No mails found for the sender "{sender}"</p>
      )}
    </div>
  );

  if (!mailData || !Array.isArray(mailData)) {
    return (
      <form className="max-w-lg mx-auto mt-44">
        <h2 className="mb-4 text-3xl text-center font-bold text-sky-900">
          Enter Sender Name
        </h2>
        <div className="relative w-full">
          <input
            type="search"
            className="block p-2.5 w-full z-20 text-sm text-sky-900 bg-gray-50 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by sender..."
            value={sender}
            onChange={handleInputChange}
            required
          />
        </div>
        <ButtonGroup handleLogout={handleLogout} />
      </form>
    );
  }

  return (
    <div>
      <form className="max-w-lg mx-auto mt-44">
          <h2 className="mb-4 text-3xl text-center font-bold text-sky-900">
          Enter Sender Name
        </h2>
        <div className="relative w-full">
          <input
            type="search"
            className="block p-2.5 w-full z-20 text-sm text-sky-900 bg-gray-50 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by sender..."
            value={sender}
            onChange={handleInputChange}
            required
          />
        </div>
      </form>

      {loading && sender && <p>Loading...</p>}

      {renderTable()}
      <ButtonGroup handleLogout={handleLogout} />
      <ToastContainer />
    </div>
  );
};

export default MailDetails;
