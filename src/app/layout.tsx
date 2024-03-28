import React from "react";
import Link from "next/link";
import "./globals.css";


export const metadata = {
  title: "OpenSpace Converter",
  description: "A set of conversion tools for OpenSpace files"
}

export default function RootLayout({ children }: { children: React.ReactNode}) {
  return (
    <React.StrictMode>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </React.StrictMode>
  )
}
