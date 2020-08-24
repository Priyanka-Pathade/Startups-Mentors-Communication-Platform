var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'startuphackethon@gmail.com',
    pass: 'TonyStark'
  }
});

var mailOptions = {
  from: 'startuphackethon@gmail.com',
  to: 'shaikhfiza2018@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

  //   var transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //       user: 'startuphackethon@gmail.com',
  //       pass: 'Startup@123'
  //     }
  //   });
    
  //   var mailOptions = {
  //     from: 'startuphackethon@gmail.com',
  //     to: Semail,
  //     subject:'Your Request Accepted...',
  //     text: 'Hello',
  //     html:'<h1>Your Request is accepted by mentor, you are able to chat with them.</h1>'
  //   };
    
  //   transporter.sendMail(mailOptions, function(error, info){
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('Email sent: ' + info.response);
  //     }
  //   });
