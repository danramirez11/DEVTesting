import { useState } from "react";

const topItems = ["Overview", "Team & Roles"];
const docsItems = ["Business Registration", "Tax Information", "Supporting Files"];
const bottomItems = ["Review", "Submit"];

function MenuItem({ label, active = false, nested = false }: { label: string; active?: boolean; nested?: boolean }) {
  return (
    <li className={`menu-item ${active ? "active" : ""} ${nested ? "nested" : ""}`.trim()}>
      <span className="item-icon" aria-hidden="true">
        {nested ? "" : "[]"}
      </span>
      <span>{label}</span>
    </li>
  );
}

export default function LeftMenu() {
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(true);

  return (
    <aside className="left-menu" aria-label="Workspace navigation">
      <div className="company-brand">
        <span className="company-dot" aria-hidden="true" />
        <span>Company</span>
      </div>

      <ul className="menu-list">
        {topItems.map((item) => (
          <MenuItem key={item} label={item} active={item === "Overview"} />
        ))}

        <li>
          <button
            type="button"
            className="menu-item expanded docs-toggle"
            aria-expanded={isDocumentsOpen}
            onClick={() => setIsDocumentsOpen((current) => !current)}
          >
            <span className="item-icon" aria-hidden="true">
              []
            </span>
            <span>Documents</span>
            <span className={`caret ${isDocumentsOpen ? "open" : ""}`.trim()} aria-hidden="true">
              ^
            </span>
          </button>

          <ul className={`menu-sublist ${isDocumentsOpen ? "open" : "closed"}`.trim()}>
            {docsItems.map((item) => (
              <MenuItem key={item} label={item} nested />
            ))}
          </ul>
        </li>

        {bottomItems.map((item) => (
          <MenuItem key={item} label={item} />
        ))}
      </ul>
    </aside>
  );
}
