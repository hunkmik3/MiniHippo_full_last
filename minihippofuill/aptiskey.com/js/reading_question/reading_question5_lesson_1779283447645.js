// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI PART 5 ///////////////
// ===============================================================================================================

const options_1 = [
    '',
    "Redefining Leisure in the Digital age",
    "Enhancing Connectivity with Mobile Apps",
    "Promoting Essential Digital Literacy",
    "Risks of Excessive Screen-Based Entertainment",
    "Concerns About Data Privacy",
    "Building Inclusive and Respectful Online Communities",
    "Prioritize human-friendly designs",
];

const paragraph_question5_1 = [
    'In today’s digital age, technology has fundamentally transformed the way people experience leisure. It has changed how individuals relax, interact with others, and consume entertainment. With innovations such as on-demand streaming services and virtual reality gaming, users can now enjoy highly customized entertainment experiences that match their personal preferences. Nevertheless, these technological advances can blur the line between work and leisure, as smartphones and online platforms constantly compete for people’s attention. Therefore, redefining leisure in the modern digital world involves finding a balance between technological convenience and maintaining offline well-being, ensuring that technology improves quality of life rather than creating excessive dependence on digital devices.',
    'Mobile applications have emerged as powerful tools that strengthen global connectivity. They have significantly changed the way people communicate, cooperate, and build relationships. Through services such as instant messaging, video calls, and AI-powered social platforms, mobile apps allow individuals to interact instantly regardless of geographic or cultural distances. In addition to supporting personal communication, app ecosystems also facilitate professional networking, online education, telemedicine, and international trade. However, the increasing dependence on these technologies can also create challenges, including digital exhaustion and fierce competition for users’ attention. To fully realize their advantages, developers should design applications that emphasize accessibility, inclusiveness, and smooth integration into everyday life.',
    'As the world becomes more digitally oriented, digital literacy has become a crucial competency for education, career development, and civic engagement. This skill goes beyond basic technical knowledge and also includes the ability to think critically, evaluate information sources, and behave responsibly in online environments. Educational institutions, businesses, and governments need to work together to create initiatives that help individuals effectively navigate digital platforms, protect their personal data, and identify misinformation. Reducing the digital divide is especially important so that disadvantaged communities can also access economic and social opportunities. Strengthening digital literacy ultimately promotes equal access and prepares people for success in an increasingly technology-driven society.',
    'Although modern technology has greatly expanded entertainment options, excessive dependence on screen-based activities can lead to serious health and social problems. Spending long periods using smartphones, playing video games, or watching online streaming content may cause eye strain, disrupted sleep patterns, decreased physical activity, and shorter attention spans. On a social level, people may feel isolated if digital entertainment replaces meaningful real-life interactions. Addressing these concerns requires a balanced strategy that encourages digital well-being, promotes outdoor activities, and supports mindful media consumption. As technology continues to evolve, society must redefine healthy forms of entertainment that provide benefits without harming physical or mental health.',
    'The rapid expansion of digital technologies has intensified discussions about protecting personal data. As AI-based services, online shopping, and social media platforms grow quickly, users frequently share sensitive information, often without fully understanding the potential consequences. Issues such as data breaches, unauthorized monitoring, and algorithm-based profiling have raised worries about surveillance, misuse of information, and reduced personal autonomy. To address these risks, governments, technology companies, and advocacy organizations need to cooperate in establishing stronger data protection regulations, improving transparency, and giving users greater control over their personal information. In a world where data is increasingly valuable for innovation, safeguarding privacy is vital to maintaining trust and ethical technological development.',
    'Online platforms have the potential to connect individuals from around the world, but they can also intensify division, misinformation, and exclusion if they are not properly managed. Creating inclusive digital communities requires thoughtful design that ensures people from various backgrounds feel respected and represented. This process involves addressing problems such as cyberbullying, hate speech, and bias in algorithms, while also ensuring fair access for underrepresented groups. Social media platforms and community-based applications should emphasize transparency, diversity, and cooperative governance, allowing users to influence the standards of online interaction. When inclusivity becomes a central design principle, digital environments can encourage meaningful connections rather than deepen social fragmentation.',
    'In a time of rapid technological progress, intuitive and user-friendly design has become a key factor in the success of digital products. An effective interface is not only visually appealing but also simplifies complex systems, improves accessibility, and ensures that technology supports users instead of overwhelming them. Many companies now follow human-centered design principles by using user feedback, behavioral data analysis, and accessibility testing to develop products that address a wide range of needs. Focusing on usability not only increases customer satisfaction but also encourages digital inclusion, ensuring that technological innovation remains practical, engaging, and accessible to people of all ages, abilities, and levels of technical expertise.',
];

