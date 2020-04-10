const express = require('express');
const port = process.env.PORT || 3000;
require('./db/db');

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Listening at port ${port}`))