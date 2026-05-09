import fs from 'node:fs/promises';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
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
    // Environment can still be provided by the shell or Vercel.
  }
}

function q(id, prompt, options, answer) {
  return {
    id,
    prompt,
    options: options.map((text, index) => ({
      label: String.fromCharCode(65 + index),
      text
    })),
    answer
  };
}

async function ensureAudio(relativePath, text) {
  const target = path.join(rootDir, relativePath);
  if (existsSync(target)) return;

  mkdirSync(path.dirname(target), { recursive: true });
  const temp = target.replace(/\.[^.]+$/i, '.aiff');

  const sayResult = spawnSync('say', ['-o', temp, text], {
    cwd: rootDir,
    encoding: 'utf8'
  });
  if (sayResult.status !== 0) {
    throw new Error(`Unable to generate speech audio for ${relativePath}: ${sayResult.stderr || sayResult.error?.message || 'say failed'}`);
  }

  const convertArgs = /\.m4a$/i.test(target)
    ? ['-f', 'm4af', '-d', 'aac', temp, target]
    : ['-y', '-i', temp, '-codec:a', 'libmp3lame', '-q:a', '4', target];
  const convertCommand = /\.m4a$/i.test(target) ? 'afconvert' : 'ffmpeg';
  const convertResult = spawnSync(convertCommand, convertArgs, {
    cwd: rootDir,
    encoding: 'utf8'
  });
  rmSync(temp, { force: true });

  if (convertResult.status !== 0) {
    throw new Error(`Unable to convert speech audio for ${relativePath}: ${convertResult.stderr || convertResult.error?.message || `${convertCommand} failed`}`);
  }
}

const listeningPart1Transcript = `
Question 1. A woman calls a hotel reception desk. She says she will arrive at half past seven, and she asks whether the restaurant will still be open. The receptionist says dinner is served until nine.
Question 2. A man leaves a voice message for his colleague. He says the project meeting has moved from room 204 to the conference room on the ground floor.
Question 3. A student asks about the library printer. The assistant says the color printer is out of order, but black and white printing is available near the entrance.
Question 4. Two friends discuss weekend plans. The woman cannot go hiking because she has to visit her grandparents on Saturday morning.
Question 5. A passenger speaks to a ticket officer. The officer says the next train to Da Nang leaves at ten fifteen from platform three.
Question 6. A man asks a shop assistant about a jacket. The assistant says the blue jacket is available in medium, but the black one is only available in small.
Question 7. A teacher reminds students that the vocabulary quiz is on Wednesday, not Monday, because the class trip is on Monday.
Question 8. A customer calls a repair service. The technician will come between two and four in the afternoon and will check the washing machine first.
`;

const listeningPart2Transcript = `
You will hear a talk for new students at a language center. The speaker explains that the center opens at eight in the morning and closes at eight in the evening. Students can collect their ID cards from the main office after the first class. The self-study room is on the second floor and must be booked online at least one day before use. Speaking clubs take place every Thursday afternoon, and the first meeting this term will focus on giving opinions politely. If students miss a lesson, they should email the teacher before midnight on the same day. The center cafe offers a student discount, but only when students show their ID card. For final assessment, students will complete a listening test, a reading test, a writing task, and a short speaking interview. Practice materials are uploaded every Friday. Students who need technical support should visit room 108. The speaker also says that phones must be silent during class, but tablets may be used for dictionaries. At the end, students are invited to join a campus tour that starts at the front gate at half past three.
`;

const listeningPart3Transcript = `
You will hear an interview with an urban planner about small community gardens. The planner says that many cities are turning empty lots into gardens because these spaces can reduce heat, support local food projects, and give neighbors a reason to meet. She explains that the first challenge is not money but long-term responsibility, because a garden quickly fails when no group agrees to water plants and manage tools. In one district, local schools joined the project and students measured soil quality as part of science lessons. The planner says the most successful gardens are not the largest ones. They are the ones with clear rules, flexible schedules, and a small budget for repairs. She warns that gardens should not replace public parks, because people still need open spaces for sport and relaxation. Looking ahead, she believes technology can help by monitoring water use, but it cannot replace face-to-face cooperation. She ends by saying that a garden should be judged not only by the vegetables it produces, but also by the habits of cooperation it creates.
`;

