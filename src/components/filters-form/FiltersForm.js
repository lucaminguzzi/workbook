import "./filters-form.css";

import Field from "../field/Field";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../filter/Filter";
import { filtersActions } from "../../store/filters-slice";

export default function FiltersForm({ onClose }) {
  const page = useSelector((state) => state.ui).page;
  const filters = useSelector((state) => state.filters);
  const clientSlice = useSelector((state) => state.clients);
  const itemsSlice = useSelector((state) => state.items);
  const dispatch = useDispatch();

  const clientRef = useRef();
  const fromRef = useRef();
  const toRef = useRef();
  const nameRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const materialRef = useRef();

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const [names, setNames] = useState([]);
  const [phones, setPhones] = useState([]);
  const [emails, setEmails] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [clientsSelected, setClientsSelected] = useState([]);
  const [periodsSelected, setPeriodsSelected] = useState([]);
  const [namesSelected, setNamesSelected] = useState([]);
  const [phonesSelected, setPhonesSelected] = useState([]);
  const [emailsSelected, setEmailsSelected] = useState([]);
  const [materialsSelected, setMaterialsSelected] = useState([]);

  useEffect(() => {
    const pocs = itemsSlice.items.map((it) => it.poc).flat();

    const nameUniqueList = [];
    const phoneUniqueList = [];
    const emailUniqueList = [];

    pocs.forEach((poc) => {
      const foundName = nameUniqueList.find(
        (el) => el.toUpperCase() === poc.name.toUpperCase()
      );
      const foundEmail = emailUniqueList.find(
        (el) => el.toUpperCase() === poc.email.toUpperCase()
      );

      if (poc.name.length > 0 && !foundName) {
        nameUniqueList.push(poc.name);
      }
      if (poc.phone.length > 0 && !phoneUniqueList.includes(poc.phone)) {
        phoneUniqueList.push(poc.phone);
      }
      if (poc.email.length > 0 && !foundEmail) {
        emailUniqueList.push(poc.email);
      }
    });

    setNames(nameUniqueList);
    setPhones(phoneUniqueList);
    setEmails(emailUniqueList);

    setMaterials(itemsSlice.items.map((it) => it.materials).flat());

    if (filters[page].clients.length > 0) {
      setClientsSelected(
        filters[page].clients.map((clientId) =>
          clientSlice.items.find((el) => el.id === clientId)
        )
      );
    }
    if (filters[page].periods.length > 0) {
      setPeriodsSelected(filters[page].periods);
    }
    if (filters[page].names.length > 0) {
      setNamesSelected(filters[page].names);
    }
    if (filters[page].phones.length > 0) {
      setPhonesSelected(filters[page].phones);
    }
    if (filters[page].emails.length > 0) {
      setEmailsSelected(filters[page].emails);
    }
    if (filters[page].materials.length > 0) {
      setMaterialsSelected(filters[page].materials);
    }
  }, [itemsSlice.items, filters, page, clientSlice.items]);

  const addClientHandler = (event) => {
    const client = clientSlice.items.find(
      (it) => `${it.id}` === event.target.value
    );
    if (
      client &&
      !clientsSelected.find((it) => `${it.id}` === event.target.value)
    ) {
      setClientsSelected((prev) => [...prev, client]);
    }

    clientRef.current.value = "";
  };

  const minMaxPeriodHandler = () => {
    if (fromRef.current.value) {
      const fromDate = new Date(fromRef.current.value);
      fromDate.setDate(fromDate.getDate() + 1);
      setMinDate(fromDate.toISOString().split("T")[0]);
    } else {
      setMinDate("");
    }

    if (toRef.current.value) {
      const toDate = new Date(toRef.current.value);
      toDate.setDate(toDate.getDate() - 1);
      setMaxDate(toDate.toISOString().split("T")[0]);
    } else {
      setMaxDate("");
    }
  };

  const addPeriodHandler = () => {
    if (!fromRef.current.value || !toRef.current.value) {
      return;
    }

    const [formYear, fromMonth, fromDay] = fromRef.current.value.split("-");
    const [toYear, toMonth, toDay] = toRef.current.value.split("-");
    const formattedPeriod = `${fromDay}/${fromMonth}/${formYear} - ${toDay}/${toMonth}/${toYear}`;

    if (!periodsSelected.find((it) => it.formatted === formattedPeriod)) {
      setPeriodsSelected((prev) => [
        ...prev,
        {
          from: parseInt(formYear + fromMonth + fromDay),
          to: parseInt(toYear + toMonth + toDay),
          formatted: formattedPeriod,
        },
      ]);
    }

    fromRef.current.value = "";
    toRef.current.value = "";

    setMinDate("");
    setMaxDate("");
  };

  const addNameHandler = (event) => {
    const nameSelected = event.target.value;

    if (nameSelected.length > 0 && !namesSelected.includes(nameSelected)) {
      setNamesSelected((prev) => [...prev, nameSelected]);
    }

    nameRef.current.value = "";
  };

  const addPhoneHandler = (event) => {
    const phoneSelected = event.target.value;

    if (phoneSelected.length > 0 && !phonesSelected.includes(phoneSelected)) {
      setPhonesSelected((prev) => [...prev, phoneSelected]);
    }

    phoneRef.current.value = "";
  };

  const addEmailHandler = (event) => {
    const emailSelected = event.target.value;

    if (emailSelected.length > 0 && !emailsSelected.includes(emailSelected)) {
      setEmailsSelected((prev) => [...prev, emailSelected]);
    }

    emailRef.current.value = "";
  };

  const addMaterialHandler = (event) => {
    const materialSelected = event.target.value;

    if (
      materialSelected.length > 0 &&
      !materialsSelected.includes(materialSelected)
    ) {
      setMaterialsSelected((prev) => [...prev, materialSelected]);
    }

    materialRef.current.value = "";
  };

  const resetFiltersHandler = () => {
    setClientsSelected([]);
    setPeriodsSelected([]);
    setNamesSelected([]);
    setPhonesSelected([]);
    setEmailsSelected([]);
    setMaterialsSelected([]);

    const emptyFilters = {
      clients: [],
      periods: [],
      names: [],
      phones: [],
      emails: [],
      materials: [],
    };

    if (page === "works") {
      dispatch(filtersActions.setWorksFilters(emptyFilters));
    } else if (page === "quotes") {
      dispatch(filtersActions.setQuotesFilters(emptyFilters));
    }
  };

  const applyFiltersHandler = (event) => {
    event.preventDefault();

    if (event.target.id !== "filters-form" || event.keyCode === 13) {
      return;
    }

    const updatedFilters = {
      clients: clientsSelected.map((client) => client.id),
      periods: periodsSelected,
      names: namesSelected,
      phones: phonesSelected,
      emails: emailsSelected,
      materials: materialsSelected,
    };

    if (page === "works") {
      dispatch(filtersActions.setWorksFilters(updatedFilters));
    } else if (page === "quotes") {
      dispatch(filtersActions.setQuotesFilters(updatedFilters));
    }

    onClose();
  };

  return (
    <form id="filters-form" onSubmit={applyFiltersHandler}>
      <div className="fields">
        <Filter
          items={clientsSelected}
          setItems={setClientsSelected}
          property="displayName"
        >
          <Field label={{ id: "client", text: "Cliente" }}>
            <select
              id="client"
              name="client"
              ref={clientRef}
              onChange={addClientHandler}
            >
              <option value="" />
              {clientSlice.items.map((client, i) => (
                <option key={`client-${i}`} value={client.id}>
                  {client.displayName}
                </option>
              ))}
            </select>
          </Field>
        </Filter>
        <Filter
          items={periodsSelected}
          setItems={setPeriodsSelected}
          property="formatted"
        >
          <div className="row">
            <Field label={{ id: "from", text: "Periodo" }}>
              <input
                type="date"
                id="from"
                name="from"
                ref={fromRef}
                onChange={minMaxPeriodHandler}
                onBlur={addPeriodHandler}
                max={maxDate}
              />
            </Field>
            <Field>
              <input
                type="date"
                id="to"
                name="to"
                ref={toRef}
                onChange={minMaxPeriodHandler}
                onBlur={addPeriodHandler}
                min={minDate}
              />
            </Field>
          </div>
        </Filter>
        <Filter items={namesSelected} setItems={setNamesSelected}>
          <Field label={{ id: "name", text: "Nome e cognome" }}>
            <select
              id="name"
              name="name"
              ref={nameRef}
              onChange={addNameHandler}
            >
              <option value="" />
              {names.map((name, i) => (
                <option key={`name-${i}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </Field>
        </Filter>
        <Filter items={phonesSelected} setItems={setPhonesSelected}>
          <Field label={{ id: "phone", text: "Telefono" }}>
            <select
              id="phone"
              name="phone"
              ref={phoneRef}
              onChange={addPhoneHandler}
            >
              <option value="" />
              {phones.map((phone, i) => (
                <option key={`phone-${i}`} value={phone}>
                  {phone}
                </option>
              ))}
            </select>
          </Field>
        </Filter>
        <Filter items={emailsSelected} setItems={setEmailsSelected}>
          <Field label={{ id: "email", text: "E-mail" }}>
            <select
              id="email"
              name="email"
              ref={emailRef}
              onChange={addEmailHandler}
            >
              <option value="" />
              {emails.map((emails, i) => (
                <option key={`email-${i}`} value={emails}>
                  {emails}
                </option>
              ))}
            </select>
          </Field>
        </Filter>
        <Filter items={materialsSelected} setItems={setMaterialsSelected}>
          <Field label={{ id: "material", text: "Materiale" }}>
            <select
              id="material"
              name="material"
              ref={materialRef}
              onChange={addMaterialHandler}
            >
              <option value="" />
              {materials.map((material, i) => (
                <option key={`material-${i}`} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </Field>
        </Filter>
      </div>
      <div className="btns">
        <button
          type="button"
          className="text-btn border gray"
          onClick={resetFiltersHandler}
        >
          Pulisci
        </button>
        <button type="submit" className="text-btn fill teal">
          Applica
        </button>
      </div>
    </form>
  );
}
