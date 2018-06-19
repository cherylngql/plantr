const Sequelize = require('sequelize')
const db = new Sequelize('postgres:localhost:5432/plantr');

const Gardener = db.define('gardener', {
  name: {
    type: Sequelize.STRING
  },
  age: {
    type: Sequelize.INTEGER
  }
});

const Plot = db.define('plot', {
  size: {
    type: Sequelize.INTEGER
  },
  shaded: {
    type: Sequelize.BOOLEAN
  }
});

const Vegetable = db.define('vegetable', {
  name: {
    type: Sequelize.STRING
  },
  color: {
    type: Sequelize.STRING
  },
  planted_on: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  hooks: {
  beforeValidate: (vegetable, options) => {
    vegetable.planted_on = vegetable.createdAt;
  }
}});

Plot.belongsTo(Gardener);

Gardener.belongsTo(Vegetable, {as: 'favourite_vegetable'});

Vegetable.belongsToMany(Plot, {through: 'vegetable_plot'});
Plot.belongsToMany(Vegetable, {through: 'vegetable_plot'});

module.exports = {db, Vegetable, Plot, Gardener}