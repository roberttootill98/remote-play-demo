'use strict'

// a two player game

let gameData = {
  playerData: [
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
  ]
};



async function createGame() {
  const name = document.getElementById('nameInput').value;

  removeModalWindow();

  const canvas = createGameBoard();
  // draw player 1
  drawPlayerModel(canvas, 50, 50, 0);
  // draw player 2
  drawPlayerModel(canvas, canvas.width - 50, canvas.height - 50, 1);

  // post game
  const game = await postGame(name, canvas);
  gameData.gameID = game.gameID;
  gameData.name = game.name;

  await updateGameData();

  console.log("creating game...");
  console.log("game cookie: " + game.gameID);
  console.log("name: " + game.name);

  window.addEventListener("keypress", keyPress);
  //window.addEventListener("keydown", keyPress);
  //window.addEventListener("keyup", keyPress);
}

async function joinGame(ev) {
  removeModalWindow();

  // extract info from elements
  const parent = ev.currentTarget;
  const name = parent.childNodes[0].textContent;
  const gameID = parent.childNodes[1].textContent;

  console.log("Joining: " + name);

  // should get canvas from session
  const canvas = createGameBoard();

  // get gameData from server
  gameData = await getGameData(gameID);

  drawPlayerModels(canvas);

  window.addEventListener("keypress", keyPress);
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

// draws players models according to game data
function drawPlayerModels(canvas) {
  for(let player of gameData.playerData) {
    // draw graphics
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(player.x, player.y, 40, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

// draws a specific playerModel(index) at a given xy
function drawPlayerModel(canvas, x, y, index) {
  // draw graphics
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(x, y, 40, 0, 2 * Math.PI);
  ctx.stroke();

  // update data
  gameData.playerData[index].x = x;
  gameData.playerData[index].y = y;
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

async function keyPress(ev) {
  const key = ev['key'];
  const action = inputs[key];

  // should get based on cookie
  if(action) {
    action();

    // get players
    const player1 = gameData.playerData[0];
    const player2 = gameData.playerData[1];

    const canvas = document.getElementById('gameCanvas');

    // clear canvas
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    // draw items again

    // draw each player again
    drawPlayerModel(canvas, player1.x, player1.y, 0);
    drawPlayerModel(canvas, player2.x, player2.y, 1);

    await updateGameData();
  }
}

function upP1() {
  const player1 = gameData.playerData[0];
  player1.y = player1.y - 5;
}

function rightP1() {
  const player1 = gameData.playerData[0];
  player1.x = player1.x + 5;
}

function downP1() {
  const player1 = gameData.playerData[0];
  player1.y = player1.y + 5;
}

function leftP1() {
  const player1 = gameData.playerData[0];
  player1.x = player1.x - 5;
}

function upP2() {
  const player2 = gameData.playerData[1];
  player2.y = player2.y - 5;
}

function rightP2() {
  const player2 = gameData.playerData[1];
  player2.x = player2.x + 5;
}

function downP2() {
  const player2 = gameData.playerData[1];
  player2.y = player2.y + 5;
}

function leftP2() {
  const player2 = gameData.playerData[1];
  player2.x = player2.x - 5;
}
