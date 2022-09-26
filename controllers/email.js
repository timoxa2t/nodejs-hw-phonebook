const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'alex2t@ukr.net',
  from: 'alex2t@ukr.net',
  subject: 'Phonebook email verification',
  text: 'and easy to do anywhere, even with Node.js',
};


async function sendVerificationMail(email, token, host){

  const mail = {...msg, to: email, text: `http://${host}/users/verify/${token}`}
  const res = await sgMail.send(mail)
  return res
}

module.exports = sendVerificationMail
