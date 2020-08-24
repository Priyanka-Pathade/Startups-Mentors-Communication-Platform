var express = require('express');
var router = express.Router();
var bcrypt=require('bcrypt');
var session = require('express-session')
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose')

//model for database
var answer=require('../module/ans');
var sign=require('../module/sign');
var adv=require('../module/adv');
var que=require('../module/que');
const date = require('date-and-time');
var proStartup=require('../module/profile_startup');
var randomstring = require("randomstring");
var Imgmodel=require('../module/uploadimg');
var hireModel=require('../module/hire');
var IntModel=require('../module/inte_stu');

var sign=require('../module/sign');
var proStartup=require('../module/profile_startup');
var proMentor=require('../module/profile_mentor');
var notifyMentor=require('../module/notify_mentor');
var acceptStartup=require('../module/accept_startup');
// var chatting_startup=require('../module/chatting_start');
var chatmentor=require('../module/chat_mentor');
var blogmentor=require('../module/blog_mentor');



var imgData=Imgmodel.find({});

var multer  = require('multer');
var path=require('path');
var upload = multer({ dest: 'uploads/' });




//to define path
router.use(express.static(__dirname+"./public/"));


//middleware to display nav for login users
function checklogin(req,res,next){
  var user=req.session.useremail;
  if(!user){
    res.redirect('/login')
  }
  next();
}
var notifyMentor=require('../module/notify_mentor');
router.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

/* GET home page. */
router.get('/',function(req,res,next){
  var user=req.session.useremail;
  res.render('index1',{user:user});

})

//sign
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

//login 
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
        req.session.useremail=getemail;
        console.log( req.session.useremail);
        
        var user=req.session.useremail;
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

//logout
router.get('/logout',function(req,res,next){
  req.session.destroy(function(err) {
    if(err){
      res.redirect('/index');
    }
  });
  res.redirect('/login');
});

//index page for mentor
router.get('/mentorhome',function(req,res,next){
  var user=req.session.useremail;
  res.render('mentorhome',{user:user});

});

//index page for startup
router.get('/startuphome',function(req,res,next){
  var user=req.session.useremail;
  res.render('startuphome',{user:user});

});

//index page for student
router.get('/studenthome',function(req,res,next){
  var user=req.session.useremail;
  res.render('studenthome',{user:user});

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

//show existing profile
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

//update existing profile
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

//mentor profile
router.get('/mentor_profile',function(req,res,next){
  var user=req.session.useremail;
  var Exist1=proMentor.findOne({email:user});
  Exist1.exec(function(err,data){
    if(err) throw err;
    if(data){
      res.redirect('Existing_mentor');
    }    
    else{
      var mentor=sign.findOne({email:user});
      mentor.exec(function(err,data){
        if(err) throw err;
        if(data){
          var getcat=data.Register_as;
          var getname=data.name;
          res.render('mentor_profile',{data:data});
        }
      });
    }
  });
});
router.post('/mentor_profile',function(req,res,next){
  var email=req.session.useremail;
  var gender=req.body.gender;
  var stories=req.body.stories;
  var mobile=req.body.mobile;
  var sector1=req.body.sector1;
  var sector2=req.body.sector2;
  var sector3=req.body.sector3;
  var work_ex=req.body.work_ex;
  var work_year=req.body.work_year;
  var g_stages=req.body.g_stages;
  var name=req.body.fname;
  // var image=req.file.filename;

  var men= new proMentor({
     email:email,
     name:name,
     gender:gender,
      stories:stories,
      mobile:mobile,
      sector1:sector1,
      sector2:sector2,
      sector3:sector3,
      work_ex:work_ex,
      work_year:work_year,
      g_stages:g_stages,

  });
  men.save(function(err,data){
    if(err) throw err;
    else{
      res.redirect('mentorhome');
    }
  });
  });

  router.get('/Existing_mentor',function(req,res,next){
    var email=req.session.useremail;
  
    var Exist2=proMentor.findOne({email:email});
    Exist2.exec(function(err,data){
      if(err) throw err;
      var uid=data._id
       console.log(data._id);
       console.log(uid);
      res.render('Existing_mentor',{data:data,uid:uid})
    });
  });

  router.post('/Existing_mentor',function(req,res,next){
    console.log(req.body.uid);
    console.log(req.body.email);
    
    var upd1=proMentor.findByIdAndUpdate(req.body.uid,{
      email:req.body.email,
      gender:req.body.gender,
       stories:req.body.stories,
       mobile:req.body.mobile,
       sector1:req.body.sector1,
       sector2:req.body.sector2,
      sector3:req.body.sector3,
       work_ex:req.body.work_ex,
       work_year:req.body.work_year,
       g_stages:req.body.g_stages,
    }); 
    upd1.exec(function(err,data){
    if(err) throw err;
    res.redirect('/mentorhome');
    });
    });


//change password
router.get('/startup_setting',function(req,res,next){
  var email=req.session.useremail;
  var msg=req.session.msg;
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
  
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
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
       
       res.render('change',{msg:"",uid:uid});
    });
  
});

