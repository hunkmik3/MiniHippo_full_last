document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================




// 5. Câu 5
const options_1 = [
    '',
    "Changing the definition of mountain",
    "The unique feeling of achievement",
    "Publicity of achievement",
    "The mistake of misplaced priorities",
    "Worrying connections",
    "Intimate relationships",
    "Focus on stability",
];


const paragraph_question5_1 = [
    'The term "mountain" has evolved over time, reflecting not only physical characteristics but also cultural significance. In contemporary discussions, mountains may symbolize challenges to overcome or destinations for adventure, transcending their geographical attributes.',
    "Climbing a mountain often leads to a profound sense of accomplishment. It represents not just reaching a physical summit but also conquering personal fears and pushing one's limits, creating memories that last a lifetime.",
    "In today's digital age, sharing achievements has become prevalent. Climbing a mountain is frequently documented on social media, turning personal milestones into public spectacles that inspire others while also raising questions about authenticity.",
    "The pursuit of climbing mountains can sometimes lead to misplaced priorities. While seeking adventure and recognition, individuals may neglect personal relationships or responsibilities, emphasizing the need for a balanced approach to life.",
    "Engaging in extreme sports, such as mountain climbing, can forge strong bonds among participants. However, it may also create worrying connections where individuals prioritize adrenaline over safety, potentially leading to dangerous situations.",
    "Shared experiences in challenging environments, like mountains, can deepen intimacy in relationships. Couples or friends who navigate the challenges of climbing together often find their bonds strengthened through mutual support and understanding.",
    "While adventure is thrilling, there is a growing recognition of the importance of stability in life. Balancing the desire for adventure with the need for security is crucial, prompting individuals to reflect on their life choices and long-term goals.",
];


const question5_keyword_1 ='<strong>Mẹo nhớ Keyword:</strong> mountain → achievement → Publicity → mistake → Worrying → relationships → stability.';
const question5_meo_1 = "<strong>Nhớ theo đoạn văn:</strong> Ngọn núi (<strong>mountain</strong>) là biểu tượng của thành tựu (<strong>achievement</strong>), nhưng việc phô trương thành tích leo núi để có danh tiếng (<strong>publicity</strong>) là một sai lầm (<strong>mistake</strong>). Điều này dẫn đến lo ngại (<strong>worrying</strong>) và hiềm khích đến mối quan hệ (<strong>relationships</strong>) giữa những người leo núi. Tốt nhất là giữ tâm lý ổn định (<strong>stability</strong>) và không khoe khoang.";





// 5. Câu 5
const options_2 = [
    '',
    "A way of life now out date",
    "Benefits for employees",
    "Undesirable finalcial consequences",
    "Unforeseen challenges for employees",
    "Difficult to change old habits",
    "Unfair for some people",
    "Alternative solutions worth considering",
];


const paragraph_question5_2 = [
    "For many years, a workweek of five or even six days was the standard. However, advancements in technology, evolving social values, and an increasing emphasis on work-life balance are making this traditional schedule less relevant. Both employees and employers are starting to question whether spending the majority of one’s week at work is truly necessary or productive.",
    
    "Proponents of a four-day workweek highlight various benefits for workers. With an extra day off, employees gain more time to recharge, connect with family, or explore personal interests. Research shows that shorter workweeks can enhance focus and efficiency, leading to improved job performance and higher levels of job satisfaction.",

    "While appealing, a reduced workweek could have financial downsides. Companies might incur higher expenses from the need to hire additional staff or adjust compensation models. For sectors that rely on hourly employees, it may be difficult to maintain profitability, potentially leading to service reductions or job cuts.",

    "Adapting to a new work schedule can be difficult for some employees. The pressure to complete tasks within a shorter timeframe can lead to stress, and fast-paced industries may face challenges such as missed deadlines or conflicting schedules, complicating the transition to a shorter workweek.",

    "For individuals accustomed to traditional work hours, the shift to a four-day workweek can be challenging. Breaking long-established routines is tough, and some may resist change even when it offers potential benefits. Adapting to a new work pattern often requires time and support.",

    "While a four-day workweek may sound ideal to many, it isn’t necessarily fair to all. Essential workers, healthcare providers, and employees in the hospitality industry may not have the option to reduce their hours. This could create disparities among different worker groups and lead to tension within the workforce.",

    "Rather than universally implementing a four-day workweek, experts suggest considering more flexible arrangements. Options such as allowing employees to choose their days off or offering shorter daily hours can provide similar advantages without disrupting industries that depend on a traditional work schedule."
];

