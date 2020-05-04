var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var user = {
    name : "abhiraj",
    password : "kale"
}

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

var app = express();
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret :'secret',
    resave : true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/home.html'));
    
});

app.get('/login', (request,response) => {
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', (request,response) =>{
    if(request.body.username == user.name && request.body.password== user.password){
      
        response.send('User logged in.');
        
    }else{
      
        response.alert('Please enter Username and Password!');
		
    }
    console.log(request.session.loggedin);
    response.end();
   // response.sendFile(path.join(__dirname + '/login.html'));
});

app.listen(3000, (err) => {
    if (err) { throw err;}
    else
    console.log("Server is listening...");
});
