var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn= mongoose.connection;

var notifyMentorSchema= new mongoose.Schema({
    startupEmail:String,
    mentorEmail:String,
 
});

var mentorNotifyModel=new mongoose.model('mentorNotifies',notifyMentorSchema);
module.exports=mentorNotifyModel;
