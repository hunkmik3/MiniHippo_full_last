/**
 * VSTEP Lớp Học — blueprint cấu trúc cố định của 18 buổi B1 + 24 buổi B2.
 *
 * Mỗi buổi mô tả CHÍNH XÁC những bài nào HV sẽ làm. Khi admin click 1 ô
 * "Buổi N" trong grid của lớp, form content editor sẽ:
 *   1. Set title gợi ý theo blueprint (vd "Buổi 1 - Practice Reading 1+2")
 *   2. Chỉ giữ các kỹ năng có trong blueprint, ẩn kỹ năng không dùng
 *   3. Pre-fill số part + số câu mỗi part đúng theo blueprint
 *
 * Source: Google Doc spec của user (FBACK WEB).
 *
 * Schema 1 blueprint:
 *   {
 *     title: string  — tiêu đề gợi ý cho buổi
 *     summary: string — mô tả ngắn hiện trong card
 *     reading?:   { parts: [{title, questionCount}] }
 *     listening?: { parts: [{title, questionCount}] }
 *     writing?:   { parts: [{title, instructions?}] }
 *     speaking?:  { parts: [{title, prompt?, prepSeconds?, answerSeconds?}] }
 *   }
 */
(function () {
    'use strict';

    // Helper tạo Reading part nhanh (mỗi part = 1 "Practice Reading X")
    const R = (title, count) => ({ title, questionCount: count });
    const L = (title, count) => ({ title, questionCount: count });
    const W = (title, instructions) => ({ title, instructions: instructions || 'You should spend about 20 minutes on this task.' });
    const S = (title, prepSeconds = 60, answerSeconds = 180) => ({ title, prepSeconds, answerSeconds });

    const B1 = {
        1: {
            title: 'Buổi 1 - Practice Reading 1 + 2',
            summary: 'Reading 1 (10 câu) + Reading 2 (12 câu)',
            reading: { parts: [R('Practice Reading 1', 10), R('Practice Reading 2', 12)] }
        },
        2: {
            title: 'Buổi 2 - Practice Reading 3',
            summary: 'Reading 3 (7 câu)',
            reading: { parts: [R('Practice Reading 3', 7)] }
        },
        3: {
            title: 'Buổi 3 - Reading 4 + Listening 1-3',
            summary: 'Reading 4 (10 câu) + Listening 1-3 (16 câu)',
            reading: { parts: [R('Practice Reading 4', 10)] },
            listening: { parts: [L('Practice Listening 1-3', 16)] }
        },
        4: {
            title: 'Buổi 4 - Reading 5 + Listening 4-5',
            summary: 'Reading 5 (10 câu) + Listening 4-5 (12 câu)',
            reading: { parts: [R('Practice Reading 5', 10)] },
            listening: { parts: [L('Practice Listening 4-5', 12)] }
        },
        5: {
            title: 'Buổi 5 - Reading 6 + Speaking 1',
            summary: 'Reading 6 + Speaking Part 1 (newspapers, hometown)',
            reading: { parts: [R('Practice Reading 6', 10)] },
            speaking: { parts: [S('Practice Speaking 1 - Newspapers & Hometown', 0, 180)] }
        },
        6: {
            title: 'Buổi 6 - Listening 6 + Speaking 2',
            summary: 'Listening 6 + Speaking Part 1 (transportation, countryside, hometown)',
            listening: { parts: [L('Practice Listening 6', 10)] },
            speaking: { parts: [S('Practice Speaking 2 - Transport/Countryside/Hometown', 0, 90)] }
        },
        7: {
            title: 'Buổi 7 - Reading 7 + Speaking 3',
            summary: 'Reading 7 + Speaking Part 1 (weather, teamwork, social network)',
            reading: { parts: [R('Practice Reading 7', 10)] },
            speaking: { parts: [S('Practice Speaking 3 - Weather/Teamwork/Social Network', 0, 90)] }
        },
        8: {
            title: 'Buổi 8 - Listening 7 + Speaking 4',
            summary: 'Listening 7 + Speaking Part 2 (charity money)',
            listening: { parts: [L('Practice Listening 7', 10)] },
            speaking: { parts: [S('Practice Speaking 4 - Charity Money (Part 2)', 60, 180)] }
        },
        9: {
            title: 'Buổi 9 - Reading 8 + Speaking 5',
            summary: 'Reading 8 + Speaking Part 1 + Part 2 (in a hurry, animals, skills)',
            reading: { parts: [R('Practice Reading 8', 10)] },
            speaking: { parts: [
                S('Speaking Part 1 - In a Hurry / Animals', 0, 90),
                S('Speaking Part 2 - Learning Skills', 60, 180)
            ]}
        },
        10: {
            title: 'Buổi 10 - Listening 8 + Speaking 6',
            summary: 'Listening 8 + Speaking Part 3 (Time)',
            listening: { parts: [L('Practice Listening 8', 10)] },
            speaking: { parts: [S('Practice Speaking 6 - Topic: Time (Part 3)', 60, 240)] }
        },
        11: {
            title: 'Buổi 11 - Speaking 7 + Writing 1',
            summary: 'Speaking full 3 parts + Writing Task 1 (email Lee)',
            speaking: { parts: [
                S('Speaking Part 1 - Communication & Photos', 0, 180),
                S('Speaking Part 2 - Guitar Course', 60, 180),
                S('Speaking Part 3 - Topic Development', 60, 240)
            ]},
            writing: { parts: [W('Writing Task 1 - Reply Lee\'s Email')] }
        },
        12: {
            title: 'Buổi 12 - Reading 9 + Listening 9 + Writing 2',
            summary: 'Reading 9 + Listening 9 + Writing Task 1 (hometown / bookstore)',
            reading: { parts: [R('Practice Reading 9', 10)] },
            listening: { parts: [L('Practice Listening 9', 10)] },
            writing: { parts: [
                W('Writing Task 1 (1) - Hometown for Jack'),
                W('Writing Task 1 (2) - Bookstore Feedback')
            ]}
        },
        13: {
            title: 'Buổi 13 - Speaking 8 + Writing 3',
            summary: 'Speaking full 3 parts + Writing Task 1 (sports with Tom)',
            speaking: { parts: [
                S('Speaking Part 1 - Health & Travelling', 0, 180),
                S('Speaking Part 2 - Plan a Short Trip', 60, 180),
                S('Speaking Part 3 - Free Discussion', 60, 240)
            ]},
            writing: { parts: [W('Writing Task 1 - Sports Reply to Tom')] }
        },
        14: {
            title: 'Buổi 14 - Listening 10 + Writing 4',
            summary: 'Listening 10 + Writing Task 1 (event speaker email)',
            listening: { parts: [L('Practice Listening 10', 10)] },
            writing: { parts: [W('Writing Task 1 - Event Speaker Email')] }
        },
        15: {
            title: 'Buổi 15 - Reading FULL + Listening FULL + Writing 5',
            summary: 'Reading Full Test + Listening Full Test + Writing Task 1+2',
            reading: { parts: [R('Reading Full Test - Part 1', 10), R('Reading Full Test - Part 2', 10), R('Reading Full Test - Part 3', 10), R('Reading Full Test - Part 4', 10)] },
            listening: { parts: [L('Listening Full Test - Part 1', 8), L('Listening Full Test - Part 2', 12), L('Listening Full Test - Part 3', 15)] },
            writing: { parts: [
                W('Writing Task 1 - Favourite Restaurant'),
                W('Writing Task 2 - Video Games for Children', 'You should spend about 40 minutes on this task.')
            ]}
        },
        16: {
            title: 'Buổi 16 - Speaking 9 + Writing 6',
            summary: 'Speaking full 3 parts + Writing Task 2 (overweight people)',
            speaking: { parts: [
                S('Speaking Part 1 - Shopping Online & Interview', 0, 180),
                S('Speaking Part 2 - Gift for Friend\'s Mother', 60, 180),
                S('Speaking Part 3 - Free Discussion', 60, 240)
            ]},
            writing: { parts: [W('Writing Task 2 - Overweight & Physical Education', 'You should spend about 40 minutes on this task.')] }
        },
        17: {
            title: 'Buổi 17 - Writing 7',
            summary: 'Writing Task 1 (TV in your country) + Task 2 (delayed childbirth)',
            writing: { parts: [
                W('Writing Task 1 - TV Programs Reply to Paul'),
                W('Writing Task 2 - Delayed Childbirth', 'You should spend about 40 minutes on this task.')
            ]}
        },
        18: {
            title: 'Buổi 18 - FINAL TEST',
            summary: 'Full Test 4 kỹ năng',
            reading: { parts: [R('Reading Part 1', 10), R('Reading Part 2', 10), R('Reading Part 3', 10), R('Reading Part 4', 10)] },
            listening: { parts: [L('Listening Part 1', 8), L('Listening Part 2', 12), L('Listening Part 3', 15)] },
            writing: { parts: [W('Writing Task 1'), W('Writing Task 2', 'You should spend about 40 minutes on this task.')] },
            speaking: { parts: [
                S('Speaking Part 1', 0, 180),
                S('Speaking Part 2', 60, 180),
                S('Speaking Part 3', 60, 240)
            ]}
        }
    };

    const B2 = {
        1: {
            title: 'B2 Buổi 1 - Listening 1-3 + 4-5',
            summary: 'Listening 1-3 + Listening 4-5',
            listening: { parts: [L('Practice Listening 1-3', 16), L('Practice Listening 4-5', 12)] }
        },
        2: {
            title: 'B2 Buổi 2 - Listening 6 + 7',
            summary: 'Listening 6 + Listening 7',
            listening: { parts: [L('Practice Listening 6', 10), L('Practice Listening 7', 10)] }
        },
        3: {
            title: 'B2 Buổi 3 - Reading 1 + 2',
            summary: 'Reading 1 + Reading 2',
            reading: { parts: [R('Practice Reading 1', 10), R('Practice Reading 2', 12)] }
        },
        4: {
            title: 'B2 Buổi 4 - Reading 3 + 4',
            summary: 'Reading 3 + Reading 4',
            reading: { parts: [R('Practice Reading 3', 7), R('Practice Reading 4', 10)] }
        },
        5: {
            title: 'B2 Buổi 5 - Listening 8 + Reading 5 + 6',
            summary: 'Listening 8 + Reading 5 + Reading 6',
            listening: { parts: [L('Practice Listening 8', 10)] },
            reading: { parts: [R('Practice Reading 5', 10), R('Practice Reading 6', 10)] }
        },
        6: {
            title: 'B2 Buổi 6 - Speaking 1',
            summary: 'Speaking Part 1 (Learning English, School & Study)',
            speaking: { parts: [S('Practice Speaking 1 - Learning English & School/Study', 0, 90)] }
        },
        7: {
            title: 'B2 Buổi 7 - Reading 7 + Speaking 2',
            summary: 'Reading 7 + Speaking Part 1 (Reading, Sleeping, Snacks)',
            reading: { parts: [R('Practice Reading 7', 10)] },
            speaking: { parts: [S('Practice Speaking 2 - Reading/Sleeping/Snacks', 0, 90)] }
        },
        8: {
            title: 'B2 Buổi 8 - Listening 9 + Speaking 3',
            summary: 'Listening 9 + Speaking Part 1 (Health, Sport, Communication)',
            listening: { parts: [L('Practice Listening 9', 10)] },
            speaking: { parts: [S('Practice Speaking 3 - Health/Sport/Communication', 0, 90)] }
        },
        9: {
            title: 'B2 Buổi 9 - Reading 8 + Speaking 4',
            summary: 'Reading 8 + Speaking Part 1+2 (Social Network, Work, Travel)',
            reading: { parts: [R('Practice Reading 8', 10)] },
            speaking: { parts: [
                S('Speaking Part 1 - Social Network & Work', 0, 90),
                S('Speaking Part 2 - Travel Destination', 60, 180)
            ]}
        },
        10: {
            title: 'B2 Buổi 10 - Listening 10 + Speaking 5',
            summary: 'Listening 10 + Speaking Part 1+2 (Daily Routine, Hobby, Holiday)',
            listening: { parts: [L('Practice Listening 10', 10)] },
            speaking: { parts: [
                S('Speaking Part 1 - Daily Routine & Hobby', 0, 90),
                S('Speaking Part 2 - Holiday Priorities', 60, 180)
            ]}
        },
        11: {
            title: 'B2 Buổi 11 - Reading 9 + Speaking 6',
            summary: 'Reading 9 + Speaking Part 1+2 (Teamwork, Free Time, Tourism)',
            reading: { parts: [R('Practice Reading 9', 10)] },
            speaking: { parts: [
                S('Speaking Part 1 - Teamwork & Free Time', 0, 90),
                S('Speaking Part 2 - Promote Tourist Attraction', 60, 180)
            ]}
        },
        12: {
            title: 'B2 Buổi 12 - Speaking 7',
            summary: 'Speaking full 3 parts (Family, TV Program, Gift)',
            speaking: { parts: [
                S('Speaking Part 1 - Family & TV Program', 0, 90),
                S('Speaking Part 2 - Gift for Hospital Friend', 60, 180),
                S('Speaking Part 3 - Free Discussion', 60, 240)
            ]}
        },
        13: {
            title: 'B2 Buổi 13 - Listening 11 + Speaking 8',
            summary: 'Listening 11 + Speaking full 3 parts (Food, Cook)',
            listening: { parts: [L('Practice Listening 11', 10)] },
            speaking: { parts: [
                S('Speaking Part 1 - Food & Cook', 0, 90),
                S('Speaking Part 2 - Student Restrictions', 60, 180),
                S('Speaking Part 3 - Free Discussion', 60, 240)
            ]}
        },
        14: {
            title: 'B2 Buổi 14 - Reading Full Test 1 + Speaking 9',
            summary: 'Reading Full Test 1 + Speaking full 3 parts (Houses, Shopping)',
            reading: { parts: [R('Reading Full Test 1 - Part 1', 10), R('Reading Full Test 1 - Part 2', 10), R('Reading Full Test 1 - Part 3', 10), R('Reading Full Test 1 - Part 4', 10)] },
            speaking: { parts: [
                S('Speaking Part 1 - Houses & Shopping', 0, 90),
                S('Speaking Part 2 - Hobby Recommendation', 60, 180),
                S('Speaking Part 3 - Free Discussion', 60, 240)
            ]}
        },
        15: {
            title: 'B2 Buổi 15 - Listening Full Test 1 + Writing 1',
            summary: 'Listening Full Test 1 + Writing Task 1 (Visit Vietnam)',
            listening: { parts: [L('Listening Full Test 1 - Part 1', 8), L('Listening Full Test 1 - Part 2', 12), L('Listening Full Test 1 - Part 3', 15)] },
            writing: { parts: [W('Writing Task 1 - Visit Vietnam Email')] }
        },
        16: {
            title: 'B2 Buổi 16 - Reading Full Test 2 + Writing 2',
            summary: 'Reading Full Test 2 + Writing Task 1 (Conference)',
            reading: { parts: [R('Reading Full Test 2 - Part 1', 10), R('Reading Full Test 2 - Part 2', 10), R('Reading Full Test 2 - Part 3', 10), R('Reading Full Test 2 - Part 4', 10)] },
            writing: { parts: [W('Writing Task 1 - Conference Reply')] }
        },
        17: {
            title: 'B2 Buổi 17 - Listening Full Test 2 + Writing 3',
            summary: 'Listening Full Test 2 + Writing Task 1 (English Course / Concert)',
            listening: { parts: [L('Listening Full Test 2 - Part 1', 8), L('Listening Full Test 2 - Part 2', 12), L('Listening Full Test 2 - Part 3', 15)] },
            writing: { parts: [
                W('Writing Task 1 (1) - Summer English Course for Parent'),
                W('Writing Task 1 (2) - Music Concert with Josh')
            ]}
        },
        18: {
            title: 'B2 Buổi 18 - Speaking 10 + Writing 4',
            summary: 'Speaking full 3 parts + Writing Task 1 (Da Nang / Cooking)',
            speaking: { parts: [
                S('Speaking Part 1 - In a Hurry & Animals', 0, 180),
                S('Speaking Part 2 - Restaurant Choice', 60, 180),
                S('Speaking Part 3 - Free Discussion', 60, 240)
            ]},
            writing: { parts: [
                W('Writing Task 1 (1) - Da Nang City Tour'),
                W('Writing Task 1 (2) - International Cooking Class')
            ]}
        },
        19: {
            title: 'B2 Buổi 19 - Writing 5 + Reading Full Test 3',
            summary: 'Reading Full Test 3 + Writing Task 1+2 (Friend John / Religious Tourism)',
            reading: { parts: [R('Reading Full Test 3 - Part 1', 10), R('Reading Full Test 3 - Part 2', 10), R('Reading Full Test 3 - Part 3', 10), R('Reading Full Test 3 - Part 4', 10)] },
            writing: { parts: [
                W('Writing Task 1 - Friend John Accommodation Advice'),
                W('Writing Task 2 - Religious Tourism', 'You should spend about 40 minutes on this task.')
            ]}
        },
        20: {
            title: 'B2 Buổi 20 - Speaking 11 + Writing 6',
            summary: 'Speaking full 3 parts + Writing Task 1+2 (Birthday / Good Health)',
            speaking: { parts: [
                S('Speaking Part 1 - Being Alone & Photos', 0, 180),
                S('Speaking Part 2 - Relax Choice', 60, 180),
                S('Speaking Part 3 - Free Discussion', 60, 240)
            ]},
            writing: { parts: [
                W('Writing Task 1 - Birthday Party Email'),
                W('Writing Task 2 - Maintaining Good Health', 'You should spend about 40 minutes on this task.')
            ]}
        },
        21: {
            title: 'B2 Buổi 21 - Speaking 12 + Writing 7',
            summary: 'Speaking full 3 parts + Writing Task 1+2 (Bookstore / Workplace Stress)',
            speaking: { parts: [
                S('Speaking Part 1 - Friends & Clothes', 0, 180),
                S('Speaking Part 2 - Guitar Course', 60, 180),
                S('Speaking Part 3 - Free Discussion', 60, 240)
            ]},
            writing: { parts: [
                W('Writing Task 1 - Bookstore Manager Reply'),
                W('Writing Task 2 - Workplace Stress', 'You should spend about 40 minutes on this task.')
            ]}
        },
        22: {
            title: 'B2 Buổi 22 - Writing 8',
            summary: 'Writing Task 1 + Task 2 (Anna Student Life / Online Learning)',
            writing: { parts: [
                W('Writing Task 1 - Anna Student Life in Vietnam'),
                W('Writing Task 2 - Online vs Traditional Learning', 'You should spend about 40 minutes on this task.')
            ]}
        },
        23: {
            title: 'B2 Buổi 23 - Final Test 1',
            summary: 'Full Test 4 kỹ năng',
            reading: { parts: [R('Reading Part 1', 10), R('Reading Part 2', 10), R('Reading Part 3', 10), R('Reading Part 4', 10)] },
            listening: { parts: [L('Listening Part 1', 8), L('Listening Part 2', 12), L('Listening Part 3', 15)] },
            writing: { parts: [W('Writing Task 1'), W('Writing Task 2', 'You should spend about 40 minutes on this task.')] },
            speaking: { parts: [S('Speaking Part 1', 0, 180), S('Speaking Part 2', 60, 180), S('Speaking Part 3', 60, 240)] }
        },
        24: {
            title: 'B2 Buổi 24 - Final Test 2',
            summary: 'Full Test 4 kỹ năng (đề khác)',
            reading: { parts: [R('Reading Part 1', 10), R('Reading Part 2', 10), R('Reading Part 3', 10), R('Reading Part 4', 10)] },
            listening: { parts: [L('Listening Part 1', 8), L('Listening Part 2', 12), L('Listening Part 3', 15)] },
            writing: { parts: [W('Writing Task 1'), W('Writing Task 2', 'You should spend about 40 minutes on this task.')] },
            speaking: { parts: [S('Speaking Part 1', 0, 180), S('Speaking Part 2', 60, 180), S('Speaking Part 3', 60, 240)] }
        }
    };

    function getBlueprint(band, sessionNumber) {
        const map = String(band || '').toUpperCase() === 'B2' ? B2 : B1;
        return map[Number(sessionNumber)] || null;
    }

    function hasSkill(blueprint, skill) {
        return Boolean(blueprint?.[skill]?.parts?.length);
    }

    window.VSTEP_SESSION_BLUEPRINTS = {
        B1, B2, getBlueprint, hasSkill,
        bandSessionCount: (band) => (String(band || '').toUpperCase() === 'B2' ? 24 : 18)
    };
})();
