// You have to follow 2 steps:
/**
	Step:1---> https://www.google.com/settings/security/lesssecureapps 
	Then allow less secure apps
	
	Step:2---> go here https://accounts.google.com/DisplayUnlockCaptcha 
	And then enable/continue.
*/ 


var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'xxxxxxxx@gmail.com',
    pass: 'xxxxxxxxx'
  }
}));

var mailOptions = {
  from: 'xxxxxxxx@gmail.com',
  to: 'xxxxxxxxx@gmail.com',
  subject: 'Sending Email using Node.js[nodemailer]',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 