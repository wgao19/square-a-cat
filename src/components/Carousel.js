// Carousel.js
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRecoilValueLoadable, useRecoilValue } from "recoil";
import { colorState } from "../atoms/colorState";
import { fileState } from "../atoms/fileState";
import { rasterizedImageState } from "../atoms/rasterizedImageState";
import Uploader from "./Uploader";

/**
 * ms
 */
export const CAROUSEL_SWIPE_TRANSITION_TIME = 100;

/**
 * px
 */
export const CAROUSEL_SWIPE_THRESHOLD = 2;

/**
 * px
 */
export const CAROUSEL_SWIPE_UNCERTAINTY_THRESHOLD = 3;

/**
 * px
 */
const CAROUSEL_MAX_WIDTH = 720;

const Carousel = () => {
  const { state, contents: images } =
    useRecoilValueLoadable(rasterizedImageState);
  const files = useRecoilValue(fileState);

  const [activeIndex, setActiveIndex] = useState(0);

  const carouselSizeRef = useRef();
  const carouselRef = useRef();
  const carouselListRef = useRef();

  const _swipePayload = useRef({
    _swipeStartX: 0,
    _swipeStartY: 0,
    _swipeVx: 0,
    _swipeLastX: 0,
    _swipeStarted: false,
    _swipeMoved: false,
  });

  const _transitionTimeoutId = useRef();

  const handleSwipeStart = (event) => {
    if (images.length <= 0) {
      return;
    }

    event.stopPropagation();

    _swipePayload.current._swipeStartX = event.changedTouches[0].pageX;
    _swipePayload.current._swipeStartY = event.changedTouches[0].pageY;
    _swipePayload.current._swipeVx = 0;
    _swipePayload.current._swipeLastX = _swipePayload.current._swipeStartX;
    _swipePayload.current._swipeStarted = true;
    _swipePayload.current._swipeMoved = false;
  };

  const handleSwipeMove = (event) => {
    if (!_swipePayload.current._swipeStarted) {
      return;
    }
    const currentX = event.changedTouches[0].pageX;
    const currentY = event.changedTouches[0].pageY;
    let dx = currentX - _swipePayload.current._swipeStartX;

    event.stopPropagation();
    if (!_swipePayload.current._swipeMoved) {
      // Determine if scrolling or swiping
      const dy = currentY - _swipePayload.current._swipeStartY;
      _swipePayload.current.isSwiping =
        Math.abs(dx) > Math.abs(dy) &&
        Math.abs(dx) > CAROUSEL_SWIPE_UNCERTAINTY_THRESHOLD;
      if (
        _swipePayload.current.isSwiping ||
        Math.abs(dy) > CAROUSEL_SWIPE_UNCERTAINTY_THRESHOLD
      ) {
        _swipePayload.current._swipeMoved = true;
        _swipePayload.current._swipeStartX = currentX;
        dx = currentX - _swipePayload.current._swipeStartX;
      }
    }

    if (_swipePayload.current.isSwiping) {
      animateCarousel(activeIndex, dx);
      _swipePayload.current._swipeVx =
        _swipePayload.current._swipeVx * 0.5 +
        (currentX - _swipePayload.current._swipeLastX) * 0.5;
      _swipePayload.current._swipeLastX = currentX;
    }
  };

  const getCurrentCarouselTransform = (destination, offset = 0) => {
    if (carouselListRef.current) {
      return `translateX(${-destination * carouselSizeRef.current + offset}px)`;
    }
    return "";
  };

  const animateCarousel = (destination, dx = 0, transitionTime = 0) => {
    const carouselItemList = carouselListRef.current;
    if (carouselItemList) {
      carouselItemList.style.transition = `${transitionTime}ms`;
      const carouselTransform = getCurrentCarouselTransform(destination, dx);
      carouselItemList.style.webkitTransform = carouselTransform;
      carouselItemList.style.transform = carouselTransform;
    }
  };

  const handleSwipeEnd = (event) => {
    if (
      !_swipePayload.current._swipeStarted ||
      !_swipePayload.current.isSwiping
    ) {
      return;
    }

    _swipePayload.current._swipeStarted = false;
    _swipePayload.current._swipeMoved = false;
    _swipePayload.current.isSwiping = false;
    event.stopPropagation();

    let nextActiveIndex = activeIndex;

    // Quick movement
    // Implementation source: https://github.com/oliviertassinari/react-swipeable-views/blob/43450628080e5e9749107684e69841ee322b67e0/packages/react-swipeable-views/src/SwipeableViews.js#L637
    if (Math.abs(_swipePayload.current._swipeVx) > CAROUSEL_SWIPE_THRESHOLD) {
      if (_swipePayload.current._swipeVx > 0) {
        nextActiveIndex = nextActiveIndex - 1;
      } else {
        nextActiveIndex = nextActiveIndex + 1;
      }
    }

    if (nextActiveIndex < 0 || nextActiveIndex >= images.length + 1) {
      nextActiveIndex = activeIndex;
    }

    animateCarousel(nextActiveIndex, 0, CAROUSEL_SWIPE_TRANSITION_TIME);

    if (nextActiveIndex !== activeIndex) {
      _transitionTimeoutId.current = setTimeout(() => {
        handleSlideEnd(nextActiveIndex);
      }, CAROUSEL_SWIPE_TRANSITION_TIME);
    }
  };

  const handleSlideEnd = (_destination) => {
    let destination = _destination;
    _transitionTimeoutId.current = null;
    setActiveIndex(destination);
  };

  const updateWidth = useCallback(
    (ref) => {
      if (ref) {
        ref.style.width = `calc(${
          (files.length || 0) + 1
        } * var(--carousel-item-width))`;
      }
    },
    [files]
  );

  useEffect(() => {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    carouselSizeRef.current = vw;
    document.documentElement.style.setProperty(
      "--carousel-item-width",
      `${Math.min(vw, CAROUSEL_MAX_WIDTH)}px`
    );
  }, []);

  const color = useRecoilValue(colorState);

  return (
    <div
      className="carousel-window"
      ref={carouselRef}
      onTouchStart={handleSwipeStart}
      onTouchEnd={handleSwipeEnd}
      onTouchMove={handleSwipeMove}
    >
      <ul
        className="carousel-list"
        ref={(node) => {
          updateWidth(node);
          carouselListRef.current = node;
        }}
      >
        {state === "loading" && files.map(file => <li className="carousel-item">loading</li>)}
        {state === "hasValue" &&
          images.map((image, index) => (
            <li className="carousel-item" style={{ backgroundColor: color }} key={`carousel item ${index}`}>
              <img alt="downloadable" src={image.url} className="carousel-img" />
            </li>
          ))}
        <Uploader />
      </ul>
    </div>
  );
};

export default Carousel;
