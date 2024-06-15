importScripts('cropper.js')
let cropper = "";
let hiddenImage
let model;
let data;

async function init(){
  if(cropper){
    cropper.destroy();
  }
  cropper = new Cropper(hiddenImage);
}

onmessage = async function(event) {
  // Retrieve the parameters passed from the main thread
  model = event.data[1]
  dataURL = event.data[0];

//   const blob = await fetch(dataURL).then(response => response.blob());
//   hiddenImage = await createImageBitmap(blob);

//   init();

//   await fetch('/park_slot')
//     .then(response => response.json()) // Parse the JSON from the response
//     .then(data => {this.data = data})   // Do something with the data
//     .catch(error => console.error('Error:', error)); // Handle errors

//   for (let i = 0; i < data.length; i++) {
    // cropper.setCropBoxData(data[i]);
    //let img = cropper.getCroppedCanvas({});
    // let classId = predict(img);
    // fetch('/update', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: new URLSearchParams({
    //     id: i.toString(),
    //     class: classId,
    //   }),
    // })
    //   .then(response => response.text())
    //   .then(data => console.log(data))
    //   .catch(error => console.error('Error:', error));


//   }
};

function convertToTf(imgSrc){
  return tf.tidy(() => {
    // Reads the image as a Tensor from the webcam <video> element.
    const webcamImage = tf.browser.fromPixels(imgSrc);

    const reversedImage = webcamImage.reverse(1);

    // Crop the image so we're using the center square of the rectangular
    // webcam.
    const croppedImage = webcam.cropImage(reversedImage);

    // Expand the outer most dimension so we have a batch size of 1.
    const batchedImage = croppedImage.expandDims(0);

    // Normalize the image between -1 and 1. The image comes in between 0-255,
    // so we divide by 127 and subtract 1.
    const expandedImg = batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));

    return tf.image.resizeBilinear(expandedImg,[150, 150]);
  });
}

async function predict(img){
  let processedImg = convertToTf(img);
  let predictions = await model.predict(processedImg);
  // const myJSON = JSON.stringify(predictions.argMax());
  const classId = (await predictions.data())[0];
  if(classId >= 10e-20){
    return 0;
  }else {
    return 1;
  }
}
