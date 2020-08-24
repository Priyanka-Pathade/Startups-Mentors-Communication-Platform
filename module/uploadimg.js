var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/startup',{useNewUrlParser:true});
var conn=mongoose.connection;

var Imgschema=new mongoose.Schema({
    cid:String,
    img:String
});
// Empschema.methods.totalsal=function(){
//     console.log("Total salary"+this.rate*this.workhour);
    
// }
var Imgmodel=mongoose.model('Img',Imgschema);

// var emp=new Empmodel({name:"shiva",email:"xyz",emptype:"temp",rate:8000,workhour:3});
// console.log("Total income"+emp.rate*emp.workhour);
// emp.totalsal();

conn.on("connected",function(){
    console.log("Server Connected");
    
});
conn.on("disconnected",function(){
    console.log("Server Disconnected");
    
});
module.exports=Imgmodel;