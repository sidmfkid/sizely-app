import React from "react";

function Image(props) {
  const fileSize = Math.round(Number(props.fileSize) * 0.001);

  let badge;

  if (fileSize > 300) {
    badge = (
      <>
        <small className="badge text-danger fs-5">{fileSize}KB</small>
        <span className="badge text-danger fs-5 text-start text-wrap">
          *May cause longer page loads
        </span>
      </>
    );
  }
  if (fileSize < 300 && fileSize > 100) {
    badge = (
      <>
        <small className="badge text-warning fs-5">{fileSize}KB</small>
        <span className="badge text-danger fs-5">*Needs some work</span>
      </>
    );
  }
  if (100 > fileSize) {
    badge = <small className="badge text-success fs-5">{fileSize}KB</small>;
  }

  return (
    <div className="row py-3 border-bottom">
      <div className="rounded col-4 modal-img-container">
        <img
          className="modal-img"
          width={props.imageWidth}
          height={props.imageHeight}
          src={props.imageURL}
        ></img>
      </div>
      <div className=" d-flex justify-content-end align-items-center col-6 ms-auto position-relative">
        <div className="d-flex w-100 justify-content-end align-items-baseline">
          <h5 className="mb-1 badge text-bg-primary fs-5">File Size</h5>
          {badge}
        </div>
        <div className="d-block position-absolute bottom-0 end-0 me-2 mb-2">
          <div className="form-check form-switch">
            <input
              onChange={props.handleChange}
              value={props.imageID}
              name="image[id]"
              className="form-check-input"
              type="checkbox"
              role="switch"
              id={`flexSwitchCheckDefault-${props.index}`}
            />
            <label
              className="form-check-label"
              htmlFor={`flexSwitchCheckDefault-${props.index}`}
            >
              Add for upload
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Image;
