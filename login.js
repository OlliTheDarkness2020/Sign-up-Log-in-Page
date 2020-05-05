var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'abhiraj',
  database : 'nodelogin'
});

connection.connect();


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

app.post('/signup', (request,response) =>{
    var username = request.body.username;
    var password = request.body.password;
    var email = request.body.email;
    var details = [username,password,email];
    
    var query = connection.query(`INSERT INTO accounts(username,password,email) VALUES (?,?,?)`,[username,password,email],
     function(error, results) {
            if(error){
                throw error;
            }
            request.session.loggedin = true; 
            response.redirect('/');
            console.log('User created- username: '+ username +' ,password: '+password+' ,email: '+email);

        response.end();
    });
});

app.get('/login', (request,response) => {
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0){ 
                if(results[0].username==username && results[0].password==password){
                    response.send('Logged in');
                    request.session.loggedin = true;
			    	request.session.username = username;  
                  } 
			} else {
                response.send('Incorrect Username and/or Password!');
                
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.listen(3000, (err) => {
    if (err) { throw err;}
    else
    console.log("Server is listening...");
});
