'use strict'

async function boot() {
  if(clientContent.cookie) {
    // prompt modal window
    const games = await getGames();
    promptModalWindow(games);
  } else {
    // prompt login
    promptLoginWindow();
  }
}

async function getGames() {
  const response = await fetch('/api/games');
  if(response.ok) {
    return await response.json();
  }
}

function promptModalWindow(games) {
  // create container
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.id = 'modalWindow';

  // create container list
  const gameList = document.createElement('ul');
  container.appendChild(gameList);
  gameList.id = 'gameList';

  // add games
  for(let game of games) {
    const gameContainer = document.createElement('div');
    gameList.appendChild(gameContainer);
    gameContainer.classList.add('gameContainer');

    // add name
    const nameLabel = document.createElement('p');
    gameContainer.appendChild(nameLabel);
    nameLabel.classList.add('nameLabel');
    nameLabel.textContent = game.name;
    // add id
    const idLabel = document.createElement('p');
    gameContainer.appendChild(idLabel);
    idLabel.classList.add('idLabel');
    idLabel.textContent = game.id;

    gameContainer.onclick = joinGame;
  }

  // add create new button
  const createNew = document.createElement('button');
  container.appendChild(createNew);
  createNew.onclick = newGameModalWindow;
  createNew.textContent = 'Create new game';
  createNew.classList.add('button');
}

function newGameModalWindow() {
  const container = document.getElementById('modalWindow');

  // delete elements in modal window
  const childNodes = container.childNodes;
  for(let childNode of childNodes) {
      childNode.remove();
  }

  // add entry fields
  // name
  // label
  const nameLabel = document.createElement('p');
  container.appendChild(nameLabel);
  nameLabel.textContent = 'Name:';
  // input
  const nameInput = document.createElement('input');
  container.appendChild(nameInput);
  nameInput.id = 'nameInput';

  // buttons
  // create
  const create = document.createElement('button');
  container.appendChild(create);
  create.onclick = createGame;
  create.textContent = 'Done';
  create.classList.add('button');
  // cancel
  const cancel = document.createElement('button');
  container.appendChild(cancel);
  cancel.onclick = removeModalWindow;
  cancel.textContent = 'Cancel';
  cancel.classList.add('button');
}

async function removeModalWindow() {
  // delete current modalWindow
  document.getElementById('modalWindow').remove();
}

window.addEventListener("load", boot);
