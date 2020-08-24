var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn=mongoose.connection;
var hireSchema=new  mongoose.Schema({
    email:String,
    cname:String,
    contact:String,
    desig:String,
    des:String,
    url:String,
    start:Date,
    sector:String,
    loc:String
});

var hireModel=new mongoose.model('hire',hireSchema);

conn.on("connected",function(){
    console.log("Server connected");
    
});

conn.on("disconnected",function(){
    console.log("Server disconnected");
    
});
module.exports=hireModel;