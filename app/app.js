 
const low = require('lowdb');
const express = require("express");
const bodyParser = require("body-parser");
const app = express()

const router = express.Router();
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('iot.db')
const db = low(adapter)
 
db.defaults({ users: [] }).write();
 
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/user',(req,res)=>{
 const obj = JSON.parse(req.query.json);
 db.get("users").find(obj.uuid).assign(obj).write();
 res.send("ok");
});
app.get("/users",(req,res)=>{
 res.json(db.get("users"));
});
app.listen(5182, () => console.log('Example app listening on port 5182!'))
