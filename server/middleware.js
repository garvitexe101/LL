const jwt = require('jsonwebtoken');
const db = require('./db');
const config = require('./config');
const { HttpError } = require('./http');

const COOKIE = 'll_token';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function issueToken(res, user) {
  const token = jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: '7d' });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.secureCookies,
    maxAge: WEEK_MS,
  });
}

function clearToken(res) {
  res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'lax', secure: config.secureCookies });
}

/** Attaches req.user (fresh from the database, so role changes apply immediately) or null. */
function loadUser(req, res, next) {
  req.user = null;
  const token = req.cookies && req.cookies[COOKIE];
  if (token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      req.user =
        db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(payload.sub) || null;
    } catch (err) {
      req.user = null;
    }
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return next(new HttpError(401, 'Please sign in first.', 'auth_required'));
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) return next(new HttpError(401, 'Please sign in first.', 'auth_required'));
  if (req.user.role !== 'admin') return next(new HttpError(403, 'Administrator access required.', 'forbidden'));
  next();
}

/** Tiny in-memory per-IP limiter, enough to slow down password guessing locally. */
function rateLimit({ windowMs, max }) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    const entry = hits.get(key);
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      return next(new HttpError(429, 'Too many attempts. Please try again in a few minutes.', 'rate_limited'));
    }
    next();
  };
}

module.exports = { issueToken, clearToken, loadUser, requireAuth, requireAdmin, rateLimit };
