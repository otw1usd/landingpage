const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

var transporter = nodemailer.createTransport({
    host: 'amati.co',
    port: 465,
    secure: true,
    auth: {
        user: 'support@amati.co',
        pass: '31kpoyf*].NH'
    },
    //nanti bagian tls ini diapus ketika uda diupload, config buat di local
    tls : {
        rejectUnauthorized:false
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
            from: 'support@amati.co',
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