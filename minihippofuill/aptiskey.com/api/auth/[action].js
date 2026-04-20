import login from '../../server/api/auth/login.js';
import logout from '../../server/api/auth/logout.js';
import refresh from '../../server/api/auth/refresh.js';
import verify from '../../server/api/auth/verify.js';

const handlers = {
  login,
  logout,
  refresh,
  verify
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown auth action' });
  }

  return fn(req, res);
}
