import "normalize.css";
import "./styles/app.css";

import Header from "./components/header/Header";
import { useSelector } from "react-redux";
import Toolbar from "./components/toolbar/Toolbar";
import ItemsList from "./components/items-list/ItemsList";
import ItemForm from "./components/item-form/ItemForm";
import Loader from "./components/loader/Loader";
import { useContext, useEffect } from "react";
import AuthContext from "./context/auth-context";
import Login from "./components/login/Login";
import Modal from "./components/modal/Modal";

function App() {
  const ctx = useContext(AuthContext);
  const ui = useSelector((state) => state.ui);

  useEffect(() => {
    const importHoverStateHandler = async () => {
      if (!ui.isTouchDevice) {
        await import("./styles/button-hover.css");
      }
    };
    importHoverStateHandler();
  }, [ui.isTouchDevice]);

  return (
    <>
      {ui.isLoading && <Loader />}
      {ctx.isFirstLoad && (
        <Modal onClose={ctx.onFirstLoad}>
          <div className="alert success" style={{ gap: "12px" }}>
            <h3>Benvenuto in Workbook 👋</h3>
            <p>
              Stai visitando una versione dimostrativa dell'applicazione,
              pensata per esplorare le funzionalità principali. L'accesso è
              completamente libero: puoi utilizzare qualsiasi email e password,
              senza necessità di autenticazione reale. Tieni presente che i dati
              inseriti, come lavori o preventivi, non vengono salvati in modo
              permanente e saranno persi se ricarichi la pagina. Buona
              esplorazione! 😊
            </p>
            <div className="btns">
              <button
                type="button"
                className="text-btn fill teal"
                onClick={ctx.onFirstLoad}
              >
                Procedi
              </button>
            </div>
          </div>
        </Modal>
      )}
      {!ctx.isLoggedIn && <Login />}
      {ctx.isLoggedIn && ui.form.action && <ItemForm />}
      {ctx.isLoggedIn && !ui.form.action && (
        <>
          <div className="top-bar">
            <Header />
            <Toolbar />
          </div>
          <ItemsList />
        </>
      )}
    </>
  );
}

export default App;
