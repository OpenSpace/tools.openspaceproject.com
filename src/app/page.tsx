"use client"

import SgctConfig from "./sgct/component";
import Image from "next/image";


export default function Page() {
  return (
    <main>
      <h1>OpenSpace Conversion Functions</h1>

      <div className="card">
        <h2>SGCT Configuration Converter</h2>
        <p>This converter is used to update SGCT configuration files from older versions to the newest supported version.</p>
        <SgctConfig />
      </div>

      <div className="logo-container">
        <Image
          src="openspace-horiz-logo.png"
          alt="OpenSpace Logo"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </main>
  )
}
