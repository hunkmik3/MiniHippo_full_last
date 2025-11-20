// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 5 ///////////////
// ===============================================================================================================

const options_1 = [
    '',
    "sdfsdfsds",
    "sdfsdfsds",
    "sdfsdfsds",
    "sdfsdfsdssdfsdfsds",
    "sdfsdfsds",
    "sdfsdfsdssdfsdfsds",
    "sdfsdfsds",
];

const paragraph_question5_1 = [
    'sdfsdfsdssdfsdfsdssdfsdfsds',
    'sdfsdfsdssdfsdfsdssdfsdfsds',
    'sdfsdfsdssdfsdfsdssdfsdfsdssdfsdfsds',
    'sdfsdfsdssdfsdfsds',
    'sdfsdfsdssdfsdfsdssdfsdfsdssdfsdfsds',
    'sdfsdfsdssdfsdfsdssdfsdfsdssdfsdfsds',
    'sdfsdfsdssdfsdfsdssdfsdfsdssdfsdfsds',
];

const question5_keyword_1 = 'sdfsdfsdssdfsdfsdssdfsdfsdssdfsdfsds';
const question5_meo_1 = "";

const options = [
    options_1,
];

const paragraph_question5 = Array.from(
  { length: options.length },
  (_, i) => eval(`paragraph_question5_${i + 1}`)
);

const meohoc = Array.from({ length: options.length }, (_, i) => [
  eval(`question5_keyword_${i + 1}`),
  eval(`question5_meo_${i + 1}`)
]);

const topic_name = {
    topic_1: "sdfsdfsds",
};

const dodai = options.length;
window.options = options;
window.paragraph_question5 = paragraph_question5;
window.topic_name = topic_name;


/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "reading",
  "part": "5",
  "sets": [
    {
      "id": 1,
      "title": "sdfsdfsds",
      "data": {
        "topic": "sdfsdfsds",
        "options": [
          "",
          "sdfsdfsds",
          "sdfsdfsds",
          "sdfsdfsds",
          "sdfsdfsdssdfsdfsds",
          "sdfsdfsds",
          "sdfsdfsdssdfsdfsds",
          "sdfsdfsds"
        ],
        "paragraphs": [
          "sdfsdfsdssdfsdfsdssdfsdfsds",
          "sdfsdfsdssdfsdfsdssdfsdfsds",
          "sdfsdfsdssdfsdfsdssdfsdfsdssdfsdfsds",
          "sdfsdfsdssdfsdfsds",
          "sdfsdfsdssdfsdfsdssdfsdfsdssdfsdfsds",
          "sdfsdfsdssdfsdfsdssdfsdfsdssdfsdfsds",
          "sdfsdfsdssdfsdfsdssdfsdfsdssdfsdfsds"
        ],
        "tips": {
          "keyword": "sdfsdfsdssdfsdfsdssdfsdfsdssdfsdfsds",
          "meo": ""
        }
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
