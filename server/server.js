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
app.get('/api/game', getGame);
app.get('/api/games', getGames);
app.post('/api/game', postGame);
app.put('/api/game', updateGame);
// auth
app.post('/api/login', auth.login);

db.init();

// gets a specific game with host cookie
async function getGame(req, res) {
  const gameID = req.query.gameID;

  // get game from server memory
  let responseGame;
  for(let game of games) {
    if(gameID == game.gameID) {
      responseGame = game;
      break;
    }
  }

  if(responseGame) {
    res.json(responseGame);
  } else {
    res.sendStatus(404);
  }
}

// returns all sessions
async function getGames(req, res) {
  res.json(games);
}

// adds a new session to sessions json
async function postGame(req, res) {
  try {
    const hostCookie = req.query.hostCookie;
    const name = req.query.name;
    // create game json
    const game = {'name': name, 'gameID': auth.generateCookie()};

    console.log(`User ${auth.getClient('cookie', hostCookie).username} just created a game!`);

    games.push(game);
    res.json(game);
  } catch(e) {
    console.error(e);
    res.sendStatus(404);
  }
}

// updates game data
async function updateGame(req, res) {
  const hostCookie = req.query.hostCookie;
  const gameData = JSON.parse(req.query.gameData);

  try {
    // get game from server memory
    for(let game of games) {
      //console.log(game.gameID);
      if(gameData.gameID == game.gameID) {
        // update game player data
        game.playerData = gameData.playerData;
        break;
      }
    }

    res.sendStatus(200);
  } catch(e) {
    console.error(e);
    res.sendStatus(404);
  }
}

// in memory data
let games = [];
