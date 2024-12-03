import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Field from "../../field/Field";
import { IconContext } from "react-icons";
import { IoIosCheckmark } from "react-icons/io";

export default function DistrictInput({
  distCode = "",
  onChange = () => {},
  errorMessage = "",
}) {
  const [value, setValue] = useState("");
  const [district, setDistrict] = useState();
  const [distPlaceholder, setDistPlaceholder] = useState("");
  const clientSlice = useSelector((state) => state.clients);
  const [inputScroll, setInputScroll] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    if (distCode.length > 0) {
      const distFound = clientSlice.province.find((it) => it.code === distCode);
      if (distFound) {
        setValue(distFound.nome);
        setDistrict(distFound);
      } else {
        setValue("");
        setDistrict(null);
      }
    }
  }, [distCode, clientSlice.province]);

  const distInputPlaceholderHandler = (event) => {
    const possibleDistrict =
      event.target.value.length > 0
        ? clientSlice.province.find((it) =>
            it.nome.toUpperCase().startsWith(event.target.value.toUpperCase())
          )
        : null;

    const placeholder = possibleDistrict
      ? event.target.value +
        possibleDistrict.nome.substring(
          event.target.value.length,
          possibleDistrict.nome.length
        )
      : "";

    onChange("");
    setValue(event.target.value);
    setDistPlaceholder(placeholder);
    setDistrict(possibleDistrict);
  };

  const setPlaceholderAsValue = (event) => {
    if (
      district &&
      (event.keyCode === 13 || event.target?.classList?.contains("confirm-btn"))
    ) {
      event.preventDefault();

      onChange(district.code);
      setDistPlaceholder("");
    }
  };

  const inputScrollHandler = () => {
    setInputScroll(inputRef.current.scrollLeft);
  }

  return (
    <Field
      label={{ id: "distrinct", text: "Provincia" }}
      errorMessage={errorMessage}
      suggestion={{
        text: distPlaceholder,
        left: inputScroll
      }}
    >
      <input
        type="text"
        id="distrinct"
        name="distrinct"
        value={value}
        onChange={distInputPlaceholderHandler}
        onKeyDown={setPlaceholderAsValue}
        onScroll={inputScrollHandler}
        ref={inputRef}
      />
      {district && (
        <button
          type="button"
          className="confirm-btn"
          onClick={setPlaceholderAsValue}
          disabled={distCode.length > 0}
        >
          <IconContext.Provider
            value={{
              className: `icon${distCode.length > 0 ? " active" : ""}`,
              style: { transform: "scale(2)" },
            }}
          >
            <IoIosCheckmark />
          </IconContext.Provider>
        </button>
      )}
    </Field>
  );
}
