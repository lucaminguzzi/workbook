import { IconContext } from "react-icons";
import Field from "../../field/Field";
import { IoClose } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SelectedValue from "../../selected-value/SelectedValue";

export default function MaterialInput({
  materials,
  addMaterial,
  removeMaterial,
  errorMessage,
}) {
  const [value, setValue] = useState("");
  const [material, setMaterial] = useState();
  const [materialPlaceholder, setMaterialPlaceholder] = useState("");
  const [avaiableMaterials, setAvaiableMaterials] = useState([]);
  const [inputScroll, setInputScroll] = useState(0);
  const inputRef = useRef();

  const itemsSlice = useSelector((state) => state.items);
  const ui = useSelector((state) => state.ui);

  useEffect(() => {
    setAvaiableMaterials(itemsSlice.items.map((it) => it.materials).flat());
  }, [itemsSlice.items]);

  const materialInputPlaceholderHandler = (event) => {
    const possibleMaterial =
      event.target.value.length > 0
        ? avaiableMaterials.find((it) =>
            it.toUpperCase().startsWith(event.target.value.toUpperCase())
          )
        : null;
    const placeholder = possibleMaterial
      ? event.target.value +
        possibleMaterial.substring(
          event.target.value.length,
          possibleMaterial.length
        )
      : "";

    setMaterialPlaceholder(placeholder);
    setMaterial(possibleMaterial);
    setValue(event.target.value);
  };

  const addMaterialHandler = (event) => {
    if (
      value.length > 0 &&
      (event.keyCode === 13 || event.target?.classList?.contains("confirm-btn"))
    ) {
      if (material) {
        addMaterial(material);
      } else {
        addMaterial(value);
      }

      setMaterialPlaceholder("");
      setMaterial(null);
      setValue("");
    }
  };

  const inputScrollHandler = () => {
    setInputScroll(inputRef.current.scrollLeft);
  };

  return (
    <>
      {ui.form.action === "view" ? (
        <p className="materials-label">Materiali</p>
      ) : (
        <Field
          label={{ id: "material", text: "Materiali" }}
          errorMessage={errorMessage}
          suggestion={{
            text: materialPlaceholder,
            left: inputScroll,
          }}
        >
          <input
            type="text"
            id="material"
            name="material"
            value={value}
            onChange={materialInputPlaceholderHandler}
            onKeyUp={addMaterialHandler}
            onScroll={inputScrollHandler}
            ref={inputRef}
          />
          {value.length > 0 && (
            <button
              type="button"
              className="confirm-btn"
              onClick={addMaterialHandler}
            >
              <IconContext.Provider
                value={{
                  className: "icon",
                  style: { transform: "rotate(45deg)" },
                }}
              >
                <IoClose />
              </IconContext.Provider>
            </button>
          )}
        </Field>
      )}
      {materials.length > 0 && (
        <div className="selected-values">
          {materials.map((item, i) => (
            <SelectedValue
              key={`item-${i}`}
              className="material"
              text={item}
              btn={{
                visible: ui.form.action !== "view",
                onClick: () => removeMaterial(i),
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