const question5_keyword_1 = '';
const question5_meo_1 = "";

const options_2 = [
    '',
    "Achievements obscured by gender",
    "Recognizing the accomplishments of pioneering women",
    "Men are unfairly given credit",
    "A long career demonstrates exceptional ability",
    "The labels can change perceptions",
    "Striving to create gender balance",
    "Uniformity can be a disadvantage",
];

const paragraph_question5_2 = [
    'Achievements often go unnoticed when gender biases come into play. Many groundbreaking contributions from women in science, technology, and other fields are overshadowed by societal expectations, leading to a lack of recognition for their hard work and dedication.',
    'Recognizing the accomplishments of pioneering women is essential for breaking stereotypes and inspiring future generations. Women like Marie Curie, Ada Lovelace, and Katherine Johnson changed the world with their brilliance, yet their achievements were often marginalized due to their gender.',
    'Men are unfairly given credit for work that was often a joint effort or even led by women. History has been shaped by this bias, where the achievements of women were either ignored or misattributed, despite their immense contributions to progress.',
    'A long career is a testament to one\'s exceptional abilities. Take the story of a female engineer who spent decades improving infrastructure in underdeveloped regions. Despite her groundbreaking work, she was often overlooked simply because of her gender, but her work left an indelible mark on society.',
    'Labels can change perceptions dramatically. The label of \'genius\' or \'pioneer\' is often reserved for men, but when a woman is labeled in the same way, it challenges stereotypes and forces society to recognize her contributions. This shift in perception is key to breaking down barriers and opening doors for others.',
    'Striving to create gender balance in the workplace and society at large has become a movement. Companies and governments are starting to realize that diverse teams lead to better solutions, yet the struggle for equal representation continues. The push for gender balance is not just about fairness but also about enhancing productivity and creativity.',
    'Uniformity can be a disadvantage in many settings. When everyone is expected to conform to the same mold, innovation and individuality suffer. The story of a diverse team at a tech startup shows how embracing different perspectives led to creative breakthroughs, proving that diversity is a powerful asset.',
];

const question5_keyword_2 = '';
const question5_meo_2 = "";

const options = [
    options_1,
    options_2,
];

const paragraph_question5 = [
  paragraph_question5_1,
  paragraph_question5_2,
];

const meohoc = [
  [question5_keyword_1, question5_meo_1],
  [question5_keyword_2, question5_meo_2],
];

const topic_name = {
    topic_1: "Digital Innovation",
    topic_2: "Women Mathematicians (version 4)",
};

const dodai = options.length;
window.options = options;
window.paragraph_question5 = paragraph_question5;
window.meohoc = meohoc;
window.topic_name = topic_name;

let currentQuestion = 0;
let questions5 = [];

function shuffleArray(array) {
  const firstElement = array[0]; // Lưu phần tử đầu tiên (rỗng)
  // Tách phần tử đầu tiên và xáo trộn phần còn lại của mảng
  const remainingElements = array.slice(1);
  // Xáo trộn phần còn lại của mảng
  for (let i = remainingElements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingElements[i], remainingElements[j]] = [remainingElements[j], remainingElements[i]];
  }
  // Thêm lại phần tử đầu tiên vào đầu mảng đã xáo trộn
  remainingElements.unshift(firstElement);
  return remainingElements;
}

