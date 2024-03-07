require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/signups")

const userschema = new mongoose.Schema({
    email:String,password:String
});

const secret = process.env.SECRET ; 

userschema.plugin(encrypt,{secret:secret,encryptedFields: ['password'] })


const user = new  mongoose.model('user', userschema);




app.get('/',function(req,res){
    res.render('home');
});

app.get('/login',function(req,res){
    res.render('login');
});

app.get('/register',function(req,res){
    res.render('register');
});


app.post('/register',function(req,res){

    const new_user =new user({
        email:req.body.username,
        password:req.body.password
    });
   async function cal (){ 
   try {
        await new_user.save();
        res.render('secrets');
    } catch (err) {
        console.log(err);
    }
}

cal();

});


app.post('/login',function(req,res){
    const username = req.body.username ;
    const pass = req.body.password;

  async function abc() {  
    try {
        const foundUser = await user.findOne({ email: username });
        
        if (foundUser && foundUser.password === pass) {
            res.render('secrets');
        } else {
            res.send('Invalid username or password');
        }
    } catch (err) {
        console.log(err);
        res.send('An error occurred');
    }
};
abc();
});


app.listen(3000,function(){
console.log("server started ");
});