const speakingIntro1 = 'Speaking part one. You will answer questions about familiar topics. Listen to the questions and give clear personal answers.';
const speakingIntro2 = 'Speaking part two. You will choose the best solution for a situation. Explain your choice and compare it with the other options.';
const speakingIntro3 = 'Speaking part three. You will develop a topic, support your ideas, and answer follow-up questions.';

const listeningAudio1 = 'Listening part one. This sample audio represents eight short conversations and announcements. Choose the best answer for each question.';
const listeningAudio2 = 'Listening part two. This sample audio represents a talk for new students at a language center. Choose the best answer for each question.';
const listeningAudio3 = 'Listening part three. This sample audio represents an interview about community gardens. Choose the best answer for each question.';

await Promise.all([
  ensureAudio('audio/vstep/complete_mock/listening_part_1.m4a', listeningAudio1),
  ensureAudio('audio/vstep/complete_mock/listening_part_2.m4a', listeningAudio2),
  ensureAudio('audio/vstep/complete_mock/listening_part_3.m4a', listeningAudio3),
  ensureAudio('audio/vstep/complete_mock/speaking_part_1.m4a', speakingIntro1),
  ensureAudio('audio/vstep/complete_mock/speaking_part_2.m4a', speakingIntro2),
  ensureAudio('audio/vstep/complete_mock/speaking_part_3.m4a', speakingIntro3)
]);

