
/**
 * All rights reserved by Shangshu Lu , Likang Cao, Pengyuan Zhao
 */

var Twitter = require('twit');
var client = new Twitter({
    consumer_key:'IDiA4gBjtz3eLyUbmjhKEtu56',
    consumer_secret:'dINaqIHkHdpk7PIbKhVJqeUokRPu5OWYi4KUxl4oyoawuU1GCO',
    access_token: '3066550420-6qGjs7HdExlN7z4VMUzXjQi23qGeoxS4XTzOfqo',
    access_token_secret:'6BP5RcKdy1a5Fos42W9M5pFkixHL5TDTorWdrubGuQVil'
});
//foursquare user information --- tokens and secret keys
var config = {
    'secrets': {
        'clientId': 'Y5QTM3QVZ1IU3I0YECGY4CMTSLUG3YZDPPDWZ2TSMHYUXMKS',
        'clientSecret': '4LCX3C1JVLMHP3JBF21GS3W2NS3QZQH1PEWBZZJHS2TMTVV5',
        'redirectUrl': 'http://www.localhost.com/URI'
    },
    'foursquare': {
        'mode': 'swarm'
    }
}
var accessToken = 'ODE0Z03UDW2YFXJPOWI4TQFSO0D4GHWIJF12IQHMJDTIMJ0U' ;
//https://api.foursquare.com/v2/checkins/resolve?shortId=fcP5m3yn7AL&oauth_token=
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

var mysql = require('mysql-wrapper');
var conn = mysql(
    {
      host     : 'stusql.dcs.shef.ac.uk',
      port     : '3306',
      user     : 'team075',
      password : '62335627',
      database : 'team075'
    }
);

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
//store information for question 1 part 1
var twitterResult = [
	{id:1,date:'0',author:'null',content:'null'},	
];

//store informaiton for question 1 part 2
var retweetUser = [
	{id:0,name:'null',profile:'null'},
];
//store information for question 2a
var tweetKeywords = ["  "];

//store information for question 2b
var twittervenuenameResult2B=[{venue_name:'null',lati:'null',longti:'null'},];
var twitterResult2B = [
  {venue_name:'null',lati:'null',longti:'null'},  
];
var addressJson2B=[{lati:'null',longti:'null'},];
var rdfa2B=[
  {venuename:'null' ,venuecategory:'null',venueaddress:'null',venueUrl:'null',venueDescription:'null'},
];
var addressList2B=[];

var vresult = [
  {vphoto:'null',vname:'null',vid:'null',vcategory:'null',vaddress:'null',vurl:'null',vdescription:'null',vlati:'null',vlongti:'null',vcity:'null'},
];

//store information for question 2c
var venueUsers = [
	{id:0,name:'null',tweetName:'null',location:'null',profile:'null',description:'null'},
];

//store 100 tweets for question 2c part 2
var tweetTimeline = [
	{date:'null',text:'null'},
];

var venueInfo = [
	{id:0,name:'null',lat:0,lng:0,address:'null',city:'null',postalCode:0,photourl:'null'},
];

var venueAndUser = [
  {venuename:'null',venuelat:0,venuelng:0,username:'null',userurl:'null'},
];

//DBPedia venue info return
var DBVenueInfo = [
	{subject:'null',label:'null',lat:0 ,lng:0},
]

//database saved venue info
var sqlVenus = [
	{name:'null',abstract:'null',url:'null'},
];

var sqlKws = [];

//Data change between server and web interface
//Arrays will be sent back to each requested form
app.get('/queryInterface',function(req,res){
	res.render('queryInterface',{
		title:'Query Interface',
		items: twitterResult,
		users: retweetUser,
		venueUsers: venueUsers,
		tweetTimeline:tweetTimeline,
	});

});
app.get('/2a',function(req,res){
	res.render('2a',{
		title:'keywords',
        tweetKeywords: tweetKeywords,
    });

});
app.get('/2b',function(req,res){
  res.render('2b',{
    title:'Query_2b',
    venuesnamesb:twittervenuenameResult2B,
    itemsb: twitterResult2B,
      addressItemsb:addressList2B,
      addressJsonItemb:addressJson2B,
      rfdaItemsb:rdfa2B,
      vresult:vresult,
  });

});

