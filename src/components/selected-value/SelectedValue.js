import "./selected-value.css";

import { IconContext } from "react-icons";
import { IoClose } from "react-icons/io5";

export default function SelectedValue({
  className = "material",
  text = "",
  btn = { visible: true, onClick: () => {} },
}) {
  return (
    <div className={`selected-value${className.length > 0 ? ` ${className}` : ""}`}>
      <span>{text}</span>
      {btn.visible && (
        <button type="button" onClick={btn.onClick}>
          <IconContext.Provider value={{}}>
            <IoClose />
          </IconContext.Provider>
        </button>
      )}
    </div>
  );
}
