// requre express module
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//we'll need this bodypusrer to fatch the data
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//for ejs and its gonna diractly look into view engine/folder as defult behavior
app.set('view engine', 'ejs')

//middlewere to use css in our pages
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.use('/js', express.static('js'));

//include the node postgres library
// const { Pool, Client } = require('pg')
// var pg = require('pg');
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres', //env var: PGUSER
  host: 'localhost',  // Server hosting the postgres database
  database: 'postgres', //env var: PGDATABASE
  password: 'hello123', //env var: PGPASSWORD
  port: 5432, //PGPORT
});

// sending an html page
app.get('/', function(req, res){
	res.render('index');
});

var usersdata;
pool.query('select * from blog', (err, res) => {
  usersdata = res.rows;
  console.log(res.rows);
});

app.get('/blog', function(req, res){
	res.render('blog', {usersdata:usersdata}); // not including this '{usersdata:usersdata}' gives the ReferenceError: error'
});

// we'll need body puser to get the data
app.post('/blog', urlencodedParser, function(req, res){
	console.log(req.body);
	res.render('success', {usersdata: req.body});

    //adding data to the database table
	var insert = "insert into blog(title,name,subject)values('"+req.body.title+"','"+req.body.name+"','"+req.body.subject+"');";
	console.log(insert);
    pool.query(insert);    
    // call done and end, same as the read example    
    // pool.end();
    res.end();
});




app.get('/contact', function(req, res){
	res.render('contact');
});

app.listen(3000, function(){
    console.log("info",'Server is running at port : ' + 3000);
});