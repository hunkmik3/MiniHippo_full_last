export default function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
      // Basic guard to prevent oversized payloads from crashing the function
      // Increased limit to 50MB for audio file uploads
      if (data.length > 50 * 1024 * 1024) { // 50MB
        req.connection.destroy();
        reject(new Error('Payload too large (max 50MB)'));
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


