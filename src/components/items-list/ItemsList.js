import "./items-list.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Item from "../item/Item";
import { uiActions } from "../../store/ui-slice";

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const ui = useSelector((state) => state.ui);
  const filters = useSelector((state) => state.filters);
  const itemsSlice = useSelector((state) => state.items);
  const clients = useSelector((state) => state.clients).items;
  const dispatch = useDispatch();

  useEffect(() => {
    const listItems = itemsSlice.items.filter(
      (it) =>
        (ui.page === "works" && it.type === "work") ||
        (ui.page === "quotes" && it.type === "quote")
    );
    setItems(listItems);
  }, [itemsSlice.items, ui.page]);

  useEffect(() => {
    const listItems = itemsSlice.items.filter(
      (it) =>
        (ui.page === "works" && it.type === "work") ||
        (ui.page === "quotes" && it.type === "quote")
    );

    let filteredItems = [...listItems];

    if (filters.searchString.length > 0) {
      const formattedSearchString = filters.searchString.toUpperCase();

      filteredItems = filteredItems.filter((it) => {
        const client = clients.find((cli) => cli.id === it.client);
        const statusLabel = itemsSlice[`${it.type}States`].find(
          (status) => status.value === it.status
        ).label;
        const [year, month, day] = it.date.split("-");
        const dateFormatted = day + "/" + month + "/" + year;

        return (
          client.displayName.toUpperCase().includes(formattedSearchString) ||
          dateFormatted.includes(formattedSearchString) ||
          statusLabel.toUpperCase().includes(formattedSearchString) ||
          it.poc.find(
            (el) =>
              el.name.toUpperCase().includes(formattedSearchString) ||
              el.phone.toUpperCase().includes(formattedSearchString) ||
              el.email.toUpperCase().includes(formattedSearchString)
          ) ||
          it.materials.find((el) =>
            el.toUpperCase().includes(formattedSearchString)
          ) ||
          it.notes.toUpperCase().includes(formattedSearchString)
        );
      });
    }

    if (filters[ui.page].clients.length > 0) {
      filteredItems = filteredItems.filter((it) =>
        filters[ui.page].clients.includes(it.client)
      );
    }

    if (filters[ui.page].periods.length > 0) {
      filteredItems = filteredItems.filter((it) => {
        const itDateFormatted = parseInt(it.date.replaceAll("-", ""));
        const results = [];

        filters[ui.page].periods.forEach((period) => {
          results.push(
            itDateFormatted >= period.from && itDateFormatted <= period.to
          );
        });

        return !results.includes(false);
      });
    }

    if (filters[ui.page].names.length > 0) {
      filteredItems = filteredItems.filter((it) =>
        it.poc.find((poc) => filters[ui.page].names.includes(poc.name))
      );
    }
    if (filters[ui.page].phones.length > 0) {
      filteredItems = filteredItems.filter((it) =>
        it.poc.find((poc) => filters[ui.page].phones.includes(poc.phone))
      );
    }
    if (filters[ui.page].emails.length > 0) {
      filteredItems = filteredItems.filter((it) =>
        it.poc.find((poc) => filters[ui.page].emails.includes(poc.email))
      );
    }

    if (filters[ui.page].materials.length > 0) {
      filteredItems = filteredItems.filter((it) =>
        it.materials.find((material) =>
          filters[ui.page].materials.includes(material)
        )
      );
    }

    filteredItems.sort(
      (a, b) =>
        parseInt(b.date.replaceAll("-", "")) -
        parseInt(a.date.replaceAll("-", ""))
    );

    setFiltered(filteredItems);
  }, [ui.page, itemsSlice, filters, clients]);

  useEffect(() => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    const spObject = scrollPosition ? JSON.parse(scrollPosition) : null;

    const setScrollPosition = () => {
      sessionStorage.setItem(
        "scrollPosition",
        JSON.stringify({ ...spObject, [ui.page]: window.scrollY })
      );
    };

    if (spObject && spObject[ui.page] !== undefined) {
      setTimeout(() => window.scrollTo(0, spObject[ui.page]), 0);
    }

    window.addEventListener("scroll", setScrollPosition);

    return () => window.removeEventListener("scroll", setScrollPosition);
  }, [ui.page]);

  const openFormHandler = () => {
    dispatch(
      uiActions.setForm({
        action: "add",
        item: null,
      })
    );
  };

  return (
    <ul className="items-list">
      {filtered.length === 0 ? (
        <div className="empty-list">
          <img src={`${process.env.PUBLIC_URL}/images/thinking.svg`} alt="thinking-image" />
          <p>
            Hmm, nessun {ui.page === "works" ? "lavoro " : "preventivo "}
            {items.length === 0 ? "è ancora stato inserito" : "è stato trovato"}
            .
          </p>
          {items.length === 0 && (
            <button
              type="button"
              className="text-btn fill teal"
              onClick={openFormHandler}
            >
              Aggiungi {ui.page === "works" ? "lavoro" : "preventivo"}
            </button>
          )}
        </div>
      ) : (
        filtered.map((item) => <Item key={item.id} data={item} />)
      )}
    </ul>
  );
}
