var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn= mongoose.connection;

var profileSchema= new mongoose.Schema({
    email:String,
    pic:String,
    company:String,
    leader:String,
    website:String,
    mobile:Number,
    s_category:String,
    s_stage:String,
    sector:String,
    description:String
});

var profileModel=new mongoose.model('startuppro',profileSchema);
module.exports=profileModel;
