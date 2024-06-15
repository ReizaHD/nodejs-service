let cropper = "";
let hidden_cropper = "";
let model;
let worker;
const previewImage = document.getElementById("preview-image");
const hiddenImage = document.getElementById("preview-image-crop");
const test = document.getElementById("test");
const webcam = new Webcam(document.getElementById('wc'));

async function init(){
  await webcam.setup("device-list");
  model = await tf.loadLayersModel('js/tf_model/model.json');
  console.log(model.summary());

}

async function startWorker(){
  console.log('pressed');
  
  if (window.Worker) {
      worker = new Worker('js/worker.js');
      setInterval(async () => {
        const dataURL = await webcam.captureWithoutTensorFlow();
        const parameters = {dataURL, model};
        worker.postMessage(parameters);
      }, 10000); // Run every 10 seconds
      
      worker.onmessage = function(event) {
          console.log("berhasil");
      };

      worker.onerror = function(error) {
          console.error('Worker error:', error);
      };
  } else {
      console.error('Web Workers are not supported in your browser.');
  }
}

function stopWorker(){
  
  if (worker) {
    console.log('pressed');
    worker.terminate();
    worker = null;
  }
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

async function cropCapture(){
  if(cropper){
    let data = cropper.getCropBoxData();//JSON
    console.log(data);
    const column = document.getElementById("column_input");
    const row = document.getElementById("row_input");
  }
}

function sendData(){
  console.log("Pressed Send Data")
}

function cropReset(){
  if(cropper){
    cropper.reset();
  }
}

init();
