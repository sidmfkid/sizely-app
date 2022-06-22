import React from "react";
import { useEffect } from "react";
import fetch from "node-fetch";
function Card(props) {
  const setData = props.setData;
  const data = props.data;
  const loadImages = props.loadImages;

  // function loadImages() {
  //   fetch("/images")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setData(data);
  //     });
  // }

  return (
    <div className="card">
      <div className="card-body">
        <button
          className="btn btn-primary"
          onClick={(e) => loadImages(e)}
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          Select Images
        </button>
        {/* <input
          className="btn btn-primary"
          type="file"
          id="imageUpload"
          multiple
          name="image"
        /> */}
      </div>
    </div>
  );
}

export default Card;
