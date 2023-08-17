// Uploader.js
import React from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { fileState } from "../atoms/fileState";
import { colorState } from "../atoms/colorState";

const DEFAULT_BACKDROP = 'whitesmoke';

const Uploader = () => {
  const setFiles = useSetRecoilState(fileState);
  const color = useRecoilValue(colorState);

  const handleFileChange = (e) => {
    setFiles((oldFiles) => [...oldFiles, ...Array.from(e.target.files)]);
  };
  
  const backgroundColor = color === 'transparent' ? 'transparent' : color;
  const strokeColor = color === 'white' ? DEFAULT_BACKDROP : 'white';


  return (
    <li className="carousel-item file-upload" style={{ backgroundColor }}>
    <label htmlFor="file-upload">
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
      />
     
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="22"
            stroke={strokeColor}
            strokeWidth="2"
            fill="transparent"
          />
          <line
            x1="25"
            y1="15"
            x2="25"
            y2="35"
            stroke={strokeColor}
            strokeWidth="2"
          />
          <line
            x1="15"
            y1="25"
            x2="35"
            y2="25"
            stroke={strokeColor}
            strokeWidth="2"
          />
        </svg>
      
    </label>
    </li>
  );
};

export default Uploader;
