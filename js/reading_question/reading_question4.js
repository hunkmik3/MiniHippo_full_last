// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 4 ///////////////
// ===============================================================================================================

const question4Text_1 = [
    "qưewqe",
    "qưeqwe",
    "ưqeqweqweqwe",
    "ưqeqweqweqwe",
    "ưqeqweqweqwe",
];

const question4Content_1 = [
    { question: "ưqeqweqweqwe", id: "question4_q1", options: ["", "A", "B", "C", "D"], answer: "C" },
    { question: "ưqeqweqweqwe", id: "question4_q2", options: ["", "A", "B", "C", "D"], answer: "C" },
    { question: "ưqeqweqweqwe", id: "question4_q3", options: ["", "A", "B", "C", "D"], answer: "B" },
    { question: "ưqeqweqweqwe", id: "question4_q4", options: ["", "A", "B", "C", "D"], answer: "A" },
    { question: "ưqeqweqweqwe", id: "question4_q5", options: ["", "A", "B", "C", "D"], answer: "A" },
    { question: "ưqeqweqweqwe", id: "question4_q6", options: ["", "A", "B", "C", "D"], answer: "A" },
    { question: "ưqeqweqweqwe", id: "question4_q7", options: ["", "A", "B", "C", "D"], answer: "A" },
];

const correctAnswersQuestion4_1 = ['C', 'C', 'B', 'A', 'A', 'A', 'A'];

const question4Text = [
  question4Text_1,
];

const question4Content = [
  question4Content_1,
];

const correctAnswersQuestion4 = [
  correctAnswersQuestion4_1,
];

const question4Topic1 = {
  topic1: "qưeqwe",
};

function getQuestHeaders(obj) {
    return Object.values(obj);
}

const question4Topic = getQuestHeaders(question4Topic1);
