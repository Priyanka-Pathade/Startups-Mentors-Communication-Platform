var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn=mongoose.connection;
var advSchema=new  mongoose.Schema({
    email:String,
    title:String,
    des:String,
    img:String,
    contact:String,
    url:String,
    start:Date,
    end:Date,
    dur:Number,
    ty:String
});

var advModel=new mongoose.model('adv',advSchema);

conn.on("connected",function(){
    console.log("Server connected");
    
});

conn.on("disconnected",function(){
    console.log("Server disconnected");
    
});
module.exports=advModel;