function renderQuestion5(options, paragraph_question5, meohoc) {
  const container = document.getElementById('question5-container');
  if (!container) { console.error("Container không tồn tại!"); return; }
  const topicEl = document.getElementById("question5_topic");
  if (topicEl) topicEl.innerText = "TOPIC: " + topic_name["topic_" + (currentQuestion + 1)];
  const indexEl = document.getElementById('question5_index');
  if (indexEl) indexEl.textContent = 'Reading question 5 (' + (currentQuestion + 1) + '/' + dodai + ')';
  // Shuffle options (shuffleArray already keeps first empty option at beginning)
  const shuffledOptions = shuffleArray([...options]);
  questions5 = [
    { id: 'question5_q1', label: '1.', paragraph: paragraph_question5[0], correctAnswer: options[1] },
    { id: 'question5_q2', label: '2.', paragraph: paragraph_question5[1], correctAnswer: options[2] },
    { id: 'question5_q3', label: '3.', paragraph: paragraph_question5[2], correctAnswer: options[3] },
    { id: 'question5_q4', label: '4.', paragraph: paragraph_question5[3], correctAnswer: options[4] },
    { id: 'question5_q5', label: '5.', paragraph: paragraph_question5[4], correctAnswer: options[5] },
    { id: 'question5_q6', label: '6.', paragraph: paragraph_question5[5], correctAnswer: options[6] },
    { id: 'question5_q7', label: '7.', paragraph: paragraph_question5[6], correctAnswer: options[7] },
  ];
  container.innerHTML = '';
  questions5.forEach((question, index) => {
    // Tạo div cho mỗi câu hỏi
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('mb-3', 'border', 'rounded-3', 'p-3', 'bg-white', 'shadow-sm');
    
    // Tạo một div cha để hiển thị label số và select trên cùng một hàng
    const questionRow = document.createElement('div');
    questionRow.style.display = 'flex';
    questionRow.style.alignItems = 'center';
    questionRow.style.gap = '12px';
    questionRow.classList.add('mb-2');
    
    // Tạo label số
    const label = document.createElement('label');
    label.classList.add('mb-0', 'fw-semibold');
    label.textContent = (index + 1) + '.';
    label.style.minWidth = '30px';
    
    // Tạo phần tử select cho câu hỏi
    const select = document.createElement('select');
    select.classList.add('form-select');
    select.id = question.id;
    shuffledOptions.forEach((optionValue, optIndex) => {
      // Skip empty, null, undefined values (except for '-- Chọn --')
      if (optionValue === null || optionValue === undefined || (typeof optionValue === 'string' && optionValue.trim() === '' && optionValue !== '-- Chọn --')) {
        return;
      }
      const option = document.createElement('option');
      option.value = optionValue === '-- Chọn --' ? '' : optionValue;
      option.textContent = optionValue === '-- Chọn --' ? '-- Chọn --' : optionValue;
      if (optionValue === '-- Chọn --') {
        option.selected = true; // Select empty option by default
      }
      select.appendChild(option);
    });
    
    questionRow.appendChild(label);
    questionRow.appendChild(select);
    
    // Tạo paragraph để hiển thị nội dung (ẩn mặc định)
    const paragraph = document.createElement('p');
    paragraph.classList.add('mt-2', 'mb-0');
    paragraph.id = 'paragraph' + question.id.slice(10);
    paragraph.style.display = 'none';
    paragraph.textContent = question.paragraph;
    
    questionDiv.appendChild(questionRow);
    questionDiv.appendChild(paragraph);
    container.appendChild(questionDiv);
  });
}
// Expose renderQuestion5 to window
window.renderQuestion5 = renderQuestion5;

