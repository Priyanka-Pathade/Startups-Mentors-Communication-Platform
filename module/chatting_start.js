var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn= mongoose.connection;

var chattingSchema= new mongoose.Schema({
    startEmail:String,
    menEmail:String,
    chatFromStartup:String,
    //frommentor:String,
    date:Date
});

var chattingModel=new mongoose.model('chattings',chattingSchema);
module.exports=chattingModel;
