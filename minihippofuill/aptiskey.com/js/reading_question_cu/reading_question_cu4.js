document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

// 4. Câu 4
const question4Text_1 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> I moved to a new country and it is challenging to stay in touch with relatives, but thanks to technology, I can now easily contact my family. I rely on technology a lot for this reason, and I believe many people nowadays depend on it too. It makes sense, and I have no issues with that. Technology has made staying connected much more convenient and accessible for all of us.",
    "<strong>B:</strong> I work in finance and it is normal for me to use technology to update international banking information and I am an accountant. However, looking at the screen for too long makes my eyes hurt. Also, using my phone for extended periods before bedtime affects my sleep, so I avoid it after 9 p.m. to ensure a good night's rest.",
    "<strong>C:</strong> Our family uses technology a lot. My sister called mom even inside the house! Although my dad told us not to use the phone at night, I use it anyway. I find it convenient to watch movies and listen to music. I also use it to play games with friends. My friends always have the most updated games, which puts pressure on me to buy the latest as soon as I can. I don’t want to lag behind them.",
    "<strong>D:</strong> I am a professional painter, which is not traditionally connected to technology, but perhaps I will use it more in the future. I have a laptop at home. Whenever I use it, my daughter becomes really interested, so I have to keep it locked away. Although some of my friends are keen on letting children be exposed to technology, I think it would have an effect on their brain development."
];

