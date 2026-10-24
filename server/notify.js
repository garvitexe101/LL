const db = require('./db');
const mailer = require('./mailer');

/** Stores an in-app notification and emails the user. */
function notifyUser(userId, { type, title, message, note = null, link = null }) {
  db.prepare(
    'INSERT INTO notifications (user_id, type, title, message, note) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, type, title, message, note);

  const user = db.prepare('SELECT name, email FROM users WHERE id = ?').get(userId);
  if (!user) return;

  const body = [`Hi ${user.name},`, '', message];
  if (note) body.push('', note);
  if (link) body.push('', link);
  body.push('', '— LostLink, Chitkara University');
  mailer.send(user.email, `LostLink: ${title}`, body.join('\n'));
}

module.exports = { notifyUser };
