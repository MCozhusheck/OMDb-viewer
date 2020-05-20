const express = require('express');
const User = require('../db/model');
const auth = require('../middleware/auth');
const softAuth = require('../middleware/softAuth')
const axios = require('axios');

const router = express.Router();

router.get('/find/:title', softAuth, async (req, res) => {
    const title = req.params.title;
    const { data, status} = await axios.get(`http://www.omdbapi.com/?apikey=5aa9361f&t=${title}`)
    if(data.Response === 'False') {
        res.status(status).send(data)
        return;
    }
    const {Title, Genre, Year, imdbID} = data;
    const usersWithMovie = await User.find({'movies.imdbID': imdbID, 'movies.userRating': {$ne: null}});
    const averageRating = usersWithMovie.reduce((total, next) => total + next.movies.find(ele => ele.imdbID === imdbID).userRating, 0) / usersWithMovie.length;
    
    const user = req.user;
    if(!user) {
        res.send({Title, Genre, Year, imdbID, averageRating})
    } else {
        const userMovie = user.movies.find(ele => ele.imdbID === imdbID);
        if(!userMovie) {
            res.send({Title, Genre, Year, imdbID, averageRating})
        } else {
            const {userRating, isFavourite} = userMovie;
            res.send({Title, Genre, Year, imdbID, averageRating, userRating, isFavourite})
        }
    }
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
    try {
        const user = req.user;
        const movie = user.movies.find(ele => ele.imdbID === req.params.imdbID);
        if (movie === undefined || movie.length == 0) {
            const newMovie = user.movies.create({imdbID: req.params.imdbID, isFavourite: false});
            user.movies.push(newMovie);
        } else {
            movie.isFavourite = false;
        }
        await user.save();
        res.send(movie);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

router.post('/rate/:imdbID/:rating', auth, async (req, res) => {
    try {
        const user = req.user;
        const rating = req.params.rating
        let movie = user.movies.find(ele => ele.imdbID === req.params.imdbID);
        if (movie === undefined || movie.length == 0) {
            const newMovie = user.movies.create({imdbID: req.params.imdbID, userRating: rating});
            user.movies.push(newMovie);
            movie = newMovie;
        } else {
            movie.userRating = rating;
        }
        await user.save();
        res.send(movie);
    } catch (error) {
        console.log(error);
        res.send(400).send(error);
    }
})

module.exports = router;