const question5_keyword_2 ='<strong>Mẹo nhớ Keyword:</strong> out date → Benefits → Undesirable → challenges → Difficult → Unfair → solutions.';
const question5_meo_2 = "<strong>Nhớ theo đoạn văn:</strong> Phương pháp làm việc cũ đã <strong>lỗi thời (out date)</strong>, nhưng <strong>lợi ích (Benefits)</strong> cho nhân viên vẫn quan trọng. Tuy nhiên, có thể có <strong>hệ quả không mong muốn (Undesirable)</strong> và <strong>thách thức (challenges)</strong> khi thay đổi. Điều này khiến nhân viên cảm thấy <strong>khó khăn (Difficult)</strong> và <strong>không công bằng (Unfair)</strong>. Các <strong>giải pháp thay thế (solutions)</strong> có thể giúp cải thiện.";



// 5. Câu 5 - Đề mới tháng 9 -- cập nhật 12/9
const options_3 = [
    '',
    "Redefining business models with technology",
    "Enhancing productivity through automation",
    "Promoting digital skills training",
    "Over-reliance on automated systems",
    "Concerns about cybersecurity risks",
    "Building inclusive digital ecosystems",
    "Focusing on ethical technology development",
];


const paragraph_question5_3 = [
    "The interaction between people and technology is continuously evolving. Modern gadgets and software are designed to be more user-friendly, enabling communication through voice commands, gestures, or even facial recognition. This transformation makes technology more intuitive and accessible, enhancing both personal and professional experiences.",
    "Smart automation tools are revolutionizing workplaces by handling repetitive and time-consuming tasks. These technologies, often powered by AI, enable employees to concentrate on more valuable work, boosting efficiency and fostering innovation across various sectors.",
    "Educational institutions are increasingly incorporating technology into their curricula to prepare students for future careers. Programs focused on coding, robotics, and digital literacy provide learners with vital skills for the digital age, promoting creativity and enhancing problem-solving abilities.",
    "Although digital devices offer numerous advantages, over-reliance on screens can lead to negative consequences. Individuals may experience reduced social interactions, trouble concentrating, and higher stress levels. It’s crucial to balance digital engagement with offline activities for maintaining mental and physical well-being.",
    "Not everyone has equal access to technology, which can result in significant social and economic divides. Those without reliable internet or modern devices may miss out on educational and employment opportunities, making it essential to address these inequalities through policies and community-driven efforts.",
    "Tech communities unite individuals passionate about technology to exchange ideas, support projects, and collaborate. These groups encourage innovation and creativity, offering mentorship and resources to help transform new ideas into reality.",
    "As technology continues to evolve, there is a growing focus on sustainability. Companies are developing eco-friendly products and adopting green practices to reduce environmental impact, ensuring that digital advancements contribute to long-term ecological health."
];

const question5_keyword_3 = '<strong>Mẹo nhớ Keyword:</strong> Redefining → productivity → digital skills → Over-reliance → risks → Building → development.';
const question5_meo_3 = "<strong>Nhớ theo đoạn văn:</strong> Việc <strong>định nghĩa lại (Redefining)</strong> mô hình kinh doanh bằng công nghệ giúp <strong>tăng năng suất (productivity)</strong>, đồng thời thúc đẩy <strong>kỹ năng số (digital skills)</strong>. Tuy nhiên, <strong>quá phụ thuộc (Over-reliance)</strong> vào hệ thống tự động có thể gây ra <strong>rủi ro (risks)</strong>. Việc <strong>xây dựng (Building)</strong> các hệ sinh thái số bao gồm tất cả là bước quan trọng trong quá trình <strong>phát triển (development)</strong> công nghệ có đạo đức.";

// 5. Câu 5 - Đề mới tháng 9 -- cập nhật 12/9
const options_4 = [
    '',
    "Redefining holistic health approaches",
    "Promoting mental health awareness",
    "Encouraging community fitness programs",
    "Overemphasis on trendy diets",
    "Concerns about wellness misinformation",
    "Building supportive health communities",
    "Focusing on sustainable lifestyle changes",
];

