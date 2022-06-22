import React from "react";
import { useState, useEffect } from "react";

import Card from "./Card";
import Modal from "../UI/Modal";
import Image from "./Image";
import ImageBar from "./ImageBar";
import OptionsCard from "./OptionsCard";
import InputCard from "./InputCard";
import OutputCard from "./OutputCard";
import CompareCard from "./CompareCard";
import axios from "axios";
import Compressor from "compressorjs";
import CreateCard from "./CreateCard";

function Main(props) {
  const [imageData, setImageData] = useState();
  const [formData, setFormData] = useState([]);
  const [formSubmitted, setFormStatus] = useState(false);
  const [currentSelection, setCurrentSelection] = useState([]);
  const [currentEditObj, setCurrentEditObj] = useState(0);
  const [currentOptions, setCurrentOptions] = useState({});
  const [compressedImages, setCompressedImages] = useState({});

  let fileArr = [];

  let outputData = {
    images: [],
  };
  let compressedObj;
  const urlToFilename = (url) => {
    // let url = imageData[i].node.image.url;
    let splitString = url.split("/files");
    let endIndex = splitString[2].indexOf("?");
    let fileName = splitString[2].slice("1", endIndex);
    return fileName;
  };

  const showCompressedImages = () => {
    return outputData.images;
  };
  const addSelectionData = (data) => [...currentSelection, data[0].node];

  const editSelectionData = (data, currentSelection) => {
    console.log(data, "DATA");
    let newSelection = currentSelection.filter((selection, i) => {
      if (data[0].node.id === selection.id) {
        return;
      } else {
        return selection;
      }
    });
    return newSelection;
  };

  let fileName;
  let fileSize;
  let fileType;
  let fileUrl;
  let fileWidth;
  let fileHeight;
  let newOutputData = [];

  const startCompressing = async (files, options) => {
    let compressor;
    let fileObj = {};
    newOutputData = [];
    let compressorArr = [];
    for (let i = 0; i < files.length; i++) {
      if (options) {
        compressor = new Compressor(files[i], {
          quality: options.quality,
          width: options.width,
          height: options.height,
          resize: options.resize,
          mimeType: options.mimetype,
          convertTypes: options.convertType,

          success(result) {
            fileName = result.name;
            fileSize = result.size;
            fileType = result.type;
            fileWidth = options.width ? options.width : "";
            fileHeight = options.height ? options.height : "";
            fileUrl = URL.createObjectURL(result);
            fileObj = {
              fileName,
              fileSize,
              fileType,
              fileUrl,
              fileWidth,
              fileHeight,
            };
            newOutputData.push(fileObj);
            if (newOutputData.length === files.length) {
              return new Promise((resolve, reject) => {
                resolve(storeItem(newOutputData));
              });
            }
          },
          error(err) {
            console.log(err.message);
          },
        });
        compressorArr.push(compressor);
      }
      if (options === undefined) {
        if (currentOptions) {
          compressor = new Compressor(files[i], {
            quality: currentOptions.quality,
            width: currentOptions.width,
            height: currentOptions.height,
            resize: currentOptions.resize,
            mimeType: currentOptions.mimetype,
            convertTypes: currentOptions.convertType,

            success(Blob) {
              fileName = Blob.name;
              fileSize = Blob.size;
              fileType = Blob.type;
              fileWidth = currentOptions.width ? currentOptions.width : "";
              fileHeight = currentOptions.height ? currentOptions.height : "";
              fileUrl = URL.createObjectURL(Blob);
              fileObj = {
                fileName,
                fileSize,
                fileType,
                fileUrl,
                fileWidth,
                fileHeight,
              };
              newOutputData.push(fileObj);
              if (newOutputData.length === files.length) {
                return new Promise((resolve, reject) => {
                  resolve(storeItem(newOutputData));
                });
              }
            },
            error(err) {
              console.log(err.message);
            },
          });
        } else {
          console.log("no option compressor fired");
          compressor = new Compressor(files[i], {
            quality: 0.9,

            success(Blob) {
              fileName = Blob.name;
              fileSize = Blob.size;
              fileType = Blob.type;

              fileUrl = URL.createObjectURL(Blob);
              fileObj = {
                fileName,
                fileSize,
                fileType,
                fileUrl,
              };
              newOutputData.push(fileObj);
              if (newOutputData.length === files.length) {
                return new Promise((resolve, reject) => {
                  resolve(storeItem(newOutputData));
                });
              }
            },
            error(err) {
              console.log(err.message);
            },
          });
        }
        compressorArr.push(compressor);
      }
    }
    console.log(compressorArr);
  };

  async function storeItem(data) {
    console.log(data.length);
    localStorage.setItem("compressedFiles", JSON.stringify(await data));
    setCompressedImages((images) => data);
  }
  function compressedFiles(files, options) {
    return options
      ? new Promise((resolve, reject) => {
          resolve(startCompressing(files, options));
        })
      : new Promise((resolve, reject) => {
          resolve(startCompressing(files));
        });
  }

  async function optionsSubmit(e) {
    e.preventDefault();
    let options = {};
    let filenames = [];
    let selectionFiles = [];
    options["width"] = Number(e.target[2].value);
    options["height"] = Number(e.target[3].value);
    options["resize"] = e.target[4].value;
    options["quality"] = Number(e.target[5].value);
    options["mimetype"] = e.target[6].value;
    options["convertType"] = e.target[7].value;
    console.log(options);
    let newSelect = JSON.parse(localStorage.getItem("currentSelection"));
    for (let i = 0; i < newSelect.length; i++) {
      filenames.push(urlToFilename(newSelect[i].image.url));
    }

    for (let i = 0; i < fileArr.length; i++) {
      if (filenames.includes(fileArr[i].name)) {
        selectionFiles.push(fileArr[i]);
      }
    }
    setCurrentOptions((currentOptions) => options);

    console.log(selectionFiles);
    return await compressedFiles(selectionFiles, options);
  }

  function optionsChange(e) {
    e.preventDefault();
    console.log(e.target.value);
  }

  const calcArrIndex = (e) => {
    const lengthOfArray =
      currentSelection.length === 0 ? 0 : currentSelection.length - 1;
    console.log(lengthOfArray, currentEditObj);
    if (lengthOfArray <= -1) {
      return 0;
    }

    if (e.currentTarget.id === "left" && !currentEditObj <= 0) {
      return currentEditObj - 1;
    }

    if (currentEditObj <= 0 && e.currentTarget.id === "left") {
      return lengthOfArray;
    }
    if (e.currentTarget.id === "right" && !(currentEditObj >= lengthOfArray)) {
      return currentEditObj + 1;
    }
    if (currentEditObj === lengthOfArray && e.currentTarget.id === "right") {
      return 0;
    }
    if (e.currentTarget.id !== "right" && e.currentTarget.id !== "left") {
      return 0;
    }

    // console.log(currentEditObj);
  };
  function handleEditObj(e) {
    setCurrentEditObj(calcArrIndex(e));
    localStorage.setItem("currentEditObj", JSON.stringify(calcArrIndex(e)));
    console.log("handle edit obj!!!!!"), currentEditObj;
  }
  let selectionFiles = [];

  async function handleSelection(e) {
    setCurrentEditObj(calcArrIndex(e));

    let selectionData = imageData.filter((image) => {
      if (e.target.value === image.node.image.url) {
        return image;
      } else {
        return;
      }
    });

    let filenames = [];
    if (e.target.checked) {
      setCurrentSelection(addSelectionData(selectionData));
      localStorage.setItem(
        "currentSelection",
        JSON.stringify(addSelectionData(selectionData))
      );
      let newSelect =
        JSON.parse(localStorage.getItem("currentSelection")) ||
        addSelectionData(selectionData);

      // setCurrentEditObj(currentEditObj);
      for (let i = 0; i < newSelect.length; i++) {
        filenames.push(urlToFilename(newSelect[i].image.url));
      }

      for (let i = 0; i < fileArr.length; i++) {
        if (filenames.includes(fileArr[i].name)) {
          selectionFiles.push(fileArr[i]);
        }
      }
      // console.log(selectionFiles, "SELECTION FILES");
      localStorage.setItem("selectionFiles", selectionFiles);

      return await compressedFiles(selectionFiles);
    }
    if (!e.target.checked) {
      // localStorage.removeItem("currentSelection");
      setCurrentSelection(editSelectionData(selectionData, currentSelection));
      localStorage.setItem(
        "currentSelection",
        JSON.stringify(editSelectionData(selectionData, currentSelection))
      );

      let newSelect =
        JSON.parse(localStorage.getItem("currentSelection")) ||
        editSelectionData(selectionData, currentSelection);

      for (let i = 0; i < newSelect.length; i++) {
        filenames.push(urlToFilename(newSelect[i].image.url));
      }

      for (let i = 0; i < fileArr.length; i++) {
        if (filenames.includes(fileArr[i].name)) {
          selectionFiles.push(fileArr[i]);
        }
      }

      // console.log(selectionFiles, "SELECTION FILES");

      setCurrentEditObj((obj) => (obj === obj ? 0 : obj));
      localStorage.setItem("currentEditObj", JSON.stringify(0));
      localStorage.setItem("selectionFiles", selectionFiles);
      return await compressedFiles(selectionFiles);

      // console.log(currentSelection, "CURRENT SELECTION UNCHECKED");
    }

    // console.log(await compressedObj, "compressed Object");

    // console.log("handle Selection function", currentSelection);
  }

  function handleChange(e) {
    if (e.target.checked) {
      setFormData((arr) => [...arr, e.target.value]);
    } else {
      setFormData((arr) => {
        return arr.filter((item) => {
          return item !== e.target.value;
        });
      });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e);

    return setFormStatus(true);
  };
  // let images;

  async function loadImages(e) {
    e.preventDefault();
    await fetch("/images")
      .then((res) => res.json())
      .then((data) => {
        setImageData(data.data);
      });
  }
  const toDataURL = async (url) =>
    await fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  if (imageData) {
    localStorage.setItem("imageData", JSON.stringify(imageData));

    for (let i = 0; i < imageData.length; i++) {
      let url = imageData[i].node.image.url;
      let fileData;
      toDataURL(url).then((dataUrl) => {
        fileData = dataURLtoFile(dataUrl, urlToFilename(url));
        fileArr.push(fileData);
      });
    }
  }

  async function createFile(e) {
    e.preventDefault();
    console.log(e.target);

    const filesToUpload = JSON.parse(localStorage["compressedFiles"]);

    const base64 = filesToUpload.map((file) => {
      console.log(file);
    });

    // axios
    //   .post("/upload", {
    //     filesToUpload,
    //   })
    //   .then((res) => console.log(res))
    //   .catch((error) => console.log(error));
  }

  // INPUT EL VALUES
  let imageElements;
  let previewImage;
  let previewImageName;
  let previewImageType;
  let previewImageSize;
  let previewImageWidth;
  let previewImageHeight;

  if (currentSelection.length >= 1) {
    imageElements = currentSelection.map((image) => {
      return <img className="images" src={image.image.url}></img>;
    });
    previewImage = currentSelection[currentEditObj];
    let tempString;
    let newString;
    let strEndIndex;
    let strStartIndex;
    let fileStartIndex;

    console.log(currentSelection);
    if (previewImage) {
      tempString = previewImage.image.url.split("/files");
      newString = tempString[2];
      strEndIndex = newString.indexOf("?");
      strStartIndex = newString.indexOf("/");
      previewImageName = newString.slice(strStartIndex + 1, strEndIndex);
      fileStartIndex = previewImageName.indexOf(".");
      previewImageType = previewImageName.slice(fileStartIndex + 1);
      previewImageSize = previewImage.originalSource.fileSize * 0.001;
      previewImageWidth = previewImage.image.width;
      previewImageHeight = previewImage.image.height;
    }
  }

  if (imageData) {
    let elements = [];
    for (let i = 0; i < imageData.length; i++) {
      elements.push(
        <Image
          key={`${i}`}
          index={i}
          handleChange={handleChange}
          imageWidth={imageData[i].node.image.width}
          imageURL={imageData[i].node.image.url}
          imageHeight={imageData[i].node.image.height}
          imageID={imageData[i].node.image.id}
          fileSize={imageData[i].node.originalSource.fileSize}
        />
      );
    }

    if (imageData.length > 0 && formSubmitted === true) {
      let cardImages = [];

      // console.log(formData);

      for (let i = 0; i < formData.length; i++) {
        formData[i] = imageData[i].node.image.id
          ? cardImages.push(
              <>
                <div className="col-3">
                  <input
                    onChange={(e) => handleSelection(e)}
                    hidden
                    value={imageData[i].node.image.url}
                    type="checkbox"
                    id={`imageSelect-${i}`}
                    key={`imageSelect-${i}`}
                    className="img-checkbox"
                    name="compressed"
                  ></input>
                  <label
                    htmlFor={`imageSelect-${i}`}
                    key={`imageBarImg-${i}`}
                    className="img-container"
                  >
                    <img
                      key={`imageBarImgEl-${i}`}
                      className="card-img"
                      src={imageData[i].node.image.url}
                    ></img>
                  </label>
                </div>
              </>
            )
          : console.log(`${imageData[i].node.image.id} does not match`);
      }
      let obj = localStorage.getItem("compressedFiles");
      let compressedFiles;
      let currentObj;
      let fileUrl;
      let fileName;
      let fileSize;
      let fileType;
      let fileWidth;
      let fileHeight;
      let compressedImage;
      if (!currentObj) {
        currentObj = Number(localStorage["currentEditObj"]);
        console.log(currentObj);
      }

      if (obj !== undefined) {
        compressedFiles = JSON.parse(obj);
      }
      if (compressedFiles !== undefined) {
        console.log(compressedFiles, "compressedFiles LOCAL STORAGE");
      }
      if (
        compressedFiles !== undefined &&
        currentObj >= 0 &&
        compressedFiles[currentObj] !== undefined &&
        [...compressedFiles] !== null &&
        compressedFiles[0] !== null
      ) {
        compressedImage = compressedFiles.filter((file) => {
          if (file.fileName === previewImageName) {
            return file;
          }
        });

        if (compressedImage[0] !== undefined) {
          fileUrl = compressedImage[0].fileUrl;
          fileName = compressedImage[0].fileName;
          fileSize = compressedImage[0].fileSize;
          fileType = compressedImage[0].fileType;
          fileWidth = compressedImage[0].fileWidth;
          fileHeight = compressedImage[0].fileHeight;
        }
      }

      return (
        <>
          <div className="col h-100 p-4">
            <Card
              key={"upload"}
              loadImages={loadImages}
              data={imageData}
              setData={setImageData}
            />
            <ImageBar>{cardImages}</ImageBar>
            <div className="row">
              <div className="mt-4 col-3">
                <div className="mb-4">
                  <CreateCard createFile={createFile} />
                </div>
                <OptionsCard
                  optionsSubmit={optionsSubmit}
                  optionsChange={optionsChange}
                />
              </div>
              <div className="mt-4 col">
                <div className="col-12">
                  <InputCard
                    imageElements={imageElements}
                    previewImage={previewImage}
                    previewImageName={previewImageName}
                    previewImageType={previewImageType}
                    previewImageSize={previewImageSize}
                    previewImageWidth={previewImageWidth}
                    previewImageHeight={previewImageHeight}
                    handleEditObj={handleEditObj}
                    currentEditObj={currentEditObj}
                    currentSelection={currentSelection}
                  />
                </div>
                <div className="col-12 mt-4">
                  <OutputCard
                    // fileUrl={fileUrl}
                    // fileName={fileName}
                    // fileSize={fileSize}
                    // fileType={fileType}
                    fileUrl={fileUrl}
                    fileName={fileName}
                    fileSize={fileSize}
                    fileType={fileType}
                    fileWidth={fileWidth}
                    fileHeight={fileHeight}
                    previewImageSize={previewImageSize}
                    previewImageWidth={previewImageWidth}
                    previewImageHeight={previewImageHeight}
                    outputData={outputData.images}
                    currentEditObj={currentEditObj}
                    currentSelection={currentSelection}
                  />
                </div>
                <div className="col-12 mt-4">
                  <CompareCard
                    originalImageUrl={previewImage}
                    compressedImageUrl={fileUrl}
                  />
                </div>
              </div>
            </div>
            <Modal
              handleSubmit={handleSubmit}
              data={imageData}
              setData={setImageData}
            >
              {elements}
            </Modal>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="col h-100 p-4">
          <Card
            key={"upload"}
            loadImages={loadImages}
            data={imageData}
            setData={setImageData}
          />
          <Modal
            handleSubmit={handleSubmit}
            data={imageData}
            setData={setImageData}
          >
            {elements}
          </Modal>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="col h-100 p-4">
          <Card
            loadImages={loadImages}
            data={imageData}
            setData={setImageData}
          />
          <Modal
            handleSubmit={handleSubmit}
            data={imageData}
            setData={setImageData}
          ></Modal>
        </div>
      </>
    );
  }
}

export default Main;
