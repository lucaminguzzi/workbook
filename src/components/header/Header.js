import "./header.css";

import { IoClose, IoSearchOutline } from "react-icons/io5";
import Field from "../field/Field";
import { IconContext } from "react-icons";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { filtersActions } from "../../store/filters-slice";
import { FiLogOut } from "react-icons/fi";
import { useContext, useState } from "react";
import Modal from "../modal/Modal";
import AuthContext from "../../context/auth-context";

export default function Header() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const filters = useSelector((state) => state.filters);
  const ctx = useContext(AuthContext);
  const dispatch = useDispatch();

  const openFormHandler = () => {
    dispatch(
      uiActions.setForm({
        action: "add",
        item: null,
      })
    );
  };

  const searchChangeHandler = (event) => {
    dispatch(filtersActions.setSearchString(event.target.value));
  };

  return (
    <header>
      {isLoggingOut && (
        <Modal onClose={() => setIsLoggingOut(false)}>
          <div className="delete-alert">
            <h3>Log-out</h3>
            <p>Effettuando il log-out tornerai alla schermata di accesso</p>
            <div className="btns">
              <button
                type="button"
                className="text-btn border teal"
                onClick={() => setIsLoggingOut(false)}
              >
                Annulla
              </button>
              <button
                type="button"
                className="text-btn fill red"
                onClick={() => ctx.onLogout()}
              >
                Procedi
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="logo-container">
        <img src="./images/logo.svg" alt="logo" />
        <h1 className="app-title">Workbook</h1>
      </div>
      <Field>
        <IconContext.Provider value={{ className: "icon" }}>
          <IoSearchOutline />
        </IconContext.Provider>
        <input
          id="search"
          className="search-input"
          name="search"
          type="text"
          value={filters.searchString}
          onChange={searchChangeHandler}
          placeholder="Cerca..."
        />
      </Field>
      <div className="btns">
        <button
          type="button"
          className="icon-btn fill teal"
          onClick={openFormHandler}
        >
          <IconContext.Provider
            value={{ style: { transform: "rotate(45deg) scale(1.4)" } }}
          >
            <IoClose />
          </IconContext.Provider>
        </button>
        <button
          type="button"
          className="color red"
          onClick={() => setIsLoggingOut(true)}
        >
          <IconContext.Provider
            value={{ style: { width: "24px", height: "auto" } }}
          >
            <FiLogOut />
          </IconContext.Provider>
        </button>
      </div>
    </header>
  );
}
