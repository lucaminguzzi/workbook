import "./toolbar.css";

import { IconContext } from "react-icons";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import Tabs from "../tabs/Tabs";
import { TbFilterSearch } from "react-icons/tb";
import { Fragment, useState } from "react";
import { filtersActions } from "../../store/filters-slice";
import Panel from "../panel/Panel";
import FiltersForm from "../filters-form/FiltersForm";
import PageHeader from "../page-header/PageHeader";
import SelectedValue from "../selected-value/SelectedValue";

export default function Toolbar() {
  const page = useSelector((state) => state.ui).page;
  const filters = useSelector((state) => state.filters)[page];
  const clientSlice = useSelector((state) => state.clients);
  const currentPage = useSelector((state) => state.ui).page;
  const dispatch = useDispatch();
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const changePageHandler = (newPage) => {
    dispatch(uiActions.setPage(newPage));
  };

  const removeFilterHandler = (listName, index) => {
    const updatedFilterList = [...filters[listName]];
    updatedFilterList.splice(index, 1);

    const udatedFilters = {
      ...filters,
      [listName]: updatedFilterList,
    };

    if (page === "works") {
      dispatch(filtersActions.setWorksFilters(udatedFilters));
    } else if (page === "quotes") {
      dispatch(filtersActions.setQuotesFilters(udatedFilters));
    }
  };

  const closePanelHandler = () => {
    setIsPanelVisible(false);
  };

  return (
    <>
      {isPanelVisible && (
        <Panel position="right" onClose={closePanelHandler}>
          <PageHeader title="Filtri" btn={{ visible: true,  onClick: closePanelHandler }} />
          <FiltersForm onClose={closePanelHandler} />
        </Panel>
      )}
      <div className="toolbar">
        <Tabs
          tabs={[
            {
              title: "Lavori",
              active: currentPage === "works",
              onClick: () => changePageHandler("works"),
            },
            {
              title: "Preventivi",
              active: currentPage === "quotes",
              onClick: () => changePageHandler("quotes"),
            },
          ]}
        />
        <div className="applied-filters-container">
          <div className="applied-filters">
            {filters.clients.map((it, i) => {
              const client = clientSlice.items.find((el) => el.id === it);
              if (!client) {
                return <Fragment key={`item-${i}`} />;
              }

              return (
                <SelectedValue
                  key={`item-${i}`}
                  className="filter"
                  text={client.displayName}
                  btn={{
                    visible: true,
                    onClick: () => removeFilterHandler("clients", i),
                  }}
                />
              );
            })}
            {filters.periods.map((it, i) => (
              <SelectedValue
                key={`item-${i}`}
                className="filter"
                text={it.formatted}
                btn={{
                  visible: true,
                  onClick: () => removeFilterHandler("periods", i),
                }}
              />
            ))}
            {filters.names.map((it, i) => (
              <SelectedValue
                key={`item-${i}`}
                className="filter"
                text={it}
                btn={{
                  visible: true,
                  onClick: () => removeFilterHandler("names", i),
                }}
              />
            ))}
            {filters.phones.map((it, i) => (
              <SelectedValue
                key={`item-${i}`}
                className="filter"
                text={it}
                btn={{
                  visible: true,
                  onClick: () => removeFilterHandler("phones", i),
                }}
              />
            ))}
            {filters.emails.map((it, i) => (
              <SelectedValue
                key={`item-${i}`}
                className="filter"
                text={it}
                btn={{
                  visible: true,
                  onClick: () => removeFilterHandler("emails", i),
                }}
              />
            ))}
            {filters.materials.map((it, i) => (
              <SelectedValue
                key={`item-${i}`}
                className="filter"
                text={it}
                btn={{
                  visible: true,
                  onClick: () => removeFilterHandler("materials", i),
                }}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className="open-filters-btn"
          onClick={() => setIsPanelVisible(true)}
        >
          <IconContext.Provider
            value={{ style: { height: "100%", width: "auto" } }}
          >
            <TbFilterSearch />
          </IconContext.Provider>
        </button>
      </div>
    </>
  );
}
