import "./slideshow.css";

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { IconContext } from "react-icons";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const Backdrop = (props) => {
  return <div className="slideshow-backdrop" onClick={props.onClick} />;
};

const Overlay = ({ images = [], onClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [margins, setMargins] = useState({ left: 0, right: 0 });
  const [padding, setPadding] = useState(84);
  const viewBox = useRef();

  const manualScrollHandler = () => {
    const nodeList = Array.from(viewBox.current.children[0].children);
    const closestIndexNode = nodeList.findIndex(
      (node) => node.offsetLeft > viewBox.current.scrollLeft
    );
    if (closestIndexNode !== activeIndex) {
      setActiveIndex(closestIndexNode);
    }
  };

  const autoSroll = (index) => {
    const { offsetLeft, offsetWidth } =
      viewBox.current.children[0].children[index];
    const halfScreen = window.innerWidth / 2 - padding;
    const spaceRemaining = halfScreen - offsetWidth / 2;

    viewBox.current.scrollTo(offsetLeft - spaceRemaining - padding, 0);
  };

  const nextImage = (event) => {
    event.stopPropagation();
    const nextIndex = images.length > activeIndex + 1 ? activeIndex + 1 : 0;
    setActiveIndex(nextIndex);
    autoSroll(nextIndex);
  };

  const prevImge = (event) => {
    event.stopPropagation();
    const prevIndex =
      activeIndex - 1 >= 0 ? activeIndex - 1 : images.length - 1;
    setActiveIndex(prevIndex);
    autoSroll(prevIndex);
  };

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth < 768 && padding > 60) {
        setPadding(60)
      } else if (padding !== 84) {
        setPadding(84)
      }
    }

    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, [padding]);

  useEffect(() => {
    const firstNode = viewBox.current.children[0].children[0];
    const lastNode = viewBox.current.children[0].children[images.length - 1];

    const marginLeft =
      (window.innerWidth - firstNode.offsetWidth) / 2 - padding;
    const marginRight =
      (window.innerWidth - lastNode.offsetWidth) / 2 - padding;

    setMargins({ left: marginLeft, right: marginRight });
  }, [images.length, padding])

  useEffect(() => {
    const resizeHandler = () => {
      const firstNode = viewBox.current.children[0].children[0];
      const lastNode = viewBox.current.children[0].children[images.length - 1];

      const marginLeft =
        (window.innerWidth - firstNode.offsetWidth) / 2 - padding;
      const marginRight =
        (window.innerWidth - lastNode.offsetWidth) / 2 - padding;

      setMargins({ left: marginLeft, right: marginRight });

      const { offsetLeft, offsetWidth } =
        viewBox.current.children[0].children[activeIndex];
      const halfScreen = window.innerWidth / 2 - padding;
      const spaceRemaining = halfScreen - offsetWidth / 2;

      viewBox.current.scrollTo(offsetLeft - spaceRemaining - padding, 0);
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [activeIndex, images.length, padding]);

  return (
    <div className="slideshow" onClick={onClick}>
      <button type="button" className="icon-btn border teal" onClick={prevImge}>
        <IconContext.Provider value={{ style: { transform: "scale(1.4)" } }}>
          <IoChevronBack />
        </IconContext.Provider>
      </button>
      <div className="view-box" ref={viewBox} onScroll={manualScrollHandler}>
        <div
          className="images"
          style={{
            paddingLeft: `${margins.left}px`,
            paddingRight: `${margins.right}px`,
          }}
        >
          {images.map((image, i) => (
            <div
              key={`image-${i}`}
              className={`img-container${activeIndex === i ? " active" : ""}`}
            >
              <img src={image.src} alt={image.name} />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="icon-btn border teal"
        onClick={nextImage}
      >
        <IconContext.Provider value={{ style: { transform: "scale(1.4)" } }}>
          <IoChevronForward />
        </IconContext.Provider>
      </button>
      <div className="bullets">
        {images.map((image, i) => (
          <div
            key={`bullet-${i}`}
            className={`bullet${activeIndex === i ? " active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

const slideshowRoot = document.getElementById("slideshow-root");

export default function Slideshow({ images, onClose }) {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClick={onClose} />, slideshowRoot)}
      {ReactDOM.createPortal(
        <Overlay images={images} onClick={onClose} />,
        slideshowRoot
      )}
    </>
  );
}
