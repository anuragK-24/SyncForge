const express = require("express");
const app = express();
app.get('/',(req, res)=>{
    res.send("<h1>Hello </h1>");
})
app.get('/abc',(req, res)=>{
    res.send("<h1>ABC </h1>");
})
app.get('/123',(req, res)=>{
    res.send("<h1>123</h1>");
})

app.listen(5000, ()=>{
    console.log("Server started");
})