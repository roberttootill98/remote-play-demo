'use strict'

const express = require('express');
const app = express();
//const db = require('./ModelSQL.js');

app.get('/api/item', getItem);

async function getItem(req, res) {
    res.json({'item': 0});
}

app.listen(8080);

app.use('/', express.static('client', {'extensions': ['html']}));
