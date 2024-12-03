import "./client-form.css";

import { IconContext } from "react-icons";
import { IoClose } from "react-icons/io5";
import Field from "../field/Field";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clientsActions } from "../../store/clients-slice";
import DistrictInput from "./special-inputs/DistrictInput";
import CityInput from "./special-inputs/CityInput";

export default function ClientForm({
  item = null,
  onClose = () => {},
  onSubmit = () => {},
}) {
  const clientSlice = useSelector((state) => state.clients);
  const [avaiableCities, setAvaiableCities] = useState(clientSlice.comuni);
  const [inputDistrict, setInputDistrict] = useState({ value: "", error: "" });
  const [inputCity, setInputCity] = useState({ value: "", error: "" });
  const [inputSteet, setInputStreet] = useState({ value: "", error: "" });
  const [inputNumber, setInputNumber] = useState({ value: "", error: "" });
  const [inputFloor, setInputFloor] = useState({ value: "", error: "" });
  const [inputDoor, setInputDoor] = useState({ value: "", error: "" });
  const dispatch = useDispatch();

  useEffect(() => {
    if (item) {
      setInputDoor({
        value: item.door ? item.door : "",
        error: "",
      });
      setInputFloor({
        value: item.floor ? item.floor : "",
        error: "",
      });
      setInputNumber({
        value: item.number,
        error: "",
      });
      setInputStreet({
        value: item.street,
        error: "",
      });
      setInputCity({
        value: item.city,
        error: "",
      });
      setInputDistrict({
        value: item.district,
        error: "",
      });
    }
  }, [item]);

  const inputDistrictChangeHandler = (districtCode) => {
    if (districtCode !== inputDistrict.value) {
      setInputDistrict({
        value: districtCode,
        error: "",
      });
    }

    if (districtCode.length > 0) {
      const comuniFiltered = clientSlice.comuni.filter(
        (comune) => comune.provincia === districtCode
      );
      setAvaiableCities(comuniFiltered);

      if (
        inputCity.value.length > 0 &&
        !comuniFiltered.find((comune) => comune.code === inputCity.value)
      ) {
        setInputCity({
          value: "",
          error: "",
        });
      }
    } else {
      setAvaiableCities(clientSlice.comuni);
      setInputCity({
        value: "",
        error: "",
      });
    }
  };

  const inputCityChangeHandler = (cityName) => {
    if (cityName !== inputCity.value) {
      setInputCity({
        value: cityName,
        error: "",
      });
    }

    if (inputDistrict.value.length === 0 && cityName.length > 0) {
      const comune = clientSlice.comuni.find((com) => com.nome === cityName);
      setInputDistrict({
        value: comune.provincia,
        error: "",
      });

      const comuniFiltered = clientSlice.comuni.filter(
        (com) => com.provincia === comune.provincia
      );
      setAvaiableCities(comuniFiltered);
    }
  };

  const inputStreetChangeHandler = (event) => {
    setInputStreet({
      value: event.target.value,
      error: "",
    });
  };

  const inputNumberChangeHandler = (event) => {
    setInputNumber({
      value: event.target.value,
      error: "",
    });
  };

  const inputFloorChangeHandler = (event) => {
    setInputFloor({
      value: event.target.value,
      error: "",
    });
  };

  const inputDoorChangeHandler = (event) => {
    setInputDoor({
      value: event.target.value,
      error: "",
    });
  };

  const submitClientFormHandler = (event) => {
    event.preventDefault();

    let validationError = false;

    if (inputDistrict.value.length === 0) {
      setInputDistrict((prev) => ({
        ...prev,
        error: "Seleziona una provincia",
      }));
      validationError = true;
    }
    if (inputCity.value.length === 0) {
      setInputCity((prev) => ({ ...prev, error: "Seleziona una città" }));
      validationError = true;
    }
    if (inputSteet.value.length === 0) {
      setInputStreet((prev) => ({ ...prev, error: "Inserisci una via" }));
      validationError = true;
    }
    if (inputNumber.value.length === 0) {
      setInputNumber((prev) => ({
        ...prev,
        error: "Inserisci un numero civico",
      }));
      validationError = true;
    }
    if (inputFloor.value.length > 0) {
      try {
        parseInt(inputFloor.value);
      } catch (e) {
        setInputFloor((prev) => ({
          ...prev,
          error: "Inserisci un numero intero",
        }));
        validationError = true;
      }
    }

    if (validationError) {
      return;
    }

    let displayName = inputSteet.value + " " + inputNumber.value + ", ";
    if (inputFloor.value.length > 0) {
      displayName += `piano ${inputFloor.value}, `;
    }
    if (inputDoor.value.length > 0) {
      displayName += `porta ${inputDoor.value}, `;
    }
    displayName += inputCity.value + " (" + inputDistrict.value + ")";

    const client = {
      district: inputDistrict.value,
      city: inputCity.value,
      street: inputSteet.value,
      number: inputNumber.value,
      floor: inputFloor.value,
      door: inputDoor.value,
      displayName: displayName,
    };

    if (!item) {
      client.id = clientSlice.items.length;
      dispatch(clientsActions.addItem(client));
    } else {
      client.id = item.id;
      dispatch(clientsActions.editItem(client));
    }

    onSubmit(client);
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="title">
          {!item ? "Aggiungi " : "Modifica "}
          Cliente
        </h2>
        <button
          type="button"
          className="color teal"
          onClick={onClose}
        >
          <IconContext.Provider value={{ style: { transform: "scale(1.4)" } }}>
            <IoClose />
          </IconContext.Provider>
        </button>
      </div>
      <form id="client-form" onSubmit={submitClientFormHandler}>
        <div className="row">
          <DistrictInput
            distCode={inputDistrict.value}
            onChange={inputDistrictChangeHandler}
            errorMessage={inputDistrict.error}
          />
          <CityInput
            cities={avaiableCities}
            cityName={inputCity.value}
            onChange={inputCityChangeHandler}
            errorMessage={inputCity.error}
          />
        </div>
        <div className="row">
          <Field
            label={{ id: "street", text: "Via" }}
            errorMessage={inputSteet.error}
          >
            <input
              id="street"
              name="street"
              type="text"
              value={inputSteet.value}
              onChange={inputStreetChangeHandler}
            />
          </Field>
          <Field
            label={{ id: "number", text: "Numero civico" }}
            errorMessage={inputNumber.error}
          >
            <input
              id="number"
              name="number"
              type="text"
              value={inputNumber.value}
              onChange={inputNumberChangeHandler}
            />
          </Field>
        </div>
        <div className="row">
          <Field
            label={{ id: "floor", text: "Piano" }}
            errorMessage={inputFloor.error}
          >
            <input
              id="floor"
              name="floor"
              type="number"
              value={inputFloor.value}
              onChange={inputFloorChangeHandler}
            />
          </Field>
          <Field
            label={{ id: "door", text: "Porta" }}
            errorMessage={inputDoor.error}
          >
            <input
              id="door"
              name="door"
              type="text"
              value={inputDoor.value}
              onChange={inputDoorChangeHandler}
            />
          </Field>
        </div>
        <button type="submit" className="text-btn fill teal">
          {!item ? "Procedi" : "Salva modifiche"}
        </button>
      </form>
    </div>
  );
}
