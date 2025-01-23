import localFont from "next/font/local";
import "./globals.css";



// Metadata object
export const metadata = {
  title: "EMMS",
  description: "Electronic Mail Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
