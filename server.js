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
  Gardener.findAll().then((foundGardeners) => {
    res.send(html`
    <h3>Gardeners</h3>
    <ul class="list-unstyled">
      <ul>
  ${foundGardeners.map(gardener => 
  html`<li>
    Farmer ${gardener.id}: <a href="/gardeners/${gardener.id}">${gardener.name}</a><br/>
    Age: ${gardener.age}<br/>
    Plot: <a href="/plots/${Plot.findOne({where: {gardenerId: gardener.id}})}">${gardener.name}'s plot</a><br/>
    Favourite Vegetable: ${Vegetable.findOne({where: {id: gardener.favouriteVegetableId}})}
  </li>`)}
      </ul>
    </ul>`);
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