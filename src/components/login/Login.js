import { useContext, useState } from "react";
import Field from "../field/Field";
import "./login.css";
import AuthContext from "../../context/auth-context";

export default function Login() {
  const ctx = useContext(AuthContext);
  const [emailInput, setEmailInput] = useState({
    value: "",
    error: "",
  });
  const [passwordInput, setPasswordInput] = useState({
    type: "password",
    value: "",
    error: "",
  });

  const emailValueChangeHandler = (event) => {
    setEmailInput({
      value: event.target.value,
      error: "",
    });
  };

  const passwordValueChangeHandler = (event) => {
    setPasswordInput((prev) => ({
      ...prev,
      value: event.target.value,
      error: "",
    }));
  };

  const passwordTypeChangeHandler = () => {
    setPasswordInput((prev) => ({
      ...prev,
      type: prev.type === "password" ? "text" : "password",
    }));
  };

  const logInHandler = (event) => {
    event.preventDefault();

    let validationError = false;
    if (emailInput.value.length === 0) {
      setEmailInput((prev) => ({
        ...prev,
        error: "Inserire un indirizzo email",
      }));
      validationError = true;
    }
    if (passwordInput.value.length === 0) {
      setPasswordInput((prev) => ({
        ...prev,
        error: "Inserire una password",
      }));
      validationError = true;
    }

    if (validationError) {
      return;
    }

    ctx.onLogin(emailInput.value, passwordInput.value);
  };

  return (
    <div className="log-in-page">
      <div className="log-in-card">
        <div className="logo-container">
          <img src="./images/logo.svg" alt="logo" />
          <h1 className="app-title">Workbook</h1>
        </div>
        <form onSubmit={logInHandler}>
          <Field
            label={{ id: "email", text: "E-mail" }}
            errorMessage={emailInput.error}
          >
            <input
              id="email"
              name="email"
              type="email"
              value={emailInput.value}
              onChange={emailValueChangeHandler}
            />
          </Field>
          <Field
            label={{ id: "password", text: "Password" }}
            errorMessage={passwordInput.error}
            forgotPassword={true}
            onChangeType={passwordTypeChangeHandler}
          >
            <input
              id="password"
              name="password"
              type={passwordInput.type}
              value={passwordInput.value}
              onChange={passwordValueChangeHandler}
            />
          </Field>
          <button type="submit" className="text-btn fill teal">
            Log-in
          </button>
        </form>
      </div>
    </div>
  );
}
