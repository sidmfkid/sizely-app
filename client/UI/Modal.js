// import ReactDOM from "react-dom";
import React from "react";
import { useState } from "react";
import Image from "../components/Image";

function Modal(props) {
  const data = props.data;
  const setImageData = props.setData;

  return (
    <div
      className="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <form onSubmit={(e) => props.handleSubmit(e)}>
        <div className="modal-dialog modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header text-bg-primary">
              <h5 className="modal-title" id="staticBackdropLabel">
                Upload Images For Compression
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container">{props.children}</div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                type="submit"
                className="btn btn-primary"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Modal;
