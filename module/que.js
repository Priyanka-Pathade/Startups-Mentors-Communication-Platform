var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn=mongoose.connection;
var queSchema=new  mongoose.Schema({
    email:String,
    view:Number,
    ans:Number,
    vote:Number,
    date:Date,
    title:String,
    body:String,
    tag1:{
        type:String,
        index:{
            unique:false,
        }
    } ,
      tag2:{
        type:String,
        index:{
            unique:false,
        }
    },
    tag3:{
        type:String,
        index:{
            unique:false,
        }
    }
});

var queModel=new mongoose.model('que',queSchema);

conn.on("connected",function(){
    console.log("Server connected");
    
});

conn.on("disconnected",function(){
    console.log("Server disconnected");
    
});
module.exports=queModel;