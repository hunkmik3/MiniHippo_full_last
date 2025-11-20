// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 2 & 3 ///////////////
// ===============================================================================================================

// http://localhost:3000/ - Topic: http://localhost:3000/
const question2Content_1 = [
    'http://localhost:3000/',
    'http://localhost:3000/http://localhost:3000/',
    'http://localhost:3000/',
    'http://localhost:3000/',
    'http://localhost:3000/',
    'http://localhost:3000/',
];

const questionSets = [
    question2Content_1,
];

const questheader1 = {
    question2Content_1: "http://localhost:3000/",
};

function getQuestHeaders(obj) {
    return Object.values(obj);
}

const questheader = getQuestHeaders(questheader1);

/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "reading",
  "part": "2",
  "sets": [
    {
      "id": 1,
      "title": "http://localhost:3000/",
      "data": {
        "topic": "http://localhost:3000/",
        "sentences": [
          "http://localhost:3000/",
          "http://localhost:3000/http://localhost:3000/",
          "http://localhost:3000/",
          "http://localhost:3000/",
          "http://localhost:3000/",
          "http://localhost:3000/"
        ]
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
