const express = require('express');
var hbs = require('hbs')
const mongo  = require('mongodb').MongoClient;
const url = 'mongodb+srv://gopaljha:jhaji9871436400@cluster0.n70vgmg.mongodb.net/attendance_system?retryWrites=true&w=majority';
const client= new mongo(url,(err)=>
{
    if(err) throw err;
})
const dbName = 'attendance_system';
const app =express()
const port =process.env.PORT||3000
const db = client.db(dbName);
const collection =db.collection('students')
let date_ob = new Date();
app.set('view engine', 'hbs')
app.set('views',"views")
  
app.get('/',(req,res)=>
{
    const info=[]
    async function getData()
  {
    let data=[]
    let result = await collection.find({ "name" : { $exists : true }}).toArray();
    for(let i=0;i<result.length;i++)
    {
        data["name"]=result[i].name;
        data["no"]=result[i].enrollmentNo;
        data["date"]=result[i].date;
        info.push(data);
    }
    console.log(info);
    res.render("index",{info:info})
  }
   getData();
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
    const insertResult = collection.insertOne({"name":req.query.name,"enrollmentNo":req.query.no,date:(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)});
    return res.send("set_data")
})
app.listen(port,()=>
{
    console.log("server_start");
})
//mongodb+srv://gopaljha:jhaji9871436400@cluster0.n70vgmg.mongodb.net/project_ai?retryWrites=true&w=majority

// const client= new mongo(url,(err)=>
// {
//     if(err) throw err;
// })
// client.connect()
// console.log("connection done")
// const db = client.db(dbName);
// const collection =db.collection('Keywords')
// const collection2 =db.collection('Answers')
//insertion in atlas
//  const insertResult = collection.insertOne({_id:252, name:"ram",
// age: 19,mobile: "9871436400" });

//deletion on atlas
// collection.deleteMany()
// collection2.deleteMany()

//read from mongodb
  
// console.log("done delete")