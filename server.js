var express = require('express');
var app = express();

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
});

app.get('/whoami/', (req, res)=>{
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var lang = req.headers["accept-language"].split(",")[0];
    var os = req.headers['user-agent'].split(" ")
    .slice(1,5)
    .join(" ")
    .replace(")", "")
    .replace("(", "");
    
    res.send( {
        "ipaddress":ip,
        "language": lang,
        "software": os
    } ); 
});

app.listen(process.env.PORT, function(){
   console.log('server listening on ' + process.env.PORT ); 
});

/*
https://fcc-api-danjool.c9users.io/
*/