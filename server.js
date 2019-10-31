require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movies-data.json')

const app = express()
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization')
    if (!authToken || apiToken !== authToken.split(" ")[1]) {
        res.status(401).json({error: 'Unauthorized request'})
    }
    next()
})

function handleGetMovies(req, res) {
    let results = MOVIES;
    const { genre, country, avg_vote } = req.query
    if (genre) {
        results = results.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }
    if (country) {
        results = results.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))
    }
    if (avg_vote) {
        results = results.filter(movie => Number(movie.avg_vote) >= Number(avg_vote))
        results.sort((a, b) => b.avg_vote - a.avg_vote)
    }
    res.json(results);
}

app.get('/movie', handleGetMovies);

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error'}}
    }
    else { 
        response = {error}
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})

