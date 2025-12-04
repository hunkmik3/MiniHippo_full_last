import listDevices from '../../server/api/devices/list.js';
import removeDevice from '../../server/api/devices/remove.js';
import resetDevices from '../../server/api/devices/reset.js';

const handlers = {
  list: listDevices,
  remove: removeDevice,
  reset: resetDevices
};

export default async function handler(req, res) {
  const action = (req.query?.action || req.url?.split('/')?.pop() || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown devices action' });
  }

  return fn(req, res);
}





