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
      "left": 886.75,
      "top": 256,
      "width": 31,
      "height": 56
  },
    2: {
      "left": 888.75,
      "top": 365,
      "width": 31,
      "height": 56
    },
    3: {
      "left": 890.75,
      "top": 419,
      "width": 31,
      "height": 56
  }
  };
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
});

// This middleware is available in Express v4.16.0 onwards
app.use(express.urlencoded({extended: true}));

app.post('/add_data', (req, res) => {
  console.log(req.body);
  res.redirect('/thankyou');
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