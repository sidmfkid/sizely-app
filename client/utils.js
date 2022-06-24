function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  let byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(storeResults(reader.result));
    reader.readAsDataURL(blob);
  });
}

function storeResults(results) {
  if (localStorage["blobs"]) {
    let blobs = JSON.parse(localStorage["blobs"]);

    let uniqueBlobs = blobs.filter((blob) => blob !== results);
    localStorage.setItem("blobs", JSON.stringify([...uniqueBlobs, results]));
  }
  if (!localStorage["blobs"]) {
    localStorage["blobs"] = JSON.stringify([results]);
  }
  //   console.log(results);
}

export { dataURItoBlob, blobToBase64 };
