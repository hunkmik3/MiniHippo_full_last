const https = require('https');

const SUPABASE_URL = 'https://bydmstfxyplrfmlfkddl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZG1zdGZ4eXBscmZtbGZrZGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1ODU0NTUsImV4cCI6MjA3ODE2MTQ1NX0.jJ-JDueuwLS5tCDddY5S4JkgWLmDLGCw5b0BE77-F38';

console.log('Testing Supabase Connection...');
console.log('URL:', SUPABASE_URL);
// console.log('Key:', SUPABASE_ANON_KEY);

const options = {
    hostname: 'bydmstfxyplrfmlfkddl.supabase.co',
    path: '/rest/v1/',
    method: 'GET',
    headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
