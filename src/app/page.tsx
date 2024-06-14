"use client"

import { SgctConfigVersion, SgctConfigMPCDI } from "./sgct/component";
import Image from "next/image";


export default function Page() {
  return (
    <main>
      <h1>OpenSpace Conversion Functions</h1>

      <div className="card">
        <h2>SGCT Configuration Version Converter</h2>
        <p>This converter is used to update SGCT configuration files from older versions to the newest supported version.</p>
        <SgctConfigVersion />
      </div>

      <div className="card">
        <h2>COSM configuration file converter</h2>
        <p>This converter takes a COSM MPCDI configuration file and converts it into a format that can be loaded by SGCT.</p>
        <SgctConfigMPCDI />
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
