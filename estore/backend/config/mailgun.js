const mailgun = require('mailgun-js');
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

// Send email function
const sendEmail = (recipientEmail, subject, body) => {
  const data = {
    from: process.env.FROM_EMAIL,
    to: recipientEmail,
    subject: subject,
    text: body,
    html: `<html><body><h1>${body}</h1></body></html>`,
  };

  // Debug log to check if domain and mg are correct
  console.log("Mailgun API Key:", process.env.MAILGUN_API_KEY);
  console.log("Mailgun Domain:", DOMAIN);
  console.log("Mailgun Object:", mg);

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent successfully:', body);
    }
  });
};

module.exports = sendEmail;