router.post('/change',function(req,res,next){
  var email=req.session.useremail;
  var uid=req.body.uid;
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

//ask in public forum
router.get('/askpublic',function(req,res,next){
 var email=req.session.useremail;
  
  res.render("askpublic",{email:email});
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
      res.redirect('/public:1');
    }
  })
})


//display public forum
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

//display anser shown in public forum
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

//write answer
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

//vote que and ans
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


//show asked que
router.get('/asked',function(req,res,next){
  var email=req.session.useremail;
  
  var xist=que.find({email:email});
  xist.exec(function(err,data){
    console.log(data);
    
    res.render('asked',{records:data,email:email})
  });
})        

//adv  from for startup
router.get("/Adv",function(req,res,next){
  res.render("adv")
})

router.post("/Adv",function(req,res,next){
  var cid;
  var email=req.session.useremail;
  console.log(email);
  
 var contact=req.body.email;
  var  title=req.body.title;
  var  des=req.body.description;
   var url=req.body.url;
   var start=req.body.dat;
   var end=req.body.dat2;
   var dur=req.body.tym;
   var category=req.body.category;
   var ty="vedio";
    if(category=="Image with Text"){
      ty="img";
    }
  var adv1=new adv({
    contact:contact,
    title:title,
    des:des,
    url:url,
    start:start,
    dur:dur,
    end:end,
    email:email,
     ty:ty
  })
  adv1.save(function(err,data){
    if(err) throw err;
    cid=data._id;
    console.log(cid);
    req.session.cid=cid;
    if(category=="Video with Text"||category=="Image with Text"){
      res.redirect('/video');
    }
    else{
      res.redirect('/startuphome');
    }
  })

  
})

router.get('/video',function(req,res,next){
  console.log(req.session.cid);
  
  res.render('vedio' ,{cid:req.session.cid});
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
  var cid=req.session.cid;
  console.log(cid);
  
  var success=req.file.filename+"uploaded successfully";
  var imgdetails=new Imgmodel({
    img:img,
    cid:cid
  });

  imgdetails.save(function(err,data){
    if(err) throw err;
    else{
      imgData.exec(function(err,data){
        if(err) throw err;
       
      });

    }
  });
  var upd=adv.findByIdAndUpdate(cid,{
   img:img,
 
  }); 
  upd.exec(function(err,data){
    if(err) throw err;
    res.redirect('/startuphome');
    });

});

//show adv
router.get('/showadv',function(req,res,next){
  var currentDate = new Date();
  var xist=adv.find( { $and: [ { start: { $lte: currentDate  } }, { end: { $gt: currentDate } } ] } );
  xist.exec(function(err,data){
  if (err)  throw err;
  console.log(data);
  
    res.render('showadv',{data:data});
    
  });  
})

//hiring form for startup
router.get("/hire",function(req,res,next){
  res.render("hire")
})
router.post("/hire",function(req,res,next){
  var user=req.session.useremail;
  var cname=req.body.cname;
  var email1=req.body.email;
  var desig=req.body.place;
  var description=req.body.description;
  var url=req.body.url;
  var dat=req.body.dat;
  var sector=req.body.sector;
  var loc=req.body.loc;
  var hireModel1=new hireModel({
    email:user,
    cname:cname,
    desig:desig,
    contact:email1,
    des:description,
    url:url,
    start:dat,
    sector:sector,
    loc:loc
  })

  hireModel1.save(function(err,data){
    if(err) throw err;
   
  })
  res.redirect("startuphome")
})

//no use
router.get("/selected",function(req,res,next){
  var email=req.session.useremail;
  var xist=IntModel.find({chid:email});
  xist.exec(function(err,data){
    console.log(data);
    res.render("select",{data:data})
    });
})

//show posted job by startup to student
router.get("/stuhire",function(req,res,next){
  var email=req.session.useremail;
  var xist=hireModel.find({});
  xist.exec(function(err,data){
    console.log(data);
    
    res.render('stuhire',{records:data,email:email})
  });
})

//apply for job
router.get('/apply:id',function(req,res,next){
  var id=req.params.id;
var email=req.body.useremail;
  res.render('vedio',{cid:id,email:email})
})

