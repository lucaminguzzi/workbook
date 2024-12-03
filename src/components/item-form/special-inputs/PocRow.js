import { IconContext } from "react-icons";
import Field from "../../field/Field";
import { VscNewline } from "react-icons/vsc";
import { IoRemove } from "react-icons/io5";
import { useSelector } from "react-redux";

export default function PocRow({
  index,
  poc,
  onInputChange,
  onAddRow,
  onRemoveRow,
}) {
  const ui = useSelector((state) => state.ui);

  const rowButtons = [
    <button
      key={`poc-add-btn-${index}`}
      type="button"
      className="icon-btn border teal"
      onClick={onAddRow}
    >
      <IconContext.Provider value={{ style: { transform: "scale(1.4)" } }}>
        <VscNewline />
      </IconContext.Provider>
    </button>,
  ];

  if (index > 0) {
    rowButtons.push(
      <button
        key={`poc-remove-btn-${index}`}
        type="button"
        className="icon-btn border red"
        onClick={onRemoveRow}
      >
        <IconContext.Provider value={{ style: { transform: "scale(1.2)" } }}>
          <IoRemove />
        </IconContext.Provider>
      </button>
    );
  }

  return (
    <div className="poc-row">
      <Field
        label={{ id: `poc-name-${index}`, text: "Nome e cognome" }}
        errorMessage={poc.name.error}
      >
        <input
          type="text"
          id={`poc-name-${index}`}
          name="name"
          value={poc.name.value}
          onChange={onInputChange}
          readOnly={ui.form.action === "view"}
        />
      </Field>
      <Field
        label={{ id: `poc-phone-${index}`, text: "Telefono" }}
        errorMessage={poc.phone.error}
      >
        <input
          type="tel"
          id={`poc-phone-${index}`}
          name="phone"
          value={poc.phone.value}
          onChange={onInputChange}
          readOnly={ui.form.action === "view"}
        />
      </Field>
      <Field
        label={{ id: `poc-email-${index}`, text: "E-mail" }}
        errorMessage={poc.email.error}
        buttons={ui.form.action !== "view" ? rowButtons : []}
      >
        <input
          type="email"
          id={`poc-email-${index}`}
          name="email"
          value={poc.email.value}
          onChange={onInputChange}
          readOnly={ui.form.action === "view"}
        />
      </Field>
    </div>
  );
}
