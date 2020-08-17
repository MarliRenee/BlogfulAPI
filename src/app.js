require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const ArticlesService = require('./articles-service')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

// We'll need to make a GET /articles endpoint that gets all of the articles from the database.
//This endpoint can make use of the ArticlesService we created in the checkpoint 14.
app.get('/articles', (req, res, next) => {
    const knexInstance = req.app.get('db')
    ArticlesService.getAllArticles(knexInstance)
    //Use the ArticlesService.getAllArticles method inside the endpoint to populate the response.   
    .then(articles => {
            res.json(articles)
        })
        .catch(next)
        // Note we're passing next into the .catch from the promise chain 
        // so that any errors get handled by our error handler middleware.
})

//Implement the rest of the endpoint and make the test pass by using 
//the getById method on the articles service:
app.get('/articles/:article_id', (req, res, next) => {
    const knexInstance = req.app.get('db')
    ArticlesService.getById(knexInstance, req.params.article_id)
        .then(article => {
          res.json(article)
        })
        .catch(next)
})

app.get('/', (req, res) => {
   res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app