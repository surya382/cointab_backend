const {connection}=require("./config/db");
const cors=require("cors")

const express=require("express");
const { userroute } = require("./Routes/userroute");



const app=express();

app.use(express.json())

app.use(cors({origin:"*"}))
app.use("/user",userroute);



app.get("/",(req,res)=>
{
    res.send("Welcome to server")
})


app.listen(4500,async()=>{

    try{
         await connection;
         console.log("connected");
    }
    catch(err){
        console.log(err);
    }

    console.log("server is running")
})