const paragraph_question5_4 = [
    "In recent years, the definition of health has broadened to encompass more than just physical well-being. Holistic approaches emphasize the interconnection of the body, mind, and environment, encouraging individuals to consider emotional balance, mental clarity, nutrition, and lifestyle habits collectively. This more comprehensive view helps people achieve deeper and more sustainable wellness by addressing various aspects of life rather than isolated symptoms.",
    "Mental health has become a growing priority in public health discussions. Awareness campaigns aim to reduce the stigma surrounding mental health disorders and encourage open conversations about personal struggles. Educating people on recognizing early signs of anxiety, depression, and stress empowers them to seek help sooner. Many organizations also provide support networks and resources to build a more compassionate and understanding society.",
    "Community-based fitness initiatives are becoming more popular as a way to make exercise enjoyable and accessible. By participating in group activities such as yoga, walking clubs, or sports leagues, individuals not only improve their physical health but also form meaningful social connections. These programs foster a sense of belonging and help individuals stay committed to their fitness goals over time, contributing to healthier and happier communities.",
    "Although trendy diets often promise quick weight loss or improved health, relying too heavily on these fads can be problematic. Many popular diets lack scientific support and may eliminate essential nutrients, leading to unbalanced nutrition. Nutrition experts emphasize that sustainable eating should focus on balanced meals, moderation, and individual needs rather than quick fixes. Building a healthy relationship with food is more beneficial than chasing the latest diet trend.",
    "The rise of social media and online platforms has led to widespread sharing of health information, but not all of it is accurate or safe. Misinformation about supplements, treatments, and health practices can cause confusion or even harm. It’s crucial for individuals to critically assess sources, consult healthcare professionals, and rely on evidence-based guidance when making decisions about their wellness routines.",
    "Supportive wellness-focused communities play an essential role in helping people maintain healthy lifestyles. Whether online or through local meetups, these groups offer encouragement, share tips, and provide accountability. Members can exchange experiences, celebrate successes, and find motivation during challenges, creating an environment where individuals feel empowered to achieve their health goals.",
    "Achieving long-term health requires more than temporary diets or exercise bursts. Sustainable wellness involves making gradual changes that can be maintained over time, such as improving sleep habits, managing stress, and incorporating regular physical activity. By setting realistic goals and making incremental adjustments, individuals are more likely to experience lasting benefits and enhance their overall quality of life."
];


const question5_keyword_4 = '<strong>Mẹo nhớ Keyword:</strong> Redefining → Promoting mental → fitness → Overemphasis → misinformation → health communities → lifestyle changes.';
const question5_meo_4 = "<strong>Nhớ theo đoạn văn:</strong> Định nghĩa lại (<strong>Redefining</strong>) chăm sóc sức khỏe, quảng bá sức khỏe tâm thần (<strong>Promoting mental</strong>), thể dục cộng đồng (<strong>fitness</strong>), quá nhấn mạnh (<strong>Overemphasis</strong>) vào chế độ ăn kiêng, thông tin sai lệch (<strong>misinformation</strong>), xây dựng cộng đồng chăm sóc sức khỏe (<strong>health communities</strong>) và thay đổi lối sống bền vững (<strong>lifestyle changes</strong>).";

// 5. Câu 5 - Đề mới tháng 9 -- cập nhật 18/9
const options_5 = [
    '',
    "Breaking New Ground in Ancient Mathematics",
    "Trailblazing Computer Science",
    "Driving Space Exploration Forward",
    "Transforming Geometry and Motion",
    "Connecting Symmetry to Physics",
    "Encouraging Diversity in STEM",
    "Breaking Through Educational Barriers",
];


const paragraph_question5_5 = [
    "Long before modern scientific institutions emerged, certain individuals in ancient history established the foundations of mathematics as we know it. One such pioneer was Hypatia of Alexandria, a famous philosopher and mathematician in the 4th century.",
    "The early 20th century saw remarkable advancements in computing, largely propelled by the innovative work of figures like Alan Turing. Turing’s concept of a universal machine, capable of performing any computable task, laid the foundation for modern computers.",
    "Humanity’s quest to explore the cosmos has been defined by groundbreaking milestones. From the launch of Sputnik 1 to the Apollo moon landings, each mission has broadened our understanding of space and our place in the universe.",
    "The study of geometry and motion was irrevocably altered by the works of Isaac Newton and later Albert Einstein. Newton’s laws provided the mathematical foundation for understanding motion on Earth and in space, while Einstein’s theory of general relativity revolutionized our understanding of gravity.",
    "One of the most profound ideas in modern physics is the link between symmetry and the laws of nature. Emmy Noether, a brilliant German mathematician, proved a theorem that demonstrated how physical laws are intrinsically linked to symmetrical properties.",
    "Despite advancements in science and technology, many groups remain underrepresented in STEM fields. In recent decades, educators and organizations have worked to foster more inclusive environments, offering scholarships, mentorship, and outreach programs.",
    "In many parts of the world, individuals have had to fight for the right to education, particularly in scientific disciplines. A well-known example is the story of 19th-century women who were denied entry to universities."
];

