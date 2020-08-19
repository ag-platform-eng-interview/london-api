const express = require('express');
const app = express();

const api = require('./src/controllers/api');

app.use('/', api);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
module.exports = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});