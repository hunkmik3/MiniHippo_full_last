import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = __dirname;
const APP_DIR = path.join(ROOT_DIR, 'minihippofuill', 'aptiskey.com');
const PORT = Number(process.env.LOCAL_DEV_PORT || 3005);

loadEnvFile(path.join(ROOT_DIR, '.env.local'));

const moduleCache = new Map();

const directApiRoutes = {
  '/api/ask': 'api/ask.js',
  '/api/ask.js': 'api/ask.js',
  '/api/upload-audio': 'api/upload-audio.js',
  '/api/upload-audio.js': 'api/upload-audio.js',
  '/api/upload-speaking-recording': 'api/upload-speaking-recording.js',
  '/api/upload-speaking-recording.js': 'api/upload-speaking-recording.js',
  '/api/upload-lesson': 'api/upload-lesson.js',
  '/api/upload-lesson.js': 'api/upload-lesson.js',
  '/api/visitor-count': 'api/visitor-count.js',
  '/api/visitor-count.js': 'api/visitor-count.js'
};

const dynamicApiRoutes = [
  { regex: /^\/api\/auth\/([^/]+)\/?$/, modulePath: 'api/auth/[action].js', param: 'action' },
  { regex: /^\/api\/devices\/([^/]+)\/?$/, modulePath: 'api/devices/[action].js', param: 'action' },
  { regex: /^\/api\/lessons\/([^/]+)\/?$/, modulePath: 'api/lessons/[action].js', param: 'action' },
  { regex: /^\/api\/practice_results\/([^/]+)\/?$/, modulePath: 'api/practice_results/[action].js', param: 'action' },
  { regex: /^\/api\/practice_sets\/([^/]+)\/?$/, modulePath: 'api/practice_sets/[action].js', param: 'action' },
  { regex: /^\/api\/users\/([^/]+)\/?$/, modulePath: 'api/users/[action].js', param: 'action' }
];

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wav': 'audio/wav',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key] !== undefined) return;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    value = value.replace(/\\n/g, '\n');
    process.env[key] = value;
  });
}

function augmentResponse(res) {
  res.status = function status(code) {
    res.statusCode = code;
    return res;
  };

  res.json = function json(payload) {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(payload));
    return res;
  };

  res.send = function send(payload) {
    if (payload === undefined || payload === null) {
      res.end('');
      return res;
    }
    if (Buffer.isBuffer(payload)) {
      res.end(payload);
      return res;
    }
    if (typeof payload === 'object') {
      return res.json(payload);
    }
    res.end(String(payload));
    return res;
  };

  return res;
}

async function importHandler(relativePath) {
  const cacheKey = relativePath;
  if (!moduleCache.has(cacheKey)) {
    const fullPath = path.join(APP_DIR, relativePath);
    moduleCache.set(cacheKey, import(pathToFileURL(fullPath).href));
  }
  const mod = await moduleCache.get(cacheKey);
  return mod.default;
}

function buildQueryObject(searchParams) {
  const query = {};
  for (const [key, value] of searchParams.entries()) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      const current = query[key];
      query[key] = Array.isArray(current) ? [...current, value] : [current, value];
    } else {
      query[key] = value;
    }
  }
  return query;
}

async function handleApi(req, res, url) {
  const pathname = url.pathname;
  const query = buildQueryObject(url.searchParams);
  let handler = null;

  if (directApiRoutes[pathname]) {
    handler = await importHandler(directApiRoutes[pathname]);
  } else {
    for (const route of dynamicApiRoutes) {
      const match = pathname.match(route.regex);
      if (!match) continue;
      const action = decodeURIComponent(match[1]);
      query[route.param] = query[route.param] || action;
      handler = await importHandler(route.modulePath);
      break;
    }
  }

  if (!handler) {
    return false;
  }

  req.query = query;
  req.body = await readRequestBody(req);
  augmentResponse(res);

  try {
    await handler(req, res);
  } catch (error) {
    console.error('[local-dev-server] API error:', error);
    if (!res.headersSent) {
      res.status(error.status || 500).json({
        error: error.message || 'Internal server error'
      });
    } else {
      res.end();
    }
  }

  return true;
}

async function readRequestBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', () => {
      resolve(raw);
    });

    req.on('error', reject);
  });
}

async function resolveStaticFile(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const candidates = [];
  if (decodedPath === '/' || decodedPath === '') {
    candidates.push('/index.html');
  } else {
    candidates.push(decodedPath);
    if (!path.extname(decodedPath)) {
      candidates.push(`${decodedPath}.html`);
      candidates.push(path.join(decodedPath, 'index.html'));
    }
  }

  for (const candidate of candidates) {
    const normalized = path.normalize(candidate).replace(/^(\.\.[/\\])+/, '');
    const absolutePath = path.join(APP_DIR, normalized);
    if (!absolutePath.startsWith(APP_DIR)) continue;
    try {
      const stat = await fsp.stat(absolutePath);
      if (stat.isFile()) {
        return absolutePath;
      }
    } catch {
      // ignore missing candidate
    }
  }

  return null;
}

async function serveStaticFile(req, res, url) {
  const filePath = await resolveStaticFile(url.pathname);
  if (!filePath) {
    return false;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[ext] || 'application/octet-stream';
  const stream = fs.createReadStream(filePath);

  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);

  stream.on('error', (error) => {
    console.error('[local-dev-server] Static file error:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }
    res.destroy(error);
  });

  if (req.method === 'HEAD') {
    stream.destroy();
    res.end();
    return true;
  }

  stream.pipe(res);
  return true;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || `localhost:${PORT}`}`);

  if (await handleApi(req, res, url)) {
    return;
  }

  if (await serveStaticFile(req, res, url)) {
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`[local-dev-server] Ready at http://localhost:${PORT}`);
});
