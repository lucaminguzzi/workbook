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