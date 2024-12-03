import { IconContext } from "react-icons";
import Field from "../../field/Field";
import { IoClose } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import Modal from "../../modal/Modal";
import ClientForm from "../../client-form/ClientForm";
import { useSelector } from "react-redux";
import { RiEdit2Fill } from "react-icons/ri";
import { IoIosCheckmark } from "react-icons/io";

export default function ClientInput({ id, onChange, errorMessage }) {
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [value, setValue] = useState("");
  const [client, setClient] = useState();
  const [clientPlaceholder, setClientPlaceholder] = useState("");
  const [inputScroll, setInputScroll] = useState(0);
  const inputRef = useRef();

  const [fieldButtonIcon, setFieldButtonIcon] = useState(
    <IconContext.Provider
      value={{ style: { transform: "rotate(45deg) scale(1.1)" } }}
    >
      <IoClose />
    </IconContext.Provider>
  );
  const clientSlice = useSelector((state) => state.clients);
  const ui = useSelector((state) => state.ui);

  useEffect(() => {
    if (id !== null) {
      const clientFound = clientSlice.items.find((it) => it.id === id);
      if (clientFound) {
        setValue(clientFound.displayName);
        setClient(clientFound);
        setFieldButtonIcon(
          <IconContext.Provider value={{}}>
            <RiEdit2Fill />
          </IconContext.Provider>
        );
        return;
      }
    }

    setFieldButtonIcon(
      <IconContext.Provider
        value={{ style: { transform: "rotate(45deg) scale(1.1)" } }}
      >
        <IoClose />
      </IconContext.Provider>
    );
  }, [id, clientSlice.items]);

  const submitClientHandler = (newClient) => {
    onChange(newClient.id);
    setClientPlaceholder("");
    setClientFormOpen(false);
  };

  const clientInputPlaceholderHandler = (event) => {
    const possibleClient =
      event.target.value.length > 0
        ? clientSlice.items.find((it) =>
            it.displayName
              .toUpperCase()
              .startsWith(event.target.value.toUpperCase())
          )
        : null;

    const placeholder = possibleClient
      ? event.target.value +
        possibleClient.displayName.substring(
          event.target.value.length,
          possibleClient.displayName.length
        )
      : "";

    onChange(null);
    setValue(event.target.value);
    setClientPlaceholder(placeholder);
    setClient(possibleClient);
  };

  const setPlaceholderAsValue = (event) => {
    if (
      client &&
      (event.keyCode === 13 || event.target?.classList?.contains("confirm-btn"))
    ) {
      event.preventDefault();

      onChange(client.id);
      setClientPlaceholder("");
    }
  };

  const inputScrollHandler = () => {
    setInputScroll(inputRef.current.scrollLeft);
  }

  const fieldButton = (
    <button
      key="client-field-button"
      type="button"
      className="icon-btn border teal"
      onClick={() => setClientFormOpen(true)}
    >
      {fieldButtonIcon}
    </button>
  );

  return (
    <>
      {clientFormOpen && (
        <Modal onClose={() => setClientFormOpen(false)}>
          <ClientForm
            item={id !== null ? client : null}
            onClose={() => setClientFormOpen(false)}
            onSubmit={submitClientHandler}
          />
        </Modal>
      )}
      <Field
        label={{ id: "client", text: "Cliente" }}
        errorMessage={errorMessage}
        suggestion={{
          text: clientPlaceholder,
          left: inputScroll
        }}
        buttons={ui.form.action !== "view" ? [fieldButton] : []}
      >
        <input
          type="text"
          id="client"
          name="client"
          value={value}
          onChange={clientInputPlaceholderHandler}
          onKeyDown={setPlaceholderAsValue}
          onScroll={inputScrollHandler}
          ref={inputRef}
          readOnly={ui.form.action === "view"}
        />
        {client && ui.form.action !== "view" && (
          <button
            type="button"
            className="confirm-btn"
            onClick={setPlaceholderAsValue}
            disabled={id !== null}
          >
            <IconContext.Provider
              value={{
                className: `icon${id !== null ? " active" : ""}`,
                style: { transform: "scale(2)" },
              }}
            >
              <IoIosCheckmark />
            </IconContext.Provider>
          </button>
        )}
      </Field>
    </>
  );
}
