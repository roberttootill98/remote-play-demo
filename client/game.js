'use strict'

// a two player game

let players = [
  {
    'id': 0,
    'x': 0,
    'y': 0
  },
  {
    'id': 1,
    'x': 0,
    'y': 0
  }
];

/*
{
  'id': int,
  'x': int,
  'y': int
}
*/

function createGame(game) {
  removeModalWindow()

  // start session
  console.log("creating game...");
  console.log("id: " + game.id);
  console.log("name: " + game.name);

  const canvas = createGameBoard();
  // draw player 1
  drawPlayerModel(canvas, 50, 50, 0);
  // draw player 2
  drawPlayerModel(canvas, canvas.width - 50, canvas.height - 50, 1);

  window.addEventListener("keypress", keyPress);
}

function joinGame(ev) {
  removeModalWindow()

  // extract info from elements
  const parent = ev.currentTarget;
  const name = parent.childNodes[0].textContent;
  const id = parent.childNodes[1].textContent;

  console.log("joining: " + id);

  // should get canvas from session
  /*
  const canvas = createGameBoard();
  const model = drawPlayerModel(canvas, 50, 50, 1);
  */
}

function createGameBoard() {
  // create canvas
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.id = 'gameCanvas';
  canvas.setAttribute('width', 500);
  canvas.setAttribute('height', 200);
  return canvas;
}

function drawPlayerModel(canvas, x, y, id) {
  const template = document.getElementById('stickman');

  // draw graphics
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(x, y, 40, 0, 2 * Math.PI);
  ctx.stroke();

  // update data
  players[id].x = x;
  players[id].y = y;
}

// inputs
const inputs = {
  "w": upP1,
  "d": rightP1,
  "s": downP1,
  "a": leftP1,
  "i": upP2,
  "l": rightP2,
  "k": downP2,
  "j": leftP2
}

function keyPress(ev) {
  const key = ev['key'];
  const action = inputs[key];

  // should get based on cookie
  action();

  // get players
  const player1 = players[0];
  const player2 = players[1];

  const canvas = document.getElementById('gameCanvas');

  // clear canvas
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

  // draw each player again
  drawPlayerModel(canvas, player1.x, player1.y, 0);
  drawPlayerModel(canvas, player2.x, player2.y, 1);
}

function upP1() {
  const player1 = players[0];
  player1.y = player1.y - 5;
}

function rightP1() {
  const player1 = players[0];
  player1.x = player1.x + 5;
}

function downP1() {
  const player1 = players[0];
  player1.y = player1.y + 5;
}

function leftP1() {
  const player1 = players[0];
  player1.x = player1.x - 5;
}

function upP2() {
  const player2 = players[1];
  player2.y = player2.y - 5;
}

function rightP2() {
  const player2 = players[1];
  player2.x = player2.x + 5;
}

function downP2() {
  const player2 = players[1];
  player2.y = player2.y + 5;
}

function leftP2() {
  const player2 = players[1];
  player2.x = player2.x - 5;
}
