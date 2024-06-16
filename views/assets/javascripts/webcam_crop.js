let cropper = "";
let dataToSend;
let intervalId;
const canvas = document.getElementById('canvas');
let model;
const previewImage = document.getElementById("preview-image");
const webcam = new Webcam(document.getElementById('wc'));

async function init(){
  await webcam.setup("device-list");
  model = await tf.loadLayersModel('js/tf_model/model.json');
  console.log(model.summary());

}

async function captureNow(){
  console.log("pressed");
  const dataURL = await webcam.captureWithoutTensorFlow();
  previewImage.src = dataURL;
  if(cropper){
    cropper.destroy();
  }
  cropper = new Cropper(previewImage);

}

async function startInterval() {
  let cropperData;
  intervalId = setInterval(async () => {
    console.log('halo');
    const ctx = canvas.getContext('2d');
    const dataURL = await webcam.captureWithoutTensorFlow(); // an URL of an image captured from webcam
    
    const img = new Image();
    img.src = dataURL;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // GET CROPPED DATA
    await fetch('/park_slot')
        .then(response => response.json()) // Parse the JSON from the response
        .then(data => {cropperData = data})   // Do something with the data
        .catch(error => console.error('Error:', error)); // Handle errors

    console.log(cropperData);

    for (let i in cropperData) {
      console.log(i);

      let { left, top, width, height } = cropperData[i];
      // left = left * 1.1862836;
      // top = top * 1.1862836;
      // width = width * 1.1862836;
      // height = height * 1.1862836;

      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      offscreenCtx.drawImage(img, left, top, width, height, 0, 0, width, height);
      const croppedImageURL = offscreenCanvas.toDataURL();
      const croppedImg = new Image();
      croppedImg.src = croppedImageURL;
      await new Promise((resolve) => {
        croppedImg.onload = resolve;
      });

      let classId = await predict(croppedImg);
      console.log(classId);

      fetch('/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          id: i.toString(),
          class: classId,
        }),
      })
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    }

  }, 5000);
}


function stopInterval(){
  clearInterval(intervalId);
}

async function cropCapture(){
  if(cropper){
    let data = cropper.getCropBoxData();
    console.log(data);
    const column = document.getElementById("column_input").value;
    const row = document.getElementById("row_input").value;

    dataToSend = {
      "left" : data['left'],
      "top" : data['top'],
      "width" : data['width'],
      "height" : data['height'],
      "row" : row,
      "column" : column
    }
    

  }
}

function convertToTf(imgSrc){
  return tf.tidy(() => {
    const webcamImage = tf.browser.fromPixels(imgSrc);
    const reversedImage = webcamImage.reverse(1);
    const croppedImage = webcam.cropImage(reversedImage);
    const expandedImg = croppedImage.expandDims(0);
    const batchedImg =  expandedImg.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    return tf.image.resizeBilinear(batchedImg,[150, 150]);
  });
}

function sendData(){
  if(dataToSend){
    fetch('/add_slot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        left : dataToSend['left'],
        top : dataToSend['top'],
        width : dataToSend['width'],
        height : dataToSend['height'],
        row : dataToSend['row'],
        column : dataToSend['column']
      }),
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    cropReset();
  }
}

function cropReset(){
  if(cropper){
    cropper.reset();
    dataToSend = null;
  }
}

async function predict(img){
  let classId;
  tf.tidy(async () => {
  let processedImg = convertToTf(img);
  let predictions = await model.predict(processedImg);
  classId = (await predictions.data())[0];
  });
  if(classId >= 10e-20){
    return 1;
  }else {
    return 0;
  }
}


init();
