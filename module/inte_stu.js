var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn=mongoose.connection;
var intSchema=new  mongoose.Schema({
    chid:String,
    email:String,
    img:String
});

var intModel=new mongoose.model('int',intSchema);

conn.on("connected",function(){
    console.log("Server connected");
    
});

conn.on("disconnected",function(){
    console.log("Server disconnected");
    
});
module.exports=intModel;