const question5_keyword_5 = 'Mathematics → Computer → Space → Motion → Connecting → Diversity → Educational';
const question5_meo_5 = "<strong>Nhớ theo đoạn văn:</strong> Toán học (<strong>Mathematics</strong>) là nền tảng cho khoa học máy tính (<strong>Computer</strong>) và khám phá không gian (<strong>Space</strong>), giúp chúng ta hiểu về chuyển động (<strong>Motion</strong>) và kết nối (<strong>Connecting</strong>) các kiến thức đa dạng (<strong>Diversity</strong>), từ đó phát triển giáo dục (<strong>Educational</strong>) cho tương lai.";

// 5. Câu 5 - Đề mới tháng 9 -- cập nhật 22/9
const options_6 = [
    '',
    "Redefining Human-Technology Interaction",
    "Boosting Productivity Through Intelligent Automation",
    "Promoting Technology-Based Education Programs",
    "Overreliance on Digital Interfaces",
    "Concerns About Disparities in Access to Technology",
    "Building Innovative Tech Communities",
    "Focusing on Sustainable Digital Solutions"
];



const paragraph_question5_6 = [
    "The way people use technology is changing quickly. Today, new devices and apps are easier to use. People can talk to machines, use hand gestures, or even use their face to control them. This helps make technology feel more natural and simple. It also improves how we use technology in our daily life and at work.",
    "Smart machines and software are now doing boring and repeated tasks in many workplaces. These tools, often powered by artificial intelligence (AI), save time and help workers focus on more important and creative jobs. As a result, companies work better and grow faster in many fields.",
    "More and more schools are using technology in their lessons. They teach students skills like computer coding, robotics, and how to use digital tools. These programs help students prepare for future jobs, and also build creativity and problem-solving skills, which are important in the digital world.",
    "Using digital devices too much can cause problems. Spending too much time in front of screens can make people feel lonely, stressed, or tired. It can also make it harder to focus or talk with others. That’s why it's important to have a good balance between screen time and offline activities like exercise, talking with friends, or enjoying nature.",
    "Not everyone has the same access to technology. Some people don’t have fast internet or modern devices, so they miss chances to learn or find jobs. This creates unfair gaps in society. To fix this, we need good plans and community programs to give more people access to the tools they need.",
    "Technology communities are groups of people who love working with tech. They share ideas, help each other, and work together on new projects. These communities support learning and help turn smart ideas into real products or services that can help others.",
    "As technology grows, people are also thinking about the environment. Many companies are now creating eco-friendly products and using green practices to reduce harm to nature. These actions help protect the Earth and make sure that digital progress is good for our planet in the long term."
];


const question5_keyword_6 = '<strong>Mẹo nhớ Keyword:</strong> Human-Technology → Intelligent Automation → Education → Digital Interfaces → Access to Technology → Building Innovative → Digital Solutions.';
const question5_meo_6 = "<strong>Nhớ theo đoạn văn:</strong> Công nghệ con người (<strong>Human-Technology</strong>) kết hợp tự động hóa thông minh (<strong>Intelligent Automation</strong>) để cải cách giáo dục (<strong>Education</strong>), tạo ra giao diện kỹ thuật số (<strong>Digital Interfaces</strong>), mang đến sự tiếp cận công nghệ (<strong>Access to Technology</strong>), xây dựng giải pháp sáng tạo (<strong>Building Innovative</strong>) và giải pháp kỹ thuật số (<strong>Digital Solutions</strong>).";

// 5. Câu 5 - Đề mới tháng 10 -- cập nhật 12/10
const options_7 = [
    '',
    "Redefining Global Cultural Understanding",
    "Encouraging Cross-Cultural Festivals",
    "Promoting Language Exchange Programs",
    "Overemphasis on Commercial Tourism",
    "Concerns About Cultural Preservation",
    "Building Mutual Respect Among Communities",
    "Focusing on Authentic Cultural Experiences"
];

