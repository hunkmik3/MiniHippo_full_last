const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn(
    '[supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. API routes will fail until these are configured.'
  );
}

async function supabaseFetch(path, options = {}) {
  const url = `${SUPABASE_URL}${path}`;
  const headers = {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { error: text || 'Unknown Supabase error' };
    }
    const error = new Error(parsed.error || 'Supabase request failed');
    error.status = response.status;
    error.details = parsed;
    throw error;
  }

  if (options.method === 'HEAD') {
    return null;
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function selectFrom(
  table,
  { filters = [], order, limit, single, columns = '*' } = {}
) {
  const params = [];
  filters.forEach(({ column, operator = 'eq', value }) => {
    params.push(`${encodeURIComponent(column)}=${operator}.${encodeURIComponent(value)}`);
  });
  params.push(`select=${columns}`);
  if (order) {
    params.push(`order=${order.column}.${order.asc === false ? 'desc' : 'asc'}`);
  }
  if (limit) {
    params.push(`limit=${limit}`);
  }
  if (single) {
    params.push('limit=1');
  }

  const query = params.join('&');
  const data = await supabaseFetch(`/rest/v1/${table}?${query}`, {
    method: 'GET'
  });
  if (single) {
    return Array.isArray(data) ? data[0] : data;
  }
  return data;
}

export async function insertInto(table, payload) {
  return supabaseFetch(`/rest/v1/${table}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      Prefer: 'return=representation'
    }
  });
}

export async function updateTable(table, filters, payload) {
  const params = filters
    .map(({ column, operator = 'eq', value }) => `${column}=${operator}.${encodeURIComponent(value)}`)
    .join('&');
  return supabaseFetch(`/rest/v1/${table}?${params}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      Prefer: 'return=representation'
    }
  });
}

export async function deleteFrom(table, filters) {
  const params = filters
    .map(({ column, operator = 'eq', value }) => `${column}=${operator}.${encodeURIComponent(value)}`)
    .join('&');
  return supabaseFetch(`/rest/v1/${table}?${params}`, {
    method: 'DELETE',
    headers: {
      Prefer: 'return=representation'
    }
  });
}

export function buildSupabaseHeaders({ useAnonKey = false, includeAuthHeader = true } = {}) {
  const apiKey = useAnonKey && SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY : SUPABASE_SERVICE_KEY;
  const headers = {
    apikey: apiKey,
    'Content-Type': 'application/json'
  };

  if (includeAuthHeader) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

export async function callSupabaseAuth(path, options = {}, config = {}) {
  const url = `${SUPABASE_URL}/auth/v1/${path}`;
  const headers = {
    ...buildSupabaseHeaders({ useAnonKey: config.useAnonKey !== false, includeAuthHeader: config.includeAuthHeader !== false }),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { error: text || 'Auth request failed' };
    }
    const error = new Error(parsed.error || 'Auth request failed');
    error.status = response.status;
    error.details = parsed;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function buildGithubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('Missing GITHUB_TOKEN environment variable');
  }
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  };
}

export async function fetchGithubContent(filePath) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) {
    throw new Error('Missing GITHUB_OWNER or GITHUB_REPO environment variables');
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      headers: buildGithubHeaders()
    }
  );

  if (!response.ok) {
    const text = await response.text();
    const error = new Error(`GitHub content fetch failed (${response.status})`);
    error.details = text;
    throw error;
  }

  return response.json();
}

export async function putGithubContent(
  filePath,
  { content, message, encoding = 'utf8' }
) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const headers = {
    ...buildGithubHeaders(),
    'Content-Type': 'application/json'
  };

  let sha = null;
  try {
    const current = await fetchGithubContent(filePath);
    sha = current.sha;
  } catch (error) {
    // file may not exist -> ignore 404
  }

  let encodedContent;
  if (encoding === 'base64') {
    encodedContent = content;
  } else {
    encodedContent = Buffer.from(content, encoding).toString('base64');
  }

  const body = {
    message: message || `Update ${filePath}`,
    content: encodedContent,
    branch: process.env.GITHUB_BRANCH || 'main'
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    }
  );

  if (!response.ok) {
    const text = await response.text();
    const error = new Error(`GitHub upload failed (${response.status})`);
    error.details = text;
    throw error;
  }

  return response.json();
}

