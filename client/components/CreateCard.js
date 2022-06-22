import React from "react";

function CreateCard(props) {
  const currentSelection = JSON.parse(localStorage["compressedFiles"]);
  const createFile = props.createFile;

  return (
    <div className="card">
      <div className="card-header">Upload To Shop</div>
      <div className="card-body">
        <dl className="row">
          <dt className="col-10">Images Selected For Upload:</dt>
          <dd className="col-2">{currentSelection.length}</dd>
        </dl>
        <div className="row">
          <div className="col-12">
            <button onClick={createFile} className="btn btn-primary">
              Upload Images ({currentSelection.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCard;
