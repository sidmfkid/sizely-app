import React from "react";
import "../css/InputCard.css";

function OutputCard(props) {
  let fileUrl = props.fileUrl;
  let fileName = props.fileName;
  let fileSize = props.fileSize;
  let fileType = props.fileType;
  let fileWidth = props.fileWidth;
  let fileHeight = props.fileHeight;
  let previewImageHeight = props.previewImageHeight;
  let previewImageWidth = props.previewImageWidth;
  let previewImageSize = props.previewImageSize;
  console.log((Math.round(previewImageSize * 100) / 100).toFixed(2));
  console.log();
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center text-bg-primary">
        <div className="">Output Image</div>
        <button className="btn btn-outline-info">Download</button>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 d-flex mb-3">
            <div className="w-100 text-center position-relative current-edit-container d-flex align-items-center justify-content-center">
              <img
                src={fileUrl ? fileUrl : ""}
                className="mw-100 current-edit"
              ></img>
            </div>
          </div>
          <div className="col-md-8">
            <dl className="row info">
              <dt className="col-5">Name:</dt>
              <dd className="col-7">{fileName ? fileName : ""}</dd>
              <dt className="col-5">Type:</dt>
              <dd className="col-7">{fileType ? fileType : ""}</dd>
              <dt className="col-5">Size:</dt>
              <dd className="col-7">
                {fileSize ? Math.round(fileSize * 0.001) : ""} KB (
                {fileSize
                  ? `${(
                      ((Math.round(fileSize * 0.1) / 100).toFixed(2) /
                        (Math.round(previewImageSize * 100) / 100).toFixed(2)) *
                        100 -
                      100
                    ).toFixed(2)}%`
                  : ""}
                )
              </dd>
              <dt className="col-5">Width:</dt>
              <dd className="col-7">
                {fileWidth ? fileWidth : previewImageWidth} px
              </dd>
              <dt className="col-5">Height:</dt>
              <dd className="col-7">
                {fileHeight ? fileHeight : previewImageHeight} px
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutputCard;
