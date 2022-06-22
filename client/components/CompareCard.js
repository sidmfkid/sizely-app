import React from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

function CompareCard(props) {
  let originalImageUrl;

  let compressedImageUrl;

  if (
    props.originalImageUrl !== undefined &&
    props.compressedImageUrl !== undefined
  ) {
    originalImageUrl = props.originalImageUrl.image.url;
    compressedImageUrl = props.compressedImageUrl;
  }

  console.log(originalImageUrl, compressedImageUrl);
  return (
    <div className="card">
      <div className="card-header">Compare Images</div>

      <div className="card-body">
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage src={originalImageUrl} alt="Image one" />
          }
          itemTwo={
            <ReactCompareSliderImage src={compressedImageUrl} alt="Image two" />
          }
        />
      </div>
    </div>
  );
}

export default CompareCard;
