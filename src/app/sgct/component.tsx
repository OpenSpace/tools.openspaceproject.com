"use client"

import React, { useState } from "react";
import { convertFileVersion, convertFileMPCDI } from "./converters";
import { readFile } from "./helper";
import { Link } from "@mui/material";


export function SgctConfigVersion() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<String>();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(null);
    setError("");

    if (!e.target.files) {
      return;
    }
    console.assert(e.target.files.length === 0 || e.target.files.length === 1);

    let file = e.target.files[0]
    try {
      let content = await readFile(file);

      let extension = file.name.substring(file.name.lastIndexOf("."));
      let convertedContent = await convertFileVersion(content, extension);

      let convertedFilename =
        file.name.substring(0, file.name.lastIndexOf(".")) + ".json";
      let convertedFile = new File(
        [convertedContent], convertedFilename, { type: "text/javascript"}
      );

      setFile(convertedFile);
    }
    catch (e: any) {
      console.log(e);
      setError(e.message as string);
    }
  }

  return (
    <div>
      <input id="file" type="file" onChange={handleFileChange} accept="*.xml, *.json" />
      <div>
      {file && (
        <a download={file.name} href={URL.createObjectURL(file)}>Download: {file.name}</a>
      )}
      </div>
      {error && (
        <div>Fatal error while converting: <br /> {error}</div>
      )}
      <div className="note">If the converted file does not load, please let us know by creating an issue on <Link href="https://github.com/OpenSpace/OpenSpace/issues/new?labels=Type%3A+Bug&title=SGCT%20Config%20Converter%20Error">GitHub</Link> or via <Link href="mailto:support@openspaceproject.com">mail</Link></div>
    </div>
  )
}

export function SgctConfigMPCDI() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<String>();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(null);
    setError("");

    if (!e.target.files) {
      return;
    }
    console.assert(e.target.files.length === 0 || e.target.files.length === 1);

    let file = e.target.files[0]
    try {
      let content = await readFile(file);

      let convertedContent = await convertFileMPCDI(content);

      let convertedFilename =
        file.name.substring(0, file.name.lastIndexOf(".")) + ".json";
      let convertedFile = new File(
        [convertedContent], convertedFilename, { type: "text/javascript"}
      );

      setFile(convertedFile);
    }
    catch (e: any) {
      console.log(e);
      setError(e.message as string);
    }
  }

  return (
    <div>
      <input id="file" type="file" onChange={handleFileChange} accept="*.xml, *.json" />
      {file && (
        <a download={file.name} href={URL.createObjectURL(file)}>Download: {file.name}</a>
      )}
      {error && (
        <div>Fatal error while converting: <br /> {error}</div>
      )}
      <div className="note">If the converted file does not load, please let us know by creating an issue on <Link href="https://github.com/OpenSpace/OpenSpace/issues/new?labels=Type%3A+Bug&title=SGCT%20Config%20Converter%20Error">GitHub</Link> or via <Link href="mailto:support@openspaceproject.com">mail</Link></div>
    </div>
  )
}
