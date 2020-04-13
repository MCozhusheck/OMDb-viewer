# Node.js OMDb API viewer
Node.js miquido internship task 2020

## Installation
Create .env file with 3 variables: MONGODB_URL, JWT_KEY and PORT.

example: 
MONGODB_URL=mongodb://localhost/omdb-viewer
JWT_KEY=TossACoinToTheWitcher
PORT=3000

npm install
start mongo server (sudo service mongod start)
npm run start

### Usage

Create user at endpoint /user/register with body as JSON containing 3 fields:
name - nickname used in api, can be anything
email - must be unique
password - at least 5 characters

Response contains token used in authorization and authentication used in another endpoints.

Login at /user/login with email and password and collect token in response.

Endpoint /user/me requires bearer authentication. Response contains information about user.

/user/logout/ deletes user token from database.

/user/logoutall/ deletes all user tokens from database.

/movie/find/:title searches for title in OMDb API

/movie/markfavourite/:imdbID marks movie with given imdbID at user favourite. Requires token.

/movie/unmarkfavourite/:imdbID similar as previous one but unmark movie. Also requires token.

/movie/rate/:imdbID/:rating rates given movie by user, this endpoint also requires token.