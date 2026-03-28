import test from 'node:test';
import assert from 'node:assert/strict';

import { __testables } from './writingAutoGrade.js';

const {
  finalizeOpenAITextCorrection,
  buildOpenAITextCorrectionUserPrompt,
  buildPart1SemanticCheckUserPrompt,
  parsePart1SemanticCheckVerdict
} = __testables;

async function finalize(originalAnswer, rawModelOutput) {
  const result = await finalizeOpenAITextCorrection(originalAnswer, rawModelOutput);
  return result.correctionDecision.correctedAnswer;
}

test('active OpenAI prompt builder includes question context and answer', () => {
  const prompt = buildOpenAITextCorrectionUserPrompt({
    prompt: 'What do you like to do every morning?',
    answer: 'I like read book every morning'
  });

  assert.match(prompt, /Question: What do you like to do every morning\?/);
  assert.match(prompt, /Student answer:\nI like read book every morning/);
  assert.match(prompt, /Corrected answer:/);
});

test('part 1 semantic prompt builder includes question and corrected answer', () => {
  const prompt = buildPart1SemanticCheckUserPrompt(
    {
      prompt: 'Have you had dinner?',
      answer: 'I go by motorbike'
    },
    'I go by motorbike.'
  );

  assert.match(prompt, /Question: Have you had dinner\?/);
  assert.match(prompt, /Answer:\nI go by motorbike\./);
  assert.match(prompt, /Verdict:/);
});

test('parses part 1 semantic verdict safely', () => {
  assert.equal(parsePart1SemanticCheckVerdict('MISMATCH'), 'MISMATCH');
  assert.equal(parsePart1SemanticCheckVerdict('MISMATCH.'), 'MISMATCH');
  assert.equal(parsePart1SemanticCheckVerdict('MATCH'), 'MATCH');
  assert.equal(parsePart1SemanticCheckVerdict('something unclear'), 'MATCH');
});

test('fixes "I like read book every morning"', async () => {
  const corrected = await finalize(
    'I like read book every morning',
    'I like reading books every morning'
  );

  assert.equal(corrected, 'I like reading books every morning.');
});

test('fixes "Did my homework last night"', async () => {
  const corrected = await finalize(
    'Did my homework last night',
    'I did my homework last night'
  );

  assert.equal(corrected, 'I did my homework last night.');
});

test('fixes "Sunny and warn"', async () => {
  const corrected = await finalize(
    'Sunny and warn',
    'Sunny and warm'
  );

  assert.equal(corrected, 'Sunny and warm.');
});

test('fixes "I like listen to music in your free time"', async () => {
  const corrected = await finalize(
    'I like listen to music in your free time',
    'I like listening to music in my free time'
  );

  assert.equal(corrected, 'I like listening to music in my free time.');
});

test('fixes paragraph with read book / hone / really like it', async () => {
  const original = 'The last time I read book was last week. I read it at hone in the evening. The book was very interesting and easy to understand. I enjoyed the story and learned some new things from it. I really like it';
  const rawModelOutput = 'The last time I read a book was last week. I read it at home in the evening. The book was very interesting and easy to understand. I enjoyed the story and learned some new things from it. I really liked it.';

  const corrected = await finalize(original, rawModelOutput);

  assert.equal(
    corrected,
    'The last time I read a book was last week. I read it at home in the evening. The book was very interesting and easy to understand. I enjoyed the story and learned some new things from it. I really liked it.'
  );
});

test('fixes Yes, i like to read... beacause...', async () => {
  const original = 'Yes, i like to read. I often read books and magazines in my free time. Reading helps me relax and learn new things. Sometime i read stories and sometime i read about sport beacause it is interesting';
  const rawModelOutput = 'Yes, I like to read. I often read books and magazines in my free time. Reading helps me relax and learn new things. Sometimes I read stories and sometimes I read about sport because it is interesting.';

  const corrected = await finalize(original, rawModelOutput);

  assert.equal(
    corrected,
    'Yes, I like to read. I often read books and magazines in my free time. Reading helps me relax and learn new things. Sometimes I read stories and sometimes I read about sport because it is interesting.'
  );
});

test('adds a final period when missing', async () => {
  const corrected = await finalize(
    'There are 6 people in my family',
    'There are 6 people in my family'
  );

  assert.equal(corrected, 'There are 6 people in my family.');
});

test('does not add a period when the sentence already ends with a question mark', async () => {
  const corrected = await finalize(
    'Do you like reading?',
    'Do you like reading?'
  );

  assert.equal(corrected, 'Do you like reading?');
});

test('does not add a period when the sentence already ends with an exclamation mark', async () => {
  const corrected = await finalize(
    'Great!',
    'Great!'
  );

  assert.equal(corrected, 'Great!');
});
