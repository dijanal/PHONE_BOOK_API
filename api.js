// setup database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:'); // database will be stored in RAM only
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS phone_book (id INTEGER PRIMARY KEY autoincrement, first_name TEXT,last_name TEXT, number TEXT)");
    db.run("INSERT INTO phone_book (first_name, last_name, number) VALUES (?, ?, ?)", "Bob", "Sinclar", "+381641234567");
    db.run("INSERT INTO phone_book (first_name, last_name, number) VALUES (?, ?, ?)", "Alice", "Wonderland", "+38163122333");
    db.run("INSERT INTO phone_book (first_name, last_name, number) VALUES (?, ?, ?)", "Lee", "Bruce", "+381628000111");
});

// define api object
const express = require('express');
const cors=require('cors');
const api = express();

api.use(cors())

// define API endpoints

//api id
api.get('/phone_book:id', (req, res) => {
  const id = req.params['id'];
  db.get("SELECT * FROM phone_book WHERE id=(?)", id, function(err, row){
      res.json({  "first_name": row.first_name, "last_name": row.last_name, "number" : row.number });
  });
})

//api all contacts
api.get('/phone_book/contacts', (req, res) => {  
db.all("SELECT * FROM phone_book ",  function(err, rows){
      // rows.forEach( (row)=> {
        res.json( rows );
  });
})

//post request

// const bodyParser = require('body-parser');
// api.use(bodyParser.urlencoded({extended: false}));
// api.use(bodyParser.json())

// api.post("/phone_book/post",  (req, res) => {
//     const firstName = req.body.first_name;
//     const lastName = req.body.last_name;
//     const number = req.body.number;
//     if (firstName && lastName && number) {
//         db.run(
//             "INSERT INTO phone_book (first_name, last_name, number) VALUES (?, ?, ?)",
//             firstName,
//             lastName,
//             number
//         );
//     }
//     res.send("added");
// });


const bodyParser = require('body-parser');
api.use(bodyParser.urlencoded({extended: false}));
api.use(bodyParser.json());

api.post('/phone_book/post', (req, res) => {
  console.log(req.body);

  db.run(
    'INSERT INTO phone_book(first_name,last_name,number) VALUES (?,?,?)',
    // parameters to SQL query:
    {
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      phoneNumber: req.body.number,
    },
    // callback function to run when the query finishes:
    (err) => {
      if (err) {
        res.send({message: 'error'});
      } else {
        res.send({message: 'success'});
      }
    }
  );
});

//delete request

api.delete('/api/delete_contact:id', function (req, res) {
    const id = req.params['id'];
    db.run("DELETE FROM phone_book WHERE id=?", id, function (err) {
    (err) => {
      if (err) {
        res.send({message: 'error'});
      } else {
        res.send({message: 'success'});
      }
  }}
)})



// run server
api.listen(3000, () => console.log('Listening on port 3000...'));


