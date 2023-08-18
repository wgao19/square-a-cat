// ColorPicker.js
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { colorState } from "../atoms/colorState";

const ColorPicker = () => {
  const [appliedBackground, updateBackground] = useRecoilState(colorState);
  const [color, setColor] = useState(() => appliedBackground);

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  return (
    <div className="color-picker">
      <input type="color" value={color} onChange={handleColorChange} />
      <button
        id="apply-background-button"
        data-umami-event="apply background"
        data-umami-event-color={color}
        onClick={() => updateBackground(color)}
      >
        Apply Background
      </button>
    </div>
  );
};

export default ColorPicker;
