import { useEffect, useRef, useState } from "react";
import "./field.css";
import { IconContext } from "react-icons";
import { TbEye, TbEyeOff } from "react-icons/tb";

export default function Field({
  label = null,
  errorMessage = null,
  forgotPassword = false,
  suggestion = { text: "", left: 0 },
  buttons = [],
  onChangeType = () => {},
  children,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const fieldRef = useRef();

  useEffect(() => {
    fieldRef.current.style.setProperty("--after-left", `-${suggestion.left}px`);
  }, [suggestion.left]);

  const changePasswordInputType = () => {
    setPasswordVisible((prev) => !prev);
    onChangeType();
  };

  return (
    <div className="field">
      {label && (
        <label htmlFor={label.id} className="field-label">
          {label.text}
        </label>
      )}
      <div
        className={`field-wrapper${forgotPassword ? " password-wrapper" : ""}`}
      >
        {forgotPassword && (
          <button type="button" className="forgot-password-btn color gray">
            Password dimenticata
          </button>
        )}
        <div
          className="field-container"
          data-placeholder={suggestion.text}
          ref={fieldRef}
        >
          {children}
          {forgotPassword && (
            <button
              type="button"
              className="color gray"
              onClick={changePasswordInputType}
            >
              <IconContext.Provider
                value={{ style: { transform: "scale(1.2)" } }}
              >
                {passwordVisible ? <TbEyeOff /> : <TbEye />}
              </IconContext.Provider>
            </button>
          )}
        </div>
        {buttons.length > 0 && <div className="field-btns">{buttons}</div>}
      </div>
      {errorMessage?.length > 0 && (
        <span className="field-error">{errorMessage}</span>
      )}
    </div>
  );
}
