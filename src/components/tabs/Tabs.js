import "./tabs.css";

export default function Tabs({
  tabs = [{ title: "", active: false, onClick: () => {} }],
}) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <div key={tab.title} className={`tab${tab.active ? " active" : ""}`}>
          <button type="button" onClick={tab.onClick}>
            {tab.title}
          </button>
          <div className="circle" />
        </div>
      ))}
    </div>
  );
}
