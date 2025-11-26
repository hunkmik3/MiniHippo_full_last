import createUser from '../../server/api/users/create.js';
import deleteUser from '../../server/api/users/delete.js';
import listUsers from '../../server/api/users/list.js';
import updateUser from '../../server/api/users/update.js';

const handlers = {
  create: createUser,
  delete: deleteUser,
  list: listUsers,
  update: updateUser
};

export default async function handler(req, res) {
  const action = (req.query?.action || req.url?.split('/')?.pop() || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown users action' });
  }

  return fn(req, res);
}
