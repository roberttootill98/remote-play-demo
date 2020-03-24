'use strict'

// npm modules
const express = require('express');
const crypto = require('crypto');
// our modules
const db = require('./modelSQL.js');

let clients = [];

async function login(req, res) {
  const username = req.query.username;
  const client = getClient('username', username);

  if(client) {
    // check if email is in clients first
    res.send(client);
  } else {
    // otherwise generate cookie
    const hash = crypto.createHash('md5');
    const password = req.query.password;

    hash.update(password);

    const attempt = await db.getUser(username, hash.digest('hex'));
    if(attempt instanceof Error === false) {
        const currentDate = new Date();
        // generate cookie
        const cookie = generateCookie();

        // form response content
        const responseContent = {
          'cookie': cookie,
          'username': attempt.Username
        };

        // add new client to clients
        clients.push(responseContent);
        // respond with cookie
        res.json(responseContent);
    } else {
        console.log("Failed auth attempt!");
        // respond with failure status
        res.sendStatus(404);
    }
  }
}

// generates cookie
function generateCookie() {
  const hash = crypto.createHash('md5');
  const id = (Math.floor(Math.random() * 1000000000)).toString();
  hash.update(id);
  return hash.digest('hex');
}

function getClients() {
  return clients;
}

// gets client using a field and a value
function getClient(field, value) {
  for(let client of clients) {
    if(client[field] == value) {
      return client;
    }
  }
}

// hashes string for debugging
function hashString(string) {
  const hash = crypto.createHash('md5');
  hash.update(string);
  return hash.digest('hex');
}

module.exports = {
  login: login,
  generateCookie: generateCookie,
  getClients: getClients,
  getClient: getClient,
  hashString: hashString
}
