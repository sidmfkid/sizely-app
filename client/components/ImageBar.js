import React from "react";
import { useRef } from "react";

function ImageBar(props) {
  const quickBar = useRef(null);

  let scrollNum = 50;
  function incrementNum() {
    scrollNum === 0 || scrollNum >= quickBar.current.offsetWidth
      ? (scrollNum = 50)
      : (scrollNum = scrollNum + 600);
  }
  function decrementNum() {
    scrollNum <= 0 || scrollNum > quickBar.current.offsetWidth
      ? (scrollNum = quickBar.current.offsetWidth)
      : (scrollNum = scrollNum - 600);
  }

  function scrollSmoothRight(e) {
    incrementNum();
    quickBar.current.scroll({ top: 0, left: scrollNum, behavior: "smooth" });
  }
  function scrollSmoothLeft(e) {
    decrementNum();
    quickBar.current.scroll({
      top: 0,
      left: scrollNum,
      behavior: "smooth",
    });
  }
  return (
    <>
      <div className="col mt-4">
        <div className="card">
          <div className="card-header text-bg-primary">
            <span className="f-1">Current Images</span>
          </div>
          <button onClick={scrollSmoothLeft} className="icon-container back">
            <span className="material-symbols-rounded">arrow_back_ios</span>
          </button>
          <form
            action="/compress"
            encType="multipart/form-data"
            method="post"
            className="card-body images"
            ref={quickBar}
          >
            <div className="row">{props.children}</div>
          </form>
          <button
            onClick={scrollSmoothRight}
            className="icon-container forward"
          >
            <span className="material-symbols-rounded">arrow_forward_ios</span>
          </button>
          <div className="card-body">
            <div className="form-check d-block ms-auto w-25">
              <input
                name="images[multiple]"
                className="form-check-input"
                type="checkbox"
                value="true"
                id="multipleImages"
              ></input>
              <label className="form-check-label" htmlFor="multipleImages">
                Compress/Resize Multiple Images
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageBar;
