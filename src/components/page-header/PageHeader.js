import "./page-header.css";

import { IconContext } from "react-icons";
import { IoClose } from "react-icons/io5";

export default function PageHeader({
  title = "",
  btn = { visible: true, onClick: () => {} },
  children
}) {
  return (
    <div className="page-header">
      <h2 className="title">{title}</h2>
      {children}
      {btn.visible && (
        <button type="button" className="color teal" onClick={btn.onClick}>
          <IconContext.Provider value={{ style: { transform: "scale(1.4)" } }}>
            <IoClose />
          </IconContext.Provider>
        </button>
      )}
    </div>
  );
}
