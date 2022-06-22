import React from "react";

function Header(props) {
  const headerOpen = props.headerOpen;
  const toggleHeader = props.toggleHeader;

  return (
    <div
      className="offcanvas offcanvas-start text-bg-primary border-end-0"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      tabIndex="-1"
      id="offcanvasScrolling"
      aria-labelledby="offcanvasScrollingLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasExampleLabel">
          Offcanvas
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={(e) => toggleHeader(e)}
        ></button>
      </div>
      <div className="offcanvas-body">
        <nav className="nav flex-column">
          <a
            className="nav-link active text-white"
            aria-current="page"
            href="/"
          >
            Home
          </a>
          <a className="nav-link text-white" href="/upload">
            Saved
          </a>
          <a className="nav-link text-white" href="/settings">
            Settings
          </a>
        </nav>
      </div>
    </div>
  );
}

export default Header;
