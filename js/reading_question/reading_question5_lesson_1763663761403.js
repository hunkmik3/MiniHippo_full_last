// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 5 ///////////////
// ===============================================================================================================

const options_1 = [
    '',
    "sadasdasd",
    "sadasdasd",
    "sadasdasd",
    "sadasdasd",
    "sadasdasd",
    "sadasdasd",
    "sadasdasd",
];

const paragraph_question5_1 = [
    'sadasdasdsadasdasdsadasdasd',
    'sadasdasdsadasdasdsadasdasdsadasdasd',
    'sadasdasdsadasdasdsadasdasd5',
    'sadasdasdsadasdasdsadasdasdsadasdasd4',
    'sadasdasdsadasdasdsadasdasdsadasdasd3',
    'sadasdasdsadasdasdsadasdasdsadasdasd2',
    'sadasdasdsadasdasdsadasdasdsadasdasd1',
];

const question5_keyword_1 = 'sadasdasdsadasdasdsadasdasdsadasdasd';
const question5_meo_1 = "sadasdasdsadasdasdsadasdasdsadasdasd";

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
    topic_1: "sadasdasd",
};

const dodai = options.length;

/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "reading",
  "part": "5",
  "sets": [
    {
      "id": 1,
      "title": "sadasdasd",
      "data": {
        "topic": "sadasdasd",
        "options": [
          "",
          "sadasdasd",
          "sadasdasd",
          "sadasdasd",
          "sadasdasd",
          "sadasdasd",
          "sadasdasd",
          "sadasdasd"
        ],
        "paragraphs": [
          "sadasdasdsadasdasdsadasdasd",
          "sadasdasdsadasdasdsadasdasdsadasdasd",
          "sadasdasdsadasdasdsadasdasd5",
          "sadasdasdsadasdasdsadasdasdsadasdasd4",
          "sadasdasdsadasdasdsadasdasdsadasdasd3",
          "sadasdasdsadasdasdsadasdasdsadasdasd2",
          "sadasdasdsadasdasdsadasdasdsadasdasd1"
        ],
        "tips": {
          "keyword": "sadasdasdsadasdasdsadasdasdsadasdasd",
          "meo": "sadasdasdsadasdasdsadasdasdsadasdasd"
        }
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
