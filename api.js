// setup database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('contacts.db'); // database will be stored in RAM only
// db.serialize(function() {
//     db.run("CREATE TABLE IF NOT EXISTS phone_book (id INTEGER PRIMARY KEY autoincrement, first_name TEXT,last_name TEXT, number TEXT)");
//     db.run("INSERT INTO phone_book (first_name, last_name, number) VALUES (?, ?, ?)", "Bob", "Sinclar", "+381641234567");
//     db.run("INSERT INTO phone_book (first_name, last_name, number) VALUES (?, ?, ?)", "Alice", "Wonderland", "+38163122333");
//     db.run("INSERT INTO phone_book (first_name, last_name, number) VALUES (?, ?, ?)", "Lee", "Bruce", "+381628000111");
// });

// define api object
const express = require('express');
const cors=require('cors');
const api = express();

api.use(cors())

const bodyParser = require('body-parser');
api.use(bodyParser.urlencoded({extended: false}));
api.use(bodyParser.json());

// define API endpoints

//get by id
api.get('/phone_book:id', (req, res) => {
  const id = req.params['id'];
  db.get("SELECT * FROM phone_book WHERE id=(?)", id, function(err, row){
      res.json({  "first_name": row.first_name, "last_name": row.last_name, "number" : row.number });
  });
})

//get all 
api.get('/phone_book/contacts', function (req, res) {  
db.all("SELECT * FROM phone_book ",  function(err, rows){
      // rows.forEach( (row)=> {
        res.json( rows );
  });
})



//add new
api.post('/phone_book/post', function (req, res)  {
  console.log(req.body);
  let contact=[
    req.body.first_name,
    req.body.last_name,
    req.body.number]

  db.run(
    'INSERT INTO phone_book(first_name, last_name, number) VALUES (?,?,?)',contact,

    (err) => {
      if (err) {
        res.send({message: 'error'});
      } else {
        res.send({message: 'success'});
      }
    }
  );
});





//delete 

api.delete('/phone_book/delete', function (req, res) {
    console.log(req.body)
    db.run("DELETE FROM phone_book WHERE id=?", req.body.id, function (err) {
      if (err) {
        res.send({message: 'error'});
      } else {
        res.send({message: 'success'});
      }
  }
)})



// run server
api.listen(3000, () => console.log('Listening on port 3000...'));




