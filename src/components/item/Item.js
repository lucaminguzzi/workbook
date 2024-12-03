import "./item.css";

import { IconContext } from "react-icons";
import { FaLink, FaRegImage } from "react-icons/fa6";
import { LuTrash2 } from "react-icons/lu";
import { RiEdit2Fill } from "react-icons/ri";
import { TbEye } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { useEffect, useRef, useState } from "react";
import Modal from "../modal/Modal";
import { itemsActions } from "../../store/items-slice";
import Slideshow from "../slideshow/Slideshow";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function Item({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const clientSlice = useSelector((state) => state.clients);
  const itemsSlice = useSelector((state) => state.items);
  const actionsWrapper = useRef();
  const dispatch = useDispatch();

  const [year, month, day] = data.date.split("-");

  const client = clientSlice.items.find((it) => it.id === data.client);
  const dateFormatted = day + "/" + month + "/" + year;

  const openItemHandler = (action) => {
    dispatch(
      uiActions.setForm({
        action: action,
        item: data,
      })
    );
  };

  const viewQuoteHandler = () => {
    const quote = itemsSlice.items.find(
      (it) => it.type === "quote" && it.id === data.quote
    );
    if (quote) {
      dispatch(
        uiActions.setForm({
          action: "view",
          item: quote,
        })
      );
    }
  };

  const viewWorkHandler = () => {
    const work = itemsSlice.items.find(
      (it) => it.type === "work" && it.id === data.work
    );
    if (work) {
      dispatch(
        uiActions.setForm({
          action: "view",
          item: work,
        })
      );
    }
  };

  const deleteItemHandler = () => {
    dispatch(itemsActions.removeItem(data.id));
  };

  const openSlideshowHandler = () => {
    if (data.images.length > 0) {
      setIsSlideshowOpen(true);
    }
  };

  const showActionsHandler = () => {
    if (!isActionsOpen) {
      setIsActionsOpen(true);
    }
  };

  useEffect(() => {
    const hideActionsHandler = (event) => {
      const closestActionsWrapper = event.target.closest(".actions-wrapper");
      if (closestActionsWrapper !== actionsWrapper.current && isActionsOpen) {
        setIsActionsOpen(false);
      }
    };

    window.addEventListener("click", hideActionsHandler);

    return () => window.removeEventListener("click", hideActionsHandler);
  }, [isActionsOpen]);

  return (
    <>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="delete-alert">
            <h3>Elimina {data.type === "work" ? "lavoro" : "preventivo"}</h3>
            <p>
              Procedendo con l'operazione il{" "}
              {data.type === "work" ? "lavoro" : "preventivo"} verrà eliminato
              permanentemente
            </p>
            <div className="btns">
              <button
                type="button"
                className="text-btn border teal"
                onClick={() => setIsModalOpen(false)}
              >
                Annulla
              </button>
              <button
                type="button"
                className="text-btn fill red"
                onClick={deleteItemHandler}
              >
                Procedi
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isSlideshowOpen && (
        <Slideshow
          images={data.images}
          onClose={() => setIsSlideshowOpen(false)}
        />
      )}
      <li className="item">
        <div className="main-info">
          <div
            className={`img-container${
              data.images.length > 0 ? " active" : ""
            }`}
            onClick={openSlideshowHandler}
          >
            {data.images.length > 1 && (
              <div className="size">{data.images.length - 1}+</div>
            )}
            {data.images.length > 0 ? (
              <img src={data.images[0].src} alt={data.images[0].name} />
            ) : (
              <div className="empty">
                <IconContext.Provider
                  value={{ style: { transform: "scale(1.6)" } }}
                >
                  <FaRegImage />
                </IconContext.Provider>
              </div>
            )}
          </div>
          <div className="details">
            <div className="top">
              <div className="first-row">
                <div className="title-container">
                  <h4 className="title">{client.displayName}</h4>
                  <div className="status-info">
                    <div className="status" data-value={`${data.status}`} />
                    {(data.quote || data.work) && (
                      <button
                        type="button"
                        className="color blue"
                        onClick={
                          data.quote ? viewQuoteHandler : viewWorkHandler
                        }
                      >
                        <IconContext.Provider value={{}}>
                          <FaLink />
                        </IconContext.Provider>
                      </button>
                    )}
                  </div>
                </div>
                <div className="actions-wrapper" ref={actionsWrapper}>
                  <button
                    type="button"
                    className="open-actions-btn color gray"
                    onClick={showActionsHandler}
                  >
                    <IconContext.Provider value={{}}>
                      <BsThreeDotsVertical />
                    </IconContext.Provider>
                  </button>
                  <div className={`actions${isActionsOpen ? " visible" : ""}`}>
                    <button
                      type="button"
                      className="icon-btn border gray"
                      onClick={() => openItemHandler("view")}
                    >
                      <IconContext.Provider
                        value={{ style: { transform: "scale(1.4)" } }}
                      >
                        <TbEye />
                      </IconContext.Provider>
                    </button>
                    <button
                      type="button"
                      className="icon-btn border teal"
                      onClick={() => openItemHandler("edit")}
                    >
                      <IconContext.Provider
                        value={{ style: { transform: "scale(1.1)" } }}
                      >
                        <RiEdit2Fill />
                      </IconContext.Provider>
                    </button>
                    <button
                      type="button"
                      className="icon-btn border red"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <IconContext.Provider
                        value={{ style: { transform: "scale(1.1)" } }}
                      >
                        <LuTrash2 />
                      </IconContext.Provider>
                    </button>
                  </div>
                </div>
              </div>
              <ul className="poc">
                <li>
                  <span>{dateFormatted}</span>
                </li>
                {data.poc[0].name.length > 0 && (
                  <li>
                    <span>{data.poc[0].name}</span>
                  </li>
                )}
                {data.poc[0].phone.length > 0 && (
                  <li>
                    <span>{data.poc[0].phone}</span>
                  </li>
                )}
                {data.poc[0].email.length > 0 && (
                  <li>
                    <span>{data.poc[0].email}</span>
                  </li>
                )}
              </ul>
            </div>
            <div className="materials">
              {data.materials.map((material, i) => (
                <span key={`material-${i}`} className="material">
                  {material}
                </span>
              ))}
            </div>
          </div>
        </div>
        {data.notes.length > 0 && <p className="notes">{data.notes}</p>}
      </li>
    </>
  );
}
