const express = require('express');
const bodyParser=require("body-parser");
const mongoose = require('mongoose');

const app=express();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@webfinalserver.w3ew3zr.mongodb.net/?retryWrites=true&w=majority&appName=webFinalServer`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let db=mongoose.connection

mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected!');
});

app.post("/register",(req,res) => {
    let email= req.body.email
    let password=req.body.password
    let repeatPassword=req.body.repeatPassword
    let username=req.body.username
   

    var data={
        "email":email,
        "password":password,
        "repeatPassword":repeatPassword,
        "username":username,
    }
    db.collection('users').insertOne(data,(err,collection) => {
        if(err){
            throw err;
        }
        console.log("Record Inserted Succesfully")
    })
    return res.redirect('signup_successful.html')
})