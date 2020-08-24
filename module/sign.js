var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn=mongoose.connection;


var signSchema= new mongoose.Schema({
    Register_as:{
        type:String
    },
    name:{
        type:String
    },
    email:{
        type:String,
        index:{
            unique:true,
        }
    },
    pass:{
        type:String
    }
});


var signmodel=new mongoose.model('sign',signSchema);

conn.on("connected",function(){
    console.log("Server connected");
    
});

conn.on("disconnected",function(){
    console.log("Server disconnected");
    
});

module.exports=signmodel;

