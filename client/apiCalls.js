'use strict'

async function getGames() {
  const response = await fetch('/api/games');
  if(response.ok) {
    return await response.json();
  }
}

async function postGame(name, canvas) {
  // host details
  let query = `?hostCookie=${clientContent.cookie}`;
  // game details
  query = query + `&name=${name}`;

  const url = '/api/game' + query;

  const response = await fetch(url, {method: 'POST'});
  if(response.ok) {
    return await response.json();
  } else {
    console.error("failed to post game");
  }
}

async function updateGameData() {
  // host details
  let query = `?hostCookie=${clientContent.cookie}`;
  // game details
  query = query + `&gameData=${JSON.stringify(gameData)}`;

  const url = '/api/game' + query;

  const response = await fetch(url, {method: 'PUT'});
  if(response.ok) {
    console.log("game updated!");
  } else {
    console.error("failed to update game");
  }
}

// gets game data with game id
async function getGameData(gameID) {
  const url = `api/game?gameID=${gameID}&cookie=${clientContent.cookie}`;

  const response = await fetch(url);
  if(response.ok) {
    return await response.json();
  } else {
    console.error("failed to get game");
  }
}

async function startListen() {
  if (!!window.EventSource) {
    const url = `/api/listenGame?gameID=${gameData.gameID}&cookie=${clientContent.cookie}`;
    const source = new EventSource(url);

    // deal with server sent event
    source.addEventListener('message', event => {
      gameData = JSON.parse(event.data);

      // redraw elements
      const canvas = document.getElementById('gameCanvas');
      // clear canvas
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      drawPlayerModels(canvas);
    });

    source.addEventListener('open', event => {
      const stateElement = document.getElementById('state');
      console.log('Connected!');
      stateElement.textContent = 'Connected';
    });

    source.addEventListener('error', event => {
      const stateElement = document.getElementById('state');
      if (event.eventPhase == EventSource.CLOSED) {
        source.close();
      }
      if (event.target.readyState == EventSource.CLOSED) {
        stateElement.textContent = 'Disconnected';
      }
      if (event.target.readyState == EventSource.CONNECTING) {
        stateElement.textContent = 'Connecting...';
      }
    });
  } else {
    console.log('Your browser does not support server sent events');
  }
}
