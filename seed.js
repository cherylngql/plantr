const db =require('./model');
db.sync({force: true})
.then(db => {
    console.log('success')
    db.close()
})
.catch(error => {
    console.log(error)
    db.close()
})
