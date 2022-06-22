import React from "react";
import Input from "./Input";
function OptionsCard(props) {
  const optionsSubmit = props.optionsSubmit;
  const optionsChange = props.optionsChange;
  return (
    <div class="card">
      <div class="card-header text-bg-primary">Options</div>
      <div class="card-body">
        <form onSubmit={optionsSubmit} onChange={optionsChange}>
          <Input
            inputType={`checkbox`}
            Label="Strict"
            Name="image[strict]"
            Id="strict"
            labelClass="form-check-label fs-5"
            inputClass="form-check-input"
          />
          <Input
            inputType={`checkbox`}
            Label="Check Orientation"
            Name="image[orientation]"
            Id="orientation"
            labelClass="form-check-label fs-5"
            inputClass="form-check-input"
          />
          <Input
            inputType={`number`}
            Label="Width"
            Name="image[width]"
            Id="Width"
            labelClass="form-label fs-5"
            inputClass="form-control"
          />
          <Input
            inputType={`number`}
            Label="Height"
            Name="image[height]"
            Id="Height"
            labelClass="form-label fs-5"
            inputClass="form-control"
          />
          <Input
            inputType={`select`}
            Label="Resize"
            Name="image[resize]"
            Id="Resize"
            labelClass="form-label fs-5"
            inputClass="form-select"
          />
          <Input
            inputType={`select`}
            Label="Quality"
            Name="image[quality]"
            Id="Quality"
            labelClass="form-label fs-5"
            inputClass="form-select"
          />
          <Input
            inputType={`text`}
            Label="Mime Type"
            Name="image[mime-type]"
            Id="MimeType"
            labelClass="form-label fs-5"
            inputClass="form-control"
            value="auto"
          />
          <Input
            inputType={`text`}
            Label="Convert Type"
            Name="image[convert-type]"
            Id="ConvertType"
            labelClass="form-label fs-5"
            inputClass="form-control"
            value="image/png"
          />
          <Input
            inputType={`text`}
            Label="Convert Size"
            Name="image[convert-size]"
            Id="ConvertSize"
            labelClass="form-label fs-5"
            inputClass="form-control"
            value="5000000"
          />
          <button type="submit" className="btn btn-primary">
            Compress
          </button>
        </form>
      </div>
    </div>
  );
}

export default OptionsCard;
