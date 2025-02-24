"use client";
import React, { useState, useEffect } from "react";
import { useMailsBySender } from "../fetchMail";
import { logout } from "../authCompilation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
// Declare the notify1 function outside of the onClick handler


const ButtonGroup = ({ handleLogout }) => (
  <div className="absolute top-4 right-4 h-72">
 <Link
                  target="#"

          href="/Dashboard"
          className=" relative mx-1 text-white py-2 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          Home
        </Link>

    <button
      onClick={handleLogout}
      className="relative mx-1 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Logout
    </button>
    <Link
      target="#"
      href="/Mails"
      className="relative mx-1 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Database
    </Link>
    <Link
      target="#"
      href={"/Query"}
      className="relative mx-1 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Track Mail
    </Link>
    <Link
      target="#"
      href={"/BQuery"}
      className="relative mx-1 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Search
    </Link>
    <Link
      target="#"
      href={"/Update"}
      className="relative mx-1 text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Update
    </Link>

    <Link
          target="#"
          href={"/Delete"}
          className=" relative mx-1 text-white py-2text-white bg-sky-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          Delete
        </Link>
  </div>
);

const MailDetails = () => {
  const [sender, setSender] = useState("");
  const { mailData, loading } = useMailsBySender(sender);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/";
        // if (window.location.pathname !== "/Query" && window.location.pathname !== "/Dashboard") {
        //   window.location.href = "/"; // Redirect only if not on "/Query" or "/Dashboard"
        // }
        console.log("User is signed in:", user);
      } else {
        // if (window.location.pathname !== "/") {
        //   window.location.href = "/"; // Redirect unauthenticated users to "/"
        // }
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isClient) return null; // Prevent SSR issues

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
                "Maail ID",
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
                  {item.mail_id}
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
