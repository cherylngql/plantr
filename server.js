const express = require('express');
const html = require("html-template-tag");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { db, Vegetable, Plot, Gardener } = require('./model');

const app = express();

db.authenticate().then(() => {
  console.log('connected to the database');
});

app.get('/gardeners', (req, res) => {
  Gardener.findAll({order: [
    ['id', 'ASC']
],include: [{ all: true, nested: true }]}).then((foundGardeners) => {
    res.send(html`
    <h3>Gardeners</h3>
    <ul class="list-unstyled">
      <ul>
      ${foundGardeners.map(gardener => 
      html`<li>
        Farmer ${gardener.id}: <a href="/gardeners/${gardener.id}">${gardener.name}</a><br/>
        Age: ${gardener.age}<br/>
        Favourite Vegetable: ${gardener.favourite_vegetable.name}
      </li>`)}
      </ul>
    </ul>`);
  });
});

app.get('/gardeners/:gardenerId', (req, res) => {
  const gardenerId = req.params.gardenerId;
  Gardener.findOne({where: {id: gardenerId}, include: [{ all: true, nested: true }]}).then((gardener) => {
    res.send(html`
    <h2>${gardener.name}'s profile</h2>
    <h3>Favourite Vegetable: ${gardener.favourite_vegetable.name}</h3>
    <h3>${gardener.name}'s plot has size ${gardener.plot.size}</h3>
    <ul class="box">
      ${gardener.plot.vegetables.map(vegetable => html`
        <li>${vegetable.name} (${vegetable.color})</li>
      `)}
    </ul>
    `);
  });
});

const PORT = 3000;
const init = async () => {
  await db.sync();
  app.listen(PORT, () => {
    console.log(`App listening in port ${PORT}`);
  });
}

init();