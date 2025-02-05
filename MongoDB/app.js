const express = require('express');
const PORT = 1410;

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Server is running</h1>');
}

app.