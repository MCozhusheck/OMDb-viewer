const express = require('express');
const User = require('../db/model');
const auth = require('../middleware/auth');
const request = require('request');
const axios = require('axios');

const router = express.Router();

router.get('/find/:title', async (req, res) => {
    const { data, status} = await axios.get(`http://www.omdbapi.com/?apikey=5aa9361f&t=${req.params.title}`)
    const {Title, Genre, Year, imdbID} = data;
    res.send({Title, Genre, Year, imdbID})
})

router.post('/favourite/:imdbID', auth, async (req, res) => {
    const user = req.user;
    const movie = user.favMovies.create({imdbID: req.params.imdbID});
    user.favMovies.push(movie);
    await user.save();
    res.send(user.favMovies);
})

router.post('/rate/:imdbID/:rating', auth, async (req, res) => {
    const user = req.user;
    const movie = user.favMovies.find(ele => ele.imdbID === req.params.imdbID);
    movie.userRating = req.params.rating;
    await user.save();
    res.send(movie);
})

module.exports = router;