router.post('/apply:id',upload,function(req,res,next){
  var id=req.params.id;
var email=req.session.useremail;
var img=req.file.filename;


var success=req.file.filename+"uploaded successfully";
  var studetails=new IntModel({
    img:img,
    chid:id,
    email:email
  });

  studetails.save(function(err,data){
    if(err) throw err;
    else{
      imgData.exec(function(err,data){
        if(err) throw err;
       res.redirect("/studenthome")
      });

    }
})
})

//see posted job by startup
router.get('/seeadv',function(req,res,next){
var email=req.session.useremail;
var xist=hireModel.find({email:email});
xist.exec(function(err,data){
  console.log(data);
  
  res.render('seeposted',{records:data,email:email})
});
})

//see list of student
router.get("/seelist:id",function(req,res,next){
  var id=req.params.id;
  var xist=IntModel.find({chid:id});
xist.exec(function(err,data){
  console.log(data);
  res.render('select',{data:data})
});
})

router.get('/blog',function(req,res,next){
  res.render('blog',{succ:''});
   });
   router.post('/blog',upload,function(req,res,next){
  var user=req.session.useremail;
  var title=req.body.title;
  var domain=req.body.domain;
  var description=req.body.description;
  var image=req.file.filename;
var a1= new blogmentor({
    menEmail:user,
    title:title,
    domain:domain,
    desc:description,
    image:image,
 });
 a1.save(function(err,data){
   if(err) throw err;
   else{
    
     res.render('blog',{succ:"submitted successfully!"});
   }
 });
   });
   
//blogs
router.get('/blog_startup',function(req,res,next){
var Ex8=blogmentor.find();
  Ex8.exec(function(err,data){
    if(err) throw err;
    if(data){
    res.render('blog_startup',{record:data});
  }
});
   });
   router.post('/blog_startup',function(req,res,next){
    var user=req.session.useremail;
    var men=req.body.menemail;
    var dd=req.body.dd;
    console.log(men);
    console.log(dd);

var f1=blogmentor.findOne({$and:[{menEmail:men},{_id:dd}]});
  f1.exec(function(err,data){
    if(err) throw err;
    if(data){
    res.render('blog_detail',{data:data});
  }
});
});
router.get('/blog_detail,',function(req,res,next){
    var user=req.session.useremail;
    res.render('blog_detail');
   });
   



/// filter mentor
router.get('/startup_private',function(req,res,next){
  var user=req.session.useremail;
  res.render('startup_private',{user:user,records:'',domain:''});
});
router.post('/startup_private',function(req,res,next){
  var domain=req.body.domain;
  var level=req.body.level;

    if(domain !='' && level !=''){
      var filt={$and:[{$or:[{sector1:domain},{sector2:domain},{sector3:domain}]},{g_stages:level}]}
   
    }else if(domain !='' && level ==''){
      var filt={$or:[{sector1:domain},{sector2:domain},{sector3:domain}]}
    }else{
      var filt={}
    }

    var mentorFilter=proMentor.find(filt);
    mentorFilter.exec(function(err,data){
      if(err) throw err;
      if(data){
        res.render('filter_list',{records:data,domain:domain});
      }
    });
});

//post method of filter list
router.post('/show_mentor_profile/',function(req,res,next){
  // var user=req.session.useremail;
   var mail=req.body.email;
   var findProf=proMentor.findOne({email:mail});
   findProf.exec(function(err,data){
     if(err) throw err;
     if(data){
       res.render('show_mentor_profile',{data:data});
     }
   });
 });
 router.get('/show_mentor_profile',function(req,res,next){
   var user=req.session.useremail;
   res.render('show_mentor_profile',{msg:'',user:user});
 });

 //post of show_mentor_profile
 router.post('/chat',function(req,res,next){
   var user=req.session.useremail;
   var mentorEmail=req.body.mentorEmail;
  var userobj;
  var mentorObj;
  // console.log(user);
   var chatobj=sign.findOne({email:user});
   chatobj.exec(function(err,data){
     
     if(err) throw err;
     if(data){  
      userobj=data;

      var chatobj2=sign.findOne({email:mentorEmail});
      chatobj2.exec(function(err,data2){
        
        if(err) throw err;
        if(data2){  
          // console.log(data2);
          // console.log(data);
          var existing=chatmentor.findOne({$and:[{postedByemail:data.email},{postedToemail:data2.email}]});
          existing.exec((err,data3)=>{
            if(err) throw err;
            if(!data3){
              req.session.user=data;
              req.session.mentor=data2;

              var chats=new chatmentor({
                postedByemail:data.email,
                postedToemail:data2.email,

                postedBy:data.name,
                postedTo:data2.name
              })
          
              chats.save(function(err,data){
                if(err) throw err;
                else{

                  res.redirect('/initialchat')
                }
              })
            }
            if(data3){
              req.session.user=data;
              req.session.mentor=data2;

              res.redirect('/ctchat')
            }

          })
        }
      })

    }
     });


 });


 //chatting 
 router.get('/initialchat',(req,res)=>{
  const user=req.session.user;
  const mentor=req.session.mentor;
  res.render('initialchat',{user, mentor})
}) 


 router.post('/initialchat',(req,res)=>{
  const user=req.session.user;
  const mentor=req.session.mentor;
  const msg=req.body.msg;
  // console.log(user);
  const comment = {
    text:msg,
    postedBy:user.name
}

var existing=chatmentor.findOne({$and:[{postedByemail:user.email},{postedToemail:mentor.email}]});
      existing.exec((err,data)=>{
        if(err) throw err;
        if(data){

          chatmentor.findByIdAndUpdate(data._id,{
            $push:{comments:comment}
          },{
            new:true
          })
          .exec((err,result)=>{
            if(err){
               throw err
            }else{
              // console.log(result);
                res.redirect('/ctchat')
            }
          })
        }
      })
 })
 

 //ct chatting