// Setup button handlers
let buttonsSetup = false;
function setupPart5Buttons() {
  if (buttonsSetup) {
    console.log('Buttons already setup, skipping...');
    return;
  }
  console.log('Setting up Part 5 buttons...');
  // Show/Hide paragraphs button
  const showParagraphBtn = document.getElementById('showParagraphButton');
  if (showParagraphBtn) {
    showParagraphBtn.addEventListener('click', function() {
      const paragraphs = document.querySelectorAll('#question5-container p.mt-2');
      if (paragraphs.length === 0) {
        console.warn('No paragraphs found in question5-container');
        return;
      }
      
      // Check current state - if first paragraph is visible, hide all; otherwise show all
      const firstParagraph = paragraphs[0];
      const isCurrentlyVisible = firstParagraph && (firstParagraph.style.display !== 'none' && window.getComputedStyle(firstParagraph).display !== 'none');
      
      // Toggle visibility
      paragraphs.forEach(paragraph => {
        paragraph.style.display = isCurrentlyVisible ? 'none' : 'block';
      });
      
      // Update button text
      showParagraphBtn.textContent = isCurrentlyVisible ? 'Xem nội dung' : 'Ẩn nội dung';
      console.log('Paragraphs toggled, isVisible:', isCurrentlyVisible, 'paragraphs count:', paragraphs.length);
    });
  } else {
    console.warn('showParagraphButton not found');
  }
  
  // Show tips button
  const showAnswerBtn = document.getElementById('showAnswerButton');
  if (showAnswerBtn) {
    showAnswerBtn.addEventListener('click', function() {
      const modalBody = document.getElementById('modal-body');
      if (modalBody) {
        modalBody.innerHTML = '';
        const p1 = document.createElement('p');
        p1.innerHTML = '<strong>Học mẹo nếu bạn cần học gấp:</strong>';
        modalBody.appendChild(p1);
        const p2 = document.createElement('p');
        p2.innerHTML = meohoc[currentQuestion][0] || '';
        modalBody.appendChild(p2);
        const p3 = document.createElement('p');
        p3.innerHTML = meohoc[currentQuestion][1] || '';
        modalBody.appendChild(p3);
        const modalElement = document.getElementById('answerModal');
        if (modalElement) {
          // Remove any existing backdrop first
          const existingBackdrop = document.querySelector('.modal-backdrop');
          if (existingBackdrop) {
            existingBackdrop.remove();
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
          // Clean up backdrop when modal is hidden
          modalElement.addEventListener('hidden.bs.modal', function() {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }, { once: true });
        }
      }
    });
  }
  
  // Check result button
  const checkResultBtn = document.getElementById('checkResultButton');
  if (checkResultBtn) {
    checkResultBtn.addEventListener('click', function() {
      const answers = [];
      const correctAnswers = [];
      questions5.forEach((question, index) => {
        const selectElement = document.getElementById(question.id);
        if (selectElement) {
          const selectedAnswer = selectElement.value || "(không chọn)";
          answers.push(selectedAnswer);
          correctAnswers.push(question.correctAnswer);
        }
      });
      
      // Display results
      const comparisonBody = document.getElementById('comparisonTableBody');
      const totalScoreEl = document.getElementById('totalScore_question4');
      if (comparisonBody) {
        comparisonBody.innerHTML = '';
        let score = 0;
        questions5.forEach((question, index) => {
          const tr = document.createElement('tr');
          const questionTd = document.createElement('td');
          questionTd.textContent = (index + 1) + '. ' + question.paragraph.substring(0, 50) + '...';
          tr.appendChild(questionTd);
          const userAnswerTd = document.createElement('td');
          const userAnswer = answers[index] || "(không chọn)";
          userAnswerTd.innerHTML = '<span class="' + (userAnswer === correctAnswers[index] ? 'correct' : 'incorrect') + '">' + userAnswer + '</span>';
          tr.appendChild(userAnswerTd);
          const correctAnswerTd = document.createElement('td');
          correctAnswerTd.innerHTML = '<span class="correct">' + correctAnswers[index] + '</span>';
          tr.appendChild(correctAnswerTd);
          if (userAnswer === correctAnswers[index]) score += 2;
          comparisonBody.appendChild(tr);
        });
        if (totalScoreEl) {
          totalScoreEl.textContent = 'Total Score: ' + score + ' / ' + (questions5.length * 2);
        }
        const resultModalElement = document.getElementById('resultModal');
        if (resultModalElement) {
          // Remove any existing backdrop first
          const existingBackdrop = document.querySelector('.modal-backdrop');
          if (existingBackdrop) {
            existingBackdrop.remove();
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }
          const modal = new bootstrap.Modal(resultModalElement);
          modal.show();
          // Clean up backdrop when modal is hidden
          resultModalElement.addEventListener('hidden.bs.modal', function() {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }, { once: true });
        }
      }
    });
  }
  
  // Next button
  const nextButton = document.getElementById('nextButton');
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      if (currentQuestion < options.length - 1) {
        currentQuestion++;
        const container = document.getElementById('question5-container');
        if (container) container.innerHTML = '';
        renderQuestion5(options[currentQuestion], paragraph_question5[currentQuestion], meohoc[currentQuestion] || ['', '']);
        const backButton = document.getElementById('backButton');
        if (backButton) backButton.textContent = 'Back';
      } else if (nextButton.textContent === 'The end') {
        // Khi đã xong toàn bộ bộ đề upload (Reading Question 5) -> quay về trang chọn bài Reading
        window.location.href = 'reading_question.html';
      } else {
        nextButton.textContent = 'The end';
      }
    });
  }
  
  // Back button
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', function() {
      if (currentQuestion > 0) {
        currentQuestion--;
        const container = document.getElementById('question5-container');
        if (container) container.innerHTML = '';
        renderQuestion5(options[currentQuestion], paragraph_question5[currentQuestion], meohoc[currentQuestion] || ['', '']);
        const nextButton = document.getElementById('nextButton');
        if (nextButton) nextButton.textContent = 'Next';
      }
    });
  }
  
  buttonsSetup = true;
  console.log('Part 5 buttons setup completed');
}

