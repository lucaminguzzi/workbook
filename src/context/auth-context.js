import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  isFirstLoad: true,
  onLogout: () => {},
  onLogin: (email, password) => {},
  onFirstLoad: () => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const firstLoad = localStorage.getItem("isFirstLoad");
    let firstLoadChecked = true;

    if (firstLoad) {
      const deltaTime = parseInt(firstLoad) + 6 * 60 * 60 * 1000;
      firstLoadChecked = !(new Date().getTime() < deltaTime);

      if (firstLoadChecked) {
        localStorage.removeItem("isFirstLoad");
      }
    }

    setIsFirstLoad(firstLoadChecked);

    const stillLoggedIn = localStorage.getItem("isLoggedIn");
    let loggedStateChecked = false;

    if (stillLoggedIn) {
      const deltaTime = parseInt(stillLoggedIn) + 60 * 60 * 1000;
      loggedStateChecked = new Date().getTime() < deltaTime;

      if (!loggedStateChecked) {
        localStorage.removeItem("isLoggedIn");
      }
    }

    setIsLoggedIn(loggedStateChecked);
  }, []);

  const firstLoadHandler = () => {
    localStorage.setItem("isFirstLoad", new Date().getTime());
    setIsFirstLoad(false);
  };

  const loginHandler = () => {
    localStorage.setItem("isLoggedIn", new Date().getTime());
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        isFirstLoad: isFirstLoad,
        onLogout: logoutHandler,
        onLogin: loginHandler,
        onFirstLoad: firstLoadHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
