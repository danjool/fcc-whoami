var express = require('express');
var app = express();
// var mongoose = require('mongoose');
var mongodb = require('mongodb').MongoClient;

var dburl = 'mongodb://localhost:27017/lil'

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
});

app.get([ '/whoami/new/http://:url', '/whoami/new/https://:url'], (req, res)=>{
    
    var url = req.params.url;
    
    console.log('new: ' + url);
    
    // check db for url already present, if so, send it
    
    var prior = null;
    
    mongodb.connect( dburl, function(err, db) {
    if(err) console.log("db err: " + err)
    else {
        console.log("Connected correctly to server"); 
        var collection = db.collection('lil');
        collection.find({ "url": url }).toArray( function(err, found){
           if (err) console.log("coll err: " + err);
           else {
               console.log(found.length);
               if (found.length > 0){
                prior = found[0];
                res.send(  { "short_url": "https://fcc-api-danjool.c9users.io/whoami/"+newID, "original_url":url} );    
                db.close();
               } else {
                   var newID = Math.floor(Math.random()*9000 + 1000);
                   var newIDurl = { "id":newID, "url":url}
                   collection.insert( newIDurl, function(err){
                       if(err) console.log("instert err" + err);
                       else db.close();
                   } );
                   res.send( { "short_url": "https://fcc-api-danjool.c9users.io/whoami/"+newID, "original_url":url} );
               }
               
           }
        });
    }
    
    });
    
    
    // if not, gen a new id
    // add new id to db
    // send new id
});

app.get('/whoami/:id', function(req, res){
   var id = req.params.id;
   console.log("got id " + id);
   
   mongodb.connect( dburl, function(err,db){
      if(err) console.log(err);
      else {
          
          var collection = db.collection('lil')
          collection.find({"id": Number(id) }).toArray( function(err, found){
              if(err)console.log(err);
              else {
                  console.log( "found" + found );
                  if (found.length === 0 ) res.send("that id was never used")
                  else {
                      var oldurl = found[0].url;
                      res.redirect( "https://"+oldurl );
                      db.close();
                  }
              }
          });
      }
   });
   
   
   
   
});

app.listen(process.env.PORT, function(){
   console.log('server listening on ' + process.env.PORT ); 
});

/*
https://fcc-api-danjool.c9users.io/
*/