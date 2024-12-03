import "./modal.css";

import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return <div className="modal-backdrop" onClick={props.onClick} />;
};

const Overlay = (props) => {
  return <div className="modal">{props.children}</div>;
};

const modalRoot = document.getElementById("modal-root");

export default function Modal(props) {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClick={props.onClose} />, modalRoot)}
      {ReactDOM.createPortal(<Overlay>{props.children}</Overlay>, modalRoot)}
    </>
  );
}
