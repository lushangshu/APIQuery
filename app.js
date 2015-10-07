
/**
 * All rights reserved by Shangshu Lu 
 */


var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var jquery = require('jquery');
var fs=require('fs');
var path=require('path');
var request = require('request');
var SparqlClient = require('sparql-client');

//import funcitons
var function1= require('./1');
var bodyParser = require('body-parser');
var app = express();
var Promise = require('express-promise');
// all environments
app.set('port', process.env.PORT || 3000);
//configure app
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(bodyParser.json());
//app.use(require('express-promise')());
app.use(Promise());
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//Data change between server and web interface
//Arrays will be sent back to each requested form
app.get('/queryInterface',function(req,res){
	res.render('queryInterface',{
		title:'Query Interface',

		
	});

});



app.post('/1',function(req,res){
	var pro = req.body.promise;
  var loc = req.body.geo+","+"200mi";
	var params = {q: pro,c:loc,lang:'en',result_type:'popular',count:'20'};
	twitterResult = [];
	client.get('search/tweets',params,function(err,data,ress){
		//console.log(data);
		for (var indx in data.statuses) {
           	var tweet = data.statuses[indx];
            var message = ' -  Date: '+tweet.created_at+' from:  '+tweet.user.screen_name+' ：'+tweet.text;
            //console.log(message);
            twitterResult.push({id:tweet.id_str,date:tweet.created_at,author:tweet.user.screen_name,content:tweet.text});
          }
     res.redirect('/queryInterface');
	});
});

app.get('/venuePhotoQuery',function(req,res){
	res.redirect('/2c');
});




app.listen(3000,function(){
	
});

