import "./img-input.css";

import { Fragment, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { FaRegImage } from "react-icons/fa6";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import Slideshow from "../../slideshow/Slideshow";

export default function ImageInput({
  images,
  setImages,
  addImages,
  removeImage,
}) {
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const ui = useSelector((state) => state.ui);
  const fileInput = useRef();
  const dispatch = useDispatch();

  const openSlideshowHandler = () => {
    if (images.length > 0 && ui.form.action === "view") {
      setIsSlideshowOpen(true);
    }
  };

  const searchImageHandler = () => {
    if (ui.form.action !== "view") {
      fileInput.current.click();
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDimension = 1920;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height *= maxDimension / width;
            width = maxDimension;
          } else {
            width *= maxDimension / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Compressione fallita"));
            }
          },
          "image/webp",
          0.8
        );
      };

      img.onerror = () => reject(new Error("Errore caricamento immagine"));
      reader.readAsDataURL(file);
    });
  };

  const imgChangeHandler = async (event) => {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }

    dispatch(uiActions.setIsLoading(true));

    const newCompressedImages = [];
    for (const file of files) {
      try {
        const compressedImage = await compressImage(file);
        newCompressedImages.push({
          name: file.name.split(".")[0],
          blob: compressedImage,
          src: URL.createObjectURL(compressedImage),
        });
      } catch (e) {
        console.error(e);
        alert(e.message);
      }
    }

    addImages(newCompressedImages);
    dispatch(uiActions.setIsLoading(false));
  };

  const moveUp = (index) => {
    const tempItems = [...images];
    const [movedItem] = tempItems.splice(index, 1);
    const nextIndex = index - 1;

    if (nextIndex >= 0) {
      tempItems.splice(nextIndex, 0, movedItem);
      setImages(tempItems);
    }
  };

  const moveDown = (index) => {
    const tempItems = [...images];
    const [movedItem] = tempItems.splice(index, 1);
    const nextIndex = index + 1;

    if (nextIndex < images.length) {
      tempItems.splice(nextIndex, 0, movedItem);
      setImages(tempItems);
    }
  };

  const onDragStart = (event, index) => {
    event.dataTransfer.setData("itemIndex", index);
  };

  const onDrop = (event, index) => {
    const draggedItemIndex = event.dataTransfer.getData("itemIndex");
    const tempItems = [...images];
    const [draggedItem] = tempItems.splice(draggedItemIndex, 1);
    tempItems.splice(index, 0, draggedItem);
    setImages(tempItems);
  };

  const onDragOver = (event) => {
    event.preventDefault();

    event.dataTransfer.dropEffect = "move";

    const scrollMargin = 200;
    const scrollSpeed = 5;
    const { clientX } = event;
    const { scrollX, innerWidth } = window;

    if (clientX < scrollMargin) {
      window.scrollTo(scrollX - scrollSpeed, 0);
    } else if (clientX > innerWidth - scrollMargin) {
      window.scrollTo(scrollX + scrollSpeed, 0);
    }
  };

  const imageContainer = (img, index) => (
    <Fragment key={`image-${index}`}>
      {img.src.length === 0 ? (
        <>
          <div className="box-image-input empty" onClick={searchImageHandler}>
            <IconContext.Provider value={{ className: "img-placeholder" }}>
              <FaRegImage />
            </IconContext.Provider>
            {ui.form.action !== "view" && (
              <p className="help-text">Aggiungi immagine</p>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={imgChangeHandler}
            multiple
          />
        </>
      ) : (
        <div
          className="box-image-input"
          onDragStart={(event) => onDragStart(event, index)}
          onDrop={(event) => onDrop(event, index)}
          onDragOver={onDragOver}
          draggable={ui.form.action !== "view"}
          style={{
            pointerEvents: ui.form.action === "view" ? "none" : "unset",
          }}
        >
          <img id={`${index}-img-loaded`} src={img.src} alt={img.name} />
          {ui.form.action !== "view" && (
            <div className="overlay">
              <button
                type="button"
                className="icon-btn color white arrow-btn"
                onClick={() => moveUp(index)}
                disabled={index === 0}
              >
                <IconContext.Provider
                  value={{ style: { transform: "scale(1.4)" } }}
                >
                  <IoChevronBack />
                </IconContext.Provider>
              </button>
              <button
                type="button"
                className="icon-btn border white remove-btn"
                onClick={() => removeImage(index)}
              >
                <IconContext.Provider
                  value={{ style: { transform: "scale(1.4)" } }}
                >
                  <IoClose />
                </IconContext.Provider>
              </button>
              <button
                type="button"
                className="icon-btn color white arrow-btn"
                onClick={() => moveDown(index)}
                disabled={index === images.length - 1}
              >
                <IconContext.Provider
                  value={{ style: { transform: "scale(1.4)" } }}
                >
                  <IoChevronForward />
                </IconContext.Provider>
              </button>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );

  return (
    <>
      {isSlideshowOpen && (
        <Slideshow images={images} onClose={() => setIsSlideshowOpen(false)} />
      )}
      <div
        className={`images${
          images.length > 0 && ui.form.action === "view"
            ? " slideshow-opener"
            : ""
        }`}
        onClick={openSlideshowHandler}
      >
        {images.length === 0 &&
          imageContainer(
            {
              src: "",
              name: "empty",
            },
            0
          )}
        {images.map((image, i) => imageContainer(image, i))}
        {images.length > 0 && ui.form.action !== "view" && (
          <>
            <button
              type="button"
              className="icon-btn border gray"
              onClick={searchImageHandler}
            >
              <IconContext.Provider
                value={{
                  style: { transform: "rotate(45deg) scale(1.1)" },
                }}
              >
                <IoClose />
              </IconContext.Provider>
            </button>
            <input
              ref={fileInput}
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={imgChangeHandler}
              multiple
            />
          </>
        )}
      </div>
    </>
  );
}
