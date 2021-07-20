 const _interpreter=require("jsinterpret");
var _result;
  var express = require('express')
var app = express()
const bodyParser = require('body-parser');
const cors = require('cors');



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser());


app.get('/', function (req, res) {
res.send(`APIs: <div></div>
/interpretJS<div></div>
/interpretScheme`)
})

app.post('/interpretScheme', function (req, res) {
    console.log=function(a){res.json({result: a})}
var lips = require('@jcubic/lips');
lips.exec(req.body.code).then(result => {
    result.forEach(function(result) {
        if (typeof result !== 'undefined') {
console.log(result);
        }
    });
});
});

app.post('/interpretJS', function (req, res) {
     console.log=function(a){
   res.json({result: a});
   };
 _interpreter.interpret(req.body.code, function(a){
console.log(a);
 });
});

app.post('/addPackage', function(req, res){
const shell=require('shelljs');
shell.exec("npm install " + req.body.package);
});


var server = app.listen(8000, function () {  
  var host = server.address().address  
  var port = server.address().port  
  console.log("listening at http://%s:%s", host, port)  
})  
