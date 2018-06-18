const { db, Vegetable, Gardener, Plot } = require('./model');

db.sync({force: true})
  .then(db => {
    console.log('success')
  })
  .then(() => {
    Vegetable.bulkCreate([{ name: 'Tomato', color: 'Red' }, { name: 'Broccoli', color: 'Green' }, { name: 'Yellow Pepper', color: 'yellow' }]);
  })
  .catch(error => {
    console.log(error);
  });
