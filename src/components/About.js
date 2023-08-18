import React, { useCallback, useState } from "react";
import { createPortal } from "react-dom";

export const About = () => {
  const [open, setOpen] = useState(false);
  const toggleAboutPanel = useCallback(
    () => setOpen((current) => !current),
    []
  );
  return (
    <>
      <button
        data-umami-event="about toggle"
        className="about-toggle"
        onClick={toggleAboutPanel}
      >
        i
      </button>
      {open &&
        createPortal(
          <div id="modal-root">
            <div className="about">
              <button className="about-toggle" onClick={toggleAboutPanel}>
                <span>+</span>
              </button>
              <h2>About Square a Cat</h2>
              <p>
                Square a Cat (
                <a href="https://www.instagram.com/square_a_cat/">
                  @square_a_cat
                </a>
                ) was created by Wei (
                <a href="https://www.instagram.com/wei_climbs">@wei_climbs</a>)
                for herself and her climbing friends.
              </p>
              <p>
                All photo processing happens within your browser. Your photos
                are <b>never</b> uploaded to any servers.
              </p>
              <p>
                If you've chosen a photo via "Take Photo" action from your
                phone, you will lose it if you remove it before manually saving
                it.
              </p>
              <p>
                When network allows, minimal usage data (such as color chosen,
                number of photos uploaded etc) may be sent for performance and
                product enhancement purposes. No personal data nor cookies will
                be sent.
              </p>
              <small>
                {`©${new Date().getFullYear()} built with ❤ by Wei Gao`}
              </small>
            </div>
          </div>,
          document.getElementById("root")
        )}
    </>
  );
};
