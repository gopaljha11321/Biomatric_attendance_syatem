const express = require('express');
const bodyParser=require('body-parser');
var { Parser } = require('json2csv')
var hbs = require('hbs')
const mongo  = require('mongodb').MongoClient;
const fs = require("fs");
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
const collection2=db.collection('deatils')
const collection3=db.collection('admin')
app.set('view engine', 'hbs')
app.set('views',"views")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));
app.get('/',(req,res)=>
{
    res.render("home")
})
app.post('/home',(req,res)=>
{
    
    async function getData()
  {
    let user = await collection3.find({email:req.body.email,password:req.body.password}).toArray();
    if(user.length<1)
    {
        return res.send("Wrong password!!");
    }
    var info=[]
    let result = await collection.find({}).toArray();
    for(let i=0;i<result.length;i++)
    {
        let data={}
        data["name"]=result[i].name;
        data["no"]=result[i].enrollmentNo;
        data["date"]=result[i].date;
        if(result[i].status==="present")
        {
            data["check"]="LogIn"
        }
        else{
            data["check"]="LogOut"
        }
        
        info.push(data);
    }
    res.render("index",{"info":info,"name":user[0].name})
  }
   getData();
})
app.get("/test",(req,res)=>
{
    res.render("ui");
})
app.get('/set',(req,res)=>
{
var today = new Date();
var day = today.getDay();
var date = today.getDate() +'-'+(today.getMonth()+1)+'-'+ today.getFullYear();
var hours = today.getHours();
var AmOrPm = hours >= 12 ? 'pm' : 'am';
hours = (hours % 12) || 12;
var time = hours + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+'  --  '+time;
const final_time=dateTime+ " " + AmOrPm;
    getdetail=async (num)=>
    {
        let result = await collection2.find({id:Number(num)}).toArray();
    if(result.length>0)
    {
        if(typeof(result[0]["present"])==="undefined" ||result[0]["present"]===false)
        {
            let data1=result[0];
            data1["present"]=true;
            collection2.updateOne({id:Number(num)},{$set: data1})
            const insertResult = collection.insertOne({"name":result[0]["name"],"status":"present","enrollmentNo":num,date:final_time});
            return res.send(`Welcome ${result[0].name}`)  
        }
        else {
            let data1=result[0];
            data1["present"]=false;
           collection2.updateOne({id:Number(num)},{$set: data1})
            const insertResult = collection.insertOne({"name":result[0]["name"],"status":"absent","enrollmentNo":num,date:final_time});
            return res.send(`Thanks for coming ${result[0].name}`)
        }
    }
    else{
        return res.send(`user not found on id: ${num}`)
    }  
    }
    getdetail(req.query.no);
})
app.get('/delete_all',(req,res)=>
{
    let code=req.query['code'];
    if(code==="akshay16")
    {
        collection.deleteMany()
    return res.send("All data deleted ")
    }
    return res.send("Wrong access code!!")
})
app.get("/csv_download",async(req,res)=>
{
    const fields = ['Name', 'Enrollmment No.','Date and time','status'];
    let result = await collection.find({}).toArray();
    const myData=[]
    for(let i=0;i<result.length;i++)
    {
        let data={}
        data["Name"]=result[i].name;
        data["Enrollmment No."]=result[i].enrollmentNo;
        data["Date and time"]=result[i].date;
        if(result[i].status==="present")
        {
            data["status"]="LogIn"
        }
        else{
            data["status"]="LogOut"
        }
        
        myData.push(data);
    }
    const opts = { fields,data:myData };
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(myData);
        res.attachment(`${req.query['name']}.csv`);
        res.status(200).send(csv);
    } catch (err) {
      console.error(err);
    }
})
app.listen(port,()=>
{
    console.log("server_start");
})