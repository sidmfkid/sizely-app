import React from "react";
import "../css/InputCard.css";

function InputCard(props) {
  const currentSelection = JSON.parse(localStorage["currentSelection"]);
  const currentEditObj = JSON.parse(localStorage["currentEditObj"]);
  const handleEditObj = props.handleEditObj;
  const imageElements = props.imageElements;
  const previewImage = props.previewImage;
  const previewImageName = props.previewImageName;
  const previewImageType = props.previewImageType;
  const previewImageSize = props.previewImageSize;
  const previewImageWidth = props.previewImageWidth;
  const previewImageHeight = props.previewImageHeight;

  // let imageElements;
  // let previewImage;
  // let previewImageName;
  // let previewImageType;
  // let previewImageSize;
  // let previewImageWidth;
  // let previewImageHeight;
  // if (currentSelection.length >= 1) {
  //   imageElements = currentSelection.map((image) => {
  //     return <img className="images" src={image.image.url}></img>;
  //   });
  //   previewImage = currentSelection[currentEditObj];
  //   let tempString;
  //   let newString;
  //   let strEndIndex;
  //   let strStartIndex;
  //   let fileStartIndex;

  //   if (previewImage) {
  //     tempString = previewImage.image.url.split("/files");
  //     newString = tempString[2];
  //     strEndIndex = newString.indexOf("?");
  //     strStartIndex = newString.indexOf("/");
  //     previewImageName = newString.slice(strStartIndex + 1, strEndIndex);
  //     fileStartIndex = previewImageName.indexOf(".");
  //     previewImageType = previewImageName.slice(fileStartIndex + 1);
  //     previewImageSize = previewImage.originalSource.fileSize * 0.001;
  //     previewImageWidth = previewImage.image.width;
  //     previewImageHeight = previewImage.image.height;
  //   }
  // }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center text-bg-primary">
        <div className="">Input Image</div>
        <button className="btn btn-outline-info">Download</button>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 d-flex mb-3">
            <div className="w-100 text-center position-relative current-edit-container d-flex align-items-center">
              <img
                src={
                  currentSelection.length >= 1 && previewImage !== undefined
                    ? previewImage.image.url
                    : ""
                }
                className="mw-100 current-edit"
              ></img>
              {/* <div className="stacked-images">
                {imageElements ? imageElements : ""}
              </div> */}
            </div>
          </div>
          <div className="col-md-8">
            <dl className="row info">
              <dt className="col-5">Name:</dt>
              <dd className="col-7">{previewImageName}</dd>
              <dt className="col-5">Type:</dt>
              <dd className="col-7">{previewImageType}</dd>
              <dt className="col-5">Size:</dt>
              <dd className="col-7">
                {previewImageSize > 1000
                  ? `${Math.round(previewImageSize * 0.01)} MB`
                  : `${Math.round(previewImageSize)} KB`}{" "}
              </dd>
              <dt className="col-5">Original Width:</dt>
              <dd className="col-7">{previewImageWidth} px</dd>
              <dt className="col-5"> Original Height:</dt>
              <dd className="col-7">{previewImageHeight} px</dd>
            </dl>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 d-flex justify-content-center">
            <div className="row">
              <button
                onClick={(e) => handleEditObj(e)}
                id="left"
                className="col d-flex align-items-center"
              >
                <span className="material-symbols-rounded">chevron_left</span>
              </button>
              <div className="col d-flex align-items-center justify-content-center">
                <span className="fs-6 text-center w-100">
                  {currentEditObj + 1}/{currentSelection.length}
                </span>
              </div>
              <button
                onClick={(e) => handleEditObj(e)}
                id="right"
                className="col d-flex align-items-center"
              >
                <span className="material-symbols-rounded">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputCard;
