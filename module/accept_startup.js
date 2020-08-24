var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn= mongoose.connection;

var acceptMentorSchema= new mongoose.Schema({
    startEmail:String,
    menEmail:String,
 
});

var mentorAcceptModel=new mongoose.model('acceptstartup',acceptMentorSchema);
module.exports=mentorAcceptModel;
