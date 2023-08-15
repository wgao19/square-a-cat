// Gallery.js
import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { fileState } from '../atoms/fileState';
import { colorState } from '../atoms/colorState';

const Gallery = () => {
  const [images, setFiles] = useRecoilState(fileState);
  const color = useRecoilValue(colorState);
  const removeImage = (index) => {
    setFiles((oldFiles) => oldFiles.filter((_, i) => i !== index));
  }

  return (
    <div className="gallery">
      {images.map((image, index) => (
        <div className="gallery-item">
          <div key={index} className="thumbnail">
            <svg viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill={color} />
              <image href={URL.createObjectURL(image)} width="100" height="100" x="0" y="0" preserveAspectRatio="xMidYMid meet"  />
            </svg>
          </div>
          <button onClick={() => removeImage(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
