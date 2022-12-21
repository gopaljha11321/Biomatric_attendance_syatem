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
const collection2=db.collection('deatils')
let date_ob = new Date();
// collection.deleteMany()
app.set('view engine', 'hbs')
app.set('views',"views")
app.get('/',(req,res)=>
{
    async function getData()
  {
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
    res.render("index",{"info":info})
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
            const insertResult = collection.insertOne({"name":result[0]["name"],"status":"present","enrollmentNo":num,date:(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)});
            return res.send(`Welcome ${result[0].name}`)  
        }
        else {
            let data1=result[0];
            data1["present"]=false;
           collection2.updateOne({id:Number(num)},{$set: data1})
            const insertResult = collection.insertOne({"name":result[0]["name"],"status":"absent","enrollmentNo":num,date:(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)});
            return res.send(`Thanks for coming ${result[0].name}`)
        }
    }
    else{
        return res.send(`use not found on id: ${num}`)
    }  
  
    }
    getdetail(req.query.no);
    
})
app.listen(port,()=>
{
    console.log("server_start");
}