const paragraph_question5_7 = [
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được."
];


const question5_keyword_7 = '<strong>Mẹo nhớ Keyword:</strong> Global → Festivals → Language → Overemphasis → Preservation → Building → Authentic.';

const question5_meo_7 = "<strong>Nhớ theo đoạn văn:</strong> Hiểu biết toàn cầu (<strong>Global</strong>) thúc đẩy các lễ hội văn hóa (<strong>Festivals</strong>) và trao đổi ngôn ngữ (<strong>Language</strong>), nhưng đôi khi có sự tập trung quá mức vào du lịch thương mại (<strong>Overemphasis</strong>). Vì thế, cần quan tâm đến việc bảo tồn văn hóa (<strong>Preservation</strong>), xây dựng sự tôn trọng lẫn nhau (<strong>Building</strong>) và hướng đến trải nghiệm văn hóa chân thực (<strong>Authentic</strong>).";


// 5. Câu 5 - Đề mới tháng 10 -- cập nhật 12/10
const options_8 = [
    '',
    "Redefining Sustainable City Planning",
    "Encouraging Green Spaces in Urban Areas",
    "Supporting Affordable Housing Projects",
    "Overreliance on High-Rise Buildings",
    "Concerns About Traffic Congestion",
    "Strengthening Community Engagement",
    "Focusing on Renewable Energy Source"
];

const paragraph_question5_8 = [
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được."
];
const question5_keyword_8 = '<strong>Mẹo nhớ Keyword:</strong> Sustainable → Urban Areas → Housing Projects → Buildings → Traffic Congestion → Community → Energy Source.';
const question5_meo_8 = "<strong>Nhớ theo đoạn văn:</strong> Quy hoạch thành phố bền vững (<strong>Sustainable</strong>) bắt đầu từ việc mở rộng không gian xanh trong khu đô thị (<strong>Urban Areas</strong>), hỗ trợ các dự án nhà ở hợp lý (<strong>Housing Projects</strong>), hạn chế sự phụ thuộc quá mức vào các tòa nhà cao tầng (<strong>Buildings</strong>). Đồng thời, cần giải quyết vấn đề tắc nghẽn giao thông (<strong>Traffic Congestion</strong>), tăng cường sự gắn kết cộng đồng (<strong>Community</strong>) và tập trung vào việc sử dụng nguồn năng lượng tái tạo (<strong>Energy Source</strong>).";


// 5. Câu 5 - Đề mới tháng 10 -- cập nhật 12/10
const options_9 = [
    '',
    "Redefining Leisure in the Digital age",
    "Enhancing Connectivity with Mobile Apps",
    "Promoting Essential Digital Literacy",
    "Risks of Excessive Screen-Based Entertainment",
    "Concerns About Data Privacy",
    "Building Inclusive and Respectful Online Communities",
    "Prioritize human-friendly designs"
];
const paragraph_question5_9 = [
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được.",
    "Đề này không có nội dung, bạn học thuộc đáp án là được."
];


const question5_keyword_9 = '<strong>Mẹo nhớ Keyword:</strong> Digital Age → Mobile Apps → Digital Literacy → Risks → Data Privacy → Online Communities → Prioritize.';

const question5_meo_9 = "<strong>Nhớ theo đoạn văn:</strong> Trong kỷ nguyên số (<strong>Digital Age</strong>), con người kết nối qua các ứng dụng di động (<strong>Mobile Apps</strong>) và cần hiểu biết kỹ thuật số cơ bản (<strong>Digital Literacy</strong>). Tuy nhiên, việc sử dụng quá mức mang lại nhiều rủi ro (<strong>Risks</strong>) và lo ngại về quyền riêng tư dữ liệu (<strong>Data Privacy</strong>). Vì vậy, cần xây dựng cộng đồng mạng lành mạnh (<strong>Online Communities</strong>) và ưu tiên thiết kế thân thiện, hướng đến con người (<strong>Prioritize</strong>).";




const options = [
    options_1, options_2, options_3, options_4, options_5,
    options_6, options_7, options_8, options_9
];



const topic_name = {
    topic_1: "Mountain", // Bộ đề 16
    topic_2: "Four-Day Workweek", // Bộ đề 17
    topic_3: "Digital transformation (Tech Forward)", // Bộ đề 18
    topic_4: "Wellness trend", // Bộ đề 19
    topic_5: "Women mathematicians", // Bộ đề 20
    topic_6: "Technology advances",  // Bộ đề 21
    topic_7: "Cultural Exchange", // Bộ đề 22
    topic_8: "Urban Development", // Bộ đề 23
    topic_9: "Digital innovation" // Bộ đề 24
};




