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
    const regex = /(\d*\n)(\d\d):(\d\d:\d\d),(\d{3}) --> (\d\d):(\d\d:\d\d),(\d{3})/gm;
    const subst = `$3.$4 --> $6.$7`;
    vttContent += srtContent.replace(regex, subst);

    const file = new Blob([vttContent], { type: "text/plain" });
    saveAs(file, `${fileName}.vtt`);
  };

  const handleSaveTxt = () => {
    let regex = /\n\n/gm;
    let subst = ``;
    let text = srtContent.replace(regex, subst);

    regex = /(\d*\n)(\d\d):(\d\d:\d\d),(\d{3}) --> (\d\d):(\d\d:\d\d),(\d{3})/gm;
    text = text.replace(regex, subst);
    subst = ` `;
    text = text.replace(/\n/gm, subst);
    
    if (fileName) {
      const file = new Blob([text], { type: "text/plain" });
      saveAs(file, `${fileName}.txt`);
      handleSaveSrt();
      handleSaveVtt();
    } else {
      alert("No file name entered. File not saved.");
    }
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
