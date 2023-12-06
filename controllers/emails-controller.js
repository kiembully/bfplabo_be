const { validationResult } = require('express-validator');
require('dotenv').config();

const nodemailer = require('nodemailer');

const emailContent = (data, email) => `<table><tr><th style="text-align:left">Email</th><td style="padding-left:10px">${email}</td></tr><tr><th style="text-align:left">User ID</th><td style="padding-left:10px">${data.creator}</td></tr><tr><th style="text-align:left">Order ID</th><td style="padding-left:10px">${data.id}</td></tr><tr><th style="text-align:left">Payment Mode</th><td style="padding-left:10px">${data.discount==='10' ? 'Installment Payment' : 'Full Payment'}</td></tr><tr><th style="text-align:left">discount</th><td style="padding-left:10px">%${data.discount}</td></tr><tr><th style="text-align:left">price</th><td style="padding-left:10px">${data.price}</td></tr><tr><th style="text-align:left">price after discount</th><td style="padding-left:10px">${data.discountedPrice}</td></tr></table>`

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  }
})

const sendInvoice = async (req, res, next) => {
  const { to, subject, data, email } = req.body;

  const output = emailContent(data, email)

  const mailOptions = {
      from: process.env.GMAIL,
      to,
      subject,
      html: output
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log(res)
        res.json({ message: 'Email sent successfully' });
    }
  });
}

exports.sendInvoice = sendInvoice