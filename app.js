const express = require('express');
const port = process.env.PORT || 3001;
const cors = require('cors');
require('./db/db');
const userRouter = require('./routes/user')
const movieRouter = require('./routes/movie')

const app = express();
app.use(cors())
app.use(express.json());
app.use('/user/', userRouter)
app.use('/movie/', movieRouter)

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Listening at port ${port}`))