const nodemailer = require('nodemailer');
const config = require('./config');

const useSmtp = Boolean(config.smtp.host);

const transporter = useSmtp
  ? nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
    })
  : null;

/** Fire-and-forget email. Never throws; without SMTP settings it prints to the console. */
function send(to, subject, text) {
  if (!to || /\.invalid$/i.test(to)) return;

  if (!transporter) {
    console.log(`[email:console] to=${to} subject="${subject}"\n${text}\n`);
    return;
  }

  transporter
    .sendMail({ from: config.smtp.from, to, subject, text })
    .catch((err) => console.error(`[email] failed to send to ${to}: ${err.message}`));
}

module.exports = { send };
