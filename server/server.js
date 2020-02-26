'use strict'

const express = require('express');
const app = express();
const session = require('express-session');
//const db = require('./modelSQL.js');

app.listen(8080);

app.use('/', express.static('client', {'extensions': ['html']}));
//app.set('trust proxy', 1);
app.use(session({
  genid: function(req) {
    return genuuid()
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  //cookie: {secure: true}
}));

// session handling
function genuuid() {
  // should be validated
  return Math.floor(Math.random() * 1000000000);
}

// http verbs
app.get('/api/games', getGames);
app.post('/api/game', postGame);

// returns all sessions
async function getGames(req, res) {
  console.log(req.session.id);
  //console.log(req.session.cookie);
  res.json(games);
}

// adds a new session to sessions json
async function postGame(req, res) {
  try {
    const name = req.query.name;
    const id = req.session.id;
    const game = {'name': name, 'id': id};

    console.log(game);
    //console.log(store.get(req.session.id));

    games.push(game);
    res.json(game);
  } catch(e) {
    console.error(e);
    res.sendStatus(404);
  }
}

// in memory data
let games = [];