const dodai = options.length;







// const paragraph_question5 = [
//     paragraph_question5_1, paragraph_question5_2, paragraph_question5_3, paragraph_question5_4, paragraph_question5_5,
//     paragraph_question5_6, paragraph_question5_7, paragraph_question5_8
// ];

const paragraph_question5 = Array.from(
  { length: options.length },
  (_, i) => eval(`paragraph_question5_${i + 1}`)
);
// const meohoc1 = [question5_keyword_1, question5_meo_1];
// const meohoc2 = [question5_keyword_2, question5_meo_2];
// const meohoc3 = [question5_keyword_3, question5_meo_3];
// const meohoc4 = [question5_keyword_4, question5_meo_4];
// const meohoc5 = [question5_keyword_5, question5_meo_5];
// const meohoc6 = [question5_keyword_6, question5_meo_6];
// const meohoc7 = [question5_keyword_7, question5_meo_7];
// const meohoc8 = [question5_keyword_8, question5_meo_8];

// const meohoc = [
//     meohoc1, meohoc2, meohoc3, meohoc4, meohoc5,
//     meohoc6, meohoc7, meohoc8
// ];
const meohoc = Array.from({ length: options.length }, (_, i) => [
  eval(`question5_keyword_${i + 1}`),
  eval(`question5_meo_${i + 1}`)
]);









// const options = [options_1, options_2];
// const paragraph_question5 = [paragraph_question5_1, paragraph_question5_2];
// const questions5 = [questions5_1, questions5_2];
// const question5_keyword = [question5_keyword_1, question5_keyword_2];
// const question5_meo = [question5_meo_1, question5_meo_2];

// ===============================================================================================================
// ////////////// NÚT NHẤN NEXT VÀ BACK ///////////////
// ===============================================================================================================
// Biến theo dõi câu hỏi hiện tại
let currentQuestion = 0; // Câu hỏi bắt đầu từ 0

// Hàm xử lý sự kiện khi nhấn nút Next
document.getElementById('nextButton').addEventListener('click', function() {
     

    // Kiểm tra nếu câu hỏi không phải câu cuối cùng
    if (currentQuestion < options.length - 1) {
        currentQuestion++; // Tăng chỉ số câu hỏi hiện tại

        // Xóa nội dung cũ trong container trước khi render câu hỏi mới
        const container = document.getElementById('question5-container');
        container.innerHTML = ''; // Xóa nội dung cũ

        // Gọi lại hàm render để hiển thị câu hỏi mới
        renderQuestion5(options[currentQuestion], paragraph_question5[currentQuestion], meohoc[currentQuestion]);

        // Nếu là câu hỏi cuối cùng, đổi văn bản nút Next thành "Submit Test"
        if (currentQuestion === options.length - 1) {
            document.getElementById('nextButton').textContent = 'The end';
        }
    }
});

// Hàm xử lý sự kiện khi nhấn nút Back
document.getElementById('backButton').addEventListener('click', function() {
    if (currentQuestion > 0) {
        currentQuestion--; // Giảm chỉ số câu hỏi hiện tại

        // Xóa nội dung cũ trong container trước khi render câu hỏi mới
        const container = document.getElementById('question5-container');
        container.innerHTML = ''; // Xóa nội dung cũ

        // Gọi lại hàm render để hiển thị câu hỏi cũ
        renderQuestion5(options[currentQuestion], paragraph_question5[currentQuestion], meohoc[currentQuestion]);

        document.getElementById('nextButton').textContent = 'Next';
    }
});





// ===============================================================================================================
// ////////////// CÂU HỎI 5 ///////////////
// ===============================================================================================================
// Hàm Fisher-Yates Shuffle để xáo trộn mảng (bỏ qua phần tử đầu tiên)
function shuffleArray(arr) {
    const firstElement = arr[0]; // Lưu phần tử đầu tiên (rỗng)

    // Tách phần tử đầu tiên và xáo trộn phần còn lại của mảng
    const remainingElements = arr.slice(1);

    // Xáo trộn phần còn lại của mảng
    for (let i = remainingElements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingElements[i], remainingElements[j]] = [remainingElements[j], remainingElements[i]]; // Swap elements
    }

    // Thêm lại phần tử đầu tiên vào đầu mảng đã xáo trộn
    remainingElements.unshift(firstElement);

    return remainingElements;
}

