const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'construction.amati@gmail.com',
        pass: '30under30'
    }
    
});

const sendemailclient = (name,email, subject, message)=>{
        var mailOptions = {
            from: email,
            to: 'support@amati.co',
            subject: subject+' from '+email +' ,name: '+name,
            html: message,
            };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    };

module.exports ={ sendemailclient }