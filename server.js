const express = require('express');
const app = express();
const path = require('path');

app.use('/css', express.static(path.join(__dirname, 'views/assets/css')));
app.use('/js', express.static(path.join(__dirname, 'views/assets/javascripts')));


// app.get('/tes', (req, res) => {
//   const result = 'Hello from myFunction!';
//   res.send(result);
// });

app.get('/fetch', (req, res) => {
  res.sendFile(path.join(__dirname,'views/fetch.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views/webcam_crop.html'));
});

app.get('/park_slot', (req, res) => {
  const data = {
    1: {
      "left": 282.5,
      "top": 33,
      "width": 94,
      "height": 165
  },
    2: {
      "left": 345.5,
      "top": 34,
      "width": 94,
      "height": 165
  },
    3: {
      "left": 466.5,
      "top": 29,
      "width": 94,
      "height": 165
  },
    4: {
      "left": 534.5,
      "top": 30,
      "width": 94,
      "height": 165
  },
    5: {
      "left": 602.5,
      "top": 28,
      "width": 94,
      "height": 165
  },
    6: {
      "left": 279.5,
      "top": 323,
      "width": 94,
      "height": 165
  },
    7: {
      "left": 347.5,
      "top": 321,
      "width": 94,
      "height": 165
  },
    8: {
      "left": 466.5,
      "top": 321,
      "width": 94,
      "height": 165
  },
    9: {
      "left": 536.5,
      "top": 316,
      "width": 94,
      "height": 165
  },
    10: {
      "left": 604.5,
      "top": 317,
      "width": 94,
      "height": 165
  }
  };
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
});

// This middleware is available in Express v4.16.0 onwards
app.use(express.urlencoded({extended: true}));

app.post('/add_slot', (req, res) => {
  console.log(req.body);
  res.send("Recieved");
});

app.post('/update', (req, res) => {
  console.log(req.body);
});

app.get('/parking_slot', (req, res) => {
  //query
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});