app.get('/showMap',function(req,res){
  res.render('showMap',{
    title:'show map nearby',
    venu:sqlVenus,
    venuesnamesb:twittervenuenameResult2B,
    itemsb: twitterResult2B,
      addressItemsb:addressList2B,
      addressJsonItemb:addressJson2B,
      rfdaItemsb:rdfa2B,
  });
});

app.get('/2c',function(req,res){
	res.render('2c',{
		title:'Query Interface',
		items: twitterResult,
		users: retweetUser,
		venueUsers: venueUsers,
		tweetTimeline:tweetTimeline,
		venueInfo:venueInfo,
		DBVenueInfo:DBVenueInfo,
    vau:venueAndUser,
	});

});

app.get('/history',function(req,res){
	res.render('history',{
		title:'Query venue search history',
		venu:sqlVenus,
    kws:sqlKws,
	});

});

//
app.get('/Retweets/:id',function(req,res){
	
	var id_str = req.param("id");
	var param = {id:id_str,count:10};
	retweetUser = [];
	client.get('statuses/retweets',param,function(err,data,ress){
		var result = data;
		for(i=0;i<result.length;i++){
			//console.log(result[i].id);
			retweetUser.push({id:result[i].id,name:result[i].user.name,profile:result[i].user.profile_image_url});
		}
		res.redirect('/queryInterface');
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

//question 2b
app.post('/2b',function(req,res){
  var user_name = req.body.user_name;
  var days = req.body.days;
  var date=new Date();
  twittervenuenameResult2B=[];
  vresult=[];
  var vname;
  var vphoto;
  var vcategory;
  var vaddress;
  var vdescription;
  var vurl;
 var rdfsitembody

    adressList2B=[];
    //addressJson2B=[]
  rdfa2B=[];
  client.get('search/tweets', {q:'swarmapp.com/c/',from:user_name,since:date.setDate(date.getDates-days),count:10},function(err, data, ress){
                for(var indx in data.statuses){
                    var tweet = data.statuses[indx];
                    var naem=tweet.user.screen_name;
                    for (var indx1 in tweet.entities.urls){
                      twitterText=tweet.entities.urls[indx1].expanded_url
                      stest=twitterText.split('/');
                      console.log(stest);
                      var options = {
                          url: 'https://api.foursquare.com/v2/checkins/resolve',
                           method: 'GET',
                           headers: headers,
                           qs: {'shortId': stest[stest.length-1], 'oauth_token':accessToken ,'v': '20140806', m: 'swarm'}
                      }
                      request(options,function(error, response, body){
                        if(!error && response.statusCode == 200) {
                          var jsonObj = JSON.parse(body); 
                          var address = jsonObj.response.checkin.venue.location.lat+","+jsonObj.response.checkin.venue.location.lng;    
                          var lati=jsonObj.response.checkin.venue.location.lat;
                          var longti=jsonObj.response.checkin.venue.location.lng;
                          var venue_id = jsonObj.response.checkin.venue.id;
                          var venue_name = jsonObj.response.checkin.venue.name;
                          var venueUrl=jsonObj.response.checkin.venue.url;
                          //comment description to avoid website crash -- error code: Cannot read property 'summary' of undefined
                          //change description to venue city so it is convenient to use DBPedia
                          var city=jsonObj.response.checkin.venue.location.city;
                          twittervenuenameResult2B.push({venue_name:venue_name,lati:lati,longti:longti,city:city});
                          addressList2B.push(address);
                         var options = {
                          url: 'https://api.foursquare.com/v2/venues/' + venue_id,
                         method: 'GET',
                         headers: headers,
                         qs: { 'oauth_token': accessToken, 'v': '20140806', m: 'swarm'}
                         }     
                        request(options,function (error, response, body) {

                        if (!error && response.statusCode == 200) {
                            var jsonObj =JSON.parse(body); 
                            if (jsonObj.response.venue.photos.count!= '0'){
                              var photoprefix=jsonObj.response.venue.photos.groups[0].items[0].prefix;
                              var photosuffix=jsonObj.response.venue.photos.groups[0].items[0].suffix;
                              vphoto=photoprefix+'original'+photosuffix;
                              //console.log(photo);
                            }else{
                             vphoto='undefined';
                            }
                              vname=jsonObj.response.venue.name;
                              var vid=jsonObj.response.venue.id;
                               vcategory=jsonObj.response.venue.categories[0].name;
                               vaddress=jsonObj.response.venue.location.formattedAddress[0];
                               vurl=jsonObj.response.venue.url;
                               vdescription=jsonObj.response.venue.description;
                              var vlati=jsonObj.response.venue.location.lat;
                              var vlongti=jsonObj.response.venue.location.lng;
                              var vcity=jsonObj.response.venue.location.city;
                              vresult.push({vphoto:vphoto,vname:vname,vid:vid,vcategory:vcategory,vaddress:vaddress,vurl:vurl,vdescription:vdescription,vlati:vlati,vlongti:vlongti,vcity:vcity});
                             rdfsitembody+="<table  vocab= http://schema.org/><tr><td about=venues property= venue photo><img src="+vphoto+"></img></td><td about=venues property= venue name >"+vname+"</td><td about=venues property= venue category>"+vcategory+"</td><td about=venues property=venue address>"+vaddress+"</td><td about=venues property= venue url>"+vurl+"</td><td about=venues property=venue description>"+vdescription+"</td></tr></table>";
                            console.log(rdfsitembody);  
                    
                         }
                         else console.log('error: ' + response.statusCode + ' response: ' + JSON.parse(response.body).meta.errorDetail);
                         fs.writeFile(path.join(__dirname,'rdfa.html'),rdfsitembody,function(error){
                              if(error) throw error;
                              console.log("success!!!");
                               });  
                         });                                                            
                          }
                    else 
                        console.log('error: ' + response.statusCode + ' response: ' + JSON.parse(response.body).meta.errorDetail);                                                   
                  }) 
                }                  
                 }
                 });
        res.redirect('/2b');
  });

//query for 2b point of interest
app.post('/2bshowmap',function(req,res){
  
    twitterResult2B = [];
    var getAddress=req.body.clickbutton;  
// Configure the request
    var options = {
        // localhost does not work if you run from localhost the server itself
        url: 'https://api.foursquare.com/v2/venues/search',
        method: 'GET',
        headers: headers,
        qs: {'ll': getAddress, 'radius': 1000,'intent':'checkin', 'oauth_token': accessToken,
            'v': '20140806', m: 'swarm'}
    }

// Start the request
    request(options,function (error, response, body) {

            if (!error && response.statusCode == 200) {
                // Print out the response body
                 var jsonObj =JSON.parse(body);
                 for(var i=0;i<10;i++){
                
                      var lati= jsonObj.response.venues[i].location.lat;
                
                       var longti=jsonObj.response.venues[i].location.lng;
                       var venue_id = jsonObj.response.venues[i].id;
                addressJson2B.push({lati:lati,longti:longti});
                
                var venuename=jsonObj.response.venues[i].name;
                twitterResult2B.push({venue_name:venuename,venue_id:venue_id,lati:lati,longti:longti});

            }
            }
            else {console.log('error: ' + response.statusCode + ' response: ' + JSON.parse(response.body).meta.errorDetail);}
            res.redirect('/showMap');
        });
});

//question 2c for venue photo
app.post('/2cQueryVenuePhoto',function(req,res){
	//console.log("hello this is 2c query for photo");
});

//question 2c for poi DBPedia
app.post('/2bPOIDBpedia',function(req,res){
  var venue = req.body.clickbutton_1;
  var city = venue.replace(/ /g,"_");;
  //console.log(venue);
	var endpoint = 'http://dbpedia.org/sparql';
	var query = "SELECT ?subject ?label ?lat ?long WHERE{ <http://dbpedia.org/resource/"+city+"> geo:lat ?shefLat. <http://dbpedia.org/resource/"+city+"> geo:long ?shefLong. ?subject geo:lat ?lat. ?subject geo:long ?long. ?subject rdfs:label ?label. FILTER(xsd:double(?lat) - xsd:double(?shefLat) <= 0.1 && xsd:double(?shefLat) - xsd:double(?lat) <= 0.1 && xsd:double(?long) - xsd:double(?shefLong) <= 0.1 && xsd:double(?shefLong) - xsd:double(?long) <= 0.1 && lang(?label) = 'en') .} LIMIT 10";
	
	var client = new SparqlClient(endpoint);
	client.query(query)
	  .execute(function(error, results) {
	   var obj = results.results.bindings;
     var link = 'null';
     if(obj.length<2){
      res.redirect('2b');
      link = '/2b';
     }
     else{
  	   for(var i=0;i<results.results.bindings.length;i++){
  	   		DBVenueInfo.push({subject:obj[i].subject.value,label:obj[i].label.value,lat:obj[i].lat.value,lng:obj[i].long.value});
          link = obj[0].subject.value;
  	   }
  	  res.redirect(link);
    }
	});
});

//Search history communicate with MySQL database
app.post('/searchVenueHistory',function(req,res){
  sqlVenus = [{name:"Information common",abstract: "this is abstract",url:"http://upload.wikimedia.org/wikipedia/commons/0/06/Information_commons.jpg"}]
  var queryString = 'SELECT * FROM venueinfo';
  conn.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        for (var i in rows) {
            //console.log(rows[i].venuename+" "+rows[i].venueabstract+" "+rows[i].venueurl);
            sqlVenus.push({name:rows[i].venuename,abstract:rows[i].venueabstract,url:rows[i].venueurl});
        }
        res.redirect('/history');
  });
  //connection.end();
  
});

//retrieval keywords data in database.
//
app.post('/searchKWHistory',function(req,res){
    var kwResult = [];
    var queryString = 'SELECT * FROM keyword';
    //database query.
    conn.query(queryString, function(err, rows, fields){
        if(err) throw err;
        for (var i in rows){
            kwResult.push({screenname:rows[i].screenname, keywords:rows[i].keywords, url:rows[i].url});
        }
        var kwRes = [[kwResult[0].screenname,kwResult[0].keywords,kwResult[0].url]];
        //repetition checking.
        for(i=0;i<kwResult.length;i++){
            for(n=0;n<kwRes.length;n++){
                if (kwRes[n][0] == kwResult[i].screenname) {
                    for (k = 0; k < kwRes[n][1].split(",").length; k++) {
                        if ((kwRes[n][1].split(",")[k] != kwResult[i].keywords) && (k == kwRes[n][1].split(",").length - 1))
                            kwRes[n][1] += ("," + kwResult[i].keywords);
                        else if (kwRes[n][1].split(",")[k] == kwResult[i].keywords)
                            break;
                    }
                }
                //if no repetition, push it into array
                if (n == (kwRes.length - 1) && kwRes[n][0] != kwResult[i].screenname) {
                    kwRes[n + 1] = new Array();
                    kwRes[n + 1][0] = kwResult[i].screenname;
                    kwRes[n + 1][1] = kwResult[i].keywords;
                    kwRes[n + 1][2] = kwResult[i].url;
                }
            }

        }
        sqlKws = kwRes;
        res.redirect('/history');
    });
    
});

/*
  The function of this part is handling the 2a requirement
  The input are Names, keywords and days which transmitted from 2a front page.
  The output is an array that storing the amounts of each keyword for each user.
 */
app.post('/2aQuery',function(req,res){
    var name = ['alex','tom'];
    var wordSum = [];
    var textTotal = "";
    var nameCount = 0;
    var kwNum = 20;
    var day = 5;
    var flagZero=0;
    var KwInput = req.body.keyword;

    if(req.body.query)name = (req.body.query).split(",");
    if(req.body.days)day=req.body.days;

    var wordcountTotal = new Array(new Array(),new Array());
    var finalTotal = [];

//time parameter setting
    var currentDate = new Date();
    var aimDate = new Date();
    aimDate.setDate(currentDate.getDate()-day);
    var year = aimDate.getUTCFullYear().toString();
    var month = (aimDate.getUTCMonth()+1).toString();
    var date = aimDate.getUTCDate().toString();
    var sinceDate = year + '-' + month + '-' + date;

//twitter API invoking
    for(p=0;p<name.length;p++){
        client.get('search/tweets', {from: name[p], since: sinceDate, count:200}, callbackCount(p));
    }

    function callbackCount(p){
        return function (err, data, response){
            if(data==null) {
                tweetKeywords[0]="No  data  respond!";
                res.redirect('/2a');
            }
            else {
                var postData = "";

                for (var indx in data.statuses) {
                    var tweet = data.statuses[indx];
                    //single tweet content
                    postData += (tweet.text + " ");

                }

                /* we can set a stoplist to token the tweets at this line for more precise results  */
                postData = postData.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`'"@~()·\|]/g, "");
                postData = postData.replace(/(\r\n|\r|\n|  )/g, " ");

                //total tweet content
                textTotal += postData;
                console.log(postData);

                /*
                Set and stoplist to token useless words
                The stoplist might leads to no common words for all users,which means that there is no data respond
                */
                var wordDataTemp = postData.split(" ");
                var wordData = new Array();
                var stoplist = new Array();
                stoplist = ["to","the","for","a","and","of","i","he","RT","she","and","an","after","no","can","should",
                            "would","be","been","are","is","I","this","these","when","who","how","might","they","them","or","can",
                            "has","have","had","my","like","let","little","just","keep","less","more","big","not","it",
                            "going","go","gone","get","sometime","most","ever","must","much","once","up","down","see",
                            "saw","take","tell","will","about","just","ok","say","shall","still","that","well","last","thought"];
                for(n=0;n<wordDataTemp.length;n++){
                    for(i=0;i<stoplist.length;i++){
                        if(wordDataTemp[n]==stoplist[i])
                            break;
                        else if(wordDataTemp[n]!=stoplist[i]&&i==(stoplist.length-1)){
                            wordData.push(wordDataTemp[n]);
                        }
                    }
                }

                //storing each keywords' amounts
                var wordcount = new Array(new Array(), new Array());
                for (i = 0; i < wordData.length; i++) {
                    // wordcount[i] = [];
                    for (var n = 0; n < wordcount.length; n++) {
                        if ((n == (wordcount.length - 1)) && ((wordcount[n][0]) != wordData[i])) {
                            wordcount[wordcount.length] = [wordData[i], 1];
                        }
                        else if ((n != (wordcount.length - 1)) && ((wordcount[n][0]) == wordData[i])) {
                            wordcount[n][1]++;
                            break;
                        }
                        else
                            continue;
                    }
                }

                //sum all content
                wordSum[nameCount] = wordcount;
                nameCount++;

                //ending flag, all content have been scanned
                if (wordSum.length == name.length) {
                    //total content filter
                    textTotal = textTotal.replace(/(\r\n|\r|\n|  )/g, " ");
                    //two dimensional array to store wordlist and it's amounts for each user separately.
                    wordTotal = textTotal.split(" ");
                    for (i = 0; i < wordTotal.length; i++) {
                        for (var n = 0; n < wordcountTotal.length; n++) {
                            if ((n == (wordcountTotal.length - 1)) && ((wordcountTotal[n][0]) != wordTotal[i])) {
                                wordcountTotal[wordcountTotal.length] = [wordTotal[i], 1];
                            }
                            else if ((n != (wordcountTotal.length - 1)) && ((wordcountTotal[n][0]) == wordTotal[i])) {
                                wordcountTotal[n][1]++;
                                break;
                            }
                            else
                                continue;
                        }
                    }

                    //sorting array
                    var sortKW = new Array(new Array(), new Array());

                    for (i = 0; i < kwNum; i++) {
                        sortKW[i] = ['', 0];
                    }


                    //sorting the wordlist by amount of each word.
                    for (i = 0; i < wordcountTotal.length; i++) {
                        if ((wordcountTotal[i][1]) > (sortKW[kwNum - 1][1])) {
                            sortKW[kwNum - 1] = wordcountTotal[i];
                            for (n = 0; n < kwNum; n++) {
                                for (m = 0; m < n; m++) {
                                    if ((sortKW[m][1]) < (sortKW[n][1])) {
                                        var k = sortKW[n];
                                        sortKW[n] = sortKW[m];
                                        sortKW[m] = k;
                                    }
                                    else
                                        continue;
                                }
                            }
                        }
                        else
                            continue;
                    }

                    //connect the word array and name array together.
                    for (i = 0; i < name.length; i++) {
                        for (m = 0; m < sortKW.length; m++) {
                            for (n = 0; n < wordSum[i].length; n++)
                                if (((wordSum[i])[n][0]) == sortKW[m][0]) {
                                    finalTotal.push([name[i], (wordSum[i])[n]]);
                                    break;
                                }
                                else if ((n == wordSum[i].length - 1) && ((wordSum[i])[n][0]) != sortKW[m][0])
                                    finalTotal.push([name[i], [sortKW[m][0], 0]]);
                        }
                    }

                    //add the sum amounts.
                    for (i = 0; i < kwNum; i++) {
                        finalTotal.push(['total', sortKW[i]]);
                    }

                    //make the word common to all users, exclude repetition words
                    for (i = 0; i < finalTotal.length; i++) {
                        if ((finalTotal[i][1][1]) == 0) {
                            var flag = finalTotal[i][1][0];
                            finalTotal.splice(i, 1);
                            i--;
                            flagZero++;
                            for (n = 0; n < finalTotal.length; n++) {
                                if (finalTotal[n][1][0] == flag) {
                                    finalTotal.splice(n, 1);
                                    n--;
                                }
                            }
                        }
                    }

                    //the final result array initialization.
                    tweetKeywords = new Array();

                    for (k = 0; k < kwNum + 1; k++) {
                        tweetKeywords[k] = new Array();
                        for (j = 0; j < name.length + 2; j++) {
                            tweetKeywords[k][j] = "";
                        }
                    }

                    //put the result in the table format required.
                    if (finalTotal.length == 0)tweetKeywords.push("None  common  keywords  for  all  users!");
                    else {
                        for (j = 1; j < name.length + 2; j++) {
                            for (k = 1; k < kwNum + 1 - flagZero; k++) {
                                tweetKeywords[k][0] = finalTotal[(k - 1) + (j - 1) * (kwNum - flagZero)][1][0];
                                tweetKeywords[0][j] = finalTotal[(k - 1) + (j - 1) * (kwNum - flagZero)][0];
                                tweetKeywords[k][j] = finalTotal[(k - 1) + (j - 1) * (kwNum - flagZero)][1][1];
                            }
                        }
                        var x = parseInt(KwInput) + 1;
                        var y = tweetKeywords.length - x - 1;
                        tweetKeywords.splice(x, y);
                    }

                    console.log(tweetKeywords);
                    res.redirect('/2a');
                }
            }
        }
    }
});

//question 2c  
/*
*
* This Part achieved query:Who is visiting venues in a specific geographic area
* There are two api used in this function
* Using Foursquare api and get venue infomation, using twitter streaming and rest api to get user list
*/
app.post('/2cQuery',function(req,res){
	var location = req.body.location;
	var d = new Date();
  var curr_date = d.getDate()-req.body.days;
  console.log(req.body.days);
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();
  var day = curr_year+"-"+curr_month+"-"+curr_date;
	var ful = function1.concatenateNames(location, day);
	venueUsers=[{id:0,name:'null',tweetName:'null',location:'null',profile:'null',description:'null'}];
  venueAndUser = [{venuename:'null',venuelat:0,venuelng:0,username:'null',userurl:'null'}];
	var options= {
		url: 'http://api.foursquare.com/v2/venues/search/',
        method:'GET',
        headers:headers,
        qs:{'v':'20131016','ll':'53.38,-1.46','query':location,'oauth_token':accessToken,m:'swarm'}
	};

	request(options,function(error,response,body){
		var jsonRet = JSON.parse(body);
		//console.log(body);
		for(var indx=0;indx<jsonRet.response.venues.length;indx++){
			// below get venues' name, lat and lng
			var venueId = jsonRet.response.venues[indx].id;
			var location_q = jsonRet.response.venues[indx].name;
			var location_lat = jsonRet.response.venues[indx].location.lat;
			var	location_lng = jsonRet.response.venues[indx].location.lng;
			var postalCode = jsonRet.response.venues[indx].location.postalCode;
			var address = jsonRet.response.venues[indx].location.address;
			var city = jsonRet.response.venues[indx].location.city;
			var options_Img = {
				url: 'http://api.foursquare.com/v2/venues/'+venueId+'/photos',
		        method:'GET',
		        headers:headers,
		        qs:{'v':'20131016','oauth_token':accessToken,m:'swarm'}
			};
      // Use Tweeter Streaming api if input days are empty
      if(req.body.days==""){
        var query = location_q;
        venueInfo.push({id:venueId,name:location_q,lat:location_lat,lng:location_lng,address:address,city:city,postalCode:postalCode,photourl:'null'});
        client.stream('statuses/filter',{track:query},function(stream){
            stream.on('data', function(tweet) {
              console.log(tweet.text);
              for(var indx in tweet.statuses){
              venueUsers.push({id:data.statuses[indx].user.id,name:data.statuses[indx].user.name
                ,tweetName:data.statuses[indx].user.screen_name,location:data.statuses[indx].user.location
                ,profile:data.statuses[indx].user.profile_image_url
                ,description:data.statuses[indx].user.description});
              venueAndUser.push({venuename:location_q ,venuelat:location_lat ,venuelng: location_lng,username: data.statuses[indx].user.name,userurl:data.statuses[indx].user.profile_image_url});
             }
            });
           
            stream.on('error', function(error) {
              throw error;
          });
        });
      }
      //Use Tweeter Rest api if input days are not empty
      else{
        var query = location_q +' swarmapp.com/c since:'+day;
        venueInfo.push({id:venueId,name:location_q,lat:location_lat,lng:location_lng,address:address,city:city,postalCode:postalCode,photourl:'null'});
        client.get('search/tweets',{q:query,count:100},function(err,data,respons){
            //console.log(data);
            for(var indx in data.statuses){
              venueUsers.push({id:data.statuses[indx].user.id,name:data.statuses[indx].user.name
                ,tweetName:data.statuses[indx].user.screen_name,location:data.statuses[indx].user.location
                ,profile:data.statuses[indx].user.profile_image_url
                ,description:data.statuses[indx].user.description});
              venueAndUser.push({venuename:location_q ,venuelat:location_lat ,venuelng: location_lng,username: data.statuses[indx].user.name,userurl:data.statuses[indx].user.profile_image_url});
              //console.log(venueUsers);
              //console.log("vau++"+location_q+location_lat+location_lng+data.statuses[indx].user.name+data.statuses[indx].user.profile_image_url);
              }
            
          }); 
      }
			
		}
		res.redirect('/2c');
	});
});

/*
 * this part is for Question 1.2c quering for users' timeline,
 * It returns user's up to 100 tweets and created data
 */

app.get('/timeline/:sn',function(req,res){
	//console.log(req.param("id"));
	var screenName = req.param("sn");
	var param = {count:100,screen_name:screenName};
	tweetTimeline = [];
	client.get('statuses/user_timeline',param,function(err,data,ress){
		var result = data;
		for(i=0;i<result.length;i++){
			//console.log(result[i].text);
			tweetTimeline.push({date:result[i].created_at,text:result[i].text});
		}
		res.redirect('/2c');
	});
	
});

app.listen(3000,function(){
	
});

