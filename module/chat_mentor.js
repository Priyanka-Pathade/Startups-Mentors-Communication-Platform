var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn= mongoose.connection;
const {ObjectId}=mongoose.Schema.Types

var chatSchema= new mongoose.Schema({
    postedByemail:{
        type:String,
        required:true,
    },
    postedToemail:{
        type:String,
        required:true,
    },

    postedBy:{
        type:String,
        required:true,
    },
    postedTo:{
        type:String,
        required:true,
    },
    comments:[{
        text:String,
        postedBy:{type:String},
        timestamp: { type: Date, default: Date.now}
    }],
    timestamp: { type: Date, default: Date.now}
});

var chatModel=new mongoose.model('chatmentor',chatSchema);
module.exports=chatModel;
