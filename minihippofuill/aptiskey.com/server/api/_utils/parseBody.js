export default function parseBody(req) {
  if (req?.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }

  if (typeof req?.body === 'string') {
    const rawBody = req.body.trim();
    if (!rawBody) return Promise.resolve({});
    try {
      return Promise.resolve(JSON.parse(rawBody));
    } catch {
      return Promise.reject(new Error('Invalid JSON payload'));
    }
  }

  if (!req || typeof req.on !== 'function') {
    return Promise.resolve({});
  }

  if (req.readableEnded || req.complete) {
    return Promise.resolve({});
  }

  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
      // Basic guard to prevent oversized payloads from crashing the function.
      // Base64 expands binary uploads, so this stays above the 50MB media cap.
      if (data.length > 75 * 1024 * 1024) { // 75MB
        if (typeof req.destroy === 'function') {
          req.destroy();
        } else if (req.socket && typeof req.socket.destroy === 'function') {
          req.socket.destroy();
        }
        reject(new Error('Payload too large (max 75MB)'));
      }
    });

    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new Error('Invalid JSON payload'));
      }
    });

    req.on('error', reject);
  });
}

// Named export for backward compatibility
export const parseJsonBody = parseBody;
