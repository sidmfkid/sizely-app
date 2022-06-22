import React from "react";

function Input(props) {
  let options;

  props.Id !== "Quality"
    ? (options = (
        <select
          className={props.inputClass}
          aria-label="Select a resize option"
        >
          {" "}
          <option value="none">None</option>
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
        </select>
      ))
    : (options = (
        <select
          className={props.inputClass}
          aria-label="Select a resize option"
        >
          <option value="0">0</option>
          <option value=".1">0.1</option>
          <option value=".2">0.2</option>
          <option value=".3">0.3</option>
          <option value=".4">0.4</option>
          <option value=".5">0.5</option>
          <option value=".6">0.6</option>
          <option value=".7">0.7</option>
          <option value=".8">0.8</option>
          <option selected value=".9">
            0.9
          </option>
          <option value="1">1</option>
        </select>
      ));
  if (props.inputType === "checkbox") {
    return (
      <div className={`form-check mb-3`}>
        <input
          className={props.inputClass}
          type={props.inputType}
          name={props.Name}
          id={props.Id}
          value="false"
        ></input>
        <label className={`${props.labelClass}`} htmlFor={props.Id}>
          {props.Label}
        </label>
      </div>
    );
  }

  if (props.inputType === "select") {
    return (
      <div className={`mb-3 row align-items-center`}>
        <div class="col">
          <label className={props.labelClass}>{props.Label}</label>
        </div>
        <div class="col">{options}</div>
      </div>
    );
  }

  if (props.inputType === "number") {
    return (
      <div className={`mb-3 row align-items-center`}>
        <div className="col">
          <label className={`${props.labelClass}`} htmlFor={props.Id}>
            {props.Label}
          </label>
        </div>
        <div class="col">
          <input
            className={props.inputClass}
            type={props.inputType}
            name={props.Name}
            id={props.Id}
          ></input>
        </div>
      </div>
    );
  }
  if (props.inputType === "text") {
    return (
      <div className={`mb-3 row align-items-center`}>
        <div className="col">
          <label className={`${props.labelClass}`} htmlFor={props.Id}>
            {props.Label}
          </label>
        </div>
        <div class="col">
          <input
            className={props.inputClass}
            type={props.inputType}
            name={props.Name}
            id={props.Id}
            value={props.value}
            placeholder={props.value}
          ></input>
        </div>
      </div>
    );
  }
  return (
    <div className={`form-check mb-3`}>
      <input
        className={props.inputClass}
        type={props.inputType}
        name={props.Name}
        id={props.Id}
      ></input>
      <label className={`${props.labelClass}`} htmlFor={props.Id}>
        {props.Label}
      </label>
    </div>
  );
}

export default Input;
