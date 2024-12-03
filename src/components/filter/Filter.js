import "./filter.css";

import SelectedValue from "../selected-value/SelectedValue";

export default function Filter({
  items = [],
  setItems = () => {},
  property = "",
  children,
}) {
  const removeItemHandler = (index) => {
    if (items.length <= index) {
      return;
    }

    setItems((prev) => {
      const list = [...prev];
      list.splice(index, 1);
      return list;
    });
  };

  return (
    <div className="filter-container">
      {children}
      <div className="selected-values">
        {items.map((it, i) => (
          <SelectedValue
            key={`item-${i}`}
            className="filter"
            text={property.length > 0 ? it[property] : it}
            btn={{
              visible: true,
              onClick: () => removeItemHandler(i),
            }}
          />
        ))}
      </div>
    </div>
  );
}
