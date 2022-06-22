import React from "react";
import "../css/MenuButton.css";
function MenuButton(props) {
  const toggleHeader = props.toggleHeader;
  const headerOpen = props.headerOpen;
  return (
    <div className={headerOpen === true ? `menu-button open` : `menu-button`}>
      <button
        onClick={(e) => toggleHeader(e)}
        className="btn btn-primary"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasScrolling"
        aria-controls="offcanvasScrolling"
      >
        <span className="material-symbols-rounded">
          {headerOpen === true ? `close` : `menu`}
        </span>
      </button>
    </div>
  );
}

export default MenuButton;