let questions5 = [];  // Khai báo ngoài để sử dụng toàn cục
// Hàm renderQuestion5 với đầu vào là options, paragraph_question5, meohoc (mảng chứa strong2Content và strong3Content)
function renderQuestion5(options, paragraph_question5, meohoc) {
    const container = document.getElementById('question5-container');  // Lấy container để chứa câu hỏi

    if (!container) {
        console.error("Container không tồn tại!");
        return;
    }
    // Thay đổi tên topic cho phần tử có id "question5_topic"
    //document.getElementById("question5_topic").innerText = "TOPIC: " + topic_name[currentQuestion];  // Thay "NEW TOPIC NAME" bằng tên topic mới
    document.getElementById("question5_topic").innerText = "TOPIC: " + topic_name["topic_" + (currentQuestion +1)];  // Use the dynamic key based on currentQuestion
    document.getElementById('question5_index').textContent = `Reading question 5 (${currentQuestion + 1}/${dodai})`;

    // Xáo trộn mảng options một lần, nhưng giữ phần tử đầu tiên là khoảng trống
    const shuffledOptions = shuffleArray([...options]);

    // Mảng câu hỏi (sử dụng paragraph_question5 và options đã xáo trộn)
    questions5 = [
        { id: 'question5_q1', label: '1.', paragraph: paragraph_question5[0], correctAnswer: options[1] },
        { id: 'question5_q2', label: '2.', paragraph: paragraph_question5[1], correctAnswer: options[2] },
        { id: 'question5_q3', label: '3.', paragraph: paragraph_question5[2], correctAnswer: options[3] },
        { id: 'question5_q4', label: '4.', paragraph: paragraph_question5[3], correctAnswer: options[4] },
        { id: 'question5_q5', label: '5.', paragraph: paragraph_question5[4], correctAnswer: options[5] },
        { id: 'question5_q6', label: '6.', paragraph: paragraph_question5[5], correctAnswer: options[6] },
        { id: 'question5_q7', label: '7.', paragraph: paragraph_question5[6], correctAnswer: options[7] },
    ];
// Lấy các phần tử cần thiết


// Thêm các phần tử vào modalBody khi nút "Xem mẹo" được nhấn
document.getElementById('showAnswerButton').addEventListener('click', function() {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';

    const strong1 = document.createElement('p');
    strong1.innerHTML = '<strong>Học mẹo nếu bạn cần học gấp:</strong>';

    const strong2 = document.createElement('p');
    strong2.innerHTML = meohoc[0];

    const strong3 = document.createElement('p');
    strong3.innerHTML = meohoc[1];

    modalBody.appendChild(strong1);
    modalBody.appendChild(strong2);
    modalBody.appendChild(strong3);

    $('#answerModal').modal('show');
});





    // Tạo các câu hỏi động
    questions5.forEach(question => {
        // Tạo div cho mỗi câu hỏi
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('mb-3');

        // Tạo một div cha để hiển thị label và select trên cùng một hàng
        const questionRow = document.createElement('div');
        questionRow.style.display = 'flex';
        questionRow.style.alignItems = 'center'; // Căn chỉnh các phần tử giữa

        // Tạo label cho câu hỏi
        const label = document.createElement('label');
        label.setAttribute('for', question.id);
        label.classList.add('form-label');
        label.textContent = question.label;
        label.style.marginRight = '10px'; // Thêm khoảng cách giữa label và select

        // Tạo phần tử select cho câu hỏi
        const select = document.createElement('select');
        select.classList.add('form-select');
        select.id = question.id;

        // Thêm các option vào select
        shuffledOptions.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue.charAt(0).toUpperCase() + optionValue.slice(1); // Viết hoa chữ cái đầu tiên
            select.appendChild(option);
        });

        // Thêm label và select vào questionRow
        questionRow.appendChild(label);
        questionRow.appendChild(select);

        // Tạo đoạn văn cho câu hỏi (ẩn ban đầu)
        const paragraph = document.createElement('p');
        paragraph.classList.add('mt-2');
        paragraph.id = `paragraph${question.id.slice(10)}`;
        paragraph.style.display = 'none'; // Đảm bảo đoạn văn ẩn khi tải trang
        paragraph.textContent = question.paragraph;

        // Ghép các phần tử vào questionDiv
        questionDiv.appendChild(questionRow);
        questionDiv.appendChild(paragraph);

        // Thêm câu hỏi vào container
        container.appendChild(questionDiv);
    });
}







