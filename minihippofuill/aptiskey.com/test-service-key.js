const fs = require('fs');
const https = require('https');
const path = require('path');

// Read .env.local manually to get the exact file content
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const parseEnv = (content) => {
    const env = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            env[match[1]] = match[2].trim(); // Trim to be safe, simulating app behavior
        }
    });
    return env;
};

const env = parseEnv(envContent);
const SUPABASE_URL = env.SUPABASE_URL || 'https://bydmstfxyplrfmlfkddl.supabase.co';
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_KEY;

console.log('Testing Supabase SERVICE KEY from .env.local...');
console.log('URL:', SUPABASE_URL);
console.log('Service Key Length:', SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY.length : 0);
console.log('Service Key First 5:', SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY.substring(0, 5) : 'NONE');

if (!SUPABASE_SERVICE_KEY) {
    console.error('ERROR: SUPABASE_SERVICE_KEY not found in .env.local');
    process.exit(1);
}

// Try to fetch users (requires service role usually)
// However, direct table access via REST with Service Key should work and bypass RLS.
const hostname = SUPABASE_URL.replace('https://', '').replace('http://', '');

const options = {
    hostname: hostname,
    path: '/rest/v1/users?select=count',
    method: 'GET',
    headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_SERVICE_KEY,
        'Range': '0-1'
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
