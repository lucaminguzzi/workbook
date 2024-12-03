import { useEffect, useRef, useState } from "react";
import Field from "../../field/Field";
import { IconContext } from "react-icons";
import { IoIosCheckmark } from "react-icons/io";

export default function CityInput({
  cities = [],
  cityName = "",
  onChange = () => {},
  errorMessage = "",
}) {
  const [value, setValue] = useState("");
  const [city, setCity] = useState();
  const [cityPlaceholder, setCityPlaceholder] = useState("");
  const [inputScroll, setInputScroll] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    if (cityName.length > 0) {
      const cityFound = cities.find((it) => it.nome === cityName);
      if (cityFound) {
        setValue(cityFound.nome);
        setCity(cityFound);
      } else {
        setValue("");
        setCity(null);
      }
    }
  }, [cityName, cities]);

  const cityInputPlaceholderHandler = (event) => {
    const possibleCity =
      event.target.value.length > 0
        ? cities.find((it) =>
            it.nome.toUpperCase().startsWith(event.target.value.toUpperCase())
          )
        : null;

    const placeholder = possibleCity
      ? event.target.value +
      possibleCity.nome.substring(
          event.target.value.length,
          possibleCity.nome.length
        )
      : "";

    onChange("");
    setValue(event.target.value);
    setCityPlaceholder(placeholder);
    setCity(possibleCity);
  };

  const setPlaceholderAsValue = (event) => {
    if (
      city &&
      (event.keyCode === 13 || event.target?.classList?.contains("confirm-btn"))
    ) {
      event.preventDefault();

      onChange(city.nome);
      setCityPlaceholder("");
    }
  };

  const inputScrollHandler = () => {
    setInputScroll(inputRef.current.scrollLeft);
  }

  return (
    <Field
      label={{ id: "city", text: "Città" }}
      errorMessage={errorMessage}
      suggestion={{
        text: cityPlaceholder,
        left: inputScroll
      }}
    >
      <input
        type="text"
        id="city"
        name="city"
        value={value}
        onChange={cityInputPlaceholderHandler}
        onKeyDown={setPlaceholderAsValue}
        onScroll={inputScrollHandler}
        ref={inputRef}
      />
      {city && (
        <button
          type="button"
          className="confirm-btn"
          onClick={setPlaceholderAsValue}
          disabled={cityName.length > 0}
        >
          <IconContext.Provider
            value={{
              className: `icon${cityName.length > 0 ? " active" : ""}`,
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