const question4Content_1 = [
    
    
    { question: "Who uses the internet to communicate with family?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who advises against using internet before going to bed?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who depends on the internet?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who uses the Internet for work purposes?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who uses the internet for entertainment?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who aganist children to use the phone?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who keep the lastest products?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];
const correctAnswersQuestion4_1 = [  'A', 'B', 'A', 'B', 'C', 'D','C'];


// 4. Câu 4
const question4Text_2 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> I know a little about famous painters and their works. But I don't like going to art exhibitions unless my friend invites me. I like extracurricular activities more, painting exhibitions seem too quiet to me. I like to draw, and I have been drawing ever since I can remember. My forte in drawing is animals, especially big and ferocious animals.",
    "<strong>B:</strong> I find going to see paintings similar to reading books. You must look and read before discussing. When I go to exhibitions with my friends, they often talk before seeing the painting, and what they talk about isn't even about the painting, that's annoy me.",
    "<strong>C:</strong> I find polite art very fascinating. I often go to talks about arts and I have gone to many foreign art exhibitions and artists' houses. It's great to see their works and where they worked.",
    "<strong>D:</strong> My parents often took me to see art exhibitions when I was a child. and I think that habit remains. Currently, I often take my children to the exhibition, which is a lovely activity for me. I often ask my children to do other activities while looking at pictures, for example, think of a story for that picture, so they don't get bored."
];


const question4Content_2 = [
    { question: "Who has been going to art exhibitions all their life?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks seeing exhibitions is a boring activity?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who has a good knowledge of art?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who has some artistic skills?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks visitors should focus on the art?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who prefers seeing exhibitions by themselves?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who prefers going to art exhibitions with other people?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
    
];

const correctAnswersQuestion4_2 = ['D', 'A', 'C', 'A', 'B', 'B', 'D' ];


// Đề 2
const question4Text_3 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> I feel very lucky to have this park here. My family and I often go to the park because of the natural landscape here. It's different from the city, which is very busy and full of dust. Unfortunately, I am away this weekend so I cannot help with the cleaning. However, I know my brother and his friends will be very interested in this cleanup so I will ask them if they can help.",
    "<strong>B:</strong> I’m a very busy person and I have to spend this weekend with my family because I only have the weekend as free time. I think young people who don’t have families should help. Besides, students and schools also have days off on weekends. I think this volunteering will be very helpful for students’ future careers.",
    "<strong>C:</strong> I think this volunteering is a good idea but it doesn’t have a long-term vision. When volunteers clean up the park, it will be clean, but it will become busy again after about a month when tourist season arrives. I think we should clean this park regularly about once a month. Surrounding areas such as the lake and local forest should also be cleaned up. We should also have signs telling visitors to clean up their trash. I am very upset when I see a lot of trash on both sides of the road.",
    "<strong>D:</strong> My family and I often spend time at the park. My children love going to the park and they find the park a very interesting place to visit. My son has a dream of becoming a biologist so I think cleaning up this park will be very helpful for my son. I think we should pique children’s interest in cleaning. They will be more willing to volunteer and help others."
];

const question4Content_3 = [
    { question: "Who can't help clean the park because of their busy work?", id: "question4_q1", options: ["","A", "B", "C", "D"] },
    { question: "Who thinks the park is a beautiful place to relax?", id: "question4_q2", options: ["","A", "B", "C", "D"] },
    { question: "Who will ask for other people to help?", id: "question4_q3", options: ["","A", "B", "C", "D"] },
    { question: "Who thinks volunteering is important for chidren?", id: "question4_q4", options: ["","A", "B", "C", "D"] },
    { question: "Who thinks other local areas need cleaning?", id: "question4_q5", options: ["","A", "B", "C", "D"] },
    { question: "Who thinks the cleaning needs to be done regularly?", id: "question4_q6", options: ["","A", "B", "C", "D"] },
    { question: "Who thinks volunteering can help with future employment?", id: "question4_q7", options: ["","A", "B", "C", "D"] }
];

const correctAnswersQuestion4_3 = ['B', 'A', 'A', 'D', 'C', 'C', 'B'];

// 4. Câu 4
const question4Text_4 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> My wife often complains about not having time to read, and I say we have to make our own time. So, I often calculate my free time on my phone. So I can know in advance whether I should bring a book to read on the train. My wife often laughs at me for doing so, but I don't mind, as long as I can finish reading so many books.",
    "<strong>B:</strong> I used to struggle very much to finish reading a book that we were expected to read. However, now that I read for my own pleasure, I don't mind too much. I usually don't limit myself to reading one at a time. There are so many titles I can choose from that get me excited. I have a list of books that I want to read in the future.",
    "<strong>C:</strong> I often keep a book on the bedside table to read before going to bed. The problem is, I get tired after reading only half of a page, and I fall asleep. So, I've been reading that one book for half a year now and have only read chapter 2. However, when I read factual books, I find it very interesting and it keeps me awake for hours.",
    "<strong>D:</strong> My job requires reading a lot of books. These books include a lot of facts and figures and they are very boring. When I have free time, I usually want to read light books, like mystery novels or comedy. I often read on the train to work. I have a young child, so when I come home I almost don't have time to read. Therefore, I have to read books when traveling by train. So, a book can last me 1 week."
];


