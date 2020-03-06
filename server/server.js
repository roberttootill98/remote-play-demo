'use strict'

// npm modules
const express = require('express');
const app = express();
// our modules
const db = require('./modelSQL.js');
const auth = require('./auth-server.js');

app.listen(8080);

app.use('/', express.static('client', {'extensions': ['html']}));

// http verbs
app.get('/api/games', getGames);
app.post('/api/game', postGame);
// auth
app.post('/api/login', auth.login);

db.init();

// returns all sessions
async function getGames(req, res) {
  //console.log(req.session.id);
  //console.log(req.session.cookie);
  res.json(games);
}

// adds a new session to sessions json
async function postGame(req, res) {
  try {
    const hostCookie = req.query.hostCookie;
    const name = req.query.name;
    // create game json
    const game = {'name': name, 'id': auth.generateCookie()};

    console.log(`User ${auth.getClient('cookie', hostCookie).username} just created a game!`);

    games.push(game);
    res.json(game);
  } catch(e) {
    console.error(e);
    res.sendStatus(404);
  }
}

// in memory data
let games = [];