const payload = {
  title: 'VSTEP Complete Mock Test #003 - Drive Format',
  type: 'reading',
  description: 'Complete VSTEP mock set with Listening 3 parts, Reading 4 parts, Writing 2 parts, and Speaking 3 parts.',
  duration_minutes: 177,
  data: {
    __practice_type: 'vstep',
    __storage_type: 'reading',
    schemaVersion: 1,
    sample: true,
    status: 'published',
    durations: {
      listening: 45,
      reading: 60,
      writing: 60,
      speaking: 12
    },
    listening: {
      parts: [
        {
          title: 'Part 1: Short conversations and announcements',
          directions: 'Listen to eight short recordings and choose the correct answer.',
          audioUrl: 'audio/vstep/complete_mock/listening_part_1.m4a',
          transcript: listeningPart1Transcript.trim(),
          questions: [
            q('vstep-l-p1-q1', 'Until what time is dinner served at the hotel?', ['7:30', '8:00', '9:00', '10:15'], 'C'),
            q('vstep-l-p1-q2', 'Where will the project meeting take place?', ['Room 204', 'The main office', 'The ground-floor conference room', 'The library'], 'C'),
            q('vstep-l-p1-q3', 'What can students use near the library entrance?', ['A color printer', 'A scanner only', 'A black and white printer', 'A photocopy card machine'], 'C'),
            q('vstep-l-p1-q4', 'Why cannot the woman go hiking?', ['She is ill', 'She has to visit her grandparents', 'She has an exam', 'She is working all weekend'], 'B'),
            q('vstep-l-p1-q5', 'Which platform does the next train leave from?', ['Platform one', 'Platform two', 'Platform three', 'Platform four'], 'C'),
            q('vstep-l-p1-q6', 'Which jacket is available in medium?', ['The black jacket', 'The blue jacket', 'The green jacket', 'The brown jacket'], 'B'),
            q('vstep-l-p1-q7', 'When is the vocabulary quiz?', ['Monday', 'Tuesday', 'Wednesday', 'Friday'], 'C'),
            q('vstep-l-p1-q8', 'What will the technician check first?', ['The fridge', 'The washing machine', 'The oven', 'The air conditioner'], 'B')
          ]
        },
        {
          title: 'Part 2: Talk for new students',
          directions: 'Listen to a talk and answer twelve questions.',
          audioUrl: 'audio/vstep/complete_mock/listening_part_2.m4a',
          transcript: listeningPart2Transcript.trim(),
          questions: [
            q('vstep-l-p2-q1', 'What time does the center close?', ['6:00 p.m.', '7:00 p.m.', '8:00 p.m.', '9:00 p.m.'], 'C'),
            q('vstep-l-p2-q2', 'Where can students collect their ID cards?', ['The cafe', 'The main office', 'Room 108', 'The front gate'], 'B'),
            q('vstep-l-p2-q3', 'Where is the self-study room?', ['On the first floor', 'On the second floor', 'Next to the cafe', 'Behind the library'], 'B'),
            q('vstep-l-p2-q4', 'How should students book the self-study room?', ['By phone', 'By email to the teacher', 'Online', 'At the front gate'], 'C'),
            q('vstep-l-p2-q5', 'When do speaking clubs take place?', ['Monday morning', 'Tuesday evening', 'Thursday afternoon', 'Friday afternoon'], 'C'),
            q('vstep-l-p2-q6', 'What will the first speaking club focus on?', ['Job interviews', 'Pronunciation drills', 'Giving opinions politely', 'Campus history'], 'C'),
            q('vstep-l-p2-q7', 'What should students do if they miss a lesson?', ['Call the cafe', 'Email the teacher before midnight', 'Visit the front gate', 'Book the self-study room'], 'B'),
            q('vstep-l-p2-q8', 'How can students get a cafe discount?', ['Show an ID card', 'Bring a friend', 'Pay in cash', 'Order before noon'], 'A'),
            q('vstep-l-p2-q9', 'Which skill is included in the final assessment?', ['Grammar translation', 'A speaking interview', 'A group presentation only', 'A pronunciation lecture'], 'B'),
            q('vstep-l-p2-q10', 'When are practice materials uploaded?', ['Every Monday', 'Every Wednesday', 'Every Friday', 'Every Sunday'], 'C'),
            q('vstep-l-p2-q11', 'Where should students go for technical support?', ['Room 108', 'The second-floor study room', 'The cafe', 'The sports hall'], 'A'),
            q('vstep-l-p2-q12', 'Where does the campus tour start?', ['The main office', 'The front gate', 'Room 204', 'The library entrance'], 'B')
          ]
        },
        {
          title: 'Part 3: Interview about community gardens',
          directions: 'Listen to an interview and answer fifteen questions.',
          audioUrl: 'audio/vstep/complete_mock/listening_part_3.m4a',
          transcript: listeningPart3Transcript.trim(),
          questions: [
            q('vstep-l-p3-q1', 'What are many cities turning empty lots into?', ['Parking spaces', 'Community gardens', 'Shopping areas', 'Bus stations'], 'B'),
            q('vstep-l-p3-q2', 'Which benefit of gardens is mentioned first?', ['They reduce heat', 'They increase rent', 'They replace schools', 'They remove traffic'], 'A'),
            q('vstep-l-p3-q3', 'According to the planner, what is the first challenge?', ['Finding seeds', 'Getting long-term responsibility', 'Building a fence', 'Choosing a name'], 'B'),
            q('vstep-l-p3-q4', 'What happens when no group manages tools and watering?', ['The garden quickly fails', 'The garden becomes a park', 'The city closes nearby roads', 'Technology solves the problem'], 'A'),
            q('vstep-l-p3-q5', 'Who joined one district project?', ['Local schools', 'Hotel managers', 'Train officers', 'Tourists'], 'A'),
            q('vstep-l-p3-q6', 'What did students measure?', ['Airline prices', 'Soil quality', 'Noise levels', 'Bus schedules'], 'B'),
            q('vstep-l-p3-q7', 'Which gardens are most successful?', ['The largest gardens', 'The gardens with clear rules', 'The gardens without budgets', 'The gardens near airports'], 'B'),
            q('vstep-l-p3-q8', 'What do successful gardens need for repairs?', ['A small budget', 'A private shop', 'A sports team', 'A train ticket'], 'A'),
            q('vstep-l-p3-q9', 'What should gardens not replace?', ['Science lessons', 'Public parks', 'Tool rooms', 'Technology'], 'B'),
            q('vstep-l-p3-q10', 'Why are public parks still needed?', ['For sport and relaxation', 'For online booking', 'For project meetings', 'For hotel meals'], 'A'),
            q('vstep-l-p3-q11', 'What can technology help monitor?', ['Water use', 'Exam scores', 'Ticket prices', 'Cafe discounts'], 'A'),
            q('vstep-l-p3-q12', 'What can technology not replace?', ['Face-to-face cooperation', 'Soil tests', 'Weather forecasts', 'School lessons'], 'A'),
            q('vstep-l-p3-q13', 'How should a garden be judged?', ['Only by its size', 'Only by the vegetables it produces', 'By vegetables and cooperation habits', 'By its distance from a park'], 'C'),
            q('vstep-l-p3-q14', 'What is the speaker mainly discussing?', ['The value and management of community gardens', 'The history of public transport', 'The cost of language courses', 'The design of hotel restaurants'], 'A'),
            q('vstep-l-p3-q15', 'What is the speaker attitude toward community gardens?', ['Supportive but practical', 'Completely negative', 'Uninterested', 'Confused about the topic'], 'A')
          ]
        }
      ]
    },
    reading: {
      parts: [
        {
          title: 'Part 1: Digital noticeboards at work',
          passage: `Many offices now use digital noticeboards instead of printed announcements. At first, the change looked simple: a screen near the lift could replace a wall covered with paper. However, managers soon discovered that the new system required clear rules. If every department posted long messages, employees stopped reading them. If the notices changed too quickly, staff missed important information.

One company solved the problem by dividing notices into three groups. Urgent notices, such as fire drills or system outages, stayed at the top of the screen and used a red label. Daily notices, such as room changes or visitor information, appeared in the middle and were removed after twenty-four hours. General notices, such as charity events or staff clubs, appeared at the bottom and could stay for one week.

The company also trained employees to write shorter messages. Each notice had to answer three questions: what is happening, when it is happening, and what action is required. The communications team found that the number of questions sent to reception fell after the new rules were introduced. Employees said the board was easier to scan and more reliable than the old paper system.

Still, digital boards are not perfect. Some staff members who work remotely do not see the screen at all. For this reason, the company sends a daily email summary that repeats urgent and daily notices. Managers say the best system is not digital only. It combines screens, email, and team briefings so that important information reaches people in different ways.`,
          questions: [
            q('vstep-r-p1-q1', 'What problem appeared after digital noticeboards were introduced?', ['Screens were too expensive', 'Messages became too long or changed too quickly', 'Employees refused to use lifts', 'Reception stopped answering questions'], 'B'),
            q('vstep-r-p1-q2', 'Where were urgent notices placed?', ['At the bottom', 'In an email only', 'At the top of the screen', 'In the staff club area'], 'C'),
            q('vstep-r-p1-q3', 'How long did daily notices stay on the board?', ['One hour', 'Twenty-four hours', 'One week', 'One month'], 'B'),
            q('vstep-r-p1-q4', 'What did each notice have to explain?', ['Cost, color, and author', 'What, when, and required action', 'Department, salary, and location', 'History, opinion, and risk'], 'B'),
            q('vstep-r-p1-q5', 'What happened after the new rules were introduced?', ['Questions sent to reception decreased', 'All paper returned', 'The screen was removed', 'Staff stopped reading emails'], 'A'),
            q('vstep-r-p1-q6', 'Why are daily email summaries still needed?', ['The board has no colors', 'Remote staff may not see the screen', 'Managers dislike digital systems', 'Reception needs more work'], 'B'),
            q('vstep-r-p1-q7', 'What does the writer suggest about communication systems?', ['One channel is always enough', 'Printed notices are always best', 'Different channels should be combined', 'Team briefings should be banned'], 'C'),
            q('vstep-r-p1-q8', 'The word "scan" in paragraph 3 is closest in meaning to', ['read quickly for key points', 'copy carefully', 'repair', 'delete'], 'A'),
            q('vstep-r-p1-q9', 'Which notice would probably use a red label?', ['A staff running club', 'A charity lunch next week', 'A system outage', 'A new coffee machine'], 'C'),
            q('vstep-r-p1-q10', 'What is the main purpose of the passage?', ['To compare office buildings', 'To describe how a company managed digital notices', 'To advertise screens', 'To explain fire drill law'], 'B')
          ]
        },
        {
          title: 'Part 2: The rise of repair cafes',
          passage: `Repair cafes are community events where volunteers help people fix broken household items. Visitors bring lamps, clothes, small furniture, or kitchen devices and sit with a volunteer who tries to repair the object. The goal is not simply to save money. Organizers want people to see that many products can be repaired instead of thrown away.

The idea has become popular because it responds to two common problems. First, many consumers do not know how everyday objects work. When a toaster stops working, they often buy a new one because repair seems complicated. Second, modern products are sometimes difficult to open or contain parts that are hard to replace. Repair cafes cannot solve every technical problem, but they can teach basic skills and encourage people to ask better questions before buying.

A typical repair cafe also creates social value. Older volunteers often share skills that they learned before replacement culture became common. Younger visitors gain confidence and sometimes return as helpers. In one town, the repair cafe began as a monthly event in a library. After a year, it expanded to a school workshop because demand was high.

Critics argue that repair cafes have limited impact because they operate only a few hours each month. Organizers agree that the events are not a complete solution. However, they say the cafes change attitudes. When people watch a volunteer replace a simple wire or stitch a torn bag, they begin to see repair as normal rather than unusual. This shift in thinking may be as important as the number of objects saved.`,
          questions: [
            q('vstep-r-p2-q1', 'What do volunteers at repair cafes do?', ['Sell new household items', 'Help people fix broken objects', 'Collect old products for factories', 'Teach only professional engineers'], 'B'),
            q('vstep-r-p2-q2', 'What is one goal of repair cafes?', ['To show that products can often be repaired', 'To make visitors buy more devices', 'To close local libraries', 'To replace schools'], 'A'),
            q('vstep-r-p2-q3', 'Why do many consumers buy a new toaster?', ['They understand all repairs', 'Repair seems complicated', 'Volunteers refuse to help', 'Libraries do not allow devices'], 'B'),
            q('vstep-r-p2-q4', 'What problem do some modern products have?', ['They are easy to open', 'Their parts are always free', 'They are hard to open or repair', 'They never break'], 'C'),
            q('vstep-r-p2-q5', 'What can repair cafes teach?', ['Basic skills', 'Only advanced programming', 'Travel planning', 'Hotel management'], 'A'),
            q('vstep-r-p2-q6', 'Who often shares older practical skills?', ['Older volunteers', 'Ticket officers', 'Cafe critics', 'Remote workers'], 'A'),
            q('vstep-r-p2-q7', 'Where did one town first hold its repair cafe?', ['In a library', 'At a train station', 'In a hotel lobby', 'At a shopping mall'], 'A'),
            q('vstep-r-p2-q8', 'Why did the event move to a school workshop?', ['The library closed permanently', 'Demand was high', 'Visitors disliked books', 'The volunteers stopped coming'], 'B'),
            q('vstep-r-p2-q9', 'What criticism is mentioned?', ['Repair cafes cost too much to enter', 'They operate only a few hours each month', 'They never repair clothes', 'They use too many computers'], 'B'),
            q('vstep-r-p2-q10', 'According to organizers, what may be as important as saving objects?', ['Changing attitudes toward repair', 'Selling tickets', 'Reducing library hours', 'Making products harder to open'], 'A')
          ]
        },
        {
          title: 'Part 3: Flexible working and team learning',
          passage: `Flexible working has changed the way teams learn from one another. In the past, new employees often learned by listening to conversations in the office, watching how experienced colleagues solved problems, and asking quick questions at a nearby desk. When teams work partly from home, these small learning moments can disappear unless managers design new routines.

Some companies tried to solve the problem by adding more online meetings. This approach helped with formal updates, but it also created fatigue. Employees said they needed time to focus, not another call with no clear purpose. A better solution was to separate communication into different types. Urgent decisions were discussed in short video calls. Complex ideas were written in shared documents so people could read them carefully. Informal learning was supported through optional mentoring sessions.

One software team introduced a weekly "problem review." Team members brought one difficult case from the week and explained how they handled it. The aim was not to blame anyone for mistakes. Instead, the group looked for patterns and reusable strategies. Junior staff said these sessions helped them understand expert thinking, while senior staff noticed repeated problems that needed better documentation.

Flexible working can therefore support learning if teams become more deliberate. Casual office learning may decline, but written knowledge, mentoring, and review sessions can make learning more inclusive. People who are quiet in open offices may contribute more effectively in documents. The challenge is to choose routines that match the work, rather than copying old office habits into online spaces.`,
          questions: [
            q('vstep-r-p3-q1', 'How did new employees often learn in the past?', ['By watching and asking quick office questions', 'Only through exams', 'By avoiding experienced colleagues', 'Only from customer emails'], 'A'),
            q('vstep-r-p3-q2', 'What can disappear when teams work partly from home?', ['Small learning moments', 'All written documents', 'Every formal update', 'Company salaries'], 'A'),
            q('vstep-r-p3-q3', 'What was the problem with adding more online meetings?', ['It caused fatigue', 'It removed all communication', 'It stopped urgent decisions', 'It made documents illegal'], 'A'),
            q('vstep-r-p3-q4', 'How were urgent decisions discussed?', ['In long written reports only', 'In short video calls', 'At repair cafes', 'Through daily noticeboards'], 'B'),
            q('vstep-r-p3-q5', 'Where were complex ideas shared?', ['In shared documents', 'Only in the cafe', 'On train tickets', 'In private notebooks only'], 'A'),
            q('vstep-r-p3-q6', 'What did the software team introduce?', ['A weekly problem review', 'A daily exam', 'A public noticeboard', 'A hotel reception desk'], 'A'),
            q('vstep-r-p3-q7', 'What was the aim of the problem review?', ['To blame mistakes', 'To find patterns and reusable strategies', 'To cancel mentoring', 'To reduce documents'], 'B'),
            q('vstep-r-p3-q8', 'What did junior staff gain from the sessions?', ['Understanding of expert thinking', 'Free equipment', 'A shorter commute only', 'A cafe discount'], 'A'),
            q('vstep-r-p3-q9', 'What did senior staff notice?', ['Repeated problems needing documentation', 'A lack of office chairs', 'Too many library books', 'A need to remove documents'], 'A'),
            q('vstep-r-p3-q10', 'What is the passage mainly about?', ['How flexible work can be managed to support learning', 'Why all workers should return to offices', 'How to repair software devices', 'Why online meetings should replace all documents'], 'A')
          ]
        },
        {
          title: 'Part 4: Public libraries as learning hubs',
          passage: `Public libraries are often described as quiet places for books, but many libraries now operate as wider learning hubs. They provide internet access, language clubs, career workshops, and spaces for community meetings. This broader role has become more important as daily services move online. People who do not have reliable internet at home may need library computers to apply for jobs, renew documents, or join online classes.

The change has required librarians to develop new skills. They still help readers find books, but they also guide users through websites, explain basic digital safety, and organize events with local partners. Some librarians say their job is now closer to community education than traditional book management. This does not mean books are less valuable. In fact, reading groups and children's storytelling sessions remain among the most popular activities.

Funding is a continuing challenge. When local budgets are tight, libraries must prove that they serve many groups, not only regular readers. Data on visitor numbers is useful, but it does not capture all benefits. A person who learns to write a CV at a library workshop may later find employment. A retired resident who joins a conversation club may become less isolated. These outcomes are difficult to count, yet they matter to the health of a community.

The future of libraries will probably depend on balance. If they focus only on digital services, they may lose the calm reading environment that people still need. If they focus only on books, they may fail to support people facing modern digital demands. Successful libraries are likely to protect reading while also offering practical help for life, work, and learning.`,
          questions: [
            q('vstep-r-p4-q1', 'What are many libraries becoming?', ['Learning hubs', 'Hotels', 'Train stations', 'Repair factories'], 'A'),
            q('vstep-r-p4-q2', 'Why are library computers important for some people?', ['They do not have reliable internet at home', 'They dislike books', 'They work at hotels', 'They cannot use paper'], 'A'),
            q('vstep-r-p4-q3', 'Which activity is mentioned as a library service?', ['Career workshops', 'Ticket selling', 'Jacket repair only', 'Fire drills'], 'A'),
            q('vstep-r-p4-q4', 'What new skill do librarians need?', ['Guiding users through websites', 'Driving trains', 'Cooking meals', 'Repairing washing machines'], 'A'),
            q('vstep-r-p4-q5', 'What do some librarians compare their job to?', ['Community education', 'Hotel management', 'Sports coaching only', 'Factory production'], 'A'),
            q('vstep-r-p4-q6', 'Which traditional activity remains popular?', ['Children storytelling sessions', 'Online shopping', 'Train booking', 'Room cleaning'], 'A'),
            q('vstep-r-p4-q7', 'What is a continuing challenge for libraries?', ['Funding', 'Too many gardens', 'A lack of books worldwide', 'No visitors ever'], 'A'),
            q('vstep-r-p4-q8', 'Why is visitor data limited?', ['It cannot capture all benefits', 'It is always false', 'It counts only computers', 'It ignores the building size'], 'A'),
            q('vstep-r-p4-q9', 'What may happen after someone learns to write a CV?', ['They may find employment', 'They must stop reading', 'They become a librarian immediately', 'They lose internet access'], 'A'),
            q('vstep-r-p4-q10', 'What balance should future libraries protect?', ['Reading and practical support', 'Noise and confusion', 'Only digital services', 'Only old habits'], 'A')
          ]
        }
      ]
    },
    writing: {
      parts: [
        {
          title: 'Part 1: Email',
          prompt: `You recently attended a short course at a community learning center. Write an email to the course coordinator.

In your email, you should:
- thank the coordinator for the course;
- describe one thing you found useful;
- suggest one improvement for future students.

Write at least 120 words.`,
          minWords: 120,
          maxWords: 220
        },
        {
          title: 'Part 2: Essay',
          prompt: `Some people believe that schools should teach more practical life skills, such as financial planning, communication, and digital safety. Others think schools should focus mainly on academic subjects.

To what extent do you agree or disagree?

Give reasons for your answer and include relevant examples from your own knowledge or experience. Write at least 250 words.`,
          minWords: 250,
          maxWords: 350
        }
      ]
    },
    speaking: {
      readySeconds: 60,
      readyMessage: 'Put on your headset and prepare for the speaking test. The system will record your answers automatically.',
      parts: [
        {
          title: 'Part 1: Social Interaction',
          introAudioUrl: 'audio/vstep/complete_mock/speaking_part_1.m4a',
          prompt: `Answer the questions.

1. What kind of place do you like to study or work in?
2. How often do you use public libraries or learning spaces?
3. What skill would you like to improve this year?
4. Do you prefer learning alone or with other people? Why?`,
          prepSeconds: 20,
          answerSeconds: 180
        },
        {
          title: 'Part 2: Solution Discussion',
          introAudioUrl: 'audio/vstep/complete_mock/speaking_part_2.m4a',
          prompt: `A language center wants to help students practise English outside class. There are three possible options:

Option 1: create a weekly speaking club.
Option 2: open an online self-study room.
Option 3: organize monthly community projects in English.

Choose the best option. Explain your choice and compare it with the other two options.`,
          prepSeconds: 60,
          answerSeconds: 240
        },
        {
          title: 'Part 3: Topic Development',
          introAudioUrl: 'audio/vstep/complete_mock/speaking_part_3.m4a',
          prompt: `Develop the topic: Technology can make learning more flexible.

You may use the following ideas:
- access to online materials;
- communication with teachers and classmates;
- self-paced learning;
- possible problems such as distraction.

Follow-up questions:
1. Should online learning replace face-to-face classes?
2. How can schools help students use technology responsibly?
3. What makes a good online learning environment?`,
          prepSeconds: 60,
          answerSeconds: 300
        }
      ]
    }
  }
};

await loadLocalEnv();
const { insertInto, selectFrom, updateTable } = await import('../server/api/_utils/supabase.js');

const existing = await selectFrom('practice_sets', {
  filters: [{ column: 'title', value: payload.title }],
  single: true
});

const saved = existing?.id
  ? await updateTable('practice_sets', [{ column: 'id', value: existing.id }], payload)
  : await insertInto('practice_sets', payload);

const record = Array.isArray(saved) ? saved[0] : saved;
const counts = {
  listeningParts: payload.data.listening.parts.length,
  listeningQuestions: payload.data.listening.parts.reduce((sum, part) => sum + part.questions.length, 0),
  readingParts: payload.data.reading.parts.length,
  readingQuestions: payload.data.reading.parts.reduce((sum, part) => sum + part.questions.length, 0),
  writingParts: payload.data.writing.parts.length,
  speakingParts: payload.data.speaking.parts.length
};

console.log(JSON.stringify({
  action: existing?.id ? 'updated' : 'created',
  id: record?.id,
  title: payload.title,
  counts,
  examUrl: `/vstep_exam.html?set=${record?.id}`
}, null, 2));
