var express = require('express');
var router = express.Router();
var bcrypt=require('bcrypt');
var session = require('express-session')
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
//model for signup
var answer=require('../module/ans');
var sign=require('../module/sign');
var adv=require('../module/adv');
var que=require('../module/que');
const date = require('date-and-time');
var proStartup=require('../module/profile_startup');
var randomstring = require("randomstring");
var Imgmodel=require('../module/uploadimg');

var imgData=Imgmodel.find({});

var multer  = require('multer');
var path=require('path');
var upload = multer({ dest: 'uploads/' });
//to define path
router.use(express.static(__dirname+"./public/"));

//local-storage
// if (typeof localStorage === "undefined" || localStorage === null) {
//   var LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('./scratch');
// }


//middleware to display nav for login users
function checklogin(req,res,next){
  var user=req.session.useremail;
  // console.log(user);
  if(!user){
    res.redirect('/login')
  }
  next();
}

router.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

/* GET home page. */
router.get('/',function(req,res,next){
  var user=req.session.useremail;
  res.render('index1',{user:user});

})

router.get('/sign', function(req, res, next) {
  res.render('signup',{msg:""});
});

//middleware to check duplicate
function dupilicate(req,res,next){
  var email=req.body.email;
  var dup=sign.findOne({email:email});
  dup.exec(function(err,data){
    if(err) throw err;
    if(data){
      return res.render('signup',{msg:"Duplicate"});
    }
    next();
  })
}

router.post('/sign',dupilicate,function(req,res,next){
  var cat=req.body.category;
  var name=req.body.name;
  var email=req.body.email;
  var pass=req.body.password;
  var cpass=req.body.Cpassword;
  if(pass!=cpass){
    console.log("got");
    
    res.render('signup',{msg:"Confirm"});
  }
  else{
    pass=bcrypt.hashSync(pass,10);
    var cust=new sign({
      name:name,
      email:email,
      Register_as:cat,
      pass:pass
    })

    cust.save(function(err,data){
      if(err) throw err;
      else{
        res.redirect('/login');
      }
    })
  }
});

router.get('/login',function(req,res,next){
  res.render('login',{msg:""});
});

router.post('/login',function(req,res,next){
  var email=req.body.email;
  var pass=req.body.password;
  
  var cklog=sign.findOne({$and:[{email:req.body.email},{Register_as:req.body.category}]});
  cklog.exec(function(err,data){
    
    if(err) throw err;
    if(data){  
      var getcat=data.Register_as; 
      var getpass=data.pass;
      var getemail=data.email;
      if(bcrypt.compareSync(req.body.password,getpass)){
        // var token = jwt.sign({ uemail: getemail }, 'logintoken');
        // localStorage.setItem('useremail', getemail);
        // localStorage.setItem('usertoken', token);
        req.session.useremail=getemail;
        console.log( req.session.useremail);
        
        var user=req.session.useremail;
        // res.render('index',{user:user});
        if(getcat=="Startup"){
          res.redirect('startuphome');
        }
        else if(getcat=="Mentor"){
          res.redirect('mentorhome');
        }
        else{
          res.redirect('studenthome');
        }
      }
      else{
        res.render('login',{msg:"invalid1"});
      }
    }
    else{
      res.render('login',{msg:"invalid"});
    }
  })
});

router.get('/mentorhome',function(req,res,next){
  var user=req.session.useremail;
  res.render('mentorhome',{user:user});

});
router.get('/startuphome',function(req,res,next){
  var user=req.session.useremail;
  res.render('startuphome',{user:user});

});





router.get('/logout',function(req,res,next){
  req.session.destroy(function(err) {
    if(err){
      res.redirect('/index');
    }
  });
  res.redirect('/login');
});

//startup profile
router.get('/startup_profile',function(req,res,next){
  
  var user=req.session.useremail;
  var Exist=proStartup.findOne({email:user});
  Exist.exec(function(err,data){
    if(err) throw err;
    if(data){
      res.redirect('Existing');
    }    
    else{
      var startup=sign.findOne({email:user});
      startup.exec(function(err,data){
        if(err) throw err;
        if(data){
          var getcat=data.Register_as;
          var getname=data.name;
          
          res.render('startup_profile',{data:data});
    
        }
      });
    }
  
  
  })
  
});

