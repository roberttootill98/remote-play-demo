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
// server sent events
app.get('/api/listenGame', listenGame);
// auth
app.post('/api/login', auth.login);

db.init();

// gets a specific game with host cookie
async function getGame(req, res) {
  const gameID = req.query.gameID;
  const clientCookie = req.query.cookie;

  // get game from server memory
  let responseGame;
  for(let game of games) {
    if(gameID == game.gameID) {
      responseGame = game;
      break;
    }
  }

  // add joining client cookie to game data as player 2
  responseGame.playerData[1].id = clientCookie;

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
    //console.log(res);

    const hostCookie = req.query.hostCookie;
    const name = req.query.name;
    // create game json
    const game = {
      'name': name,
      'gameID': auth.generateCookie(),
      'playerData': [
        {'id': hostCookie, 'x': 0, 'y': 0}, // host is player one
        {'id': null, 'x': 0, 'y': 0}
      ]
    };

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
  const gameData = JSON.parse(req.query.gameData);

  try {
    // get game from server memory
    let gameFound;
    for(let game of games) {
      if(gameData.gameID == game.gameID) {
        // update game player data
        game.playerData = gameData.playerData;
        gameFound = game;
        break;
      }
    }

    sendEventsToAll(gameFound);

    res.sendStatus(200);
  } catch(e) {
    console.error(e);
    res.sendStatus(404);
  }
}

// sends event to all clients associated with game to update game locally
function sendEventsToAll(game) {
  // only send to connected clients
  let clients = [];
  for(let playerData of game.playerData) {
    if(playerData.id) {
      clients.push(auth.getClient('cookie', playerData.id));
    }
  }

  clients.forEach(c => c.res.write(`data: ${JSON.stringify(game)}\n\n`))
}

// server sent events
async function listenGame(req, res) {
  const gameID = req.query.gameID;
  const clientCookie = req.query.cookie;

  // get game from server memory
  let responseGame;
  for(let game of games) {
    if(gameID == game.gameID) {
      responseGame = game;
      break;
    }
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  res.write(`data: ${JSON.stringify(responseGame)} \n\n`);

  auth.addClientRes(clientCookie, res);
}

// in memory data
let games = [];
