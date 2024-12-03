import "./item-form.css";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import Field from "../field/Field";
import ClientInput from "./special-inputs/ClientInput";
import PocRow from "./special-inputs/PocRow";
import MaterialInput from "./special-inputs/MaterialInput";
import { itemsActions } from "../../store/items-slice";
import ImageInput from "./img-input/ImageInput";
import Tabs from "../tabs/Tabs";
import PageHeader from "../page-header/PageHeader";

export default function ItemForm() {
  const ui = useSelector((state) => state.ui);
  const itemsSlice = useSelector((state) => state.items);
  const [type, setType] = useState();
  const [isTransforming, setIsTransforming] = useState();
  const dispatch = useDispatch();

  const states =
    type === "work" ? itemsSlice.workStates : itemsSlice.quoteStates;
  const [stateValue, setStateValue] = useState(states[0].value);

  useEffect(() => {
    if (ui.form.item) {
      setType(ui.form.item.type);
    } else if (ui.page === "works") {
      setType("work");
    } else if (ui.page === "quotes") {
      setType("quote");
    }
  }, [ui.form.item, ui.page]);

  const closeFormHandler = () => {
    dispatch(
      uiActions.setForm({
        action: null,
        item: null,
      })
    );
  };

  const quoteToWorkHandler = () => {
    window.scrollTo(0, 0);
    setIsTransforming(true);
    setType("work");
    setDateInput({
      value: "",
      error: "",
    });
    setStateValue(states[0].value);
  };

  const workToQuoteHandler = () => {
    window.scrollTo(0, 0);
    setIsTransforming(false);
    setType("quote");
    setDateInput({
      value: ui.form.item.date,
      error: "",
    });
    setStateValue(ui.form.item.status);
  };

  const [images, setImages] = useState([]);
  const addImagesHandler = (uploadedImages) => {
    setImages((prev) => [...prev, ...uploadedImages]);
  };
  const removeImageHandler = (index) => {
    if (images.length > index) {
      setImages((prev) => {
        const list = [...prev];
        list.splice(index, 1);
        return list;
      });
    }
  };

  const [clientInput, setClientinput] = useState({
    id: null,
    error: "",
  });

  const clientInputHandler = (clientId) => {
    setClientinput({
      id: clientId,
      error: "",
    });
  };

  const [dateInput, setDateInput] = useState({
    value: "",
    error: "",
  });
  const dateInputHandler = (event) => {
    setDateInput({
      value: event.target.value,
      error: "",
    });
  };

  const changeTypeHandler = (newType) => {
    setType(newType);
    setStateValue(states[0].value);
  };

  const stateValueHandler = (event) => {
    setStateValue(event.target.value);
  };

  const emptyPocRow = {
    name: {
      value: "",
      error: "",
    },
    phone: {
      value: "",
      error: "",
    },
    email: {
      value: "",
      error: "",
    },
  };
  const [pocList, setPocList] = useState([emptyPocRow]);

  const addPocRow = () => {
    setPocList((prev) => [...prev, emptyPocRow]);
  };
  const removePocRow = (index) => {
    setPocList((prev) => {
      if (prev.length > index) {
        const newList = [...prev];
        newList.splice(index, 1);
        return newList;
      }
    });
  };

  const pocInputChangeHandler = (event, index) => {
    const poc = { ...pocList[index] };
    const attribute = event.target.name;

    poc[attribute].value = event.target.value;
    poc[attribute].error = "";

    setPocList((prev) => {
      const newList = [...prev];
      newList[index] = poc;
      return newList;
    });
  };

  const [materials, setMaterials] = useState([]);
  const [materialError, setMaterialError] = useState("");
  const addMaterial = (material) => {
    if (!materials.includes(material)) {
      setMaterials((prev) => [...prev, material]);
    }
  };
  const removeMaterial = (index) => {
    if (materials.length > index) {
      setMaterials((prev) => {
        const list = [...prev];
        list.splice(index, 1);
        return list;
      });
    }
  };

  const notes = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!ui.form.item) {
      return;
    }

    if (ui.form.item.images.length > 0) {
      setImages(ui.form.item.images);
    }
    if (ui.form.item.client !== null) {
      setClientinput({
        id: ui.form.item.client,
        error: "",
      });
    }
    setDateInput({
      value: ui.form.item.date,
      error: "",
    });
    setStateValue(ui.form.item.status);
    setPocList(
      ui.form.item.poc.map((poc) => ({
        name: { value: poc.name, error: "" },
        phone: { value: poc.phone, error: "" },
        email: { value: poc.email, error: "" },
      }))
    );
    setMaterials(ui.form.item.materials);
    notes.current.value = ui.form.item.notes;
  }, [ui.form.item]);

  const notSubmitOnEnter = (event) => {
    if (event.keyCode === 13 && event.target.type !== "textarea") {
      event.preventDefault();
    }
  };

  const submitFormHandler = (event) => {
    event.preventDefault();

    if (event.target.id !== "item-form" || event.keyCode === 13) {
      return;
    }

    let validationError = false;
    if (clientInput.id === null) {
      setClientinput((prev) => ({
        ...prev,
        error: "Inserire un cliente",
      }));
      validationError = true;
    }
    if (dateInput.value.length === 0) {
      setDateInput((prev) => ({
        ...prev,
        error: "Inserire una data",
      }));
      validationError = true;
    }
    /*
    const pocErrorRows = [];
    pocList.forEach((row, i) => {
      if (row.name.value.length === 0) {
        pocErrorRows.push({
          index: i,
          field: "name",
          message: "Inserire un nome e un cognome",
        });
      }
      if (row.phone.value.length === 0 && row.email.value.length === 0) {
        pocErrorRows.push({
          index: i,
          field: "phone",
          message: "Inserire un numero di telefono o un indirizzo e-mail",
        });
        pocErrorRows.push({
          index: i,
          field: "email",
          message: "Inserire un numero di telefono o un indirizzo e-mail",
        });
      }
    });
    if (pocErrorRows.length > 0) {
      setPocList((prev) => {
        const list = [...prev];
        pocErrorRows.forEach((error) => {
          list[error.index][error.field].error = error.message;
        });
        return list;
      });
      validationError = true;
    }

    if (materials.length === 0) {
      setMaterialError("Inserisci almeno un materiale");
      validationError = true;
    }
    */

    if (validationError) {
      return;
    }

    const newItem = {
      type: type,
      // Quando implementerai il vero upload ti servirà anche il blob (non serve fare il `.map()`)
      images: images.map((img) => ({ src: img.src, name: img.name })),
      client: clientInput.id,
      date: dateInput.value,
      status: stateValue,
      poc: pocList.map((row) => ({
        name: row.name.value.trim(),
        phone: row.phone.value.trim(),
        email: row.email.value.trim(),
      })),
      materials: materials.map((it) => it.trim()),
      notes: notes.current.value.trim(),
    };

    if (ui.form.item?.quote) {
      newItem.quote = ui.form.item.quote;
    }
    if (ui.form.item?.work) {
      newItem.work = ui.form.item.work;
    }

    if (isTransforming) {
      newItem.quote = ui.form.item.id;
    }

    if (!ui.form.item || isTransforming) {
      const now = new Date();
      newItem.id = now.getTime();
    } else {
      newItem.id = ui.form.item.id;
    }

    if (ui.form.item && !isTransforming) {
      dispatch(itemsActions.editItem(newItem));
    } else {
      dispatch(itemsActions.addItem(newItem));
      if (isTransforming) {
        const quoteItem = { ...ui.form.item, status: 1, work: newItem.id };
        dispatch(itemsActions.editItem(quoteItem));
      }
    }

    dispatch(uiActions.setPage(`${type}s`));
    closeFormHandler();
  };

  const viewWorkHandler = () => {
    const work = itemsSlice.items.find(
      (it) => it.type === "work" && it.id === ui.form.item.work
    );
    if (work) {
      dispatch(
        uiActions.setForm({
          action: "view",
          item: work,
        })
      );
    }
  };

  const viewQuoteHandler = () => {
    const quote = itemsSlice.items.find(
      (it) => it.type === "quote" && it.id === ui.form.item.quote
    );
    if (quote) {
      dispatch(
        uiActions.setForm({
          action: "view",
          item: quote,
        })
      );
    }
  };

  return (
    <div className="form-page">
      <PageHeader
        title={
          ui.form.action === "add" || isTransforming
            ? `Aggiungi ${isTransforming ? "lavoro" : ""}`
            : ui.form.action === "edit"
            ? `Modifica ${type === "work" ? "lavoro" : "preventivo"}`
            : `Visualizza ${type === "work" ? "lavoro" : "preventivo"}`
        }
        btn={{ visible: !isTransforming, onClick: closeFormHandler }}
      >
        {!ui.form.item && (
          <Tabs
            tabs={[
              {
                title: "Lavoro",
                active: type === "work",
                onClick: () => changeTypeHandler("work"),
              },
              {
                title: "Preventivo",
                active: type === "quote",
                onClick: () => changeTypeHandler("quote"),
              },
            ]}
          />
        )}
      </PageHeader>
      <form
        id="item-form"
        onSubmit={submitFormHandler}
        onKeyDown={notSubmitOnEnter}
      >
        <div className="row">
          <ImageInput
            images={images}
            setImages={setImages}
            addImages={addImagesHandler}
            removeImage={removeImageHandler}
          />
        </div>
        <div className="row client-row">
          <ClientInput
            id={clientInput.id}
            onChange={clientInputHandler}
            errorMessage={clientInput.error}
          />
        </div>
        <div className="row">
          <Field
            label={{ id: "date", text: "Data " }}
            errorMessage={dateInput.error}
          >
            <input
              type="date"
              id="date"
              name="date"
              value={dateInput.value}
              onChange={dateInputHandler}
              readOnly={ui.form.action === "view"}
            />
          </Field>
          <Field label={{ id: "status", text: "Stato" }} errorMessage="">
            <select
              id="status"
              name="status"
              value={stateValue}
              onChange={stateValueHandler}
              disabled={ui.form.action === "view"}
            >
              {states.map((status) => (
                <option key={status.label} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="row">
          {pocList.map((row, i) => {
            return (
              <PocRow
                key={`poc${i}`}
                index={i}
                poc={row}
                onInputChange={(event) => pocInputChangeHandler(event, i)}
                onAddRow={addPocRow}
                onRemoveRow={() => removePocRow(i)}
              />
            );
          })}
        </div>
        <div className="row materials-row">
          <MaterialInput
            materials={materials}
            addMaterial={addMaterial}
            removeMaterial={removeMaterial}
            errorMessage={materialError}
          />
        </div>
        <Field label={{ id: "notes", text: "Note" }}>
          <textarea
            id="notes"
            name="notes"
            ref={notes}
            readOnly={ui.form.action === "view"}
          />
        </Field>
        <div className="btns">
          {ui.form.action === "add" && (
            <button type="submit" className="text-btn fill teal">
              Procedi
            </button>
          )}
          {ui.form.action === "edit" && !isTransforming && (
            <>
              <button type="submit" className="text-btn border teal">
                Salva modifiche
              </button>
              {type === "quote" && !ui.form.item.work && (
                <button
                  type="button"
                  className="text-btn fill teal"
                  onClick={quoteToWorkHandler}
                >
                  Crea lavoro
                </button>
              )}
              {type === "quote" && ui.form.item.work && (
                <button
                  type="button"
                  className="text-btn color teal"
                  onClick={viewWorkHandler}
                >
                  Visualizza lavoro
                </button>
              )}
              {type === "work" && ui.form.item.quote && (
                <button
                  type="button"
                  className="text-btn color teal"
                  onClick={viewQuoteHandler}
                >
                  Visualizza preventivo
                </button>
              )}
            </>
          )}
          {isTransforming && (
            <>
              <button
                type="button"
                className="text-btn border red"
                onClick={workToQuoteHandler}
              >
                Annulla
              </button>
              <button type="submit" className="text-btn fill teal">
                Procedi
              </button>
            </>
          )}
          {ui.form.action === "view" && ui.form.item.work && (
            <button
              type="button"
              className="color teal"
              onClick={viewWorkHandler}
            >
              Visualizza lavoro
            </button>
          )}
          {ui.form.action === "view" && ui.form.item.quote && (
            <button
              type="button"
              className="color teal"
              onClick={viewQuoteHandler}
            >
              Visualizza preventivo
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
