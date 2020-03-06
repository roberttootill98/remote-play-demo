'use strict'

let clientContent = {
  'cookie': null,
  'username': null
};

async function login(username, password) {
  const url = `/api/login?username=${username}&password=${password}`;

  const response = await fetch(url, {method: 'post'});
  if(response.ok) {
    // extract content
    clientContent = await response.json();
  } else {
    console.log('failure');
  }
}

// debug
async function hashString(string) {
  const url = `/api/hashString?string=${string}`;
  const response = await fetch(url);
  if(response.ok) {
    console.log(await response.text());
  } else {
    console.error('failed to hash string');
  }
}

function promptLoginWindow() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.id = 'loginContainer';

  // name
  const nameContainer = document.createElement('div');
  container.appendChild(nameContainer);
  // label
  const nameLabel = document.createElement('p');
  nameContainer.appendChild(nameLabel);
  nameLabel.textContent = 'Name:';
  // input
  const nameInput = document.createElement('input');
  nameContainer.appendChild(nameInput);
  nameInput.id = 'nameInput';

  // password
  // name
  const passwordContainer = document.createElement('div');
  container.appendChild(passwordContainer);
  // label
  const passwordLabel = document.createElement('p');
  passwordContainer.appendChild(passwordLabel);
  passwordLabel.textContent = 'Password:';
  // input
  const passwordInput = document.createElement('input');
  passwordContainer.appendChild(passwordInput);
  passwordInput.id = 'passwordInput';

  // buttons
  const buttonContainer = document.createElement('div');
  container.appendChild(buttonContainer);
  // submit
  const submitButton = document.createElement('button');
  buttonContainer.appendChild(submitButton);
  submitButton.onclick = submit;
  submitButton.textContent = 'Submit';
}

async function submit() {
  const username = document.getElementById('nameInput').value;
  const password = document.getElementById('passwordInput').value;

  await login(username, password);

  // delete elements
  document.getElementById('loginContainer').remove();

  boot();
}
