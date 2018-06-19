const { db, Vegetable, Gardener, Plot } = require('./model');
let vegetables;
let plots;
let tomato;
let spinach;
let corn;

db.sync({force: true})
  .then(() => {
    const vegetableData = [{ name: 'Tomato', color: 'Red'},
                        { name: 'Spinach', color: 'Green'},
                        { name: 'Corn', color: 'Yellow'}];
    return Vegetable.bulkCreate(vegetableData, {returning: true});
  })
  .then((createdVegetables) => {
    vegetables = createdVegetables;
    [tomato, spinach, corn] = createdVegetables;
    const gardeners = [{name: 'Cheryl', age: 46, favouriteVegetableId: tomato.id},
                       {name: 'Matthew', age: 47, favouriteVegetableId: corn.id},
                       {name: 'Meteora', age: 18, favouriteVegetableId: spinach.id},
                       {name: 'Cassiel', age: 15, favouriteVegetableId: corn.id}];
    return Gardener.bulkCreate(gardeners, {returning: true});
  })
  .then((createdGardeners) => {
    const [cheryl, matthew, meteora, cassiel] = createdGardeners;
    const plots = [{size: 30, shaded: false, gardenerId: matthew.id},
                   {size: 10, shaded: true, gardenerId: cheryl.id},
                   {size: 13, shaded: false, gardenerId: cassiel.id},
                   {size: 7, shaded: true, gardenerId: meteora.id}];
    return Plot.bulkCreate(plots, {returning: true});
  })
  .then((createdPlots) => {
    plots = createdPlots;
    const [plotMa, plotCh, plotCa, plotMe] = createdPlots;
    return tomato.addPlots([plotMa, plotCh, plotCa], {returning: true});
  })
  .then(() => {
    const [plotMa, plotCh, plotCa, plotMe] = plots;
    return spinach.addPlots([plotCh, plotMe], {returning: true});
  })
  .then(() => {
    return corn.addPlots(plots); // we want to return a promise if not .catch & .finally
    // will run before the database is updated!!!
  })
  .catch(error => {
    console.log(error);
  })
  .finally(() => {
    db.close();
  })

  // Why doesn't the following work? 
  // somePromise.then(() => {
  //   console.log(someValue);
  // })
  // .catch(error => {
  //   console.log(error);
  // })
  // .finally(() => {
  //   if (db) {
  //     db.close();
  //   }
  // });
  // Unhandled rejection Error: ConnectionManager.getConnection was called after the connection manager was closed!