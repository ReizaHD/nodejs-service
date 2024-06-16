let cropper = "";
let intervalId;
let hiddenCropper="";
let model;
let cropperData;
const previewImage = document.getElementById("preview-image");
const hiddenImage = document.getElementById('preview-image-crop');
const test = document.getElementById("test");
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
// - id (unique)
// - left
// - top
// - width
// - height
// - column
// - row

async function startInterval(){
  let count = 0;
  intervalId = setInterval(async () => {
      const dataURL = await webcam.captureWithoutTensorFlow();
      hiddenImage.src = dataURL;
      
      if(hiddenCropper){
        hiddenCropper.destroy();
      }
      hiddenCropper = new Cropper(hiddenImage);

      await fetch('/park_slot')
        .then(response => response.json()) // Parse the JSON from the response
        .then(data => {cropperData = data})   // Do something with the data
        .catch(error => console.error('Error:', error)); // Handle errors

      console.log(cropperData);

      for (let i in cropperData) {
        console.log(i);
        hiddenCropper.setCropBoxData(cropperData[i]);
        let img = hiddenCropper.getCroppedCanvas();
        let classId = await predict(img);
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
    let data = cropper.getCropBoxData();//JSON
    console.log(data);
    const column = document.getElementById("column_input");
    const row = document.getElementById("row_input");

    //kirim variable data, row, column ke database

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
  console.log("Pressed Send Data")
}

function cropReset(){
  if(cropper){
    cropper.reset();
  }
}

async function predict(img){
  let processedImg = convertToTf(img);
  let predictions = await model.predict(processedImg);
  const classId = (await predictions.data())[0];
  console.log(classId);
  if(classId >= 10e-20){
    return classId;
  }else {
    return classId;
  }
}

function predictAll(){
  // cropperData = //Ambil semua data dari database;
  for (let i = 0; i < cropperData.length; i++) {
    cropper.setCropBoxData(cropperData[i]);
    let img = cropper.getCroppedCanvas({});
    let classId = predict(img);
    //update data di database

  }
}

init();
