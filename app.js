const express = require('express');
const port = process.env.PORT || 3001;
require('./db/db');
const userRouter = require('./routes/user')

const app = express();
app.use(express.json());
app.use('/user/', userRouter)

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Listening at port ${port}`))