const question4Content_4 = [
    { question: "Who wants to read a lot of books?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who plans their reading schedule?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks that factual books are boring?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who is having difficulty in fishing a book?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who has limited time to read books?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who reads more than another family member?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who reads many books at once?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];


const correctAnswersQuestion4_4 = ['B', 'A', 'D', 'C', 'D', 'A', 'B'];



// 4. Câu 4
const question4Text_5 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> When I first came to this city, I felt very scared because this city is very big. The city has many parts and the shopping part is very far from the green part. However, we already had the bus route and we signed up to take the bus for a full day. Buses are very cheap and very convenient. I feel very lucky to not have to put pressure on my sore feet.",
    "<strong>B:</strong> I don't like big cities and rarely go out. But I go to StevenSon city very often. I go there about five to seven times a year. There is an area outside the city. In that area, there are many things that I need. There is a lot of water, a natural area, a small forest and a special camping area. I really like coming to this place to rest. It also has a great coffee serving area for visitors.",
    "<strong>C:</strong> I went to this city last summer and really liked the atmosphere of this city. The reason I like the atmosphere here is because it has a lot of public performances. These performances often take place in front of department stores. so this prevents me from shopping inside those stores. I was very surprised when I came home with an empty bag and I didn't buy anything.",
    "<strong>D:</strong> When I go out, I only care about two things: good food and a good play. I especially liked the lunch I had in this city, it was delicious and I really want to come back here next time. However, I guess it's a bit expensive and I have to walk a long way to get there. However, it didn't matter because I had a wonderful day."
];

const question4Content_5 = [
    
    { question: "Who liked the public theatre that the city puts on?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who paid a lot for their meal?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who usually spends a lot of money on shopping?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who thought public transport system was good?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who thought walking too much causes a problem?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who likes the natural resort here?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who visits one part of the city?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];
const correctAnswersQuestion4_5 = [  'C', 'D', 'C', 'A', 'A', 'B', 'B'];

// 4. Câu 4
const question4Text_6 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> When I was a kid, I was often given ready-made or junk food when I was at home, although I don't want to blame my parents. Since then, I try to eat at restaurants as much as possible. The food at the restaurant is not very diverse but for me that is not a problem. What matters to me when going out to eat is who you go with. I often eat with colleagues or close friends when I get off work, it's very fun.",
    "<strong>B:</strong> I used to often go to the most fashionable and luxurious restaurants to eat. However, now, I'm back to being a student and my finances won't stretch that far. Therefore, I often cook for myself and watch recipes and cooking methods on the internet. That helps me to be able to focus on my studies without losing concentration.",
    "<strong>C:</strong> Going to a restaurant is for the social atmosphere and I am not bothered to eat alone either. What's important to me is the variety of dishes. Therefore, I eat at as many places as possible even though they are a bit pricey. That's why I joined the cooking club, where I can learn many new recipes and also meet many friends.",
    "<strong>D:</strong> I don't understand why so many people want to find many different recipes for one dish. I know clearly what I like and I eat exactly that food. My dad is a good cook, he knows what ingredients I don't like to eat, which obviously are a lot. I love being home and eating with my family."
];


const question4Content_6 = [
    { question: "Who takes a cookery course?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who only wants to eat a few range of food?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who likes to eat with friends?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who prefers to eat alone?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who needs to save money?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who likes home cooked food?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who likes to eat a wide range of dishes?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];


const correctAnswersQuestion4_6 = [  'C', 'D', 'A', 'B', 'B', 'D', 'C'];



// 4. Câu 4
const question4Text_7 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> I know I have to spend time studying but there are so many great TV shows. especially horror tv shows, once you watch it, you will be glued to it and can't stop watching. Besides, these TV shows often last for many weeks.",
    "<strong>B:</strong> I often spend time watching news on TV in the evening when I'm free. In the past, I often watched the soccer team I like on TV, but they often lost, so I gave up watching them. Nowadays there are too many reality TV shows being shown on TV. Every time I see these shows, I turn it off and do more interesting things.",
    "<strong>C:</strong> I wasn't good when I was in school because I often spent time watching cartoons on TV. However, I now watch nature documentaries and TV shows about science, history, and business. This helps me expand my knowledge a lot compared to when I was in school.",
    "<strong>D:</strong> My husband usually schedules TV viewing for the weekend, he usually watches football or documentaries. I'm the opposite. I just turn on the TV and it doesn't matter what program it is, because I just need to relax. However, I also want to update news about movies. not just movies, but also songs. I also find reality TV shows very entertaining."
];


const question4Content_7 = [
    
    { question: "Who isn't a very selective viewer?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who likes TV programs which continue over several weeks?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who keeps up to date on cinema and music?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who avoids watching reality TV programs?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who has lost interest in watching football on TV?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who gets a lot of knowledge by watching TV?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who watches TV instead of studying?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];


const correctAnswersQuestion4_7 = [ 'D', 'A', 'D', 'B', 'B', 'C', 'A'];



// 4. Câu 4
const question4Text_8 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> I have a dream that I work as a tour guide. So I understand that I will have to fly to other countries. In my personal opinion, airplanes are currently too cheap compared to the damage they cause to the environment, so I believe we should add taxes to airline ticket prices to make people choose to use other means of transport before they think about flying. I believe that people are also very happy when they can contribute to protecting the environment.",
    "<strong>B:</strong> My family and siblings live quite far from me. So I often have to fly to visit them every month when I have time. We really appreciate the time we spend together and we are happy to be able to meet each other and share our new story. I know that traveling by plane too much is not good for the environment so I often shop online or go to work by bike instead of going by car or I reuse plastic bags and paper bags. In addition, I sometimes volunteer to clean up trash in the neighborhood.",
    "<strong>C:</strong> I was a businessman so I had to fly many times a week. I had to go to other countries to be able to sign wine trading contracts with them. I felt very tired every time I have to fly. Now, my sister and I, whenever we have free time, take the train together and we enjoy that time very much because I can travel while sightseeing and relax without any stress.",
    "<strong>D:</strong> If I have to go somewhere I will choose other means of public transport, not the plane. Every time I go on a plane I feel extremely tired and I just hope time passes quickly so I can get off that plane. However, due to the specific nature of my job, I have to film in many different locations, so sometimes I cannot avoid having to take this public transportation."
];

const question4Content_8 = [
    
    { question: "Who tries to protect the environment?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who likes relaxing while they travel?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who finds flying tiring?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who needs to fly for their work?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who suggests making flights more expensive?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who wants to work in other countries?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who visits relatives regularly?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];
const correctAnswersQuestion4_8 = [  'B', 'C', 'D', 'D', 'A', 'A', 'B'];


// 4. Câu 4
const question4Text_9 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> This is my first time coming to this restaurant. The food is very cheap but the quality is excellent. I was very surprised with the starter because its menu is very diverse. but there is one thing that I want the restaurant to improve. The music was too low and it didn't make the meal atmosphere lively. Next time turn the music louder, please!",
    "<strong>B:</strong> This is a very famous restaurant that I saw in the newspaper. Sadly, I arrived later than the rest of the party, so I didn't get to order dinner. However, I ordered orange juice and mango juice and they were both delicious. What about the surroundings? Lively music along with fashionable and appropriate decor makes me feel very comfortable.",
    "<strong>C:</strong> I'm not sure if I will return to this restaurant. I think the staff was arguing when I got there, because the atmosphere here was not very comfortable. As for the food, I think there's nothing to write about. I ordered fish and chips, it wasn't bad, but it wasn't good either. But many people say that the food here is fabulous. So, I think I'm an exception.",
    "<strong>D:</strong> I don't understand why this restaurant is so famous. When I arrived and saw a menu with lots of different dishes, I saw this as a bad sign. Furthermore, the menu with traditional dishes contrasting with the modern decoration style made me feel very confused and strange. The staff here are also not friendly. This was one of my worst experiences eating at a restaurant."
];

const question4Content_9 = [
    
    { question: "Who was impressed by the range of appetizers?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who thought his experience was probably unusual?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who thought the food was of average quality?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who will definitely not return to the restaurant?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who thought the music was too quiet?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who didn't eat anything at the restaurant?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who enjoyed the atmosphere?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];
const correctAnswersQuestion4_9 = [  'A', 'C', 'C', 'D', 'A', 'B', 'B'];


// 4. Câu 4
const question4Text_10 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> When I travel somewhere, I often ask for bus routes to famous tourist destinations so that I can get to those places as quickly as possible and avoid wasting time going around. Famous tourist destinations are the places I want to explore the most when traveling somewhere. I don't understand why many people just like to sit still at the beach when traveling, I find that uninteresting and time-consuming.",
    "<strong>B:</strong> My family and I often plan to travel every time we have a vacation. If the weather is nice then our plans go ahead as usual, if not, we will postpone that vacation. For my family, light wind and warm sunlight are important when we go out. A few of my friends invited me to go climbing, but I'm afraid of heights so I refused them. However, in the future I really want to try mountain climbing once.",
    "<strong>C:</strong> Next month's trip will be the first time I travel to another country. Normally I only travel to famous local places or in my country. These places are beautiful but I'm so excited to travel to a foreign place once in my life.",
    "<strong>D:</strong> Last year, I went on a mountain climbing trip with my friends. It was the most horrible trip I have ever experienced. However, after that trip, I had a strong passion for walking. So now, every day I walk as a hobby, and it also helps my health a lot. I'm old so I'm no longer interested in traveling to far away places. Instead, I want to lie on a comfortable sofa and watch my favorite TV show."
];

const question4Content_10 = [
    
    
    { question: "Who thinks going to the beach is boring?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who prefers to stay at home?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks holiday requires good weather?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who likes going walking?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who wants to go mountaineering trip?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who has never been abroad?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who likes seeing tourist attractions?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];
const correctAnswersQuestion4_10 = [  'A', 'D', 'B', 'D', 'B', 'C','A'];


// 4. Câu 4
const question4Text_11 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> Exercising with friends is a fantastic idea, don't you think? It adds a fun element to the workout routine. It's important to fuel our bodies properly, though. After a good workout, I always make sure to have a nutritious meal to replenish energy and support muscle recovery.",
    "<strong>B:</strong> Establishing a consistent workout routine has really helped me stay on track with my fitness goals. It's amazing how much more I can accomplish when I have a structured plan in place. Plus, it keeps me accountable and ensures I make time for physical activity every day.",
    "<strong>C:</strong> Age is just a number when it comes to exercise. Whether you're young or old, staying active is crucial for maintaining overall health and vitality. While competitions can be motivating for some, they're not necessarily suitable for everyone. It's important to find activities that are enjoyable and sustainable for each individual.",
    "<strong>D:</strong> Experiencing pain during exercise isn't necessary and it's a sign that something may be wrong. It's important to listen to our bodies and seek expert advice when needed, whether it's from a trainer, physical therapist, or medical professional. Taking care of ourselves properly ensures we can continue to enjoy physical activity without risking injury."
];

const question4Content_11 = [
    
    
    { question: "Who thinks work out with friends is a good idea?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks competitions are not useful for everybody?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks experience pain is not necessary?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks a proper meal is important?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks a routine can help us do more sport?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks exercise is for both the young and the elderly?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks at times we seek expert advice?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];
const correctAnswersQuestion4_11 = [  'A', 'C', 'D', 'A', 'B', 'C','D'];


// 4. Câu 4
const question4Text_12 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> This is the second time I've watched this movie but it still makes me feel restless and anxious. Every time there are sudden scary scenes, my heart feels like it's going to jump out. I think the director and actors made this movie very successful in scaring the audience.",
    "<strong>B:</strong> I feel like going to the cinema is a waste of money so I watched this movie at home with my family, and we had a very good time together. One thing about this movie that makes me excited is the plot of the movie. The film progresses very logically, the story lines are cleverly and skillfully arranged to express the character's psychology in the most complete way. That's one thing I like most about this movie.",
    "<strong>C:</strong> It was a holiday weekend and my college friends and I had planned to go see this movie at the cinema. We had a great time together watching that horror movie. However, I feel that this movie is not as scary as rumored. When I finished watching, I didn't feel any impression or fear at all.",
    "<strong>D:</strong> I read the book for the movie, and to be fair, the movie wasn't as good as the book. If you want to understand more about this movie you should read its book before you watch the movie. For me, the length of this movie is terrible, the movie lasts over 3 hours, while only half the time is needed for all that content."
];

const question4Content_12 = [
    { question: "Who thought the film was too long?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who saw the movies with friends?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who found the film scary?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who saw the film at home?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who enjoyed the story of the film?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who read the book of the film?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who saw the film previously?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];
const correctAnswersQuestion4_12 = [  'D', 'C', 'A', 'B', 'B','D', 'A', ];

// 4. Câu 4
const question4Text_13 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> I see too many people who do not arrange a good time to travel to work, they often arrive at work late. I always think in advance about what time I will get to work tomorrow and what means of transport I will use.",
    "<strong>B:</strong> Buses are often full of people, especially during rush hour. This makes me very uncomfortable when I have to travel to work by bus. The public transportation improvement plan proposed by the city is very reasonable and it will improve the above situation a lot.",
    "<strong>C:</strong> In my opinion, the bus is very clean and comfortable to travel. I find it has a lot of space for everyone, and the bus system is also very large. Therefore, I think improving the public transport system is unnecessary, while the old system is still good.",
    "<strong>D:</strong> Building a new public transportation system will be very costly. and we all know it's at the expense of residents. I think we should use that money for something more beneficial, which is building more hospitals. Hospitals in this living area are very few."
];

const question4Content_13 = [
    { question: "Who thinks transport system doesn't need improving?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks better medical facilities are needed?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks people should plan their journeys better?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks the bus is too busy?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks the new station will improve train travel?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks the bus service is good?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who thinks the new station will cost too much to build?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];
const correctAnswersQuestion4_13 = [  'C', 'D', 'A', 'B', 'B','C', 'D', ];



// 4. Câu 4
const question4Text_14 = [
    "<strong>Four people respond in the comments section of an online magazine article about the above topic. Read the texts and then answer the questions.</strong>",
    "<strong>A:</strong> I like traveling to the beach. I think I have to walk quite a distance from the hotel to the beach so I think I have to bring boots. However, when I opened the suitcase I didn't see any boots. But I still completed the trip and visited many beautiful beaches. One great thing is that the beaches are in remote areas so there are very few tourists. However, it also makes finding food and drinks more difficult.",
    "<strong>B:</strong> As an architect, I have always been interested in how buildings are constructed. So when I travel, I never spend time lying on the beach or buying souvenirs. I will go around the area to see the architecture of the houses. I chose to go around by taxi, it was great. However, it cost me a lot because I traveled alone and had no one to share the costs with. But for me this was still a great experience because I got to see many old houses.",
    "<strong>C:</strong> The sharp bends of the island made me abandon the idea of renting a car, because it was very dangerous. I decided to take the bus, it was also much cheaper. However, the bus routes are quite few and there are many time constraints. We toured the neighborhoods on foot. I loved this experience because I could see many beautiful sights.",
    "<strong>D:</strong> There's a lot of food here and I spend most of my time eating. I can't recommend any of the dishes because they are all very impressive. If you want to cook for yourself, you will have to take the bus to the market. Don't forget to visit the street market because they sell a lot of cool local products. I have a lot of good bargains there."
];


const question4Content_14 = [
    { question: "Who loved eating food here?", id: "question4_q1", options: ["", "A", "B", "C", "D"] },
    { question: "Who liked to be alone?", id: "question4_q2", options: ["", "A", "B", "C", "D"] },
    { question: "Who liked buying things on the island?", id: "question4_q3", options: ["", "A", "B", "C", "D"] },
    { question: "Who spent a lot of money on transport?", id: "question4_q4", options: ["", "A", "B", "C", "D"] },
    { question: "Who thought public transport could be improved?", id: "question4_q5", options: ["", "A", "B", "C", "D"] },
    { question: "Who liked to walk?", id: "question4_q6", options: ["", "A", "B", "C", "D"] },
    { question: "Who forgot to bring something?", id: "question4_q7", options: ["", "A", "B", "C", "D"] },
];
const correctAnswersQuestion4_14 = ['D', 'A', 'D', 'B', 'C', 'C', 'A'];




const question4Text = [
  question4Text_1, question4Text_2, question4Text_3, question4Text_4, question4Text_5, 
  question4Text_6, question4Text_7, question4Text_8, question4Text_9, question4Text_10, 
  question4Text_11, question4Text_12, question4Text_13, question4Text_14, 
];

const question4Content = [
  question4Content_1, question4Content_2, question4Content_3, question4Content_4, 
  question4Content_5, question4Content_6, question4Content_7, question4Content_8, 
  question4Content_9, question4Content_10, question4Content_11, question4Content_12, 
  question4Content_13, question4Content_14, 
];

const correctAnswersQuestion4 = [
  correctAnswersQuestion4_1, correctAnswersQuestion4_2, correctAnswersQuestion4_3, correctAnswersQuestion4_4, 
  correctAnswersQuestion4_5, correctAnswersQuestion4_6, correctAnswersQuestion4_7, correctAnswersQuestion4_8, 
  correctAnswersQuestion4_9, correctAnswersQuestion4_10, correctAnswersQuestion4_11, correctAnswersQuestion4_12, 
  correctAnswersQuestion4_13, correctAnswersQuestion4_14, 
];


const question4Topic1 = {
  topic1: "Technology",
  topic2: "Online magazine article about art",
  topic3: "Volunteering to clean a local park",
  topic4: "Reading books",
  topic5: "Visit Stevenson city",
  topic6: "Eating and cooking",
  topic7: "Watching television",
  topic8: "Opinions on flying",
  topic9: "A new restaurant",
  topic10: "Going on holiday",
  topic11: "Sports",
  topic12: "Watching a movie",
  topic13: "Plans for a new station",
  topic14: "Visiting an island",
};




function getQuestHeaders(obj) {
    return Object.values(obj);
}

// Gọi hàm
const question4Topic = getQuestHeaders(question4Topic1);



// ===============================================================================================================
// ////////////// NÚT NHẤN NEXT VÀ BACK ///////////////
// ===============================================================================================================
let currentIndex = 0; // Biến lưu trữ chỉ số câu hỏi hiện tại

// Hiển thị câu hỏi đầu tiên khi load trang
renderQuestion4(currentIndex);

// Sự kiện cho nút Next
document.getElementById('nextButton').addEventListener('click', function() {
    if (currentIndex < question4Text.length - 1) {
        currentIndex++; // Tăng chỉ số lên để chuyển sang câu hỏi tiếp theo
        renderQuestion4(currentIndex); // Render câu hỏi mới
    } else {
        // Nếu đã ở câu hỏi cuối cùng, thay đổi văn bản nút Next thành "Submit Test"
        document.getElementById('nextButton').textContent = "The end";
    }
});

// Sự kiện cho nút Back
document.getElementById('backButton').addEventListener('click', function() {
    if (currentIndex > 0) {
        currentIndex--; // Giảm chỉ số xuống để quay lại câu hỏi trước
        renderQuestion4(currentIndex); // Render câu hỏi trước
        document.getElementById('nextButton').textContent = "Next";
    } else {
        // Khi đã đến câu hỏi đầu tiên, có thể thay đổi văn bản nút Back hoặc thực hiện hành động khác
        document.getElementById('backButton').textContent = "No Previous Question";
    }
});





// ===============================================================================================================
// ////////////// MẢNG CÂU HỎI VÀ ĐÁP ÁN CÂU HỎI 4 ///////////////
// ===============================================================================================================
// Hàm render câu hỏi với dữ liệu đầu vào là question4Text và question4Content
function renderQuestion4(index) {
    // Kiểm tra xem mảng question4Text và question4Content có hợp lệ không
    if (!question4Text[index] || !question4Content[index]) {
        console.error('Không tìm thấy dữ liệu cho câu hỏi tại index: ' + index);
        return;  // Dừng hàm nếu dữ liệu không hợp lệ
    }

    const container = document.getElementById('question4');
    const row = container.querySelector('.row');

    // Render các đoạn văn vào cột bên trái
    const leftColumn = row.querySelector('.col-md-7');
    leftColumn.innerHTML = ''; // Xóa nội dung cũ
    question4Text[index].forEach(text => {
        const p = document.createElement('p');
        p.innerHTML = text;  // Cho phép HTML trong đoạn văn (ví dụ <strong>)
        leftColumn.appendChild(p);
    });

    // Render các câu hỏi và dropdown vào cột bên phải
    const rightColumn = row.querySelector('.col-md-5');
    const form = rightColumn.querySelector('form');
    form.innerHTML = ''; // Xóa nội dung cũ

    question4Content[index].forEach(item => {
        const div = document.createElement('div');
        div.classList.add('mb-3', 'row', 'align-items-center');

        const label = document.createElement('label');
        label.setAttribute('for', item.id);
        label.classList.add('col-9', 'col-form-label');
        label.textContent = item.question;

        const selectDiv = document.createElement('div');
        selectDiv.classList.add('col-3');

        const select = document.createElement('select');
        select.id = item.id;
        select.classList.add('form-select', 'select-fixed');

        item.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });

        selectDiv.appendChild(select);
        div.appendChild(label);
        div.appendChild(selectDiv);
        form.appendChild(div);
    });

    // Cập nhật chủ đề cho câu hỏi
    const topicElement = document.getElementById('question4_topic');
    topicElement.textContent = `Topic: ${question4Topic[index]}`;
}



// 2. Xử lý kết quả khi nhấn submit
document.getElementById('checkResultButton').addEventListener('click', function() {
    const answers = [];
    const correctAnswers = [];

    // Lặp qua các câu hỏi và lấy đáp án người học, sau đó so sánh với đáp án đúng
    for (let i = 0; i < 7; i++) {
        const selectElement = document.getElementById(`question4_q${i + 1}`);
        if (selectElement) {
            const selectedAnswer = selectElement.value || "(không chọn)";
            answers.push(selectedAnswer);
            correctAnswers.push(correctAnswersQuestion4[currentIndex][i]); // Sử dụng currentIndex để lấy mảng đúng
        } else {
            console.error(`Element with id 'question4_q${i + 1}' not found`);
        }
    }

    // Hiển thị kết quả so sánh
    question4Score = displayComparisonResultsQuestion4(answers, correctAnswers);

    // Show the modal after displaying the results
    $('#resultModal').modal('show');
});

// Hàm hiển thị kết quả so sánh và điểm số
function displayComparisonResultsQuestion4(userAnswers, correctAnswers) {
    const comparisonResult = document.getElementById('comparisonResult_question4');
    const comparisonBody = document.getElementById('comparisonTableBody');
    const totalScoreElement = document.getElementById('totalScore');

    // Clear previous results
    comparisonBody.innerHTML = '';

    // Tính điểm
    let score = 0;

    // Lặp qua các câu hỏi từ mảng question4Content và hiển thị đáp án người học và đáp án đúng
    question4Content[currentIndex].forEach((item, index) => {
        const tr = document.createElement('tr');

        // Cột câu hỏi
        const questionTd = document.createElement('td');
        questionTd.innerHTML = item.question;  // Lấy câu hỏi từ question4Content
        tr.appendChild(questionTd);

        // Cột đáp án người học
        const userAnswerTd = document.createElement('td');
        const userAnswer = userAnswers[index] || "(không chọn)";
        userAnswerTd.innerHTML = `<span class="${userAnswer === correctAnswers[index] ? 'correct' : 'incorrect'}">${userAnswer}</span>`;
        tr.appendChild(userAnswerTd);

        // Cột đáp án đúng
        const correctAnswerTd = document.createElement('td');
        correctAnswerTd.innerHTML = `<span class="correct">${correctAnswers[index]}</span>`;
        tr.appendChild(correctAnswerTd);

        // Nếu người học chọn đúng, cộng điểm
        if (userAnswer === correctAnswers[index]) {
            score += 2;
        }

        comparisonBody.appendChild(tr);
    });


    // Trả về điểm số
    return score;
}



// 1. Hiển thị câu hỏi khi trang được load
window.onload = function() {
    let currentIndex = 0; // Chỉ số câu hỏi ban đầu (hiển thị câu hỏi đầu tiên)
    renderQuestion4(currentIndex);   // Gọi hàm renderQuestion4 và truyền index đầu tiên
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
