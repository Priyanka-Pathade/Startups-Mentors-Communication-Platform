var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn= mongoose.connection;

var blogSchema= new mongoose.Schema({
    menEmail:String,
    title:String,
    domain:String,
    desc:String,
    image:String,
    date:{
        type:Date,
        default:Date.now
    }
});

var blogModel=new mongoose.model('blog',blogSchema);
module.exports=blogModel;
