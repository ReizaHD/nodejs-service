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
      "left": 1026.5,
      "top": 621,
      "width": 37,
      "height": 73
    },
    2: {
      "left": 1021.5,
      "top": 240,
      "width": 37,
      "height": 73
    },
    3: {
      "left": 784.5,
      "top": 431,
      "width": 37,
      "height": 73
    },
    4: {
      "left": 694.5,
      "top": 499,
      "width": 39,
      "height": 65
    },
    5: {
      "left": 814.5,
      "top": 620,
      "width": 40,
      "height": 79
    }
  };
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
});

// This middleware is available in Express v4.16.0 onwards
app.use(express.urlencoded({extended: true}));

app.post('/add_slot', (req, res) => {
  console.log(req.body);
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