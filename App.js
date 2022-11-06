const express = require('express');
const {engine} = require('express-handlebars');
const app =express()
const port =3000
let date_ob = new Date();
// app.engine('handlebars', engine({ extname: '.hbs', defaultLayout: "views"}));
app.engine('handlebars', engine({
    layoutsDir: __dirname + '/views',
    }));
app.set('view engine', 'handlebars');
app.get('/',(req,res)=>
{
    
    res.render("index",{layout:"index"})
})
app.get('/set',(req,res)=>
{
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    console.log(hours + ":" + minutes);
    return res.send("get_data");
})
app.listen(port,()=>
{
    console.log("app start");
})