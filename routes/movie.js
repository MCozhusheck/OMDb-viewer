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

router.post('/markfavourite/:imdbID', auth, async (req, res) => {
    try {
        const user = req.user;
        const movie = user.movies.find(ele => ele.imdbID === req.params.imdbID);
        if (movie === undefined || movie.length == 0) {
            const newMovie = user.movies.create({imdbID: req.params.imdbID, isFavourite: true});
            user.movies.push(newMovie);
        } else {
            movie.isFavourite = true;
        }
        await user.save();
            res.send(user.movies);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

router.post('/unmarkfavourite/:imdbID', auth, async (req, res) => {
    const user = req.user;
    const movie = user.movies.find(ele => ele.imdbID === req.params.imdbID);
    movie.isFavourite = false;
    await user.save();
    res.send(movie);
})

router.post('/rate/:imdbID/:rating', auth, async (req, res) => {
    const user = req.user;
    const movie = user.movies.find(ele => ele.imdbID === req.params.imdbID);
    movie.userRating = req.params.rating;
    await user.save();
    res.send(movie);
})

module.exports = router;