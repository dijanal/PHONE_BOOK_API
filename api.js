// setup database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:'); // database will be stored in RAM only
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS phone_book (id INTEGER PRIMARY KEY, first_name TEXT,last_name TEXT, number TEXT)");
    db.run("INSERT INTO phone_book (first_name, last_name, number) VALUES (?, ?, ?)", "Bob", "Sinclar", "+381641234567");
    db.run("INSERT INTO phone_book (first_name, last_name, number) VALUES (?, ?, ?)", "Alice", "Wonderland", "+38163122333");
    db.run("INSERT INTO phone_book (first_name, last_name, number) VALUES (?, ?, ?)", "Lee", "Bruce", "+381628000111");
});

// define api object
const express = require('express');
const api = express();

// define API endpoints

//api id
api.get('/phone_book:id', (req, res) => {
  const id = req.params['id'];
  db.get("SELECT * FROM phone_book WHERE id=(?)", id, function(err, row){
      res.json({  "first_name": row.first_name, "last_name": row.last_name, "number" : row.number });
  });
})


// run server
api.listen(3000, () => console.log('Listening on port 3000...'));