router.get('/ctchat',(req,res)=>{
  const user=req.session.user;
  const mentor=req.session.mentor;
  const useEmail=req.session.useremail;
  var men="no";
  if(mentor.email==useEmail){
    men="yes";
  }

  var existing=chatmentor.findOne({$and:[{postedByemail:user.email},{postedToemail:mentor.email}]});
  existing.exec((err,data)=>{
    if(err) throw err;
    if(data){
    res.render('ctchat',{msgdata:data.comments,user,mentor,men});
    }
})
})

router.post('/ctchat',(req,res)=>{
  const user=req.session.user;
  const mentor=req.session.mentor;
  var user_mentor=req.session.useremail;

  const msg=req.body.msg;
  var existing=chatmentor.findOne({$and:[{postedByemail:user.email},{postedToemail:mentor.email}]});
      existing.exec((err,data)=>{
        if(err) throw err;
        if(data){
          var comment=" ";
          if(user.email==user_mentor){
             comment = {
              text:msg,
              postedBy:user.name
          }
        }
      
        if(mentor.email==user_mentor){
           comment = {
            text:msg,
            postedBy:mentor.name
        }
      }
      
          chatmentor.findByIdAndUpdate(data._id,{
            $push:{comments:comment}
          },{
            new:true
          })
          .exec((err,result)=>{
            if(err){
               throw err
            }else{
              // console.log(result);
                res.redirect('/ctchat')
            }
          })
        }
      })

})


//notify for mentor
router.get('/notify',(req,res)=>{
  const mentor=req.session.useremail;

  var mentorobj=chatmentor.find({postedToemail:mentor});
  mentorobj.exec(function(err,data){
    if(err) throw err;
    if(data){ 
      res.render('notify',{data})
      // console.log(data);
    }
})

})


router.post('/notify',(req,res)=>{
 const user=req.body.postedby;
 var mentorEmail=req.session.useremail;

 var chatobj=sign.findOne({email:user});
 chatobj.exec(function(err,data){
   
   if(err) throw err;
   if(data){  
    req.session.user=data;
    var chatobj1=sign.findOne({email:mentorEmail});
    chatobj1.exec(function(err,data1){
   
      if(err) throw err;
      if(data1){  
        req.session.mentor=data1;
        res.redirect('/ctchat');
      }
    })
  }
    })

})

router.get('/notifyStartup',(req,res)=>{
  const startup=req.session.useremail;

  var startobj=chatmentor.find({postedByemail:startup});
  startobj.exec(function(err,data){
    if(err) throw err;
    if(data){ 
      res.render('notifyStartup',{data})
      // console.log(data);
    }
})

})



router.post('/notifyStartup',(req,res)=>{
  const mentor=req.body.postedto;
  var startupemail=req.session.useremail;
 
  var chatobj=sign.findOne({email:startupemail});
  chatobj.exec(function(err,data){
    
    if(err) throw err;
    if(data){  
     req.session.user=data;
     var chatobj1=sign.findOne({email:mentor});
     chatobj1.exec(function(err,data1){
    
       if(err) throw err;
       if(data1){  
         req.session.mentor=data1;
        //  console.log(data1);
         res.redirect('/ctchat');
       }
     })
   }
     })

 
})

module.exports = router;
