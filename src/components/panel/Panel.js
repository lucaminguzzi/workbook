import "./panel.css";

import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return <div className="panel-backdrop" onClick={props.onClick} />;
};

const Overlay = ({ position = "", children }) => {
  return (
    <div className={`panel${position.length > 0 ? ` ${position}` : ""}`}>
      {children}
    </div>
  );
};

const panelRoot = document.getElementById("panel-root");

export default function Panel({ position = "", onClose = () => {}, children }) {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClick={onClose} />, panelRoot)}
      {ReactDOM.createPortal(
        <Overlay position={position}>{children}</Overlay>,
        panelRoot
      )}
    </>
  );
}
