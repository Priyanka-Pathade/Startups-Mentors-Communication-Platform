var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn= mongoose.connection;

var profileMentorSchema= new mongoose.Schema({
    email:String,
 //   pic:String,
 name:String,
 gender:String,
 stories:String,
 mobile:Number,
 sector1:String,
 sector2:String,
 sector3:String,
 work_ex:String,
 work_year:String,
 g_stages:String,
});

var mentorProfileModel=new mongoose.model('mentorpro',profileMentorSchema);
module.exports=mentorProfileModel;