// 2. Xử lý kết quả

// Hàm lấy kết quả khi nhấn nút "Submit Test"
document.getElementById('checkResultButton').addEventListener('click', function() {
    const answers = [];
    let correctAnswers = [];
    // Lặp qua các câu hỏi và lưu đáp án người học, sau đó so sánh với đáp án đúng
    questions5.forEach((question, index) => {
        const selectedAnswer = document.getElementById(question.id).value || "(không chọn)";  // Lấy đáp án từ các select box
        answers.push(selectedAnswer);
        correctAnswers.push(question.correctAnswer);
    });

    // Hiển thị kết quả so sánh và mở modal
    displayComparisonResultsQuestion5(answers, correctAnswers);
    $('#resultModal').modal('show');  // Mở modal khi đã có kết quả
});




// Hàm hiển thị kết quả so sánh và điểm số
function displayComparisonResultsQuestion5(userAnswers, correctAnswers) {
    const comparisonBody = document.getElementById('comparisonTableBody');
    const totalScoreElement = document.getElementById('totalScore_question4');
    
    // Clear previous results
    comparisonBody.innerHTML = '';

    // Tính điểm
    let score = 0;

    // Lặp qua các câu hỏi và so sánh đáp án của người dùng và đáp án đúng
    userAnswers.forEach((userAnswer, index) => {
        const tr = document.createElement('tr');

        // Hiển thị câu hỏi (có thể thay đổi tùy vào câu hỏi)
        const questionTd = document.createElement('td');
        questionTd.innerHTML = `${index + 1}`;
        tr.appendChild(questionTd);

        // Hiển thị đáp án của người học
        const userAnswerTd = document.createElement('td');
        userAnswerTd.innerHTML = `<span class="${userAnswer === correctAnswers[index] ? 'correct' : 'incorrect'}">${userAnswer}</span>`;
        tr.appendChild(userAnswerTd);

        // Hiển thị đáp án đúng
        const correctAnswerTd = document.createElement('td');
        correctAnswerTd.innerHTML = `<span class="correct">${correctAnswers[index]}</span>`;
        tr.appendChild(correctAnswerTd);

        // Nếu người học chọn đúng, cộng điểm
        if (userAnswer === correctAnswers[index]) {
            score += 2;
        }

        comparisonBody.appendChild(tr);
    });

    // Hiển thị điểm số vào phần tử có id "totalScore_question4"
    totalScoreElement.innerHTML = `<strong>Your score: ${score} / ${correctAnswers.length * 2}</strong>`;

    // Trả về điểm số
    return score;
}



// ===============================================================================================================
// ////////////// HIỂN THỊ ĐOẠN VĂN VÀ XEM MẸO ///////////////
// ===============================================================================================================

// Hiển thị/Ẩn đoạn văn khi nhấn nút "Hiển thị đoạn văn"
document.getElementById('showParagraphButton').addEventListener('click', function() {
    const paragraphs = document.querySelectorAll('.mt-2');
    paragraphs.forEach(paragraph => {
        paragraph.style.display = (paragraph.style.display === 'none' || paragraph.style.display === '') ? 'block' : 'none';
    });
});

// // Hiển thị/Ẩn đáp án khi nhấn nút "Xem mẹo"
// document.getElementById('showAnswerButton').addEventListener('click', function() {
//     const answerBox = document.getElementById('answerBox');
//     answerBox.style.display = (answerBox.style.display === 'none' || answerBox.style.display === '') ? 'block' : 'none';
// });



// 1. Hiển thị câu hỏi khi trang được load
window.onload = function() {
    renderQuestion5(options[0], paragraph_question5[0], meohoc[0]);
};












// ===============================================================================================================
// ////////////// ĐẾM NGƯỢC THỜI GIAN --- COUNT DOWN ///////////////
// ===============================================================================================================
// Countdown Timer
let timeLeft = 35 * 60; // 35 minutes in seconds
const countdownElement = document.getElementById('countdownTimer');

function updateCountdown() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timeLeft > 0) {
        timeLeft--;
        setTimeout(updateCountdown, 1000);
    }
}

updateCountdown();


// Kết thúc
});
