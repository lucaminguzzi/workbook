import "./loader.css";

import ReactDOM from "react-dom";
import { ClipLoader } from "react-spinners";

const loaderRoot = document.getElementById("loader-root");

export default function Loader() {
  return ReactDOM.createPortal(
    <div className="loader-container">
      <ClipLoader
        color="#2DD4BF"
        loading={true}
        size={50}
        aria-label="Loading Spinner"
      />
    </div>,
    loaderRoot
  );
}
