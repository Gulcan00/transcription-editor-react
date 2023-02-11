import React, { useState } from "react";
import { saveAs } from "file-saver";
import "../styles/SrtEditor.css"

const SrtEditor = () => {
  const [srtContent, setSrtContent] = useState("");
  const [fileName, setFileName] = useState("subtitles");

  const handleOpen = (event) => {
    const file = event.target.files[0];

    if (!file || file.name.split(".").pop() !== "srt") {
      alert("Please select an .srt file");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      setSrtContent(event.target.result);
    };

    reader.readAsText(file);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleEdit = (event) => {
    setSrtContent(event.target.value);
  };

  const handleSaveSrt = () => {
    const file = new Blob([srtContent], { type: "text/plain" });
    saveAs(file, `${fileName}.srt`);
  };

  const handleSaveVtt = () => {
    let vttContent = "WEBVTT\n\n";
    const lines = srtContent.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(/^\d+$/)) {
        vttContent += "\n";
      } else {
        vttContent += `${line}\n`;
      }
    }
    const file = new Blob([vttContent], { type: "text/plain" });
    saveAs(file, `${fileName}.vtt`);
  };

  const handleSaveTxt = () => {
    const text = srtContent;
    const lines = text.split("\n");
    let newText = "";
    for (let i = 0; i < lines.length; i++) {
      if (isNaN(lines[i].substring(0, 2))) {
        newText += lines[i];
    }
    }
    const file = new Blob([newText], { type: "text/plain" });
    saveAs(file, `${fileName}.txt`);
    handleSaveSrt();
    handleSaveVtt();
  };

  return (
    <div className="srt-editor">
      <div className="file-input-container">
        Transcription Editor
        <label className="file-input-label" htmlFor="file-input">
          Choose File
        </label>
        <input
          className="file-input"
          type="file"
          id="file-input"
          onChange={handleOpen}
        />
      </div>
      <div className="textarea">
      <textarea value={srtContent} onChange={handleEdit} />
      </div>
      <div className="file-save">
      <label>Save as</label>
      <input
        className="filename-input"
        type="text"
        placeholder="Enter file name"
        value={fileName}
        onChange={handleFileNameChange}
      />
      <button className="btn" onClick={handleSaveTxt}>Save</button>
      </div>
    </div>
  );
};

export default SrtEditor;
