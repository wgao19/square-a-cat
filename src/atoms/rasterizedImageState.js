import { selector } from "recoil";
import { fileState } from "./fileState";
import { colorState } from "./colorState";

const outputMaxSize = 1440; // IG uses this dimension

export const rasterizedImageState = selector({
  key: "rasterizedImageState",
  get: async ({ get }) => {
    const color = get(colorState);
    const files = get(fileState);

    const newImages = await Promise.all(
      files.map(async (file) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await img.decode();

        const canvas = document.createElement("canvas");
        let scaleFactor = 1;
        const imgMaxSize = Math.max(img.width, img.height);

        // Only scale down if the image's max dimension exceeds 1440
        if (imgMaxSize > outputMaxSize) {
          scaleFactor = outputMaxSize / imgMaxSize;
        }

        const scaledWidth = img.width * scaleFactor;
        const scaledHeight = img.height * scaleFactor;

        canvas.width = outputMaxSize;
        canvas.height = outputMaxSize;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = color || "transparent";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Now draw the image centered on the canvas with the scaled dimensions
        ctx.drawImage(
          img,
          (outputMaxSize - scaledWidth) / 2, // Adjusted to use the scaled width
          (outputMaxSize - scaledHeight) / 2, // Adjusted to use the scaled height
          scaledWidth,
          scaledHeight
        );

        const url = canvas.toDataURL("image/jpeg");
        return {
          filename: file.name,
          url,
        };
      })
    );

    return newImages;
  },
});