router.post('/startup_profile',function(req,res,next){
var email=req.session.useremail;
var Cname=req.body.Cname;
var lname=req.body.lname;
var web=req.body.web;
var mob=req.body.mob;
var Scategory=req.body.cat;
var stage=req.body.stage;
var sector=req.body.sector;
var description=req.body.description;




var pro=new proStartup({
   email:email,
   company:Cname,
    leader:lname,
    website:web,
    mobile:mob,
    s_category:Scategory,
    s_stage:stage,
    sector:sector,
    description:description
  
});

pro.save(function(err,data){
  if(err) throw err;
  else{
    res.redirect('startuphome');
  }
})
  
});

router.get('/Existing',function(req,res,next){
  var email=req.session.useremail;

  var Exist=proStartup.findOne({email:email});
  Exist.exec(function(err,data){
   
    if(err) throw err;
    var uid=data._id
     console.log(data._id);
     console.log(uid);
     
    res.render('Existing',{data:data,uid:uid})
  });
})


router.post('/Existing',function(req,res,next){
console.log(req.body.uid);
console.log(req.body.email);

var upd=proStartup.findByIdAndUpdate(req.body.uid,{
  company:req.body.Cname,
  email:req.body.email,
  leader:req.body.lname,
  website:req.body.web,
  mobile:req.body.mob,
  s_category:req.body.cat,
  s_stage:req.body.stage,
  sector:req.body.sector,
  description:req.body.description
}); 
upd.exec(function(err,data){
if(err) throw err;
res.redirect('/startuphome');
});

});



router.get('/startup_setting',function(req,res,next){
  var email=req.session.useremail;
  var msg=req.session.msg;
  console.log(msg);
  res.render('sett1',{email:email,msg:msg});
  
});

var ran=randomstring.generate(7); 
console.log(ran);

router.post('/startup_setting',function(req,res,next){
  var to=req.session.useremail;
  req.session.msg=" ";
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'startuphackethon@gmail.com',
      pass: 'TonyStark'
    }
  });
  
  var mailOptions = {
    from: 'startuphackethon@gmail.com',
    // to:to,
    to:"shaikhfiza2018@gmail.com",
    subject:'OTP for changing password',
    text: ran
  };
  
  
  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
res.redirect('/sett2');
});


router.get('/sett2',function(req,res,next){
  console.log(ran);
res.render('setting');
})


router.post('/sett2',function(req,res,next){

  var email=req.session.useremail;
  var otp=req.body.otp;
  if(otp==ran){
    res.redirect('/change');
  }
  else{
    req.session.msg="not";
    res.redirect('/startup_setting');
  }
  
})

router.get('/change',function(req,res,next){
  var email=req.session.useremail;
  var Exist=sign.findOne({email:email});
    Exist.exec(function(err,data){
     
      if(err) throw err;
      var uid=data._id
       console.log(data._id);
       console.log(uid);
       
       res.render('change',{msg:"",uid:uid});
    });
  
});

router.post('/change',function(req,res,next){
  var email=req.session.useremail;
  console.log(req.session.useremail);
  var uid=req.body.uid;
  console.log(uid);
  
  var p1=req.body.p1;
  var p2=req.body.p2;
  if(p1!=p2){
    res.render('change',{msg:"not"});
  }
  else{
    pass=bcrypt.hashSync(p1,10);
    var upd=sign.findByIdAndUpdate(uid,{
      pass:pass,
      name:"piri"
    }); 
    upd.exec(function(err,data){
    if(err) throw err;
    res.redirect('/startuphome');
    });
  }
  
})

router.get('/askpublic',function(req,res,next){
 var email=req.session.useremail;
  
  res.render("askpublic",{email:email});
})

router.get('/public:id',function(req,res,next){
  var id=req.params.id;
  
  if(id==":1"){
    var myvote = { vote: -1 };
    var queall=que.find({}).sort(myvote);
  }
  else if(id==":2"){
    var myvote = { ans: -1 };
    var queall=que.find({}).sort(myvote);
  }
  else{
    var myvote = { view: -1 };
    var queall=que.find({}).sort(myvote);
  }
   

  var email=req.session.useremail;
  queall.exec(function(err,data){
    if(err) throw err;
    else
    res.render('public',{records:data,email:email});

  });
})

router.get('/answer:id',function(req,res,next){
  var id=req.params.id;
  var myvote = { vote: -1 };

  var upd=que.findByIdAndUpdate(req.params.id,{
    $inc: { view: 1} 
  }); 
  var question;
  upd.exec(function(err,data){
  if(err) throw err;
  question=data;
  });

  var view=answer.find({qid:id}).sort(myvote);
  view.exec(function(err,data){
    if(err) throw err;
    res.render('answer',{id:id,records:data,question:question});
  })
})