// Expose setupPart5Buttons to window
window.setupPart5Buttons = setupPart5Buttons;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    if (options && options.length > 0 && paragraph_question5 && paragraph_question5.length > 0 && meohoc && meohoc.length > 0) {
      renderQuestion5(options[0], paragraph_question5[0], meohoc[0] || ['', '']);
      setupPart5Buttons();
    }
  });
} else {
  if (options && options.length > 0 && paragraph_question5 && paragraph_question5.length > 0 && meohoc && meohoc.length > 0) {
    renderQuestion5(options[0], paragraph_question5[0], meohoc[0] || ['', '']);
    setupPart5Buttons();
  }
}


/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "reading",
  "part": "5",
  "sets": [
    {
      "id": 1,
      "title": "UPDATE",
      "data": {
        "topic": "Digital Innovation",
        "options": [
          "",
          "Redefining Leisure in the Digital age",
          "Enhancing Connectivity with Mobile Apps",
          "Promoting Essential Digital Literacy",
          "Risks of Excessive Screen-Based Entertainment",
          "Concerns About Data Privacy",
          "Building Inclusive and Respectful Online Communities",
          "Prioritize human-friendly designs"
        ],
        "paragraphs": [
          "In today’s digital age, technology has fundamentally transformed the way people experience leisure. It has changed how individuals relax, interact with others, and consume entertainment. With innovations such as on-demand streaming services and virtual reality gaming, users can now enjoy highly customized entertainment experiences that match their personal preferences. Nevertheless, these technological advances can blur the line between work and leisure, as smartphones and online platforms constantly compete for people’s attention. Therefore, redefining leisure in the modern digital world involves finding a balance between technological convenience and maintaining offline well-being, ensuring that technology improves quality of life rather than creating excessive dependence on digital devices.",
          "Mobile applications have emerged as powerful tools that strengthen global connectivity. They have significantly changed the way people communicate, cooperate, and build relationships. Through services such as instant messaging, video calls, and AI-powered social platforms, mobile apps allow individuals to interact instantly regardless of geographic or cultural distances. In addition to supporting personal communication, app ecosystems also facilitate professional networking, online education, telemedicine, and international trade. However, the increasing dependence on these technologies can also create challenges, including digital exhaustion and fierce competition for users’ attention. To fully realize their advantages, developers should design applications that emphasize accessibility, inclusiveness, and smooth integration into everyday life.",
          "As the world becomes more digitally oriented, digital literacy has become a crucial competency for education, career development, and civic engagement. This skill goes beyond basic technical knowledge and also includes the ability to think critically, evaluate information sources, and behave responsibly in online environments. Educational institutions, businesses, and governments need to work together to create initiatives that help individuals effectively navigate digital platforms, protect their personal data, and identify misinformation. Reducing the digital divide is especially important so that disadvantaged communities can also access economic and social opportunities. Strengthening digital literacy ultimately promotes equal access and prepares people for success in an increasingly technology-driven society.",
          "Although modern technology has greatly expanded entertainment options, excessive dependence on screen-based activities can lead to serious health and social problems. Spending long periods using smartphones, playing video games, or watching online streaming content may cause eye strain, disrupted sleep patterns, decreased physical activity, and shorter attention spans. On a social level, people may feel isolated if digital entertainment replaces meaningful real-life interactions. Addressing these concerns requires a balanced strategy that encourages digital well-being, promotes outdoor activities, and supports mindful media consumption. As technology continues to evolve, society must redefine healthy forms of entertainment that provide benefits without harming physical or mental health.",
          "The rapid expansion of digital technologies has intensified discussions about protecting personal data. As AI-based services, online shopping, and social media platforms grow quickly, users frequently share sensitive information, often without fully understanding the potential consequences. Issues such as data breaches, unauthorized monitoring, and algorithm-based profiling have raised worries about surveillance, misuse of information, and reduced personal autonomy. To address these risks, governments, technology companies, and advocacy organizations need to cooperate in establishing stronger data protection regulations, improving transparency, and giving users greater control over their personal information. In a world where data is increasingly valuable for innovation, safeguarding privacy is vital to maintaining trust and ethical technological development.",
          "Online platforms have the potential to connect individuals from around the world, but they can also intensify division, misinformation, and exclusion if they are not properly managed. Creating inclusive digital communities requires thoughtful design that ensures people from various backgrounds feel respected and represented. This process involves addressing problems such as cyberbullying, hate speech, and bias in algorithms, while also ensuring fair access for underrepresented groups. Social media platforms and community-based applications should emphasize transparency, diversity, and cooperative governance, allowing users to influence the standards of online interaction. When inclusivity becomes a central design principle, digital environments can encourage meaningful connections rather than deepen social fragmentation.",
          "In a time of rapid technological progress, intuitive and user-friendly design has become a key factor in the success of digital products. An effective interface is not only visually appealing but also simplifies complex systems, improves accessibility, and ensures that technology supports users instead of overwhelming them. Many companies now follow human-centered design principles by using user feedback, behavioral data analysis, and accessibility testing to develop products that address a wide range of needs. Focusing on usability not only increases customer satisfaction but also encourages digital inclusion, ensuring that technological innovation remains practical, engaging, and accessible to people of all ages, abilities, and levels of technical expertise."
        ],
        "tips": {
          "keyword": "",
          "meo": ""
        }
      }
    },
    {
      "id": 2,
      "title": "UPDATE",
      "data": {
        "topic": "Women Mathematicians (version 4)",
        "options": [
          "",
          "Achievements obscured by gender",
          "Recognizing the accomplishments of pioneering women",
          "Men are unfairly given credit",
          "A long career demonstrates exceptional ability",
          "The labels can change perceptions",
          "Striving to create gender balance",
          "Uniformity can be a disadvantage"
        ],
        "paragraphs": [
          "Achievements often go unnoticed when gender biases come into play. Many groundbreaking contributions from women in science, technology, and other fields are overshadowed by societal expectations, leading to a lack of recognition for their hard work and dedication.",
          "Recognizing the accomplishments of pioneering women is essential for breaking stereotypes and inspiring future generations. Women like Marie Curie, Ada Lovelace, and Katherine Johnson changed the world with their brilliance, yet their achievements were often marginalized due to their gender.",
          "Men are unfairly given credit for work that was often a joint effort or even led by women. History has been shaped by this bias, where the achievements of women were either ignored or misattributed, despite their immense contributions to progress.",
          "A long career is a testament to one's exceptional abilities. Take the story of a female engineer who spent decades improving infrastructure in underdeveloped regions. Despite her groundbreaking work, she was often overlooked simply because of her gender, but her work left an indelible mark on society.",
          "Labels can change perceptions dramatically. The label of 'genius' or 'pioneer' is often reserved for men, but when a woman is labeled in the same way, it challenges stereotypes and forces society to recognize her contributions. This shift in perception is key to breaking down barriers and opening doors for others.",
          "Striving to create gender balance in the workplace and society at large has become a movement. Companies and governments are starting to realize that diverse teams lead to better solutions, yet the struggle for equal representation continues. The push for gender balance is not just about fairness but also about enhancing productivity and creativity.",
          "Uniformity can be a disadvantage in many settings. When everyone is expected to conform to the same mold, innovation and individuality suffer. The story of a diverse team at a tech startup shows how embracing different perspectives led to creative breakthroughs, proving that diversity is a powerful asset."
        ],
        "tips": {
          "keyword": "",
          "meo": ""
        }
      }
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
