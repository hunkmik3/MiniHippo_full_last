import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function loadLocalEnv() {
  const envPath = path.join(rootDir, '.env.local');
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index === -1) return;
      const key = trimmed.slice(0, index).trim();
      let value = trimmed.slice(index + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key && !process.env[key]) process.env[key] = value;
    });
  } catch {
    // Environment can be provided by the shell.
  }
}

function isVstepSet(set) {
  const marker = String(set?.data?.__practice_type || set?.type || '').toLowerCase();
  return marker === 'vstep';
}

function normalizeFlow(value) {
  return String(value || '').toLowerCase() === 'lesson_exam' ? 'lesson_exam' : 'practice';
}

function normalizeKind(value, flow) {
  const kind = String(value || '').toLowerCase();
  if (kind === 'lesson' || kind === 'assigned_exam' || kind === 'mock_test') return kind;
  return flow === 'lesson_exam' ? 'assigned_exam' : 'mock_test';
}

await loadLocalEnv();
const { selectFrom, insertInto, updateTable } = await import('../server/api/_utils/supabase.js');

const legacySets = await selectFrom('practice_sets', {
  order: { column: 'created_at', asc: false }
});

const vstepSets = (legacySets || []).filter(isVstepSet);
let created = 0;
let updated = 0;

for (const set of vstepSets) {
  const data = set.data && typeof set.data === 'object' ? { ...set.data } : {};
  const flow = normalizeFlow(data.vstep_flow);
  const contentKind = normalizeKind(data.vstep_content_kind, flow);
  const status = String(data.status || 'published').toLowerCase() === 'draft' ? 'draft' : 'published';

  data.__practice_type = 'vstep';
  data.vstep_module = true;
  data.vstep_flow = flow;
  data.vstep_content_kind = contentKind;
  data.status = status;
  data.legacy_practice_set_id = set.id;

  const payload = {
    flow,
    content_kind: contentKind,
    title: set.title || 'VSTEP content',
    description: set.description || '',
    status,
    duration_minutes: Number(set.duration_minutes) || 177,
    data
  };

  const existing = await selectFrom('vstep_contents', {
    filters: [{ column: 'title', value: payload.title }],
    single: true
  });

  if (existing?.id) {
    await updateTable('vstep_contents', [{ column: 'id', value: existing.id }], {
      ...payload,
      updated_at: new Date().toISOString()
    });
    updated += 1;
  } else {
    await insertInto('vstep_contents', payload);
    created += 1;
  }
}

console.log(JSON.stringify({
  migrated_from_practice_sets: vstepSets.length,
  created,
  updated
}, null, 2));
