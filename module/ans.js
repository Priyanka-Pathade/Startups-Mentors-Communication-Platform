var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn=mongoose.connection;
var ansSchema=new  mongoose.Schema({
    email:String,
    view:Number,
    vote:Number,
    date:Date,
    ans:String,
    qid:String
});

var ansModel=new mongoose.model('ans',ansSchema);

conn.on("connected",function(){
    console.log("Server connected");
    
});

conn.on("disconnected",function(){
    console.log("Server disconnected");
    
});
module.exports=ansModel;