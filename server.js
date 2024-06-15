const express = require('express');
const app = express();
const path = require('path');

app.use('/css', express.static(path.join(__dirname, 'views/assets/css')));
app.use('/js', express.static(path.join(__dirname, 'views/assets/javascripts')));

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

app.get('/tes', (req, res) => {
  const result = 'Hello from myFunction!';
  res.send(result);
});

app.get('/fetch', (req, res) => {
  res.sendFile(path.join(__dirname,'views/fetch.html'));
});

app.get('/submit', (req, res) => {
    res.sendFile(path.join(__dirname,'views/form.html'));
});

app.get('/webcam', (req, res) => {
    res.sendFile(path.join(__dirname,'views/webcam_crop.html'));
});

app.get('/park_slot', (req, res) => {
  const data = {
    "1": {
        "left": "204.5",
        "top": "230",
        "width": "155",
        "height": "209"
    },
    "2": {
        "left": "255.5",
        "top": "261",
        "width": "156",
        "height": "175"
    }
  };
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
});

// This middleware is available in Express v4.16.0 onwards
app.use(express.urlencoded({extended: true}));

app.post('/submit', (req, res) => {
  console.log({
    name: req.body.name,
    message: req.body.message,
  });
  res.redirect('/thankyou');
});

app.post('/update', (req, res) => {
  console.log(req.body);
});

app.get('/thankyou', (req, res) => {
    res.redirect('/submit');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});