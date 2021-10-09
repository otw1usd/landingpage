const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

var transporter = nodemailer.createTransport({
    //nanti kalu uda diupload
    // host: 'amati.co',
    // port: 465,
    // secure: true,
    // auth: {
    //     user: 'support@amati.co',
    //     pass: '31kpoyf*].NH'
    // }

    //kalo gmail
    service: 'gmail',
    auth :{
        user : 'construction.amati@gmail.com',
        pass: '30under30'
    }
});



const senduseremailverification = (userid,useremail)=>{
    const pk = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;
    const pkpk = 'amatimaster';
    jwt.sign(
        {
            userid: userid,
        },
        pkpk,
        {
            expiresIn: '1hr',
        },
      (err, emailToken)=>{
        const url = `http://localhost:3000/confirmation/${emailToken}`
        var mailOptions = {
            from: 'construction.amati@gmail.com',
            to: useremail,
            subject: 'Sending Email using Node.js',
            html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
    }); 
};

module.exports ={ senduseremailverification }