import login from '../../server/api/auth/login.js';
import logout from '../../server/api/auth/logout.js';
import verify from '../../server/api/auth/verify.js';

const handlers = {
  login,
  logout,
  verify
};

export default async function handler(req, res) {
  const action = (req.query?.action || req.url?.split('/')?.pop() || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown auth action' });
  }

  return fn(req, res);
}
