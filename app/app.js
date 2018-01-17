 
const low = require('lowdb');
const express = require("express");
const bodyParser = require("body-parser");
const app = express()

const router = express.Router();
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('iot.db')
const db = low(adapter)
 
db.defaults({ users: [] }).write();
app.use(function(req, res, next) {
 var data = new Buffer("");
 var str = "";
 var bufLen = 0;
 req.on("data", function(chunk) {
   bufLen += chunk.length;
   str += chunk.toString();
   // data = Buffer.concat([data, chunk]);
 });
 req.on("end", function() {
   req.rawBody = new Buffer(str);
   next();
 });
});
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/user',(req,res)=>{
 try{
 const obj = JSON.parse(req.rawBody);
 var item = db.get("users").find(obj.uuid);
 if(!item){
  db.get("users").push(obj).write();
  console.log("add user:",obj);
 }else{
  item.assign(obj).write();
  console.log("update user:",obj);
 }
 }catch(e){
  res.send("fail");
  return;
 }
 res.send("ok");
});
app.get("/users",(req,res)=>{
 res.json(db.get("users"));
});
app.listen(5182, () => console.log('Example app listening on port 5182!'))