router.post('/answer:id',function(req,res,next){
  var email=req.session.useremail;
  var qid=req.params.id;

  var upd=que.findByIdAndUpdate(qid,{
    $inc: { ans: 1} 
  }); 
  upd.exec(function(err,data){
  if(err) throw err;
  });
  var Ans=req.body.description;

  var ans1=new answer({
    qid:qid,
    ans:Ans,
    view:0,
    vote:0,
    email:email,
    date:Date.now()
  })

  ans1.save(function(err,data){
    if(err) throw err;
    else{
      res.redirect('/public:1');
    }
  })
})

router.post('/askpublic',function(req,res,next){
  var email=req.body.email;
  var title=req.body.title;
  var description=req.body.description;
  var tag1=req.body.tag1;
  var tag2=req.body.tag2;
  var tag3=req.body.tag3;
  var view=0;
  var vote=0;
  var ans=0;

  var que1=new que({
    title:title,
    body:description,
    tag1:tag1,
    tag2:tag2,
    tag3:tag3,
    view:0,
    ans:0,
    vote:0,
    email:email,
    date:Date.now()
  })

  que1.save(function(err,data){
    if(err) throw err;
    else{
      res.redirect('/public');
    }
  })
})

router.get('/edit:id/:id2',function(req,res,next){
  const ans = req.params.id;
  const que= req.params.id2;
 
  var upd=answer.findByIdAndUpdate(ans,{
    $inc: { vote: 1} 
  }); 
  upd.exec(function(err,data){
    if(err) throw err;
    res.redirect('/answer'+que);
    });

  });

  router.get('/tdown:id/:id2',function(req,res,next){
    const ans = req.params.id;
    const que= req.params.id2;
   
    var upd=answer.findByIdAndUpdate(ans,{
      $inc: { vote: -1} 
    }); 
    upd.exec(function(err,data){
      if(err) throw err;
      res.redirect('/answer'+que);
      });
  
    });

    router.get('/qup:id',function(req,res,next){
      const question = req.params.id;
     
      var upd=que.findByIdAndUpdate(question,{
        $inc: { vote: 1} 
      }); 
      upd.exec(function(err,data){
        if(err) throw err;
        res.redirect('/answer'+question);
        });
    
      });
      router.get('/qdown:id',function(req,res,next){
        const question = req.params.id;
       
        var upd=que.findByIdAndUpdate(question,{
          $inc: { vote: -1} 
        }); 
        upd.exec(function(err,data){
          if(err) throw err;
          res.redirect('/answer'+question);
          });
      
        });

router.get('/asked',function(req,res,next){
  var email=req.session.useremail;
  
  var xist=que.findOne({email:"priyankapathade4773@gmail.com"});
  xist.exec(function(err,data){
    console.log(data);
    
    res.render('asked',{records:data,email:email})
  });
})        

router.get("/Adv",function(req,res,next){
  res.render("adv")
})

router.post("/Adv",function(req,res,next){
 var email=req.body.email;
  var  title=req.body.title;
  var  des=req.body.description;
   var url=req.body.url;
   var start=req.body.dat;
   var dur=req.body.tym;
   var category=req.body.category;

console.log(category);

  var adv1=new adv({
    email:email,
    title:title,
    des:des,
    url:url,
    start:start,
    dur:dur
    
  })
  adv1.save(function(err,data){
    if(err) throw err;
    if(category=="Video with Text"){
      res.redirect('/video');
    }
    else if(category=="Image with Text"){

    }
    else{
      res.redirect('/');
    }
  })

})

router.get('/video',function(req,res,next){
  res.render('vedio');
})

//how to move in desti and to get filename
var Storage=multer.diskStorage({
  destination:"./public/uploads",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});
var upload=multer({
  storage:Storage
}).single('filename');


router.post('/video',upload,function(req,res,next){
  var img=req.file.filename;
  var success=req.file.filename+"uploaded successfully";
  var imgdetails=new Imgmodel({
    img:img
  });

  imgdetails.save(function(err,data){
    if(err) throw err;
    else{
      imgData.exec(function(err,data){
        if(err) throw err;
        else{
          res.redirect('/');

        }
      });

    }
  });
});
router.get('/showadv',function(req,res,next){
  var xist=adv.findOne({email:"priyankapathade4773@gmail.com"});
  xist.exec(function(err,data){
    console.log(data);
    let date_ob = data.start;
   
    let date = ( date_ob.getDate());
    console.log(date+2);
    
    let date1_ob = new Date();
    let date1 = (date_ob.getDate());
    console.log(date1);
    
    if(date1<=date){
      res.render('showadv')
    }
    
  });  
})
module.exports = router;
