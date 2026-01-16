console.log("hello Backend!!")
const express = require("express")
const app = express()
const port=3000

const seeder=require("./server/config/seeder")
seeder.adminReg()

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({extended:true}))
app.use(express.json({limit:'40mb'}))

const db=require("./server/config/db")

const apiRoutes=require("./server/routes/apiRoutes")
const { request } = require("express")
app.use("/apis",apiRoutes)

app.get('/', (req, res) => {
  res.send('Hello World! The server is running.');
});

app.post('/', (req, res) => {
  res.send({
    status:200,
    success:true,
    message:"Post request is hitted succesfully!!"
  });
});

app.listen(port,(err)=>{
  if(err){
    console.log("server is not connected!!")
  }
  else{
    console.log("server is running on port",port)
  }
})
