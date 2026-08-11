(function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

window.listeningQuestions1 = [
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q1.mp3",
    question: "How much does the flight in the morning cost?",
    options: ["350 pounds", "300 pounds", "380 pounds"],
    correctAnswer: "350 pounds",
    transcript: "\"If you are looking to book your flight to London for next Tuesday, we have a few different pricing options available depending on the time of day. The late evening departure is the most budget-friendly, coming in at just two hundred and fifty pounds. If you prefer to travel during peak hours in the afternoon, the ticket price jumps up to four hundred and fifty pounds. However, if you decide to take the early morning flight, it will cost you exactly three hundred and fifty pounds.\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q8.mp3",
    question: "How much did she sell it for?",
    options: ["50 dollars", "45 dollars", "60 dollars"],
    correctAnswer: "50 dollars",
    transcript: "\"I finally sold my old bicycle yesterday. I initially posted it online for 60 dollars, but a college student asked for a discount. Since he was very polite, I agreed to sell it to him for 50 dollars. I\'m glad it found a new owner.\""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q3.mp3",
    question: "What is the main reason she gets late?",
    options: ["Missed the train", "Got stuck in traffic", "Overslept"],
    correctAnswer: "Missed the train",
    transcript: "\"I am so incredibly sorry for keeping you all waiting for the budget meeting this morning. I actually woke up early today so I didn\'t oversleep at all, and I even checked the roads to make sure I wouldn\'t get stuck in a morning traffic jam. However, just as I walked onto the platform, the doors slammed shut and the express rail pulled away right in front of me. Having missed the train, I had no choice but to wait for the next slow commuter service.\""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_28s%20(audio-joiner.com)%20(1).mp3",
    question: "What is the man going to do after work?",
    options: ["Goes running", "Meet a friend", "Go shopping"],
    correctAnswer: "Goes running",
    transcript: "Woman: Hey, a few of us are heading downtown to meet some friends for dinner after we log off. Do you want to come along? \nMan: Thanks for the invite, but I’ll have to pass tonight. I’ve been feeling really sluggish lately and need some active exercise. \nWoman: Oh, are you heading home to relax then? \nMan: Not quite. I brought my trainers with me today, so as soon as I leave the office, I’m going straight to the local park to go running for an hour to clear my head."
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_33s%20(audio-joiner.com).mp3",
    question: "Tom is calling his friend. What time will they meet?",
    options: ["7 p.m.", "6:30 p.m.", "7:30 p.m."],
    correctAnswer: "7 p.m.",
    transcript: "Man: Hi, it\'s Tom. I\'m just calling to confirm our dinner plans for tonight. My shift finishes at 5 PM, so I can head over right after that if you like. \nWoman: Five is a bit too rushed for me because I have a client meeting that goes until 6 PM. Could we push it back a bit? \nMan: No problem at all. Let\'s make it an hour after you finish, which gives us both plenty of time to get to the restaurant. See you at 7 PM then! \nWoman: Perfect, see you there!"
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q6.mp3",
    question: "A finance expert is giving advice to young people. What shouldn\'t they do?",
    options: ["Ask for more money", "Spend money without a plan", "Borrow money from friends"],
    correctAnswer: "Ask for more money",
    transcript: "\"As a finance expert, my number one advice for young entrepreneurs pitching to investors is to do your homework thoroughly. You should never hesitate to request more details from your target market, and if your project schedule is tight, it is completely acceptable to ask for more time to prepare a perfect business model. However, the biggest mistake you can make is trying to inflate your budget right at the beginning. Whatever you do, do not ask for more money until you have proven your idea works.\""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q7.mp3",
    question: "A girl is talking about a show she will attend. What will it end with?",
    options: ["A surprise performance", "A fireworks display", "A question-and-answer session"],
    correctAnswer: "A surprise performance",
    transcript: "\"Welcome to the annual charity gala event line-up. We will kick off the evening with a short speech by our organization\'s founder to thank all the donors. Immediately following that, our main attraction will take the stage, which is a wonderful music show featuring a live classical orchestra. Finally, to wrap up the entire evening, we have scheduled an unannounced surprise performance from a world-famous magician that isn\'t printed on your programs.\""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q8.mp3",
    question: "Listen to an auction man talking about a cabinet. Which part of the cabinet is original?",
    options: ["The drawer", "The doors", "The handles"],
    correctAnswer: "The drawer",
    transcript: "\"Moving on to item number fourteen, we have this beautiful nineteenth-century antique cabinet. Potential buyers should note that this piece has undergone extensive restoration over the years. The front wooden door was completely replaced with new oak timber due to water damage, and the iron handle is also a modern replacement. However, the internal sliding drawer at the bottom remains completely untouched and is the only original part left from the day it was manufactured.\""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_36s%20(audio-joiner.com).mp3",
    question: "A woman tells her friend about her plans for the day. What is the woman going to do?",
    options: ["Have coffee", "Visit her sister", "Go to the supermarket"],
    correctAnswer: "Have coffee",
    transcript: "Man: Hey, the weather is beautiful outside. Do you want to go grab a sandwich and have lunch in the park? \nWoman: I’d love to, but I have a virtual French grammar lesson starting at my desk in about twenty minutes, so I can\'t go far. \nMan: Ah, that\'s a shame. Do you need anything before your class begins? \nWoman: Actually, yes! I\'m feeling quite exhausted. Could you help me grab a hot cup of coffee from the breakroom? I really need some caffeine to stay awake. \nMan: Sure thing, I\'ll bring it right over."
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q10.mp3",
    question: "Listen to the speaker talking on the radio. What is she talking about?",
    options: ["Her journey to work", "Her first day at work", "Her holiday plans"],
    correctAnswer: "Her journey to work",
    transcript: "\"Good morning listeners, and welcome back to the radio show. Today, I want to talk about how relocating to a new neighborhood has completely transformed my morning commute. I used to have a standard daily routine where I could just walk to my old building in five minutes. Now, my daily journey to work involves navigating through heavy road traffic on a crowded bus, followed by a frantic rush to catch a connecting train. It is easily the most stressful part of my day now.\""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_38s%20(audio-joiner.com).mp3",
    question: "Listen to the conversation about the directions. Where is the library located?",
    options: ["On the left of the square", "Opposite the square", "Behind the museum"],
    correctAnswer: "On the left of the square",
    transcript: "Man: Excuse me, I’m trying to find the public library. Am I heading in the right direction? \nWoman: Yes, you are very close. Just walk past this street and you will enter the central town square. \nMan: Okay, I see it. Is the library that modern building tucked away in the far corner? \nWoman: No, that’s the post office. If you look to the right of the square, you’ll see the historical museum. The library is directly opposite that museum, standing right on the left of the square. \nMan: Ah, I see it now. Thank you so much!"
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_37s%20(audio-joiner.com).mp3",
    question: "The woman is calling a friend about meeting for dinner. How long does it take to get to the station?",
    options: ["40 minutes", "30 minutes", "50 minutes"],
    correctAnswer: "40 minutes",
    transcript: "Man: Hi Helen, are we still meeting up for dinner outside the train station at 6 PM? \nWoman: Yes, but I\'m checking the navigation map right now, and the traffic looks quite heavy. Normally, the bus ride from my house takes about twenty or thirty minutes. \nMan: Oh dear, is it going to take much longer tonight? \nWoman: Yes, according to the live traffic update, the delay adds another ten minutes to the trip. So it\'s going to take me exactly forty minutes to get to the station. I might be just a few minutes late!"
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q76.mp3",
    question: "What is this man going to do?",
    options: ["Eat something", "Make dinner", "Buy a snack"],
    correctAnswer: "Eat something",
    transcript: "\"I’ve had a remarkably busy morning running errands all over town. I had to stop by the mall to go shopping for a new winter jacket, and right after that, I spent twenty minutes on the line trying to make a phone call to my bank to sort out a card issue. Now that all of those tasks are finally out of the way, my stomach is completely empty. I\'m going to pull over at the next diner I see to grab a quick bite to eat before heading back to the office. \""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q1%20(3).mp3",
    question: "What time does the party start?",
    options: ["Three o\'clock", "Two o\'clock", "Half past three"],
    correctAnswer: "Three o\'clock",
    transcript: "\"Hi everyone, I just wanted to update you on the schedule for the company anniversary celebration this afternoon. The catering staff will arrive at two o\'clock to set up the buffet tables, and our guest speaker isn\'t scheduled to arrive until half past three. However, the main doors will open and the party itself will officially start at exactly three o\'clock, so please ensure you are in the main hall by then.\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q67.mp3",
    question: "Where is she taking the staff to?",
    options: ["To a different country", "To the city center", "To the company\'s new office"],
    correctAnswer: "To a different country",
    transcript: "\"As the regional manager, I usually organize our annual team-building event at the company headquarters downtown, or sometimes we just take a short weekend trip to a nearby city. This year, however, the team exceeded their sales targets by forty percent. To celebrate this massive achievement, I am taking all the staff across the border to a luxury resort in a different country for a four-day vacation.\""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q3%20(3).mp3",
    question: "Which bus stop number is near the boy\'s house?",
    options: ["Eight", "Six", "Ten"],
    correctAnswer: "Eight",
    transcript: "\"If you are taking the public transit to visit my new apartment, make sure you board the line 6 express bus from the central station. The bus will pass by a large shopping mall near stop number ten, and then it will stop right outside the public library at stop number six. You need to stay on for one more stop and get off at stop number eight, which is located right at the corner of my street.\""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q69.mp3",
    question: "Why can\'t he do that job today?",
    options: ["He has another appointment", "He doesn\'t feel well", "He has to finish another project"],
    correctAnswer: "He has another appointment",
    transcript: "\"Hi Sarah, regarding the kitchen repair job you requested, I\'m afraid I won\'t be able to come over to fix it this afternoon. I\'m feeling completely fine and healthy today, and I’ve actually already completed the plumbing project that kept me busy all week. However, I have a mandatory meeting scheduled with my accountant at the bank today, so this prior appointment means I’ll have to reschedule your repair for tomorrow morning. \""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q5%20(3).mp3",
    question: "Which room will the director\'s presentation be in?",
    options: ["The meeting room", "The training room", "The conference hall"],
    correctAnswer: "The meeting room",
    transcript: "\"Good morning, team. Please note that the schedule for today\'s corporate events has been slightly adjusted. The onboarding session for the new interns will remain in the training room on the first floor, and the afternoon budget review has been moved to the large conference hall. As for the director\'s annual presentation, that will take place in the standard meeting room down the hall at 10 AM sharp.\""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q71.mp3",
    question: "How much money is left in the kitchen?",
    options: ["10 pounds", "5 pounds", "15 pounds"],
    correctAnswer: "10 pounds",
    transcript: "\"Before I left the house this morning, I counted thirty pounds in cash sitting on the dining table. I took fifteen pounds with me to buy some groceries down the road, and I instructed my son to take another five pounds to pay for his bus fare to school. Therefore, if you check the small jar on the kitchen counter right now, you should find exactly ten pounds left inside. \""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q7%20(3).mp3",
    question: "What is the new medical center next to?",
    options: ["Train station", "The shopping mall", "The post office"],
    correctAnswer: "Train station",
    transcript: "\"The city council has recently approved the construction of a modern healthcare facility to serve our growing local community. Many residents initially microfilm expected the facility to be built inside the commercial zone next to the grand shopping mall, while others petitioned to place it near the public park. In the end, the developers chose a vacant lot right adjacent to the central train station, ensuring it is easily accessible for commuters.\""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q73.mp3",
    question: "What time do they arrange the meeting?",
    options: ["5:30", "5:00", "6:00"],
    correctAnswer: "5:30",
    transcript: "\"Hi everyone, I’m calling to update you on our project discussion scheduled for this evening. Our manager initially wanted us to gather in the main office at 5:00 p.m. sharp, but a few team members mentioned they couldn\'t finish their reports by then. We also considered pushing it back to 6:00 p.m., but that would mean staying too late after office hours. Therefore, we have decided to split the difference and lock in the meeting for half past five instead. See you all there!\""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q9%20(3).mp3",
    question: "Which floor is the French class on?",
    options: ["On the second floor", "On the first floor", "On the third floor"],
    correctAnswer: "On the second floor",
    transcript: "\"Welcome to the language department building. If you are looking for the beginner Spanish seminar, please note that it has been moved down to the laboratory on the first floor. The advanced German lecture is currently being held at the top of the building on the third floor. For all students registered for the intermediate French course, your classroom is located right in the middle, on the second floor, just opposite the elevators.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q75.mp3",
    question: "The man has a new job. How many days does he have to work?",
    options: ["Three days", "Four days", "Five days"],
    correctAnswer: "Three days",
    transcript: "\"My new shift pattern at the logistics center is quite different from my previous corporate job. I used to work a standard routine of six days a week, which left me with almost no personal time at all. My manager recently offered me a standard four-day schedule, but I opted for the compressed hours program instead. Now, I only have to commute to the facility three days a week, performing longer shifts but enjoying a four-day weekend. \""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q11%20(3).mp3",
    question: "What is this man going to do?",
    options: ["Eat something", "Buy some food", "Go home"],
    correctAnswer: "Eat something",
    transcript: "\"I’ve had a remarkably busy morning running errands all over town. I had to stop by the mall to go shopping for a new winter jacket, and right after that, I spent twenty minutes on the line trying to make a phone call to my bank to sort out a card issue. Now that all of those tasks are finally out of the way, my stomach is completely empty. I\'m going to pull over at the next diner I see to grab a quick bite to eat before heading back to the office.\""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_28s%20(audio-joiner.com).mp3",
    question: "What time is dinner?",
    options: ["7:30 p.m.", "7:00 p.m.", "8:00 p.m."],
    correctAnswer: "7:30 p.m.",
    transcript: "Man: Hi Rose, what time should we gather at the restaurant for dinner tonight? I finish my shift at ten to seven, so I can make it there by ten to eight. \nWoman: That\'s a bit late since the kitchen closes early. How about we split the difference and aim for half past seven instead? \nMan: That works perfectly. It gives me just enough time to head home first and change. Let\'s lock it in for 7:30 p.m. then. \nWoman: Great, see you there!"
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q13%20(3).mp3",
    question: "How much does a bus card cost?",
    options: ["$20", "$15", "$25"],
    correctAnswer: "$20",
    transcript: "\"Welcome to the city transit customer service desk. If you are looking to purchase standard single-trip tickets, they are currently ten dollars each. We also offer a weekly tourist pass for fifteen dollars which is valid on local routes only. However, if you want the best value for your daily commute, I highly recommend our premium monthly transit card. It costs exactly twenty dollars and gives you unlimited access to both buses and trains across all zones.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-q1.mp3",
    question: "What does her sister drink?",
    options: ["Tea", "Water", "Coffee"],
    correctAnswer: "Tea",
    transcript: "\"My sister and I stopped by a local café yesterday afternoon to relax after our classes. I was feeling quite tired, so I ordered a large iced espresso with fresh milk to help me stay awake. My sister initially looked at the menu wanting a hot chocolate, but she decided to cut down on sugar this week. In the end, she asked the barista for a hot pot of herbal tea to sip while we chatted.\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q2.mp3",
    question: "What is the population of this village?",
    options: ["10.000", "40.000", "20.000"],
    correctAnswer: "10.000",
    transcript: "\"Welcome to our beautiful countryside area! Many people are surprised to learn that a decade ago, this place was just a tiny settlement with only 5,000 residents. Over the last few years, however, many families have moved here from the big cities to enjoy a quieter lifestyle. While we haven\'t grown as large as the neighboring town with its 15,000 people, our community has certainly expanded. According to the latest official census released last month, the total population of this village is now right at 10,000 residents!\""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q3.mp3",
    question: "Where does he want to go tomorrow?",
    options: ["The town hall", "The cinema", "The park"],
    correctAnswer: "The town hall",
    transcript: "\"I have a very busy schedule mapped out for my day off tomorrow. I originally planned to spend the morning reading at the central library, and I also needed to drop off a few packages at the main post office. However, I just received a notification regarding my residency registration documents. So, my main priority tomorrow is to head straight to the town hall to submit my application forms before noon.\""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q4.mp3",
    question: "What floor is the office on?",
    options: ["On the first floor", "On the second floor", "On the third floor"],
    correctAnswer: "On the first floor",
    transcript: "\"Excuse me, if you\'re looking for the translation department office today, please note that the directory sign in the lobby hasn\'t been updated since the recent building renovation. They actually moved out of their old location on the second floor last week. They didn\'t move all the way down to the reception area on the ground floor either—they are just one level up. You will find the office right on the first floor, right next to the main elevators!\""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q5.mp3",
    question: "Cost of bus",
    options: ["2.5", "5.5", "3.5"],
    correctAnswer: "2.5",
    transcript: "\"If you are planning to travel around the city center today, public transit is by far the most affordable option. Express subway trains charge a flat rate of three pounds fifty per trip, while short taxi rides usually start around ten pounds. However, if you take the local commuter transit, the cost of bus travel is just two pounds fifty for a single journey anywhere within the central zone.\""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q6.mp3",
    question: "When can they play football at school?",
    options: ["Wednesday afternoon", "Thursday afternoon", "Sunday afternoon"],
    correctAnswer: "Wednesday afternoon",
    transcript: "\"Hi everyone, here is a quick notice regarding the schedule for playing football on the school sports field! Many students have asked if the pitch is open for recreational games on Monday morning, but the groundskeeper uses that time for routine maintenance on the grass. On Friday evening, the stadium is strictly reserved for the official track team practice. However, regular students are welcome to organize friendly matches during the designated open slot on Wednesday afternoon, right after secondary classes finish!\""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q7.mp3",
    question: "Where is the office?",
    options: ["Opposite the hotel", "Opposite the park", "Opposite the hospital"],
    correctAnswer: "Opposite the hotel",
    transcript: "\"If you are coming to submit your research project documents at our regional administrative center today, here are the exact directions. Our building is located on the main boulevard downtown. You will pass the grand commercial bank on your right, but do not turn into the shopping mall nearby. Our main office is located directly opposite the hotel, right across the street with large glass entrance doors.\""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q8.mp3",
    question: "A man is calling his wife. Where did they meet?",
    options: ["Outside a shop", "At a café", "In a park"],
    correctAnswer: "Outside a shop",
    transcript: "Man: Hi honey, I’ve arrived downtown to pick up the groceries. Where are you standing right now? \nWoman: I was waiting inside the train station, but it was far too noisy and crowded with commuters. \nMan: Did you go sit at the coffee shop across the road then? \nWoman: No, it was completely full. I walked down the street a bit and I’m standing right outside a shop selling cameras. You can park right in front of it."
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q9.mp3",
    question: "What time does he have dinner these days?",
    options: ["7 o\'clock", "6 o\'clock", "1 o\'clock"],
    correctAnswer: "7 o\'clock",
    transcript: "\"My daily evening routine has changed quite a bit recently due to my new work schedule. I used to eat very early at 6 o\'clock right after leaving the office, and during the winter, I often delayed meals until 8 o\'clock. However, my doctor advised me to keep a consistent eating schedule for better digestion. These days, I make sure to sit down at the table and have dinner at exactly 7 o\'clock every single night.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q10.mp3",
    question: "What does he do after work?",
    options: ["Play football", "Play badminton", "Play volleyball"],
    correctAnswer: "Play football",
    transcript: "\"After sitting at my computer all day at the office, I always need to get some active exercise to unwind once my shift finishes. Some of my colleagues asked if I wanted to go to the cinema, but I had to pass. While I often enjoy going for a run around the neighborhood park or heading to the local gym, today is a bit different. I joined a community sports league this season, so I play football with my teammates every Tuesday evening right after work!\""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q11.mp3",
    question: "What did they both like about the movie?",
    options: ["The ending", "The actor", "The theme song"],
    correctAnswer: "The ending",
    transcript: "Man: What were your overall thoughts on that new sci-fi film we watched last night? I found the soundtrack a bit too loud, to be honest. \nWoman: Yeah, the music was overwhelming, and I thought the visual effects looked a bit cheap in some scenes. \nMan: I agree. But that final plot twist in the last ten minutes was absolutely brilliant! I didn\'t see it coming at all. \nWoman: Same here! The ending was definitely the best part for both of us—it saved the entire film."
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q12.mp3",
    question: "What area is he describing?",
    options: ["A university area", "A mall", "A sport hall"],
    correctAnswer: "A university area",
    transcript: "\"As you walk down this main avenue, you will immediately notice the energetic atmosphere surrounding the neighborhood. The streets are lined with affordable bookshops, lively student cafés, and modern lecture halls. Every morning, thousands of young adults and academic professors fill the sidewalks heading toward the central library and research centers. It is clearly defined as a vibrant university area.\""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q13.mp3",
    question: "A man wants to buy a new house. What is his biggest problem?",
    options: ["Persuading his family", "Finding enough money", "Choosing the right location"],
    correctAnswer: "Persuading his family",
    transcript: "\"I’ve been planning to relocate to a new house in the suburbs for months now. I’ve already secured enough savings, so getting a bank mortgage isn\'t an issue at all, and I’ve already found a fantastic property in a great location near a public park. However, my biggest problem right now is persuading my family. My wife and children are deeply attached to our current neighborhood, so convincing them to pack up and move is proving to be extremely difficult.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q1.mp3",
    question: "What was his last job?",
    options: ["An electrician", "A teacher", "A doctor"],
    correctAnswer: "An electrician",
    transcript: "\"Looking back at my career history, I’ve worked in several technical trades over the years. I started out as a plumber fixing commercial heating systems, and later I spent a few years working as an auto mechanic at a busy garage downtown. However, right before I decided to retire and move to the countryside, my final position was working as an electrician for a major construction company, managing complex wiring installations.\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011-%20q2.mp3",
    question: "What did she lose?",
    options: ["A bag", "A hat", "A coat"],
    correctAnswer: "A bag",
    transcript: "\"I just got back from checking the train station lost and found office, but unfortunately, I haven\'t had any luck yet. When I got off the train, I was so relieved that I was holding both my winter jacket and my wallet securely in my hands. However, I realized too late that I had left something behind on the overhead rack. I completely forgot my leather shoulder bag, which has all my university notebooks inside, so I really hope someone turns it in soon!\""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-q3.mp3",
    question: "Who is his favourite teacher?",
    options: ["Miss Brown", "Miss Andy", "Mr Brown"],
    correctAnswer: "Miss Brown",
    transcript: "\"We had some wonderful educators during our secondary school years. Everyone loved Mr. Davis because his science experiments were always fun, and Mrs. Taylor was always very gentle during our literature lectures. However, if you ask me who had the greatest impact on my academic journey, Miss Brown was definitely my absolute favourite teacher. She was so passionate about teaching history that she made every single lesson feel like an exciting story.\""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q4.mp3",
    question: "Why does the woman return the dress?",
    options: ["Because of its size", "Because of its color", "Because it was damaged"],
    correctAnswer: "Because of its size",
    transcript: "\"Hello! I bought this formal evening gown here yesterday, but I need to return it today for a refund. To be clear, there are no flaws with the fabric, there is no stain on it, and the color is absolutely beautiful. However, when I tried it on after getting home, it was far too tight around the waist. Since the store doesn\'t have a larger option in stock for me to exchange, I am returning it simply because of its size.\""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q5.mp3",
    question: "What is his opinion about that restaurant?",
    options: ["The service is slow", "He finds it too expensive", "He doesn’t like the food there"],
    correctAnswer: "The service is slow",
    transcript: "\"My friends and I went to try that new dining spot near the harbor last night. The atmosphere was quite vibrant, the prices were surprisingly reasonable, and the food itself was hot and delicious. However, our main complaint was about the staff efficiency. We had to wait over forty-five minutes just to get our appetizers, and another hour for the main course. Overall, my main opinion about that restaurant is that the service is slow.\""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q6.mp3",
    question: "Where are the students now?",
    options: ["In a townhouse", "Library", "Sport hall"],
    correctAnswer: "In a townhouse",
    transcript: "\"Hi everyone, I\'m just calling to give you an update on where our study group is meeting today to prepare for the presentation! We initially planned to gather in the school library, but it was completely full, and we couldn\'t meet in the public park either because it started raining outside. Luckily, Huy invited us over to his place instead. So right now, we are all sitting and working together in the living room of a townhouse right down the street from the campus. Come on over and join us!\""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q7.mp3",
    question: "When will Anna meet her friend?",
    options: ["9 a.m. on Sunday", "9 a.m. on Saturday", "9 a.m. on Monday"],
    correctAnswer: "9 a.m. on Sunday",
    transcript: "\"Hi everyone, I\'m leaving a quick message for Anna regarding our weekend catch-up. We initially thought about getting together at 9 a.m. on Saturday, but she mentioned she had morning lectures. We also considered pushing it to 10 a.m. on Sunday, but the cafe gets extremely crowded by mid-morning. Therefore, we’ve agreed that Anna will meet her friend at 9 a.m. on Sunday right outside the central subway station instead.\""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q8.mp3",
    question: "Which button should the man press to buy a new computer?",
    options: ["Three", "Two", "Six"],
    correctAnswer: "Three",
    transcript: "\"Hello and thank you for calling the Tech Direct customer service helpline! If you have questions regarding our desktop repair services, please press One. To check the current delivery status of an existing order, press Two. Finally, if you would like to browse our store catalog and speak directly with a sales advisor to buy a new computer, please press Three.\""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q9.mp3",
    question: "How many pages of the assignment?",
    options: ["4", "5", "8"],
    correctAnswer: "4",
    transcript: "\"Attention language students, please take note of the formatting requirements for your upcoming mid-term paper. Last year, students submitted long essays of six pages, which was a bit excessive. Some of you asked if a short summary of two pages would be acceptable, but that won\'t cover all the necessary methodology. To keep it concise yet thorough, the syllabus states that the final draft of the assignment must be exactly 4 pages long.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q10.mp3",
    question: "What is his opinion about sea transport?",
    options: ["The use of technology will increase", "It is slow but reliable", "It is environmentally friendly"],
    correctAnswer: "The use of technology will increase",
    transcript: "\"Many people wonder if international shipping and sea transport will slowly decline as air freight becomes more popular, or if shipping costs will become much higher in the future. In my view, maritime trade remains the backbone of global commerce, but it is undergoing a massive transformation. As autonomous navigation, smart logistics, and automated ports continue to expand, my strong belief is that the use of technology will increase dramatically across the entire industry to boost efficiency.\""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q11.mp3",
    question: "What is not working?",
    options: ["The computer", "TV", "The mouse"],
    correctAnswer: "The computer",
    transcript: "\"I arrived at the office early this morning to finalize my research abstract before the morning deadline. The main lights turned on fine, and the wireless printer printed out my documents with no issues at all. However, when I sat down at my desk and hit the power switch on my workstation, the screen stayed completely black. I tried plugging it into different sockets, but it\'s clear that the computer is not working at all today.\""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q12.mp3",
    question: "What did he leave in the yard?",
    options: ["Shoes", "Hat", "Coat"],
    correctAnswer: "Shoes",
    transcript: "\"When the rain started pouring down this afternoon, I rushed inside the house as fast as I could! I hung my wet coat on the rack in the hallway, and I dropped my school bag right onto the sofa in the living room. I thought I had brought everything inside with me, but then I looked out the back window onto the grass. Oh no! I completely forgot my muddy trainers outside. I left those shoes right in the middle of the yard!\""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q13.mp3",
    question: "What did the two people buy?",
    options: ["Trousers", "Computer", "Shirt"],
    correctAnswer: "Trousers",
    transcript: "\"My brother and I went shopping at the menswear store downtown this morning to refresh our wardrobe for work. We spent a lot of time looking at casual linen shirts, and I tried on a few denim jackets, but we didn\'t end up getting those. Since both of us needed formal attire for our new corporate jobs, we decided to take advantage of a \'buy one, get one half-off\' promotion and we both bought matching formal trousers instead.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q1.mp3",
    question: "Why did he call his friend?",
    options: ["Suggest a drink", "Suggest a food", "Suggest a shirt"],
    correctAnswer: "Suggest a drink",
    transcript: "\"Hi Clara, it\'s me! I\'m just calling to see if you\'re free after your French class this evening. I\'ve already eaten dinner, so I wasn\'t calling to grab a full meal or invite you to a big party, but I was thinking we could head downtown to relax for a bit. I wanted to call and suggest a drink at that new rooftop café near the train station. I heard their fruit juices and mocktails are fantastic, and it would be a lovely way to unwind together after class!\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q2.mp3",
    question: "When did they decide to meet?",
    options: ["9am on Sunday", "10am on Sunday", "9am on Saturday"],
    correctAnswer: "9am on Sunday",
    transcript: "\"Hi Everyone, I\'m just calling to finalize our weekend jogging group plans. We initially thought about getting together at 9 a.m. on Saturday, but a few members mentioned they had morning chores and fitness classes. We also considered pushing it to 10 a.m. on Sunday, but the sun gets a bit too hot by then. Therefore, we’ve locked in our schedule for 9 a.m. on Sunday morning at the park entrance instead. See you all there!\""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-q3.mp3",
    question: "A girl is calling her mother. Which dress does she want?",
    options: ["Long and red", "Long and black", "Short and red"],
    correctAnswer: "Long and red",
    transcript: "Daughter: Hi Mum, I’m at the boutique right now trying on outfits for the university gala next week. Could you help me decide? \nMother: Sure, dear. Did you find that short blue dress you were looking at online? \nDaughter: I tried it on, but the color looked a bit washed out on me. I also tried a short red one, but it felt a bit too casual for a formal evening. \nMother: So which one stood out to you? \nDaughter: There’s a gorgeous long and red gown on the display rack. It fits perfectly and looks very elegant, so that\'s the one I definitely want!\nDaughter: Hi Mum, I’m at the boutique right now trying on outfits for the university gala next week. Could you help me decide? \nMother: Sure, dear. Did you find that short blue dress you were looking at online? \nDaughter: I tried it on, but the color looked a bit washed out on me. I also tried a short red one, but it felt a bit too casual for a formal evening. \nMother: So which one stood out to you? \nDaughter: There’s a gorgeous long and red gown on the display rack. It fits perfectly and looks very elegant, so that\'s the one I definitely want!"
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q4.mp3",
    question: "What day is the new appointment?",
    options: ["Thursday 13th", "Friday 13th", "Thursday 15th"],
    correctAnswer: "Thursday 13th",
    transcript: "\"Good morning, this is the reception desk at the Central Health Clinic calling for Mr. Nguyen. We are calling regarding your dental check-up originally scheduled for Tuesday the 11th. Unfortunately, the dentist has an emergency conference on Wednesday the 12th, so we need to reschedule your visit. We have opened a new slot for you on Thursday 13th at 2:00 p.m. Please call us back if this date works for you.\""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q5.mp3",
    question: "A man is calling his wife. Where did they meet?",
    options: ["Outside a shop", "Outside an office", "At home"],
    correctAnswer: "Outside a shop",
    transcript: "Man: Hi honey, I’ve arrived downtown to pick up the groceries. Where are you standing right now? \nWoman: I was waiting inside the train station, but it was far too noisy and crowded with commuters. \nMan: Did you go sit at the coffee shop across the road then? \nWoman: No, it was completely full. I walked down the street a bit and I’m standing right outside a shop selling cameras. You can park right in front of it."
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q6.mp3",
    question: "What did she do last weekend?",
    options: ["Stayed at home", "Watched a movie", "Went out with her friends"],
    correctAnswer: "Stayed at home",
    transcript: "\"Most of my classmates spent their weekend driving down to the coast to swim at the beach, and a few went to the countryside to visit their relatives. I was initially planning to join a photography trip around the city, but I started feeling quite exhausted from my university exams. In the end, I cancelled my plans and stayed at home all weekend, reading nutrition books and catching up on my sleep.\""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q7.mp3",
    question: "How many weeks have they been in India?",
    options: ["2 weeks", "3 weeks", "1 weeks"],
    correctAnswer: "2 weeks",
    transcript: "\"We just got back yesterday from an incredible holiday trip across South Asia, and it was truly an unforgettable experience! When we first planned the journey, we originally booked a short one-week tour to visit the historic monuments. However, once we arrived, we fell so deeply in love with the local culture, food, and landscapes that we decided to extend our itinerary. By the time we flew back home, we had spent exactly 2 weeks exploring different regions of India!\""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/TTSOL-en-US-Brian-20260727-181123.mp3",
    question: "Where is the office?",
    options: ["Opposite the hotel", "Next the hotel", "Opposite the mall"],
    correctAnswer: "Opposite the hotel",
    transcript: "\"If you are coming to drop off your research abstract documents at our translation company today, here are quick directions. Our building is located on the main boulevard downtown. You will pass the grand commercial bank on your right, but do not turn into the shopping mall nearby. Our main office is located directly opposite the hotel, right across the central street with the large glass doors.\""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q9.mp3",
    question: "Where do they wait for the bus?",
    options: ["By the hotel’s main entrance", "Near the school", "Outside the station"],
    correctAnswer: "By the hotel’s main entrance",
    transcript: "\"Hi everyone, I’m leaving a quick update regarding the tourist shuttle for our city tour this morning. If you were taking the public commuter buses, you would need to walk two blocks down to the central bus station or wait in front of the museum. However, since we are staying here as a group, it is much more convenient for us. The driver will pull up right by the hotel’s main entrance, so please make sure you are waiting outside the front glass doors when the bus arrives.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q10.mp3",
    question: "What does his wife like to do?",
    options: ["Photography", "Cooking", "Gardening"],
    correctAnswer: "Photography",
    transcript: "\"My wife and I have different ways to relax during our weekend leisure time. While I prefer active exercise like jogging around the local lake or doing gymnastics at the gym, her creative passion lies elsewhere. She doesn\'t spend much time cooking complicated dishes either. Instead, whenever we travel or go for walks in scenic parks, she always brings her camera along because photography is what she truly loves to do.\""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q11.mp3",
    question: "What outdoor activities do they do in the afternoon?",
    options: ["Play golf", "Play football", "Play chess"],
    correctAnswer: "Play golf",
    transcript: "\"Welcome to our weekend sports resort! I wanted to give everyone a quick breakdown of our group schedule for today. In the morning, while the weather is nice and cool, we have reserved the outdoor court so everyone can play tennis together. After lunch, instead of taking a swim at the pool, we will move out to the green fairways for our main feature. We’ve organized a friendly tournament where everyone will play golf while enjoying the afternoon sunshine!\""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q12.mp3",
    question: "A woman is introducing a concert. The concert will end with?",
    options: ["The city’s favorite group", "A special guest appearance", "A fireworks display"],
    correctAnswer: "The city’s favorite group",
    transcript: "\"Good evening, music lovers, and welcome to the annual summer charity festival. We have a fantastic lineup prepared for you tonight. We will open the show with a short speech by the event organizer, followed immediately by a classical solo violin performance on the main stage. Finally, to close out this memorable night on a high note, the concert will end with an energetic performance from the city’s favorite group.\""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q13.mp3",
    question: "What was the writer\'s first job?",
    options: ["Teacher", "Writer", "Doctor"],
    correctAnswer: "Teacher",
    transcript: "\"Many readers who look up my biography online notice that I spent five years working as a newspaper journalist before publishing my bestselling novels, and that I also worked briefly as a university librarian later on. Because of that, people often assume that journalism was my very first profession after graduating. However, that wasn\'t the case! Right after leaving university, my very first career was actually working as a teacher, which gave me so many great experiences before I eventually transitioned into writing full-time.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q1.mp3",
    question: "How does he feel?",
    options: ["Sick", "Happy", "Funny"],
    correctAnswer: "Sick",
    transcript: "\"I was really looking forward to joining my university friends for a gym workout and a jog around the neighborhood this afternoon, and I felt so excited about it yesterday. However, I woke up with a terrible fever and a severe headache today. It’s a huge shame because I don\'t just feel tired from studying late; I actually feel quite sick, so I’ll have to stay in bed and miss the session entirely.\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q2.mp3",
    question: "How long does it take to get to the station?",
    options: ["20 minutes", "30 minutes", "70 minutes"],
    correctAnswer: "20 minutes",
    transcript: "\"Hi everyone, I\'m just leaving a quick message to confirm our meeting outside the train station at 6 PM. I was checking the navigation map earlier, and traffic on the main roads looks quite heavy tonight. Normally, if I take the local bus from my house, the journey takes about thirty or forty minutes. Fortunately, I’ve decided to take the new subway line instead, which bypasses all the traffic. It\'s going to take me exactly 20 minutes to get to the station, so I\'ll be there right on time!\""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q3.mp3",
    question: "What did he call to say?",
    options: ["To say thank you", "To say goodbye", "To say apologize"],
    correctAnswer: "To say thank you",
    transcript: "\"Hi Anna, it\'s David. I\'m just leaving a quick voicemail because your line was busy. I already know the way to the French department\'s new building, so I didn\'t call to ask for directions, and our meeting for tomorrow is still on. I just wanted to call to say thank you for helping me proofread my scientific research abstract yesterday. Your feedback was incredibly useful, and I really appreciate your time!\""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q4.mp3",
    question: "Who is coming to visit him this weekend?",
    options: ["His sister and her children", "His friends", "His parents"],
    correctAnswer: "His sister and her children",
    transcript: "\"I\'m really looking forward to the upcoming weekend! Most of my university friends are busy studying for their mid-term exams, so we couldn\'t organize a dinner together. I initially thought my parents were driving down from our hometown, but they had to change their travel schedule at the last minute. Fortunately, I won\'t be spending the weekend alone at all. My sister and her children are catching the morning train to come to the city, and I\'m planning to take my niece and nephew to the public park on Saturday!\""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q5.mp3",
    question: "What time is the meeting?",
    options: ["2pm", "3pm", "1pm"],
    correctAnswer: "2pm",
    transcript: "\"Good afternoon, team. Please note a quick adjustment to our schedule for the afternoon corporate presentations. The marketing team initially requested to gather at one o\'clock, and the notice on the board says we might push it to three o\'clock. To clarify, the director has a flight later, so we have locked in the meeting for exactly 2 p.m. sharp. Please ensure you are in the conference hall by then.\""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q6.mp3",
    question: "Why can\'t she pick up her child?",
    options: ["Stay late at the office", "Her car has broken down", "She is stuck in a meeting"],
    correctAnswer: "Stay late at the office",
    transcript: "\"Hi honey, I\'m leaving a quick message because I need a massive favor this afternoon. My car is running completely fine today, and I\'ve already finished my doctor\'s appointment earlier this morning. However, my manager just handed me an urgent project report that has to be submitted before midnight. Because of this, I have to stay late at the office to wrap everything up, so I won\'t be able to collect our daughter from school. Could you please go pick her up for me?\""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-q7.mp3",
    question: "How much do the cleaning products cost?",
    options: ["One pound fifty", "One pound sixty", "Two pound fifty"],
    correctAnswer: "One pound fifty",
    transcript: "\"Welcome to the local supermarket bargain aisle. Today, we have special discounts on various household goods. Our lavender air fresheners are priced at two pounds fifty, and the large bottles of laundry detergent are on sale for three pounds fifty. If you look right here on the lower shelf, our eco-friendly cleaning products cost exactly one pound fifty this week, which is an excellent price for stocking up.\""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q8.mp3",
    question: "Where is she going with her family?",
    options: ["The mountains", "The waterfall", "The museum"],
    correctAnswer: "The mountains",
    transcript: "\"My family and I have been discussing our upcoming summer holiday plans for weeks. We initially considered going down to the seaside because the weather is perfect for the beach, and my brother was really keen to tour a historic city to see the ancient architecture. However, my mother prefers a much quieter environment where we can relax closer to nature. In the end, we decided to book a stay up in the Mountains instead, renting a beautiful wooden cabin where we can spend the whole week hiking and enjoying the fresh air.\""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209-%20q9.mp3",
    question: "What did he usually do last year?",
    options: ["Cycling", "Hiking", "Biking"],
    correctAnswer: "Cycling",
    transcript: "\"My fitness routine has evolved quite a bit over the last few years. Nowadays, I spend most of my free time doing gymnastics at the sports club or jogging around the lake to improve my stamina. However, my routine was quite different last year. I used to be obsessed with long-distance road trips on my bicycle, so cycling was what I usually did every single weekend last year to stay active.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q10.mp3",
    question: "How many minutes did he have to speak?",
    options: ["15", "20", "25"],
    correctAnswer: "15",
    transcript: "\"My scientific research presentation at the university conference went really well yesterday, though the schedule was extremely tight with so many speakers. The organizers initially told us we would only get ten minutes each, which was barely enough time to explain my research methodology and findings. Fortunately, a few delegates canceled at the last minute, so the chairperson adjusted the timetable and allowed me exactly 15 minutes on stage to deliver my talk!\""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q11.mp3",
    question: "Who does she live with?",
    options: ["Best friends", "Her family", "Boy friend"],
    correctAnswer: "Best friends",
    transcript: "\"When I first relocated to Ho Chi Minh City to start my university degree, I briefly stayed with my relatives and family in District 3, and I also considered renting a tiny studio apartment to live alone. In the end, I decided that sharing expenses would be much better. I moved into a spacious flat near the campus, and now I live with my best friends from the French department. We get along perfectly and always cook dinner together.\""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q12.mp3",
    question: "Why does she want to be a writer?",
    options: ["Help people", "To earn a living", "To express her ideas"],
    correctAnswer: "Help people",
    transcript: "\"I\'ve been spending a lot of time drafting short stories, essays, and articles lately, and people often ask what my ultimate career goal is. Becoming a famous author to earn a lot of money isn\'t my motivation at all, and I don\'t particularly care about traveling the world for book signings either. The main driving force behind my creative writing is much simpler: I want to write books on nutrition and mental well-being that can offer practical advice and help people improve their daily lives. Knowing that my words can make a positive difference for others is all that truly matters to me.\""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q13.mp3",
    question: "Why was the flight canceled?",
    options: ["Poor weather conditions", "Technical problem", "Not enough passengers"],
    correctAnswer: "Poor weather conditions",
    transcript: "\"Attention all passengers waiting at gate number nine for flight VN250 to Paris. We regret to inform you that this service will not be departing today. The airline crew has already resolved the minor technical difficulties with the aircraft engine, and there are no issues with a pilot strike. However, due to a sudden and severe blizzard causing poor weather conditions at our destination airport, the aviation authority has officially canceled the flight for safety reasons.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q1.mp3",
    question: "Which room will they study in?",
    options: ["Room 301", "Room 303", "Room 302"],
    correctAnswer: "Room 301",
    transcript: "\"Good morning, language students. Please listen carefully to a quick schedule change regarding the intermediate French lecture today. The class was originally scheduled to be held in the basement laboratory in Room 103, and the notice on the board incorrectly states that we are moving to Room 201. To clarify, those rooms are currently occupied, so you will actually study in Room 301 on the third floor instead. Please head up there now so we can begin on time.\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q2.mp3",
    question: "What time is the football match?",
    options: ["1pm", "3pm", "1am"],
    correctAnswer: "1pm",
    transcript: "\"Hi everyone, I’m just calling to confirm our plans for heading to the stadium together today. A few people asked if the football match kicks off at eleven in the morning, but those are just the junior league games. The main championship match was originally set for 3:00 p.m., but the organizers decided to move the schedule up to avoid the evening heat. So, please make sure you are in your seats before 1:00 p.m. because that is when the match officially begins.\""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q3.mp3",
    question: "What is the phone number of the shop?",
    options: ["20 10 30", "20 20 30", "30 20 10"],
    correctAnswer: "20 10 30",
    transcript: "\"Thank you for listening to our local business directory broadcast. If you are looking to contact the new organic grocery market in District 1 to check their stock of fresh spring rolls, please note down their details. Their old service line, which ended in 20, is no longer active. You can reach the front desk directly by dialing twenty, ten, thirty. I repeat, the official hotline for the shop is 20.10.30.\""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q4.mp3",
    question: "What did they bring for the picnic?",
    options: ["Food", "Water", "Clothes"],
    correctAnswer: "Food",
    transcript: "Man: Hey, did you pack the chess set and those board games for our afternoon picnic in the park? \nWoman: No, I thought the weather was too windy to play games outdoors, so I left them on the table. \nMan: Ah, that\'s a shame. Did you at least bring some portable speakers so we can listen to some music? \nWoman: I forgot those too, I\'m afraid! But don\'t worry, I made sure to fill the basket with plenty of delicious sandwiches, fresh fruit, and snacks, so we have more than enough food to enjoy."
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q5.mp3",
    question: "How many copies did he sell?",
    options: ["Over 300000 copies", "300000 copies", "Under 300000 copies"],
    correctAnswer: "Over 300000 copies",
    transcript: "\"When I first published my debut novel about university life, my literary agent told me we would be lucky to clear one hundred thousand copies in the first year. The publisher was slightly more optimistic, setting a target of two hundred thousand. However, the book completely went viral on social media sports magazines and blogs. I am absolutely thrilled to announce that we have officially sold over 300,000 copies worldwide, which is beyond my wildest dreams.\""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/TTSOL-en-US-Aria-20260727-175320.mp3",
    question: "Where did they go last year?",
    options: ["Camping", "Hiking", "Biking"],
    correctAnswer: "Camping",
    transcript: "\"My family and I are currently planning our upcoming summer holiday. We are considering booking a cozy wooden cabin up in the mountains this time because my mother prefers a proper bed, and we\'ve already been to the beach a couple of times in the past. However, our trip last summer was completely different and quite an adventure. We decided to go camping in the national forest, spending a whole week sleeping in tents under the stars, which was a wonderful experience for all of us.\""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q7.mp3",
    question: "What do they plan to do together?",
    options: ["Make plans later", "Do homework", "Go to the museum"],
    correctAnswer: "Make plans later",
    transcript: "Man: Hey Mary, are we still going to the cinema to catch that new French documentary tonight, or should we stay home and cook dinner? \nWoman: Honestly, my university research deadline was just moved up, so I’m completely stressed and don\'t have time for either option right now. \nMan: Oh, I understand completely. Don\'t worry about it. \nWoman: Thanks for understanding. Let’s just focus on our assignments today and make plans later in the week once we are both completely free."
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q8.mp3",
    question: "What does the man drink?",
    options: ["Iced tea", "Water", "Coffee"],
    correctAnswer: "Iced tea",
    transcript: "\"I usually start my morning with a very strong cup of black coffee to help me wake up before heading to the office. When I feel stressed in the afternoon, I sometimes switch to hot herbal tea to soothe my throat. However, today the summer weather in the city is incredibly hot and humid, so I need something refreshing. I’ve just ordered a large glass of sweetened iced tea with lemon, and it’s perfect for cooling down.\""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q9.mp3",
    question: "Who did she take the picture of?",
    options: ["The girl\'s team", "Children", "Family"],
    correctAnswer: "The girl\'s team",
    transcript: "\"I brought my professional camera down to the sports complex this morning to cover the events. I initially planned to take photos of the boy\'s football team during their match, but my sports magazine editor asked me to focus on the regional gymnastics tournament instead. Rather than focusing on individual routines, I spent most of the session capturing the synchronized group performances. In the end, I managed to take some incredible photos of the girl’s team celebration right after they won the gold medal!\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208-%20q10.mp3",
    question: "Where do they go when they travel to India?",
    options: ["Go to the park", "Food", "People"],
    correctAnswer: "Go to the park",
    transcript: "\"When international tourists book holiday packages to India, most travel guides recommend spending a week relaxing by the sunny beaches in the south, or exploring the massive modern shopping malls in New Delhi. However, if you want a truly authentic and peaceful experience, you should do what the locals do. Whenever my family travels there, we always make sure to go to the park reserves to view the historic monuments and native wildlife in the early mornings.\""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q11.mp3",
    question: "What is the weather like today?",
    options: ["Cold and wet", "Cloudy", "Sunny"],
    correctAnswer: "Cold and wet",
    transcript: "\"Good morning listeners, and welcome to your local morning weather update. If you were hoping for a bright and sunny sky like we experienced yesterday, I\'m afraid you will be disappointed. A heavy low-pressure system has moved in over the city, replacing the warm and windy conditions. You will absolutely need your heavy coats and umbrellas before stepping outside today because it is going to stay cold and wet until midnight.\""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q12.mp3",
    question: "How did he adjust the meeting?",
    options: ["Having the meeting without him", "Changing the time", "Moving it online"],
    correctAnswer: "Having the meeting without him",
    transcript: "\"Hi everyone, I\'m calling to leave an urgent message regarding our budget presentation scheduled for this afternoon. My car completely broke down on the highway, and the mechanic says it will take hours to fix, so I won\'t be able to make it back to the office today. Since our project deadline is far too tight, I don\'t want us to postpone the session to tomorrow or try moving it to an online video platform. Instead, please adjust the plan by having the meeting without him. The vice manager has all my presentation notes and can lead the discussion smoothly.\""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q13.mp3",
    question: "Which door do they need to take to get to Edinburgh?",
    options: ["Two", "One", "Four"],
    correctAnswer: "Two",
    transcript: "\"Attention all passengers traveling on the northern railway lines. The morning commuter service to London will be boarding through the gates at Door One, and the delayed holiday express to Wales is now open at Door Three. For all travelers holding tickets for the express rail heading directly to Edinburgh, please proceed immediately to the central platform and pass through Door Two to board the train.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q1.mp3",
    question: "Where does she walk every night?",
    options: ["The college", "The park", "The mall"],
    correctAnswer: "The college",
    transcript: "\"Living in the city center gives me plenty of scenic routes for exercise. I used to go for a jog around the local lake during the weekends, and sometimes I\'d meet my cousins for a stroll in the public park. However, since my evening classes finish quite late and the streets get dark, I prefer to stay within a secure area. Every night, without fail, I spend half an hour walking around the lit paths of the college campus before heading back to my dormitory.\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%207%20-%20q2.mp3",
    question: "How many chairs do they need to prepare for a meeting?",
    options: ["20", "30", "60"],
    correctAnswer: "20",
    transcript: "\"Hi everyone, I’m calling to update you on the setup for our department presentation in the main conference room this afternoon. We initially sent out invitations to thirty staff members, but half of them are traveling for a research project and sent their apologies, which would have left us with just fifteen attendees. However, our professor and four senior guests from the French department confirmed they will join us at the last minute. Therefore, please make sure you prepare exactly twenty chairs in total before the meeting starts.\""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20%20-%20q3.mp3",
    question: "Where did she ask the coffee shop to look for her lost item?",
    options: ["In the corner", "On the table", "Next the door"],
    correctAnswer: "In the corner",
    transcript: "\"Hi, I’m calling because I think I left my study folder at your café about an hour ago. I initially sat at the bright table near the window, but the sunlight was too strong, so I moved over to the small table tucked away right in the far corner. Could you please check that specific area for me? It\'s a blue folder containing my university abstracts, so it shouldn\'t be too hard to spot.\""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q4.mp3",
    question: "Where did they meet?",
    options: ["The front entrance", "At home", "The office"],
    correctAnswer: "The front entrance",
    transcript: "Man: Hi Ngoc, I’ve just arrived at the cultural center. The main lobby is incredibly packed today. Should I look for you outside the ticket office? \nWoman: No, it\'s way too crowded to stand around there. I also noticed the traffic is terrible near the bus stop across the street, so avoid that area too. \nMan: Okay, so where are you standing right now? \nWoman: I’m waiting right by the main glass doors at the front entrance of the building. You can\'t miss me, I\'m wearing a blue jacket!"
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q5.mp3",
    question: "The daughter is calling her father. What did she buy?",
    options: ["A dress", "A hat", "A coat"],
    correctAnswer: "A dress",
    transcript: "Hi Dad, it\'s My. I\'m just calling to let you know I finished my shopping trip downtown. I spent ages in the footwear store looking at some trainers for my gymnastics class, and I was also tempted by a lovely leather handbag on sale. However, I decided to be practical since I have a university gala next week. In the end, I went to the boutique and bought a beautiful formal dress instead. I think you\'ll really like it!\""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q6.mp3",
    question: "There will be a school party soon, what should the teacher prepare?",
    options: ["Order the food", "Order the pizza", "Order the drink"],
    correctAnswer: "Order the food",
    transcript: "Good morning, everyone! I wanted to give you a quick update on our end-of-term school party preparations. The student committee has already taken care of most of the arrangements — all the invitations were emailed to parents last week, and they\'ve already set up the sound system and music playlist in the main hall. The only remaining task for the teaching staff is handling the catering. So, I will be calling the restaurant this morning to officially order the food and refreshments for our fifty guests."
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q7.mp3",
    question: "When will she need a computer?",
    options: ["Friday", "Monday", "Thursday"],
    correctAnswer: "Friday",
    transcript: "\"Thank you for contacting the university IT service desk. I\'d like to rent a laptop for my upcoming mid-term exams. My preparation seminar starts on Wednesday morning, but I can easily use the library desktops for that. My actual exam takes place on Saturday, but the regulations require us to test our software twenty-four hours in advance. Therefore, I will absolutely need the computer delivered to my desk by Friday afternoon.\""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q8.mp3",
    question: "What country will they study next semester?",
    options: ["France", "US", "Germany"],
    correctAnswer: "France",
    transcript: "\"I really enjoyed our European geography lectures this term, especially learning about the historic cities in England. I was initially curious if the curriculum committee would shift our focus toward North America and Canada for the upcoming term. However, I checked the new syllabus outline yesterday afternoon. Because our department is expanding its language programs, we are going to study the regional culture and history of France instead next semester, which is going to be fantastic for our degree!\""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q9.mp3",
    question: "What do they need to repair for the building?",
    options: ["Windows", "The roof", "The heating system"],
    correctAnswer: "Windows",
    transcript: "\"Attention all residents of the campus apartment complex. The maintenance crew will be conducting structural upgrades throughout next week. We initially planned to fix the leaks in the main roof, but that project has been delayed until the dry season. The main entrance front door is also in good condition. Instead, the workers will focus entirely on replacing the cracked glass panes and sealing the frames of all the windows across the building to improve energy efficiency.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q10.mp3",
    question: "What does the actor like to do?",
    options: ["Drawing", "Singing", "Hiking"],
    correctAnswer: "Drawing",
    transcript: "\"Welcome back to the talk show! Today, world-famous actor David Vance shared how he unwinds when he isn\'t on a movie set. While many of his co-stars love to play video games or go jogging in the park to stay active, David prefers a much quieter, creative hobby. He mentioned that after a busy shoot, he loves spending his quiet afternoons alone in his studio drawing and sketching charcoal portraits to help clear his mind.\""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q11.mp3",
    question: "What new thing is being built at the school?",
    options: ["A Performance space", "A new library", "A sport hall"],
    correctAnswer: "A Performance space",
    transcript: "\"Good morning students and faculty. The school board is thrilled to announce our new campus expansion fund. While many departments petitioned for a brand-new science laboratory, and the athletics club wanted to upgrade the football field into a massive sports stadium, the budget was allocated elsewhere. The construction crew will break ground next month to build a modern performance space, featuring a grand stage and seats for five hundred people to host our plays and concerts.\""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-q12.mp3",
    question: "What does he like about Dubai?",
    options: ["He enjoys his job here", "People", "Food"],
    correctAnswer: "He enjoys his job here",
    transcript: "\"Hi everyone, I just wanted to share a quick update on how I\'m adjusting to my new life in Dubai. To be honest, the hot weather here is quite intense, so I spend most of my time indoors, and while the modern architecture is impressive, after a few weeks it just feels normal to me. What truly makes the relocation worth it is my career. The company environment is fantastic and I really enjoy my job here - the marketing projects are challenging and my colleagues are wonderful!\""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q13.mp3",
    question: "What does he advise young people to do to save money?",
    options: ["Cook for yourself", "Avoid unnecessary spending", "Save a small amount regularly"],
    correctAnswer: "Cook for yourself",
    transcript: "\"As a personal finance advisor, I often talk to university students who are struggling to manage their monthly allowance. A lot of blogs suggest selling your vehicle to use public transit, or buying second-hand clothes, which can save a small amount. However, the biggest financial leak for youth today is dining out. My number one piece of advice if you want to protect your bank account is to cook for yourself. Preparing basic meals at home will instantly cut your food expenses by half.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q1.mp3",
    question: "Why did he call his friend?",
    options: ["Suggest a drink", "Suggest a job", "Suggest a place"],
    correctAnswer: "Suggest a drink",
    transcript: "Man: Hey Clara, are you free after your French class this evening? I was thinking we could head downtown to relax.\nWoman: Hi! I don\'t have any major plans. Did you want to go grab some dinner?\nMan: I\'ve actually already eaten, but I wanted to call and suggest a drink at that new rooftop café near the station. I heard their hot chocolate and fruit juices are fantastic.\nWoman: Oh, that sounds like a lovely way to unwind. Let\'s do it!"
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q2.mp3",
    question: "How much does the smallest car cost?",
    options: ["3250 pounds", "2530 pounds", "1500 pounds"],
    correctAnswer: "3250 pounds",
    transcript: "\"Welcome to our regional motors showroom. Today, we have a variety of compact vehicles on promotion. Our mid-sized family hatchbacks are currently priced at five thousand five hundred pounds, and our luxury sports models start at six thousand pounds. However, if you are looking for our most compact and fuel-efficient option, our smallest car on display is on sale today for exactly three thousand two hundred and fifty pounds.\""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q3.mp3",
    question: "A woman is calling her friend. What did she lose?",
    options: ["Phone", "Computer", "Glasses"],
    correctAnswer: "Phone",
    transcript: "Woman: Hi Mark, it\'s me. I\'m calling from my office desk phone because I have a bit of a crisis. \nMan: Oh dear, what happened? Did you leave your house keys at the gym again? \nWoman: No, I have my keys and my wallet right here in my handbag. But I can\'t find my mobile phone anywhere! I must have dropped it on the bus this morning, and now I can\'t check my schedule. \nMan: Don\'t worry, let me try calling it to see if anyone answers."
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q4.mp3",
    question: "What did he forget?",
    options: ["Glasses", "Key", "Clothes"],
    correctAnswer: "Glasses",
    transcript: "\"I had a terribly rushed morning today. I made sure to double-check my pockets before leaving the apartment, so I didn\'t leave my wallet behind, and my car keys were already in my hand. However, as soon as I sat down at my office desk and opened my laptop, the screen was completely blurry. That\'s when I realized I had left my reading glasses sitting right on the bedside table at home.\""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q5.mp3",
    question: "How many Americans are there?",
    options: ["One", "Two", "Three"],
    correctAnswer: "One",
    transcript: "Woman: Have the foreign exchange students from the linguistics department arrived at the welcome lounge yet? \nMan: Yes, the delegation is quite diverse. There are three students from Canada and two from the United Kingdom. \nWoman: Oh, I thought we also had a group arriving from the United States today. \nMan: Actually, only one American student registered for this particular research seminar, and he is currently filling out the registration forms at the front desk."
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%83%206%20-%20q6.mp3",
    question: "Which room is her favourite?",
    options: ["Bathroom", "Living room", "Bedroom"],
    correctAnswer: "Bathroom",
    transcript: "\"I recently finished renovating my new townhouse, and I\'m absolutely delighted with the layout. I spend a lot of time cooking in the kitchen, which is very modern, and my bedroom is incredibly cozy and peaceful. However, my absolute favourite area of the house is definitely the master bathroom. I installed a grand freestanding bathtub and large mirrors, making it the perfect place to relax after a long day of jogging and workouts.\""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q7.mp3",
    question: "Where did they go last year?",
    options: ["Camping", "Biking", "Hiking"],
    correctAnswer: "Camping",
    transcript: "Woman: Hey Huy, where is your family planning to go for the summer holidays this year? Are you heading to the beach again? \nMan: We are actually thinking of booking a cabin up in the mountains this time. \nWoman: Oh, that sounds lovely. Didn\'t you go camping in the national forest last year? \nMan: Yes, we spent a whole week sleeping in tents under the stars last year, and it was a wonderful experience, but my mother wants a proper bed this time!"
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q8.mp3",
    question: "What subject does her son like to study?",
    options: ["Art", "Math", "English"],
    correctAnswer: "Art",
    transcript: "\"My son has been doing very well since starting his first year at the local academy. His teachers tell me he is quite capable in science classes, and he works hard to get good marks in history. However, his true passion lies in creative expression. Whenever he gets home from school, he immediately grabs his brushes and sketchbooks because Art is the only subject he truly loves to study.\""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q9.mp3",
    question: "What does she usually do in her free time?",
    options: ["Go to the theatre and play sports", "Read books", "Sleep"],
    correctAnswer: "Go to the theatre and play sports",
    transcript: "\"I have a pretty busy work schedule, but I always make time for my hobbies on the weekends. In my free time, I love going to the theater to watch new shows, and I also enjoy playing sports like tennis with my friends. Staying active and entertained helps me recharge for the new week.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q10.mp3",
    question: "What advice do they need for decorating their living room?",
    options: ["Where to buy a new table", "Where to buy a new glass", "Where to buy a new desk"],
    correctAnswer: "Where to buy a new table",
    transcript: "\"My husband and I are currently redecorating our main living room, and we’ve already made most of the major decisions. We easily agreed on which soft blue colors to paint the walls, and we’ve already hired an electrician to install the modern lighting fixtures. However, we are completely stuck trying to find a high-quality wooden coffee table that fits our space, so we really need some advice on where to buy a new table.\""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q11.mp3",
    question: "What is his opinion on train travel?",
    options: ["Practical", "Comfortable", "Expensive"],
    correctAnswer: "Practical",
    transcript: "\"Whenever I need to travel between cities, I almost always choose to take the train. Some people complain about the schedule, but for me, it\'s just very practical. You can work on your laptop, relax, and you don\'t have to worry about traffic jams or parking.\""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q12.mp3",
    question: "What is not original?",
    options: ["Furniture", "House", "Floor"],
    correctAnswer: "Furniture",
    transcript: "\"Welcome to today\'s antique auction. Item number twenty-four is a beautiful nineteenth-century cabinet. I must point out to potential buyers that while the main frame of this wooden furniture is in pristine condition, some restoration work was done. The sliding drawer at the bottom and the side panels are completely authentic, but the front wooden door was heavily damaged by moisture and is not original; it was replaced with matching oak timber last year.\""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q13.mp3",
    question: "What number do you press to buy a new computer?",
    options: ["Three", "Zero", "One"],
    correctAnswer: "Three",
    transcript: "\"Thank you for calling our consumer electronics helpline. If you are experiencing technical difficulties with your display screen, please press One to speak with a technician. If you have a question regarding a delivery or want to return a broken printer, please press Two. For customers who want to browse our latest catalogue and purchase a brand-new desktop computer, please press Three to connect straight to our sales team.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q1.mp3",
    question: "How much did he pay for the computer?",
    options: ["250 pounds", "55 pounds", "500 pounds"],
    correctAnswer: "250 pounds",
    transcript: "\"I spent all weekend looking for a decent laptop for my university assignments. I initially saw a very basic, second-hand model online for just one hundred and fifty pounds, but the specifications were way too low. I also looked at a brand-new gaming computer that cost three hundred and fifty pounds, which was unfortunately out of my budget. In the end, I found a reliable refurbished desktop and paid exactly two hundred and fifty pounds for it.\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205%20-%20q2.mp3",
    question: "What did they bring for the picnic?",
    options: ["Food", "Milk", "Water"],
    correctAnswer: "Food",
    transcript: "Man: Hey, did you pack the chess set and those board games for our afternoon picnic in the park? \nWoman: No, I thought the weather was too windy to play games outdoors, so I left them on the table. \nMan: Ah, that\'s a shame. Did you at least bring some portable speakers so we can listen to some music? \nWoman: I forgot those too, I\'m afraid! But don\'t worry, I made sure to fill the basket with plenty of delicious sandwiches, fresh fruit, and snacks, so we have more than enough food to enjoy."
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q3.mp3",
    question: "What colour is the teacher\'s house?",
    options: ["White", "Blue", "Red"],
    correctAnswer: "White",
    transcript: "\"If you are looking for our French professor\'s house to drop off your research project, listen carefully to these directions. As you drive down the lane, you will pass a bright blue cottage on your left, and right next to it is a large house painted completely yellow. The professor\'s residence is the modern, two-story building located right at the end of the cul-de-sac, and it is painted entirely white with a dark grey roof.\""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205%20-%20q4.mp3",
    question: "What time is the football match?",
    options: ["1pm", "2pm", "7pm"],
    correctAnswer: "1pm",
    transcript: "\"Hi everyone, just a quick reminder about our weekend sports schedule. The gates will open early at 11:00 a.m. so fans can get inside and buy snacks. However, the football match itself will officially start at 1:00 p.m. Please make sure you arrive on time so you don\'t miss kickoff!\""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q5.mp3",
    question: "What does she do on her holidays?",
    options: ["Walking", "Hiking", "Biking"],
    correctAnswer: "Walking",
    transcript: "\"Whenever the summer break comes around, my university friends usually book flights straight to luxury resorts where they spend all their time swimming in the pool or sunbathing on the sandy beaches. Personally, I find sitting still incredibly boring. I prefer to pack my backpack, put on a sturdy pair of boots, and spend my holidays walking along scenic mountain trails and exploring nature.\""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205%20-%20q6.mp3",
    question: "Why does she like the manager?",
    options: ["He taught her a lot", "He is friendly", "He is hard-working"],
    correctAnswer: "He taught her a lot",
    transcript: "Man: How are you enjoying your new role as a content creator? Do you get along well with your team lead? \nWoman: I really do! He has a very serious attitude, so he isn\'t exactly funny, and I haven\'t received any promotion yet since I just started last month. \nMan: So what makes him a great boss to work with? \nWoman: He has years of experience in digital media and is incredibly patient with me. He taught her a lot about writing engaging copy and structuring campaigns, which has helped me improve my skills immensely."
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q7.mp3",
    question: "What does he want to be?",
    options: ["Writer", "Doctor", "Teacher"],
    correctAnswer: "Writer",
    transcript: "\"When I first entered university, my parents strongly encouraged me to pursue education so I could become a high school teacher, and I also briefly considered studying medicine to become a doctor. However, my true passion has always been literature and creative storytelling. My ultimate dream is to publish my own novels, and I am working hard every day because I want to be a professional writer.\""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205%20-%20q8.mp3",
    question: "What does he drink?",
    options: ["Water", "Milk", "Tea"],
    correctAnswer: "Water",
    transcript: "Woman: Hi Huy, can I get you a hot beverage while we wait for our class to start? I\'m going to grab a cup of black coffee. \nMan: No, thank you. I\'m trying to cut down on caffeine this week because it has been affecting my sleep. \nWoman: Oh, how about a nice cup of chamomile tea instead? It\'s very relaxing. \nMan: Actually, my throat is quite dry from our presentation earlier. I\'ll pass on the hot drinks and just stick to a glass of cold water to stay hydrated."
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q9.mp3",
    question: "What does he remember most about his school days?",
    options: ["History classes", "The exams", "His teacher"],
    correctAnswer: "History classes",
    transcript: "\"When people ask me about my high school years, many expect me to talk about the weekends we spent playing sports on the football field, or the fun times meeting friends in the school yard during recess. While those are fond memories, what stands out the most in my mind is our history classes. The teacher was incredibly passionate, and the way she brought ancient civilizations and historic events to life is something I will never forget.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205%20-%20q10.mp3",
    question: "What will she do?",
    options: ["Go for a drive", "Go to a museum", "Go to sleep"],
    correctAnswer: "Go for a drive",
    transcript: "It’s a beautiful Saturday morning and I finally have a day off from work. I’m feeling a bit stressed, so I really want to get out of the house and enjoy the fresh air. I’ve decided to take my car and go for a drive around the countryside. It’s always a great way for me to unwind."
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q11.mp3",
    question: "What does she have in common with her mother?",
    options: ["They have similar interests", "They have the same job", "They look alike"],
    correctAnswer: "They have similar interests",
    transcript: "\"My mother and I have very different career paths, as she is a dedicated pediatrician and I am studying French linguistics at university. Physically, we don\'t look identical either, since she is quite tall and I take after my father\'s side. However, we share a very deep bond because we have similar interests. We both absolutely love reading classic literature, watching foreign game shows, and exploring books on nutrition together on weekends.\""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205-%20q12.mp3",
    question: "What does he buy at the shop?",
    options: ["A suit for the office", "A book", "A computer"],
    correctAnswer: "A suit for the office",
    transcript: "Woman: Hi, did you find what you were looking for in our menswear section today? We have a great promotion on casual summer T-shirts. \nMan: They look very nice, but I\'m shopping for something much more formal. I also saw some heavy winter coats on sale, but it\'s not the right season for that. \nWoman: Ah, I see. Are you preparing for a special occasion or a new job? \nMan: Yes, I\'m starting a corporate position next week, so I need to purchase a smart suit for the office. I\'d like to try this dark blue one, please."
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q13.mp3",
    question: "What do birds do in winter?",
    options: ["They stay in groups for protection", "They migrate to warmer places", "They build new nests"],
    correctAnswer: "They stay in groups for protection",
    transcript: "\"During the harsh winter months, local bird populations face severe survival challenges due to freezing temperatures and a lack of food. While some species migrate south, those that remain in the region must adapt their behavior. You won\'t see them building new nests or flying long distances individually at this time. Instead, they stay in groups for protection, huddling together in dense trees to preserve body heat and defend against predators.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q1.mp3",
    question: "What time is the meeting?",
    options: ["10.15", "11.15", "5.15"],
    correctAnswer: "10.15",
    transcript: "\"Good morning, everyone. I need to make a quick announcement regarding our schedule for today. The department heads were initially planning to gather for the weekly presentation at a quarter to ten, but the regional director is currently caught in a traffic delay. We also thought about pushing it back to eleven o\'clock, but that would clash with our lunch plans. Therefore, we have decided to delay the start by exactly half an hour, so the meeting will now begin at ten fifteen.\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q2.mp3",
    question: "Why did he call his friend?",
    options: ["Suggest a drink", "Suggest a book", "Suggest a place"],
    correctAnswer: "Suggest a drink",
    transcript: "Man: Hey Sarah, are you free this evening? I was thinking we could head downtown after we finish our shifts. \nWoman: Hi! I\'m actually quite tired, but I don\'t have any major plans. What did you have in mind? \nMan: Well, I wanted to suggest a drink at that new rooftop cafe near the station. I heard their fruit teas and mocktails are amazing. \nWoman: Oh, that sounds lovely and relaxing. Let\'s do it!"
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q3.mp3",
    question: "How does he feel?",
    options: ["Sick", "Happy", "Tired"],
    correctAnswer: "Sick",
    transcript: "\"I was really looking forward to attending the photography club exhibition this afternoon because I\'ve spent weeks preparing my portfolio, and I felt so excited about it yesterday. However, I woke up with a terrible fever and a sore throat today. It’s a shame because I don\'t just feel tired from working late; I actually feel quite sick, so I’ll have to stay in bed and miss the event entirely.\""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q4.mp3",
    question: "What is the mother asking her daughter to buy?",
    options: ["Eggs", "Rice", "Books"],
    correctAnswer: "Eggs",
    transcript: "Mother: Hi sweetheart, are you still at the supermarket down the street? Daughter: Yes, Mum. I’ve already put a carton of fresh milk and a bag of flour into my shopping basket. Do we need anything else for the pancake recipe? Mother: Oh, thank goodness I caught you! I just checked the fridge and realized we are completely out of eggs. Could you please grab a box of those before you head to the checkout? \nDaughter: Sure thing, I’ll go find them right now."
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q5.mp3",
    question: "When do they meet?",
    options: ["10.00", "11.00", "12.00"],
    correctAnswer: "10.00",
    transcript: "\"Hi Mark, I received your message about our group study session tomorrow. I know you suggested meeting at nine o\'clock because the library is very quiet then, but the building doesn\'t actually open its doors until an hour after that. Since eleven o\'clock is a bit too close to lunchtime, let\'s aim to get together right when the library opens at ten o\'clock sharp. Let me know if that time works for you!\""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q6.mp3",
    question: "Why can\'t she pick up her child?",
    options: ["Stay late at the office", "Her car has broken down", "She is stuck in a meeting"],
    correctAnswer: "Stay late at the office",
    transcript: "Woman: Hi honey, I\'m calling because I need a massive favor. Could you collect our daughter from school this afternoon? \nMan: Sure, I can do that. Is your car still acting up? I thought you took it to the mechanic this morning. \nWoman: No, the car is running perfectly fine, and I already finished my doctor\'s appointment. But my manager just handed me an urgent project report that must be submitted tonight, so I have to stay late at the office to wrap it up. \nMan: Don\'t worry, I\'ll go pick her up."
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q7.mp3",
    question: "What movie does she recommend?",
    options: ["Action film", "Cartoon", "Romantic film"],
    correctAnswer: "Action film",
    transcript: "\"If you are looking for something entertaining to watch at the cinema this weekend, there are a few distinct choices. There is a new comedy starring John Myers, but the jokes are quite predictable, and the environmental documentary showing in hall three is a bit dry. If you want something truly engaging, I highly recommend the new action film. The stunts are breathtaking, the pacing is fast, and it will keep you on the edge of your seat the entire time.\""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q8.mp3",
    question: "A man is calling his friend. Where is he?",
    options: ["A town hall", "A shop", "An office"],
    correctAnswer: "A town hall",
    transcript: "Woman: Hi Jack, where are you? I\'ve been waiting for you near the main entrance of the train station for fifteen minutes. \nMan: I\'m so sorry, Clara! I got a bit lost. I walked past the public library and thought I saw you, but it was someone else. \nWoman: Ah, okay. Are you still near that area? \nMan: No, I walked a bit further down. I\'m actually standing right in front of the historic town hall with the large clock tower. Can you meet me here? \nWoman: Sure, stay right there, I\'ll walk over."
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q9.mp3",
    question: "What means of transport does he use to get to work?",
    options: ["By bus", "By car", "By motorbike"],
    correctAnswer: "By bus",
    transcript: "\"My daily journey to our headquarters downtown has changed a lot recently. I used to drive my car, but finding a parking space in the city center became incredibly expensive and stressful. I also tried taking the commuter train, but the constant delays made me late for meetings. In the end, I decided to stick to the express bus. The route has a dedicated lane, so it\'s both reliable and budget-friendly for my daily commute.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q10.mp3",
    question: "What time do experts recommend eating fruit?",
    options: ["In the morning", "In the evening", "In the afternoon"],
    correctAnswer: "In the morning",
    transcript: "\"Many people enjoy eating fruit in the afternoon as a snack, or having a light fruit bowl in the evening after dinner. However, health experts suggest that the best time to eat fresh fruit is in the morning on an empty stomach. Eating it early in the day helps boost your digestion and gives you plenty of energy for the rest of the day.\""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q11.mp3",
    question: "Why does she wake up early?",
    options: ["To have some quiet time", "To do exercise", "To do homework"],
    correctAnswer: "To have some quiet time",
    transcript: "\"My alarm goes off at 5:00 a.m. every single morning, even on weekends. A lot of my classmates assume I wake up at this hour to study French or go for a jog around the neighborhood to prepare for my fitness tests. While those are productive habits, my real motivation is much simpler. With a busy household, the early morning is the only part of the day when the house is completely silent, and I just want to have some quiet time to sip my coffee in peace.\""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q12.mp3",
    question: "Why is he learning to drive?",
    options: ["He has to drive to work", "He can travel more easily", "He doesn’t have to rely on public transport"],
    correctAnswer: "He has to drive to work",
    transcript: "\"I\'ve been taking driving lessons recently. At first, I just dreamed about buying a new car or going on a long road trip with my friends during the summer. But the main reason I’m doing this now is because my company moved to a new location outside the city, so I have to drive to work every day.\""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q13.mp3",
    question: "What does he buy directly at the shop?",
    options: ["Clothes", "Hat", "Coffee"],
    correctAnswer: "Clothes",
    transcript: "\"I do almost all of my shopping online nowadays because it is so convenient. I purchase all my university textbooks and nutrition books on the internet, and I even have my fresh groceries and food delivered to my apartment on weekends. However, the one thing I refuse to buy online is clothes. I prefer to go directly to the shop so I can try them on, check the fabric quality, and ensure the fit is absolutely perfect before spending any money.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q1.mp3",
    question: "What time do they meet?",
    options: ["6.30pm", "5.30pm", "7.30pm"],
    correctAnswer: "6.30pm",
    transcript: "Hi everyone, I’m calling to update you on our project discussion scheduled for this evening. Our manager initially wanted us to gather in the main office at 5:30 p.m. sharp, but a few team members mentioned they couldn\'t finish their reports by then. We also considered pushing it back to 7:30 p.m., but that would mean staying too late after office hours. Therefore, we have decided to split the difference and lock in the meeting for half past six instead. See you all there!"
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q2.mp3",
    question: "What time does she meet her child?",
    options: ["Three o\'clock", "Four o\'clock", "Six o\'clock"],
    correctAnswer: "Three o\'clock",
    transcript: "Man: Hi Sarah, are you joining us for the department lunch at 2:00 p.m. today? \nWoman: I’d love to, but I have a very tight schedule this afternoon. The school bus drops my son off early today, and I promised to meet my child right outside the gates at three o\'clock sharp. \nMan: Oh, that\'s a shame. Will you be coming back to the office afterwards? Woman: No, I took the rest of the day off, so I\'ll be heading straight home with him after 4:00 p.m."
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q3.mp3",
    question: "What does her sister drink?",
    options: ["Tea", "Milk", "Water"],
    correctAnswer: "Tea",
    transcript: "My sister and I went to that new cafe downtown yesterday. I was feeling quite exhausted, so I ordered a strong iced latte with extra milk to help me wake up. My sister was tempted to try their signature hot chocolate, but since she is trying to avoid sugary drinks this month, she changed her mind. In the end, she just ordered a pot of herbal tea to sip while we caught up on our week."
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q4.mp3",
    question: "How many buildings will the town have?",
    options: ["2000", "5000", "6000"],
    correctAnswer: "2000",
    transcript: "Woman: Did you read the new urban development report for our local town? The council plans to demolish some old structures. \nMan: Yes, I heard they are removing about one thousand old houses next year. Are they replacing them? \nWoman: Exactly. The grand expansion project states that developers will construct a massive residential zone. By the time the project finishes in 2030, the town will have exactly two thousand new buildings completed. \nMan: Wow, that’s a huge change for our community!"
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q5.mp3",
    question: "What does she usually do on Saturdays?",
    options: ["Sees her family", "Sees her friends", "Sees her uncle"],
    correctAnswer: "Sees her family",
    transcript: "My weekends are usually quite structured because I have a lot of responsibilities. I usually dedicate my Sundays to cleaning the house and going shopping for groceries to prepare for the upcoming week. However, my routine for the previous day is completely different. Every single week, as soon as Saturday morning arrives, I drive down to the countryside because I always prioritize spending quality time and sees her family for a big lunch."
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q6.mp3",
    question: "What do they both buy?",
    options: ["Clothes", "Pen", "Computer"],
    correctAnswer: "Clothes",
    transcript: "Man: We spent hours browsing through the retail stores downtown this afternoon. Did you manage to find those running shoes you wanted? \nWoman: No, they didn\'t have my size left in stock. But I did see a beautiful leather jacket on sale. \nMan: Oh, I saw that too! I actually picked up a couple of formal shirts and a pair of trousers for work. \nWoman: So we both ended up purchasing some new clothes after all, even though we didn\'t get what we originally went in for! \nMan: Yes, at least the trip wasn\'t a total waste!"
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q7.mp3",
    question: "What color shirt did he buy?",
    options: ["Black", "White", "Blue"],
    correctAnswer: "Black",
    transcript: "I went to the department store this morning to find a new outfit for the upcoming corporate gala. The sales assistant strongly recommended a bright blue shirt because it matches my eyes, and I also tried on a classic white shirt which looked very professional. However, I wanted something more elegant and formal for the evening event. In the end, I decided to purchase the plain black shirt instead, as it goes perfectly with my dark grey suit."
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q8.mp3",
    question: "When is the assignment due?",
    options: ["On Saturday", "On Monday", "On Friday"],
    correctAnswer: "On Saturday",
    transcript: "Hi everyone, just a quick reminder about our History assignment. Originally, I asked you to hand it in on Friday by 5 PM. However, a few students requested some extra time to finish their research. I considered moving the deadline to Sunday, but that doesn\'t give me enough time to grade your papers before next week\'s lecture. So, please make sure you upload your work to the student portal by midnight on Saturday at the latest."
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q9.mp3",
    question: "What did the professor want her to do?",
    options: ["Speak at the conference", "Go to the museum", "Do homework"],
    correctAnswer: "Speak at the conference",
    transcript: "I had a very motivating meeting with my academic advisor yesterday afternoon. I initially thought he called me into his office because he wanted me to write another research paper for his upcoming journal, or perhaps help him grade undergraduate exams. However, he surprised me by praising my recent presentation on linguistics. He told me that my work was outstanding and explicitly requested that I represent the department and speak at a conference in Paris next month."
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q10.mp3",
    question: "Where did she choose to go on holiday?",
    options: ["The South", "The East", "The North"],
    correctAnswer: "The South",
    transcript: "Choosing a holiday destination this year was tricky! My family really wanted to go to the mountains for some cool air and hiking. I also spent days looking at photos of the north, thinking we could explore the historical sites up there. But in the end, I just really wanted to relax on a warm beach with plenty of sunshine. So, I booked a resort in the south, and we’re all heading there next week!"
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q11.mp3",
    question: "What is special about the new song?",
    options: ["The words", "The rhythm", "The sound"],
    correctAnswer: "The words",
    transcript: "The local rock band just released their latest single this morning, and it is already getting a lot of attention online. The musical arrangement is quite standard, using the classic combination of electric guitars and drums that they always use, and the melody isn\'t particularly unique either. However, what truly makes this track stand out is the profound message behind the lyrics. The words are incredibly moving and poetic, reflecting on deep social issues in a way that the band has never done before."
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q12.mp3",
    question: "What did she like the most about the movie?",
    options: ["The mountain scenes", "The story", "The actors’ performances"],
    correctAnswer: "The mountain scenes",
    transcript: "Man: What did you think of the new adventure movie we watched last night? I thought the lead actor gave an incredible performance. \nWoman: The acting was decent, though a bit dramatic at times, and the cinematic soundtrack was beautiful too. \nMan: So what was the highlight for you? \nWoman: For me, nothing could beat the breathtaking cinematography. The gorgeous mountain scenes filmed entirely on location in New Zealand were absolutely stunning and made the whole experience unforgettable."
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q13.mp3",
    question: "Why did she become a scientist?",
    options: ["A large stone", "She enjoyed science", "She wanted to help people"],
    correctAnswer: "A large stone",
    transcript: "People often ask me what inspired my lifelong passion for geology and chemistry. Many colleagues assume I was influenced by a television documentary I watched as a child, or perhaps an encouraging high school teacher who guided my studies. In reality, it was something much more random. When I was seven years old, I found a large stone embedded with strange, glittering crystals in my backyard. Trying to discover what it was made of is the exact reason I eventually grew up to become a professional scientist."
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q1.mp3",
    question: "What time will they meet?",
    options: ["Quarter to ten", "Quarter to eight", "Quarter to eleven"],
    correctAnswer: "Quarter to eight",
    transcript: "\"Hi everyone, I\'m just calling to confirm our theater plans for this evening. The main performance doesn\'t actually start until half past eight, and the doors open at 7:30, but the traffic downtown is expected to be quite heavy around that time. Therefore, to make sure we can find good parking spaces and grab our tickets without rushing, let\'s aim to gather outside the main entrance at a quarter to eight sharp.\""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203-%20q2.mp3",
    question: "Where did they meet for the bus home?",
    options: ["marketplace", "bus station", "nearby park"],
    correctAnswer: "marketplace",
    transcript: "Man: Hey Sarah, sorry I\'m late. I went to look for you outside the library where the bus usually stops, but you weren\'t there. \nWoman: Oh, sorry about that! The bus route was temporarily changed today because of the festival. I was waiting near the central park for a bit, but it was way too noisy. \nMan: So where are you standing right now? \nWoman: I walked a block down to the crowded open plaza where the farmers sell fresh produce. Let\'s just meet here at the marketplace, as the commuter bus home stops right in front of the main gate."
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q3.mp3",
    question: "How old is Stephanie?",
    options: ["21", "22", "23"],
    correctAnswer: "21",
    transcript: "\"We are having a big family celebration this weekend because my cousin Stephanie is reaching a major milestone. It feels like just yesterday we were celebrating her nineteenth birthday when she first started university, and her parents are already planning a huge trip for when she graduates at twenty-five. But for this upcoming party, she is finally turning twenty-one, so we are throwing a formal dinner to celebrate her officially becoming an adult.\""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203%20-%20q4.mp3",
    question: "Where is the club near?",
    options: ["A coffee shop", "A museum", "A park"],
    correctAnswer: "A park",
    transcript: "Woman: Hey Alex, do you know where the new photography club holds its weekly meetings? Is it located inside that commercial complex next to the grand shopping mall? \nMan: They actually moved out of that office last month. They briefly rented a small studio right opposite the central train station, but it was far too loud with the tracks nearby. \nWoman: Oh, I see. So where do they gather now? \nMan: They found a lovely, quiet community center situated right next to a large public park, so members can easily walk outside to practice taking landscape photos."
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q5.mp3",
    question: "What to feed the cat?",
    options: ["Meat", "Fish", "Chicken"],
    correctAnswer: "Fish",
    transcript: "\"Hi Jane, thanks so much for watching my apartment and looking after my pet while I\'m away this weekend. I left a few cans of shredded chicken in the pantry, but please don\'t give her those because she had an allergic reaction to them last week. Also, despite what you see in cartoons, fresh milk will upset her stomach completely. I’ve left a bag of dried seafood biscuits on the kitchen counter, so just stick to feeding her that salmon and fish mix twice a day.\""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203%20-%20q6.mp3",
    question: "What does this family do most weekends?",
    options: ["has dinner together", "plays tennis", "goes for a walk"],
    correctAnswer: "goes for a walk",
    transcript: "\"On weekends, my family always tries to spend time together. Occasionally, if the weather is really hot, we drive to the beach for a swim, and once in a while, we visit the local museum when there\'s a new exhibition. However, our usual routine is much simpler. Most weekends, we just go for a long walk in the park near our house to relax and get some fresh air.\""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q7.mp3",
    question: "What does he need to buy for his sister?",
    options: ["Chocolates", "Eggs", "Milk"],
    correctAnswer: "Chocolates",
    transcript: "\"I\'m heading out to the high street to buy a birthday present for my sister, and I\'m running a bit out of ideas. I initially considered purchasing an elegant silver watch, but they are a bit out of my budget this month. I also thought about getting a classic bouquet of fresh flowers, but they wither so quickly. In the end, I decided to head to the premium confectionery store to pick up a luxury box of assorted chocolates, as she absolutely loves sweet treats.\""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203%20-%20q8.mp3",
    question: "The train was delayed. What time does the train leave?",
    options: ["9.30", "10.00", "11.30"],
    correctAnswer: "9.30",
    transcript: "\"This is a station announcement for passengers traveling to London. The service originally scheduled for 8:30 has been delayed due to signaling problems. We initially hoped to have the train depart at 9:00, but engineers are still working on the track. The train is now expected to leave at 9:30. Thank you for your patience.\""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q9.mp3",
    question: "Which area has the best weather?",
    options: ["In the north", "In the east", "In the south"],
    correctAnswer: "In the east",
    transcript: "\"Welcome to the national weather report. Moving through the country today, we see quite a contrast in conditions. The northern territory will experience severe gales and dropping temperatures, while regional areas in the west will face continuous heavy showers throughout the afternoon. Fortunately, the dark clouds will miss the coastal border completely, leaving residents in the east with beautiful, clear skies and bright sunshine all day long.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203%20-%20q10.mp3",
    question: "Why was the museum visit cancelled?",
    options: ["Not enough people", "The heavy storm", "Too many participant"],
    correctAnswer: "Not enough people",
    transcript: "\"Hi everyone, I have an update regarding our trip to the city museum this Saturday. I know some of you were worried about the bad weather forecast, but it turns out it’s going to be sunny. I also called ahead to make sure, and thankfully, the museum isn\'t closed for renovations anymore. However, we needed a minimum of twenty students to book the guided tour, and only ten signed up. So, unfortunately, we had to cancel the trip because there just were not enough people.\""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q11.mp3",
    question: "Where is the cafe?",
    options: ["Opposite the school", "By the river", "Opposite the gift shop"],
    correctAnswer: "Opposite the gift shop",
    transcript: "\"Welcome to the City Art Gallery! Before you begin exploring the collections, let me give you a quick layout of our facilities. As you walk through the main entrance, you will see the ticket counters immediately on your right. The entrance to the grand exhibition hall is straight ahead of you. If you turn around and look across the hallway, you\'ll see our souvenir store, and the gallery cafe is located directly opposite the gift shop, serving fresh coffee and pastries.\""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203%20-%20q12.mp3",
    question: "Where is the tea served?",
    options: ["The river boat", "The yacht", "The restaurant"],
    correctAnswer: "The river boat",
    transcript: "\"Welcome to the Riverside Hotel. Breakfast is served every morning in the main dining room, and you can enjoy afternoon coffee at our outdoor garden cafe. However, for our afternoon tea service, guests will board our private river boat at 3 PM to enjoy tea and cakes while cruising along the water.\""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q13.mp3",
    question: "Which room is the largest in her house?",
    options: ["Living room", "Kitchen", "Dining room"],
    correctAnswer: "Kitchen",
    transcript: "\"I recently moved into a lovely traditional cottage in the suburbs, and the floor plan is quite unique. Most people expect the living room to be the grandest area where everyone gathers, but in my house, it\'s actually quite cozy and small. My bedroom is slightly larger, allowing plenty of space for a king-sized bed and wardrobes. However, because I absolutely love culinary arts, the developers expanded the cooking area significantly, making the kitchen the absolute largest room in the entire house.\""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q1.mp3",
    question: "How much are the eggs?",
    options: ["1.50 pound", "2.50 pound", "1.70 pound"],
    correctAnswer: "1.50 pound",
    transcript: "Good morning, shoppers, and welcome to our organic farm stall. Today, we have a great discount on our dairy products, with a pint of fresh milk priced at just one pound twenty. Our homemade cheddar cheese is also on sale for one pound eighty per pack. If you look over here, our farm-fresh organic eggs are currently priced at exactly one pound fifty for a carton of six, which is a fantastic bargain for breakfast."
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%201%20-%20q2.mp3",
    question: "What time does the train leave? (for him to go on a business trip)",
    options: ["9.15", "9.2", "10.45"],
    correctAnswer: "9.15",
    transcript: "Woman: Hi honey, have you packed your briefcase for your business trip to the capital city yet? I thought your train was scheduled for a quarter to nine. \nMan: No, that was the express rail, but the company booked me on the regular service instead. The ticket says it departs at nine fifteen. \nWoman: Oh, okay. Do you need a ride to the station? It usually takes about thirty-five minutes, so you\'d arrive at ten to ten. \nMan: No need, I\'ll just take a quick taxi now so I can be there well before 9:15."
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q3.mp3",
    question: "How does she go to school?",
    options: ["She walks", "She drives", "She rides a bycicle"],
    correctAnswer: "She walks",
    transcript: "My daily commute to the university campus is actually quite active compared to my friends. Most of them catch the morning bus from the station, and a few prefer to ride a bike when the weather is nice. I live close enough to the campus grounds, so I don\'t need wheels at all. I just put on my comfortable trainers every morning and she walks across the neighborhood park to get to my first lecture."
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%201%20-%20q4.mp3",
    question: "A woman is calling her husband. What time is lunch ready?",
    options: ["2pm", "4pm", "5am"],
    correctAnswer: "2pm",
    transcript: "Woman: Hi dear, I\'m just calling to let you know about our plans today. I know we usually sit down for our midday meal at noon, or at 1:00 pm on weekends. \nMan: Oh, are we running a bit late today? I\'m already starting to feel quite hungry. Woman: Yes, the grocery store was packed and the chicken is taking longer to roast than I expected. I promise everything will be perfectly cooked and lunch ready by 2:00 pm sharp. \nMan: Alright, I\'ll see you at two then!"
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q5.mp3",
    question: "What does she usually do in the evening?",
    options: ["Go for a walk", "Watch TV", "Sleep"],
    correctAnswer: "Go for a walk",
    transcript: "I have a very busy office routine during the daytime, so my nights are dedicated entirely to unwinding. I sometimes stay in the living room to watch television or listen to music on my headphones, but staying indoors all day makes me feel restless. Instead, as soon as the sun goes down, I prefer to put on my jacket and go for a walk around the local lake to enjoy the cool evening breeze."
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%201%20-%20q6.mp3",
    question: "Where will they meet?",
    options: ["At the park", "At home", "At the office"],
    correctAnswer: "At the park",
    transcript: "Man: Hey, are we still meeting up outside the cinema before the movie starts tonight? \nWoman: The weather is absolutely beautiful right now, so it seems a shame to wait around inside a crowded lobby or sitting in a noisy coffee shop. \nMan: True. Why don\'t we gather near the entrance gates of the central park just across the street instead? We can enjoy the sunshine for a bit. \nWoman: That\'s a fantastic idea! I\'ll see you at the park in fifteen minutes."
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_30s%20(audio-joiner.com).mp3",
    question: "What day do they meet?",
    options: ["Tuesday", "Monday", "Saturday"],
    correctAnswer: "Tuesday",
    transcript: "Man: Hi Sarah, I received your message about scheduling our project review session. Monday is completely packed for me because I have client presentations all day. \nWoman: I understand. I’m actually traveling out of town for a conference on Wednesday, so that day is out for me too. \nMan: Well, that leaves us with the day in between. Let\'s aim to get together in the afternoon on Tuesday instead. \nWoman: Perfect, Tuesday works great for me. Let\'s lock it in."
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q9.mp3",
    question: "What career did he choose?",
    options: ["To work in business", "A doctor", "A teacher"],
    correctAnswer: "To work in business",
    transcript: "\"When I graduated from university, my parents really wanted me to go into teaching and build a stable path to work in education, while my sister suggested I train to become a nurse in healthcare. However, I’ve always been drawn to entrepreneurship, economics, and corporate management. In the end, I decided to join a multinational marketing firm, choosing to work in business where I could challenge myself in a fast-paced commercial market.\""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q7.mp3",
    question: "What does this family do most weekends?",
    options: ["Goes for a walk", "Goes to the cinema", "Watches TV together"],
    correctAnswer: "Goes for a walk",
    transcript: "\"Living near the countryside gives my family plenty of options for weekend activities. When the weather is exceptionally hot in the summer, we occasionally drive down to the coast to swim at the beach, and on rainy winter days, we might visit the local art museum. However, our standard routine throughout the year is much simpler. Almost every Saturday morning, the whole family goes for a walk along the mountain trails to stay healthy and active.\""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%201%20-%20q10.mp3",
    question: "What course did he take?",
    options: ["Computer", "Information Technology", "Business Administration"],
    correctAnswer: "Computer",
    transcript: "Woman: Hey Mark, I heard you enrolled in an evening adult education program. Are you finally learning a foreign language like you planned? \nMan: I was looking into a French class, and my wife wanted me to take a weekend cooking course with her, but I had to prioritize my career skills. \nWoman: Oh, I see. So what did you choose? \nMan: I signed up for a data analysis and computer programming seminar instead. It’s tough, but understanding software is essential for my new job."
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q11.mp3",
    question: "A woman is talking about her job. How is being a writer different from other jobs?",
    options: ["She works irregular time", "She works at home", "She has to meet strict deadlines"],
    correctAnswer: "She works irregular time",
    transcript: "People often romanticize my profession, assuming that authors earn a lot more money than standard corporate workers, or that we constantly travel to different countries for book signings. In reality, the financial aspect can be quite tough, and I spend most of my days sitting alone at home. The real contrast lies in my schedule; unlike a traditional 9-to-5 corporate career, being a creative author means she works irregular time, sometimes drafting chapters at 3 AM or taking a Tuesday afternoon completely off."
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%201%20-%20q12.mp3",
    question: "Where does she buy food?",
    options: ["At a new shopping centre", "At a convenience store", "At a mall"],
    correctAnswer: "At a new shopping centre",
    transcript: "Well, I used to buy all my fresh vegetables at a local market near my house, but it closed down last month. Since then, I\'ve tried getting my food from a traditional grocery store, but they don\'t have a wide range of organic products. So yesterday, I went to the new shopping centre downtown, and they had an amazing supermarket section! The prices were reasonable and everything was fresh, so that\'s where I decided to get all my groceries from now on."
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q13.mp3",
    question: "What causes air pollution?",
    options: ["Fire from the countryside", "Rubbish", "Factory and industrial smoke"],
    correctAnswer: "Fire from the countryside",
    transcript: "Environmental scientists recently conducted a study on seasonal smog levels in our province. While many citizens blame the daily automobile traffic in the city center or the toxic industrial waste released from local factories, the data revealed a different primary source for this month\'s poor air quality. The toxic smoke particles floating over the residential zones are actually coming from the massive agricultural fire from the countryside, where farmers are clearing fields for the new crop season."
  }
];

// ===============================================================================================================
// ////////////// CÂU HỎI 1_13 ///////////////
// ===============================================================================================================
window.renderQuestion1_13 = function(data) {
  const radioButtons = document.querySelectorAll('input[name="answer"]');
  radioButtons.forEach(button => {
    button.checked = false;
  });

  const totalQuestions = window.listeningQuestions1 ? window.listeningQuestions1.length : 0;
  const currentNumber = (typeof window.currentIndex !== 'undefined' ? window.currentIndex + 1 : 1);
  document.getElementById("question1_13_id").innerText = 'Question ' + currentNumber + ' of ' + totalQuestions;

  const audio = document.getElementById("audioPlayer");
  const questionText = document.getElementById("questionText");
  audio.src = data.audioUrl;
  questionText.innerText = data.question;

  data.options.forEach((option, index) => {
    const label = document.getElementById("label" + index);
    const input = document.getElementById("option" + index);
    if (label && input) {
      label.innerText = option;
      input.value = option;
    }
  });

  const storedAnswer = window.userAnswers[window.currentIndex];
  if (storedAnswer) {
    const savedInput = document.querySelector(`input[name="answer"][value="${storedAnswer}"]`);
    if (savedInput) savedInput.checked = true;
  }

  const playBtn = document.getElementById("playButton");
  const playIcon = document.getElementById("playIcon");
  window.setupPlayButton(audio, playBtn, playIcon);

  const transcriptBox = document.getElementById("transcriptBox");
  const transcriptContent = document.getElementById("transcriptContent");
  transcriptContent.innerText = data.transcript;

  const showTranscriptButton = document.getElementById("showTranscriptButton");

  transcriptBox.style.display = "none";
  showTranscriptButton.innerText = "Show paragraph";

  showTranscriptButton.removeEventListener("click", window.toggleTranscript);
  showTranscriptButton.addEventListener("click", window.toggleTranscript);
}

window.toggleTranscript = function() {
  const transcriptBox = document.getElementById("transcriptBox");
  const showTranscriptButton = document.getElementById("showTranscriptButton");
  if (transcriptBox.style.display === "none") {
    transcriptBox.style.display = "block";
    showTranscriptButton.innerText = "Hide paragraph";
  } else {
    transcriptBox.style.display = "none";
    showTranscriptButton.innerText = "Show paragraph";
  }
}

window.setupPlayButton = function(audio, playBtn, playIcon) {
  if (playBtn.dataset.bound === "true") return;
  playBtn.dataset.bound = "true";

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        playIcon.classList.remove("bi-play-fill");
        playIcon.classList.add("bi-pause-fill");
      }).catch(err => console.error("Không phát được:", err));
    } else {
      audio.pause();
      playIcon.classList.remove("bi-pause-fill");
      playIcon.classList.add("bi-play-fill");
    }
  });

  audio.addEventListener("ended", () => {
    playIcon.classList.remove("bi-pause-fill");
    playIcon.classList.add("bi-play-fill");
  });
}

window.currentIndex = 0;
window.userAnswers = [];

window.storeUserAnswer = function(questionIndex, answer) {
  window.userAnswers[questionIndex] = answer;
}

document.querySelectorAll('input[name="answer"]').forEach((input, index) => {
  input.addEventListener('change', function() {
    window.storeUserAnswer(window.currentIndex, this.value);
  });
});

window.onload = function() {
  window.renderQuestion1_13(window.listeningQuestions1[0]);
};

window.showResults_question1_13 = function() {
  const comparisonTableBody = document.getElementById('comparisonTableBody');
  if (!comparisonTableBody) return;
  comparisonTableBody.innerHTML = '';

  let score = 0;

  window.listeningQuestions1.forEach((question, index) => {
    const userAnswer = window.userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    const textColor = isCorrect ? 'text-success' : 'text-danger';

    if (isCorrect) {
      score += 2;
    }

    // Populate table in modal only (not on page) - format like Reading
    comparisonTableBody.innerHTML += `
      <tr>
        <td class="${textColor} fw-bold">${userAnswer || 'Not answered'}</td>
        <td class="text-success fw-bold">${question.correctAnswer}</td>
      </tr>
    `;
  });

  window.question1_13Score = score;
  // Don't show result on page, only in modal
  // totalScoreDisplay.innerText = `Score: ${score} / ${window.listeningQuestions1.length * 2}`;
  // const resultContainer = document.getElementById('comparisonResult_question1');
  // if (resultContainer) resultContainer.style.display = "block";
}

window.question1_13Score = 0;
window.calculateTotalScore = function() {
  var totalScore = window.question1_13Score;
  const totalScoreEl = document.getElementById('totalScore');
  if (totalScoreEl) totalScoreEl.innerText = 'Your Score: ' + totalScore;
  window.classifyScore(totalScore);
}

window.classifyScore = function(score) {
  let classification = '';
  const totalQuestions = window.listeningQuestions1 ? window.listeningQuestions1.length : 13;
  const maxScore = totalQuestions * 2;
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) {
    classification = 'Excellent';
  } else if (percentage >= 50) {
    classification = 'Good';
  } else {
    classification = 'Cố gắng thêm nhé!';
  }
  const scoreEl = document.getElementById('scoreClassification');
  if (scoreEl) scoreEl.innerText = 'Classification: ' + classification;
}

const checkResultBtn = document.getElementById('checkResultButton');
if (checkResultBtn) {
  checkResultBtn.addEventListener('click', function() {
    console.log('Check result button clicked');
    try {
      window.showResults_question1_13();
      window.calculateTotalScore();
      // Keep question container visible (like Reading) - don't hide it
      // const questionContainer = document.getElementById("question1_13");
      // if (questionContainer) questionContainer.style.display = "none";
      // Don't show result container on page, only show modal
      // const resultContainer = document.getElementById('comparisonResult_question1');
      // if (resultContainer) resultContainer.style.display = "block";
      // Keep navigation buttons visible (don't hide them)
      // const backBtn = document.getElementById('backButton');
      // if (backBtn) backBtn.style.display = "none";
      // checkResultBtn.style.display = "none";
      // const nextBtn = document.getElementById('nextButton');
      // if (nextBtn) nextBtn.style.display = "none";
      // Show modal with results
      const resultModal = document.getElementById('resultModal');
      if (resultModal && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(resultModal);
        modal.show();
        console.log('Result modal shown');
      } else {
        console.error('resultModal not found or bootstrap not available');
      }
    } catch (error) {
      console.error('Error in check result button handler:', error);
    }
  });
}

function renderQuestionByIndex(index) {
  if (index >= 0 && index < window.listeningQuestions1.length) {
    window.currentIndex = index;
    window.renderQuestion1_13(window.listeningQuestions1[index]);
  }
  // Update Next button text if last question
  if (index === window.listeningQuestions1.length - 1) {
    const nextBtn = document.getElementById('nextButton');
    if (nextBtn) nextBtn.textContent = 'The end';
  } else {
    const nextBtn = document.getElementById('nextButton');
    if (nextBtn) nextBtn.textContent = 'Next';
  }
}

const nextBtn = document.getElementById('nextButton');
if (nextBtn) {
  nextBtn.addEventListener('click', function() {
    // Pause all audio
    document.querySelectorAll('audio').forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    // Reset play icons
    document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {
      icon.classList.remove('bi-pause-fill');
      icon.classList.add('bi-play-fill');
    });
    if (window.currentIndex < window.listeningQuestions1.length - 1) {
      renderQuestionByIndex(window.currentIndex + 1);
    } else if (this.textContent === 'The end') {
      window.location.href = 'listening_question.html';
    }
  });
}

const backBtn = document.getElementById('backButton');
if (backBtn) {
  backBtn.addEventListener('click', function() {
    // Pause all audio
    document.querySelectorAll('audio').forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    // Reset play icons
    document.querySelectorAll('i[id^="playIcon"]').forEach(icon => {
      icon.classList.remove('bi-pause-fill');
      icon.classList.add('bi-play-fill');
    });
    if (window.currentIndex > 0) {
      renderQuestionByIndex(window.currentIndex - 1);
    }
  });
}

// ===============================================================================================================
// ////////////// ĐẾM NGƯỢC THỜI GIAN --- COUNT DOWN ///////////////
// ===============================================================================================================
if (!window.countdownInitialized) {
  window.countdownInitialized = true;
  window.timeLeft = 40 * 60; // 40 minutes in seconds
  const countdownElement = document.getElementById('countdownTimer');

  // Clear any existing timer first
  if (window.countdownTimerId) {
    clearTimeout(window.countdownTimerId);
  }

  window.updateCountdown = function() {
    if (!countdownElement) return;
    const minutes = Math.floor(window.timeLeft / 60);
    const seconds = window.timeLeft % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (window.timeLeft > 0) {
      window.timeLeft--;
      window.countdownTimerId = setTimeout(window.updateCountdown, 1000);
    }
  }

  window.updateCountdown();
}
})();

/* MINI_HIPPO_LESSON_DATA_START
{
  "version": 1,
  "lessonType": "listening",
  "part": "listening_1_13",
  "sets": [
    {
      "title": "LISTENING ĐỀ 14 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q1.mp3",
          "question": "How much does the flight in the morning cost?",
          "options": [
            "350 pounds",
            "300 pounds",
            "380 pounds"
          ],
          "correctAnswer": "350 pounds",
          "transcript": "\"If you are looking to book your flight to London for next Tuesday, we have a few different pricing options available depending on the time of day. The late evening departure is the most budget-friendly, coming in at just two hundred and fifty pounds. If you prefer to travel during peak hours in the afternoon, the ticket price jumps up to four hundred and fifty pounds. However, if you decide to take the early morning flight, it will cost you exactly three hundred and fifty pounds.\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q8.mp3",
          "question": "How much did she sell it for?",
          "options": [
            "50 dollars",
            "45 dollars",
            "60 dollars"
          ],
          "correctAnswer": "50 dollars",
          "transcript": "\"I finally sold my old bicycle yesterday. I initially posted it online for 60 dollars, but a college student asked for a discount. Since he was very polite, I agreed to sell it to him for 50 dollars. I'm glad it found a new owner.\""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q3.mp3",
          "question": "What is the main reason she gets late?",
          "options": [
            "Missed the train",
            "Got stuck in traffic",
            "Overslept"
          ],
          "correctAnswer": "Missed the train",
          "transcript": "\"I am so incredibly sorry for keeping you all waiting for the budget meeting this morning. I actually woke up early today so I didn't oversleep at all, and I even checked the roads to make sure I wouldn't get stuck in a morning traffic jam. However, just as I walked onto the platform, the doors slammed shut and the express rail pulled away right in front of me. Having missed the train, I had no choice but to wait for the next slow commuter service.\""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_28s%20(audio-joiner.com)%20(1).mp3",
          "question": "What is the man going to do after work?",
          "options": [
            "Goes running",
            "Meet a friend",
            "Go shopping"
          ],
          "correctAnswer": "Goes running",
          "transcript": "Woman: Hey, a few of us are heading downtown to meet some friends for dinner after we log off. Do you want to come along? \nMan: Thanks for the invite, but I’ll have to pass tonight. I’ve been feeling really sluggish lately and need some active exercise. \nWoman: Oh, are you heading home to relax then? \nMan: Not quite. I brought my trainers with me today, so as soon as I leave the office, I’m going straight to the local park to go running for an hour to clear my head."
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_33s%20(audio-joiner.com).mp3",
          "question": "Tom is calling his friend. What time will they meet?",
          "options": [
            "7 p.m.",
            "6:30 p.m.",
            "7:30 p.m."
          ],
          "correctAnswer": "7 p.m.",
          "transcript": "Man: Hi, it's Tom. I'm just calling to confirm our dinner plans for tonight. My shift finishes at 5 PM, so I can head over right after that if you like. \nWoman: Five is a bit too rushed for me because I have a client meeting that goes until 6 PM. Could we push it back a bit? \nMan: No problem at all. Let's make it an hour after you finish, which gives us both plenty of time to get to the restaurant. See you at 7 PM then! \nWoman: Perfect, see you there!"
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q6.mp3",
          "question": "A finance expert is giving advice to young people. What shouldn't they do?",
          "options": [
            "Ask for more money",
            "Spend money without a plan",
            "Borrow money from friends"
          ],
          "correctAnswer": "Ask for more money",
          "transcript": "\"As a finance expert, my number one advice for young entrepreneurs pitching to investors is to do your homework thoroughly. You should never hesitate to request more details from your target market, and if your project schedule is tight, it is completely acceptable to ask for more time to prepare a perfect business model. However, the biggest mistake you can make is trying to inflate your budget right at the beginning. Whatever you do, do not ask for more money until you have proven your idea works.\""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q7.mp3",
          "question": "A girl is talking about a show she will attend. What will it end with?",
          "options": [
            "A surprise performance",
            "A fireworks display",
            "A question-and-answer session"
          ],
          "correctAnswer": "A surprise performance",
          "transcript": "\"Welcome to the annual charity gala event line-up. We will kick off the evening with a short speech by our organization's founder to thank all the donors. Immediately following that, our main attraction will take the stage, which is a wonderful music show featuring a live classical orchestra. Finally, to wrap up the entire evening, we have scheduled an unannounced surprise performance from a world-famous magician that isn't printed on your programs.\""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q8.mp3",
          "question": "Listen to an auction man talking about a cabinet. Which part of the cabinet is original?",
          "options": [
            "The drawer",
            "The doors",
            "The handles"
          ],
          "correctAnswer": "The drawer",
          "transcript": "\"Moving on to item number fourteen, we have this beautiful nineteenth-century antique cabinet. Potential buyers should note that this piece has undergone extensive restoration over the years. The front wooden door was completely replaced with new oak timber due to water damage, and the iron handle is also a modern replacement. However, the internal sliding drawer at the bottom remains completely untouched and is the only original part left from the day it was manufactured.\""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_36s%20(audio-joiner.com).mp3",
          "question": "A woman tells her friend about her plans for the day. What is the woman going to do?",
          "options": [
            "Have coffee",
            "Visit her sister",
            "Go to the supermarket"
          ],
          "correctAnswer": "Have coffee",
          "transcript": "Man: Hey, the weather is beautiful outside. Do you want to go grab a sandwich and have lunch in the park? \nWoman: I’d love to, but I have a virtual French grammar lesson starting at my desk in about twenty minutes, so I can't go far. \nMan: Ah, that's a shame. Do you need anything before your class begins? \nWoman: Actually, yes! I'm feeling quite exhausted. Could you help me grab a hot cup of coffee from the breakroom? I really need some caffeine to stay awake. \nMan: Sure thing, I'll bring it right over."
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q10.mp3",
          "question": "Listen to the speaker talking on the radio. What is she talking about?",
          "options": [
            "Her journey to work",
            "Her first day at work",
            "Her holiday plans"
          ],
          "correctAnswer": "Her journey to work",
          "transcript": "\"Good morning listeners, and welcome back to the radio show. Today, I want to talk about how relocating to a new neighborhood has completely transformed my morning commute. I used to have a standard daily routine where I could just walk to my old building in five minutes. Now, my daily journey to work involves navigating through heavy road traffic on a crowded bus, followed by a frantic rush to catch a connecting train. It is easily the most stressful part of my day now.\""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_38s%20(audio-joiner.com).mp3",
          "question": "Listen to the conversation about the directions. Where is the library located?",
          "options": [
            "On the left of the square",
            "Opposite the square",
            "Behind the museum"
          ],
          "correctAnswer": "On the left of the square",
          "transcript": "Man: Excuse me, I’m trying to find the public library. Am I heading in the right direction? \nWoman: Yes, you are very close. Just walk past this street and you will enter the central town square. \nMan: Okay, I see it. Is the library that modern building tucked away in the far corner? \nWoman: No, that’s the post office. If you look to the right of the square, you’ll see the historical museum. The library is directly opposite that museum, standing right on the left of the square. \nMan: Ah, I see it now. Thank you so much!"
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_37s%20(audio-joiner.com).mp3",
          "question": "The woman is calling a friend about meeting for dinner. How long does it take to get to the station?",
          "options": [
            "40 minutes",
            "30 minutes",
            "50 minutes"
          ],
          "correctAnswer": "40 minutes",
          "transcript": "Man: Hi Helen, are we still meeting up for dinner outside the train station at 6 PM? \nWoman: Yes, but I'm checking the navigation map right now, and the traffic looks quite heavy. Normally, the bus ride from my house takes about twenty or thirty minutes. \nMan: Oh dear, is it going to take much longer tonight? \nWoman: Yes, according to the live traffic update, the delay adds another ten minutes to the trip. So it's going to take me exactly forty minutes to get to the station. I might be just a few minutes late!"
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q76.mp3",
          "question": "What is this man going to do?",
          "options": [
            "Eat something",
            "Make dinner",
            "Buy a snack"
          ],
          "correctAnswer": "Eat something",
          "transcript": "\"I’ve had a remarkably busy morning running errands all over town. I had to stop by the mall to go shopping for a new winter jacket, and right after that, I spent twenty minutes on the line trying to make a phone call to my bank to sort out a card issue. Now that all of those tasks are finally out of the way, my stomach is completely empty. I'm going to pull over at the next diner I see to grab a quick bite to eat before heading back to the office. \""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 13 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q1%20(3).mp3",
          "question": "What time does the party start?",
          "options": [
            "Three o'clock",
            "Two o'clock",
            "Half past three"
          ],
          "correctAnswer": "Three o'clock",
          "transcript": "\"Hi everyone, I just wanted to update you on the schedule for the company anniversary celebration this afternoon. The catering staff will arrive at two o'clock to set up the buffet tables, and our guest speaker isn't scheduled to arrive until half past three. However, the main doors will open and the party itself will officially start at exactly three o'clock, so please ensure you are in the main hall by then.\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q67.mp3",
          "question": "Where is she taking the staff to?",
          "options": [
            "To a different country",
            "To the city center",
            "To the company's new office"
          ],
          "correctAnswer": "To a different country",
          "transcript": "\"As the regional manager, I usually organize our annual team-building event at the company headquarters downtown, or sometimes we just take a short weekend trip to a nearby city. This year, however, the team exceeded their sales targets by forty percent. To celebrate this massive achievement, I am taking all the staff across the border to a luxury resort in a different country for a four-day vacation.\""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q3%20(3).mp3",
          "question": "Which bus stop number is near the boy's house?",
          "options": [
            "Eight",
            "Six",
            "Ten"
          ],
          "correctAnswer": "Eight",
          "transcript": "\"If you are taking the public transit to visit my new apartment, make sure you board the line 6 express bus from the central station. The bus will pass by a large shopping mall near stop number ten, and then it will stop right outside the public library at stop number six. You need to stay on for one more stop and get off at stop number eight, which is located right at the corner of my street.\""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q69.mp3",
          "question": "Why can't he do that job today?",
          "options": [
            "He has another appointment",
            "He doesn't feel well",
            "He has to finish another project"
          ],
          "correctAnswer": "He has another appointment",
          "transcript": "\"Hi Sarah, regarding the kitchen repair job you requested, I'm afraid I won't be able to come over to fix it this afternoon. I'm feeling completely fine and healthy today, and I’ve actually already completed the plumbing project that kept me busy all week. However, I have a mandatory meeting scheduled with my accountant at the bank today, so this prior appointment means I’ll have to reschedule your repair for tomorrow morning. \""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q5%20(3).mp3",
          "question": "Which room will the director's presentation be in?",
          "options": [
            "The meeting room",
            "The training room",
            "The conference hall"
          ],
          "correctAnswer": "The meeting room",
          "transcript": "\"Good morning, team. Please note that the schedule for today's corporate events has been slightly adjusted. The onboarding session for the new interns will remain in the training room on the first floor, and the afternoon budget review has been moved to the large conference hall. As for the director's annual presentation, that will take place in the standard meeting room down the hall at 10 AM sharp.\""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q71.mp3",
          "question": "How much money is left in the kitchen?",
          "options": [
            "10 pounds",
            "5 pounds",
            "15 pounds"
          ],
          "correctAnswer": "10 pounds",
          "transcript": "\"Before I left the house this morning, I counted thirty pounds in cash sitting on the dining table. I took fifteen pounds with me to buy some groceries down the road, and I instructed my son to take another five pounds to pay for his bus fare to school. Therefore, if you check the small jar on the kitchen counter right now, you should find exactly ten pounds left inside. \""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q7%20(3).mp3",
          "question": "What is the new medical center next to?",
          "options": [
            "Train station",
            "The shopping mall",
            "The post office"
          ],
          "correctAnswer": "Train station",
          "transcript": "\"The city council has recently approved the construction of a modern healthcare facility to serve our growing local community. Many residents initially microfilm expected the facility to be built inside the commercial zone next to the grand shopping mall, while others petitioned to place it near the public park. In the end, the developers chose a vacant lot right adjacent to the central train station, ensuring it is easily accessible for commuters.\""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q73.mp3",
          "question": "What time do they arrange the meeting?",
          "options": [
            "5:30",
            "5:00",
            "6:00"
          ],
          "correctAnswer": "5:30",
          "transcript": "\"Hi everyone, I’m calling to update you on our project discussion scheduled for this evening. Our manager initially wanted us to gather in the main office at 5:00 p.m. sharp, but a few team members mentioned they couldn't finish their reports by then. We also considered pushing it back to 6:00 p.m., but that would mean staying too late after office hours. Therefore, we have decided to split the difference and lock in the meeting for half past five instead. See you all there!\""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q9%20(3).mp3",
          "question": "Which floor is the French class on?",
          "options": [
            "On the second floor",
            "On the first floor",
            "On the third floor"
          ],
          "correctAnswer": "On the second floor",
          "transcript": "\"Welcome to the language department building. If you are looking for the beginner Spanish seminar, please note that it has been moved down to the laboratory on the first floor. The advanced German lecture is currently being held at the top of the building on the third floor. For all students registered for the intermediate French course, your classroom is located right in the middle, on the second floor, just opposite the elevators.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/q75.mp3",
          "question": "The man has a new job. How many days does he have to work?",
          "options": [
            "Three days",
            "Four days",
            "Five days"
          ],
          "correctAnswer": "Three days",
          "transcript": "\"My new shift pattern at the logistics center is quite different from my previous corporate job. I used to work a standard routine of six days a week, which left me with almost no personal time at all. My manager recently offered me a standard four-day schedule, but I opted for the compressed hours program instead. Now, I only have to commute to the facility three days a week, performing longer shifts but enjoying a four-day weekend. \""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q11%20(3).mp3",
          "question": "What is this man going to do?",
          "options": [
            "Eat something",
            "Buy some food",
            "Go home"
          ],
          "correctAnswer": "Eat something",
          "transcript": "\"I’ve had a remarkably busy morning running errands all over town. I had to stop by the mall to go shopping for a new winter jacket, and right after that, I spent twenty minutes on the line trying to make a phone call to my bank to sort out a card issue. Now that all of those tasks are finally out of the way, my stomach is completely empty. I'm going to pull over at the next diner I see to grab a quick bite to eat before heading back to the office.\""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_28s%20(audio-joiner.com).mp3",
          "question": "What time is dinner?",
          "options": [
            "7:30 p.m.",
            "7:00 p.m.",
            "8:00 p.m."
          ],
          "correctAnswer": "7:30 p.m.",
          "transcript": "Man: Hi Rose, what time should we gather at the restaurant for dinner tonight? I finish my shift at ten to seven, so I can make it there by ten to eight. \nWoman: That's a bit late since the kitchen closes early. How about we split the difference and aim for half past seven instead? \nMan: That works perfectly. It gives me just enough time to head home first and change. Let's lock it in for 7:30 p.m. then. \nWoman: Great, see you there!"
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/up%202%20-%20q13%20(3).mp3",
          "question": "How much does a bus card cost?",
          "options": [
            "$20",
            "$15",
            "$25"
          ],
          "correctAnswer": "$20",
          "transcript": "\"Welcome to the city transit customer service desk. If you are looking to purchase standard single-trip tickets, they are currently ten dollars each. We also offer a weekly tourist pass for fifteen dollars which is valid on local routes only. However, if you want the best value for your daily commute, I highly recommend our premium monthly transit card. It costs exactly twenty dollars and gives you unlimited access to both buses and trains across all zones.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 12 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-q1.mp3",
          "question": "What does her sister drink?",
          "options": [
            "Tea",
            "Water",
            "Coffee"
          ],
          "correctAnswer": "Tea",
          "transcript": "\"My sister and I stopped by a local café yesterday afternoon to relax after our classes. I was feeling quite tired, so I ordered a large iced espresso with fresh milk to help me stay awake. My sister initially looked at the menu wanting a hot chocolate, but she decided to cut down on sugar this week. In the end, she asked the barista for a hot pot of herbal tea to sip while we chatted.\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q2.mp3",
          "question": "What is the population of this village?",
          "options": [
            "10.000",
            "40.000",
            "20.000"
          ],
          "correctAnswer": "10.000",
          "transcript": "\"Welcome to our beautiful countryside area! Many people are surprised to learn that a decade ago, this place was just a tiny settlement with only 5,000 residents. Over the last few years, however, many families have moved here from the big cities to enjoy a quieter lifestyle. While we haven't grown as large as the neighboring town with its 15,000 people, our community has certainly expanded. According to the latest official census released last month, the total population of this village is now right at 10,000 residents!\""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q3.mp3",
          "question": "Where does he want to go tomorrow?",
          "options": [
            "The town hall",
            "The cinema",
            "The park"
          ],
          "correctAnswer": "The town hall",
          "transcript": "\"I have a very busy schedule mapped out for my day off tomorrow. I originally planned to spend the morning reading at the central library, and I also needed to drop off a few packages at the main post office. However, I just received a notification regarding my residency registration documents. So, my main priority tomorrow is to head straight to the town hall to submit my application forms before noon.\""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q4.mp3",
          "question": "What floor is the office on?",
          "options": [
            "On the first floor",
            "On the second floor",
            "On the third floor"
          ],
          "correctAnswer": "On the first floor",
          "transcript": "\"Excuse me, if you're looking for the translation department office today, please note that the directory sign in the lobby hasn't been updated since the recent building renovation. They actually moved out of their old location on the second floor last week. They didn't move all the way down to the reception area on the ground floor either—they are just one level up. You will find the office right on the first floor, right next to the main elevators!\""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q5.mp3",
          "question": "Cost of bus",
          "options": [
            "2.5",
            "5.5",
            "3.5"
          ],
          "correctAnswer": "2.5",
          "transcript": "\"If you are planning to travel around the city center today, public transit is by far the most affordable option. Express subway trains charge a flat rate of three pounds fifty per trip, while short taxi rides usually start around ten pounds. However, if you take the local commuter transit, the cost of bus travel is just two pounds fifty for a single journey anywhere within the central zone.\""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q6.mp3",
          "question": "When can they play football at school?",
          "options": [
            "Wednesday afternoon",
            "Thursday afternoon",
            "Sunday afternoon"
          ],
          "correctAnswer": "Wednesday afternoon",
          "transcript": "\"Hi everyone, here is a quick notice regarding the schedule for playing football on the school sports field! Many students have asked if the pitch is open for recreational games on Monday morning, but the groundskeeper uses that time for routine maintenance on the grass. On Friday evening, the stadium is strictly reserved for the official track team practice. However, regular students are welcome to organize friendly matches during the designated open slot on Wednesday afternoon, right after secondary classes finish!\""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q7.mp3",
          "question": "Where is the office?",
          "options": [
            "Opposite the hotel",
            "Opposite the park",
            "Opposite the hospital"
          ],
          "correctAnswer": "Opposite the hotel",
          "transcript": "\"If you are coming to submit your research project documents at our regional administrative center today, here are the exact directions. Our building is located on the main boulevard downtown. You will pass the grand commercial bank on your right, but do not turn into the shopping mall nearby. Our main office is located directly opposite the hotel, right across the street with large glass entrance doors.\""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q8.mp3",
          "question": "A man is calling his wife. Where did they meet?",
          "options": [
            "Outside a shop",
            "At a café",
            "In a park"
          ],
          "correctAnswer": "Outside a shop",
          "transcript": "Man: Hi honey, I’ve arrived downtown to pick up the groceries. Where are you standing right now? \nWoman: I was waiting inside the train station, but it was far too noisy and crowded with commuters. \nMan: Did you go sit at the coffee shop across the road then? \nWoman: No, it was completely full. I walked down the street a bit and I’m standing right outside a shop selling cameras. You can park right in front of it."
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q9.mp3",
          "question": "What time does he have dinner these days?",
          "options": [
            "7 o'clock",
            "6 o'clock",
            "1 o'clock"
          ],
          "correctAnswer": "7 o'clock",
          "transcript": "\"My daily evening routine has changed quite a bit recently due to my new work schedule. I used to eat very early at 6 o'clock right after leaving the office, and during the winter, I often delayed meals until 8 o'clock. However, my doctor advised me to keep a consistent eating schedule for better digestion. These days, I make sure to sit down at the table and have dinner at exactly 7 o'clock every single night.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q10.mp3",
          "question": "What does he do after work?",
          "options": [
            "Play football",
            "Play badminton",
            "Play volleyball"
          ],
          "correctAnswer": "Play football",
          "transcript": "\"After sitting at my computer all day at the office, I always need to get some active exercise to unwind once my shift finishes. Some of my colleagues asked if I wanted to go to the cinema, but I had to pass. While I often enjoy going for a run around the neighborhood park or heading to the local gym, today is a bit different. I joined a community sports league this season, so I play football with my teammates every Tuesday evening right after work!\""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q11.mp3",
          "question": "What did they both like about the movie?",
          "options": [
            "The ending",
            "The actor",
            "The theme song"
          ],
          "correctAnswer": "The ending",
          "transcript": "Man: What were your overall thoughts on that new sci-fi film we watched last night? I found the soundtrack a bit too loud, to be honest. \nWoman: Yeah, the music was overwhelming, and I thought the visual effects looked a bit cheap in some scenes. \nMan: I agree. But that final plot twist in the last ten minutes was absolutely brilliant! I didn't see it coming at all. \nWoman: Same here! The ending was definitely the best part for both of us—it saved the entire film."
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q12.mp3",
          "question": "What area is he describing?",
          "options": [
            "A university area",
            "A mall",
            "A sport hall"
          ],
          "correctAnswer": "A university area",
          "transcript": "\"As you walk down this main avenue, you will immediately notice the energetic atmosphere surrounding the neighborhood. The streets are lined with affordable bookshops, lively student cafés, and modern lecture halls. Every morning, thousands of young adults and academic professors fill the sidewalks heading toward the central library and research centers. It is clearly defined as a vibrant university area.\""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2012%20-%20q13.mp3",
          "question": "A man wants to buy a new house. What is his biggest problem?",
          "options": [
            "Persuading his family",
            "Finding enough money",
            "Choosing the right location"
          ],
          "correctAnswer": "Persuading his family",
          "transcript": "\"I’ve been planning to relocate to a new house in the suburbs for months now. I’ve already secured enough savings, so getting a bank mortgage isn't an issue at all, and I’ve already found a fantastic property in a great location near a public park. However, my biggest problem right now is persuading my family. My wife and children are deeply attached to our current neighborhood, so convincing them to pack up and move is proving to be extremely difficult.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 11 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q1.mp3",
          "question": "What was his last job?",
          "options": [
            "An electrician",
            "A teacher",
            "A doctor"
          ],
          "correctAnswer": "An electrician",
          "transcript": "\"Looking back at my career history, I’ve worked in several technical trades over the years. I started out as a plumber fixing commercial heating systems, and later I spent a few years working as an auto mechanic at a busy garage downtown. However, right before I decided to retire and move to the countryside, my final position was working as an electrician for a major construction company, managing complex wiring installations.\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011-%20q2.mp3",
          "question": "What did she lose?",
          "options": [
            "A bag",
            "A hat",
            "A coat"
          ],
          "correctAnswer": "A bag",
          "transcript": "\"I just got back from checking the train station lost and found office, but unfortunately, I haven't had any luck yet. When I got off the train, I was so relieved that I was holding both my winter jacket and my wallet securely in my hands. However, I realized too late that I had left something behind on the overhead rack. I completely forgot my leather shoulder bag, which has all my university notebooks inside, so I really hope someone turns it in soon!\""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-q3.mp3",
          "question": "Who is his favourite teacher?",
          "options": [
            "Miss Brown",
            "Miss Andy",
            "Mr Brown"
          ],
          "correctAnswer": "Miss Brown",
          "transcript": "\"We had some wonderful educators during our secondary school years. Everyone loved Mr. Davis because his science experiments were always fun, and Mrs. Taylor was always very gentle during our literature lectures. However, if you ask me who had the greatest impact on my academic journey, Miss Brown was definitely my absolute favourite teacher. She was so passionate about teaching history that she made every single lesson feel like an exciting story.\""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q4.mp3",
          "question": "Why does the woman return the dress?",
          "options": [
            "Because of its size",
            "Because of its color",
            "Because it was damaged"
          ],
          "correctAnswer": "Because of its size",
          "transcript": "\"Hello! I bought this formal evening gown here yesterday, but I need to return it today for a refund. To be clear, there are no flaws with the fabric, there is no stain on it, and the color is absolutely beautiful. However, when I tried it on after getting home, it was far too tight around the waist. Since the store doesn't have a larger option in stock for me to exchange, I am returning it simply because of its size.\""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q5.mp3",
          "question": "What is his opinion about that restaurant?",
          "options": [
            "The service is slow",
            "He finds it too expensive",
            "He doesn’t like the food there"
          ],
          "correctAnswer": "The service is slow",
          "transcript": "\"My friends and I went to try that new dining spot near the harbor last night. The atmosphere was quite vibrant, the prices were surprisingly reasonable, and the food itself was hot and delicious. However, our main complaint was about the staff efficiency. We had to wait over forty-five minutes just to get our appetizers, and another hour for the main course. Overall, my main opinion about that restaurant is that the service is slow.\""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q6.mp3",
          "question": "Where are the students now?",
          "options": [
            "In a townhouse",
            "Library",
            "Sport hall"
          ],
          "correctAnswer": "In a townhouse",
          "transcript": "\"Hi everyone, I'm just calling to give you an update on where our study group is meeting today to prepare for the presentation! We initially planned to gather in the school library, but it was completely full, and we couldn't meet in the public park either because it started raining outside. Luckily, Huy invited us over to his place instead. So right now, we are all sitting and working together in the living room of a townhouse right down the street from the campus. Come on over and join us!\""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q7.mp3",
          "question": "When will Anna meet her friend?",
          "options": [
            "9 a.m. on Sunday",
            "9 a.m. on Saturday",
            "9 a.m. on Monday"
          ],
          "correctAnswer": "9 a.m. on Sunday",
          "transcript": "\"Hi everyone, I'm leaving a quick message for Anna regarding our weekend catch-up. We initially thought about getting together at 9 a.m. on Saturday, but she mentioned she had morning lectures. We also considered pushing it to 10 a.m. on Sunday, but the cafe gets extremely crowded by mid-morning. Therefore, we’ve agreed that Anna will meet her friend at 9 a.m. on Sunday right outside the central subway station instead.\""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q8.mp3",
          "question": "Which button should the man press to buy a new computer?",
          "options": [
            "Three",
            "Two",
            "Six"
          ],
          "correctAnswer": "Three",
          "transcript": "\"Hello and thank you for calling the Tech Direct customer service helpline! If you have questions regarding our desktop repair services, please press One. To check the current delivery status of an existing order, press Two. Finally, if you would like to browse our store catalog and speak directly with a sales advisor to buy a new computer, please press Three.\""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q9.mp3",
          "question": "How many pages of the assignment?",
          "options": [
            "4",
            "5",
            "8"
          ],
          "correctAnswer": "4",
          "transcript": "\"Attention language students, please take note of the formatting requirements for your upcoming mid-term paper. Last year, students submitted long essays of six pages, which was a bit excessive. Some of you asked if a short summary of two pages would be acceptable, but that won't cover all the necessary methodology. To keep it concise yet thorough, the syllabus states that the final draft of the assignment must be exactly 4 pages long.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q10.mp3",
          "question": "What is his opinion about sea transport?",
          "options": [
            "The use of technology will increase",
            "It is slow but reliable",
            "It is environmentally friendly"
          ],
          "correctAnswer": "The use of technology will increase",
          "transcript": "\"Many people wonder if international shipping and sea transport will slowly decline as air freight becomes more popular, or if shipping costs will become much higher in the future. In my view, maritime trade remains the backbone of global commerce, but it is undergoing a massive transformation. As autonomous navigation, smart logistics, and automated ports continue to expand, my strong belief is that the use of technology will increase dramatically across the entire industry to boost efficiency.\""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q11.mp3",
          "question": "What is not working?",
          "options": [
            "The computer",
            "TV",
            "The mouse"
          ],
          "correctAnswer": "The computer",
          "transcript": "\"I arrived at the office early this morning to finalize my research abstract before the morning deadline. The main lights turned on fine, and the wireless printer printed out my documents with no issues at all. However, when I sat down at my desk and hit the power switch on my workstation, the screen stayed completely black. I tried plugging it into different sockets, but it's clear that the computer is not working at all today.\""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q12.mp3",
          "question": "What did he leave in the yard?",
          "options": [
            "Shoes",
            "Hat",
            "Coat"
          ],
          "correctAnswer": "Shoes",
          "transcript": "\"When the rain started pouring down this afternoon, I rushed inside the house as fast as I could! I hung my wet coat on the rack in the hallway, and I dropped my school bag right onto the sofa in the living room. I thought I had brought everything inside with me, but then I looked out the back window onto the grass. Oh no! I completely forgot my muddy trainers outside. I left those shoes right in the middle of the yard!\""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2011%20-%20q13.mp3",
          "question": "What did the two people buy?",
          "options": [
            "Trousers",
            "Computer",
            "Shirt"
          ],
          "correctAnswer": "Trousers",
          "transcript": "\"My brother and I went shopping at the menswear store downtown this morning to refresh our wardrobe for work. We spent a lot of time looking at casual linen shirts, and I tried on a few denim jackets, but we didn't end up getting those. Since both of us needed formal attire for our new corporate jobs, we decided to take advantage of a 'buy one, get one half-off' promotion and we both bought matching formal trousers instead.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 10 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q1.mp3",
          "question": "Why did he call his friend?",
          "options": [
            "Suggest a drink",
            "Suggest a food",
            "Suggest a shirt"
          ],
          "correctAnswer": "Suggest a drink",
          "transcript": "\"Hi Clara, it's me! I'm just calling to see if you're free after your French class this evening. I've already eaten dinner, so I wasn't calling to grab a full meal or invite you to a big party, but I was thinking we could head downtown to relax for a bit. I wanted to call and suggest a drink at that new rooftop café near the train station. I heard their fruit juices and mocktails are fantastic, and it would be a lovely way to unwind together after class!\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q2.mp3",
          "question": "When did they decide to meet?",
          "options": [
            "9am on Sunday",
            "10am on Sunday",
            "9am on Saturday"
          ],
          "correctAnswer": "9am on Sunday",
          "transcript": "\"Hi Everyone, I'm just calling to finalize our weekend jogging group plans. We initially thought about getting together at 9 a.m. on Saturday, but a few members mentioned they had morning chores and fitness classes. We also considered pushing it to 10 a.m. on Sunday, but the sun gets a bit too hot by then. Therefore, we’ve locked in our schedule for 9 a.m. on Sunday morning at the park entrance instead. See you all there!\""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-q3.mp3",
          "question": "A girl is calling her mother. Which dress does she want?",
          "options": [
            "Long and red",
            "Long and black",
            "Short and red"
          ],
          "correctAnswer": "Long and red",
          "transcript": "Daughter: Hi Mum, I’m at the boutique right now trying on outfits for the university gala next week. Could you help me decide? \nMother: Sure, dear. Did you find that short blue dress you were looking at online? \nDaughter: I tried it on, but the color looked a bit washed out on me. I also tried a short red one, but it felt a bit too casual for a formal evening. \nMother: So which one stood out to you? \nDaughter: There’s a gorgeous long and red gown on the display rack. It fits perfectly and looks very elegant, so that's the one I definitely want!\nDaughter: Hi Mum, I’m at the boutique right now trying on outfits for the university gala next week. Could you help me decide? \nMother: Sure, dear. Did you find that short blue dress you were looking at online? \nDaughter: I tried it on, but the color looked a bit washed out on me. I also tried a short red one, but it felt a bit too casual for a formal evening. \nMother: So which one stood out to you? \nDaughter: There’s a gorgeous long and red gown on the display rack. It fits perfectly and looks very elegant, so that's the one I definitely want!"
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q4.mp3",
          "question": "What day is the new appointment?",
          "options": [
            "Thursday 13th",
            "Friday 13th",
            "Thursday 15th"
          ],
          "correctAnswer": "Thursday 13th",
          "transcript": "\"Good morning, this is the reception desk at the Central Health Clinic calling for Mr. Nguyen. We are calling regarding your dental check-up originally scheduled for Tuesday the 11th. Unfortunately, the dentist has an emergency conference on Wednesday the 12th, so we need to reschedule your visit. We have opened a new slot for you on Thursday 13th at 2:00 p.m. Please call us back if this date works for you.\""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q5.mp3",
          "question": "A man is calling his wife. Where did they meet?",
          "options": [
            "Outside a shop",
            "Outside an office",
            "At home"
          ],
          "correctAnswer": "Outside a shop",
          "transcript": "Man: Hi honey, I’ve arrived downtown to pick up the groceries. Where are you standing right now? \nWoman: I was waiting inside the train station, but it was far too noisy and crowded with commuters. \nMan: Did you go sit at the coffee shop across the road then? \nWoman: No, it was completely full. I walked down the street a bit and I’m standing right outside a shop selling cameras. You can park right in front of it."
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q6.mp3",
          "question": "What did she do last weekend?",
          "options": [
            "Stayed at home",
            "Watched a movie",
            "Went out with her friends"
          ],
          "correctAnswer": "Stayed at home",
          "transcript": "\"Most of my classmates spent their weekend driving down to the coast to swim at the beach, and a few went to the countryside to visit their relatives. I was initially planning to join a photography trip around the city, but I started feeling quite exhausted from my university exams. In the end, I cancelled my plans and stayed at home all weekend, reading nutrition books and catching up on my sleep.\""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q7.mp3",
          "question": "How many weeks have they been in India?",
          "options": [
            "2 weeks",
            "3 weeks",
            "1 weeks"
          ],
          "correctAnswer": "2 weeks",
          "transcript": "\"We just got back yesterday from an incredible holiday trip across South Asia, and it was truly an unforgettable experience! When we first planned the journey, we originally booked a short one-week tour to visit the historic monuments. However, once we arrived, we fell so deeply in love with the local culture, food, and landscapes that we decided to extend our itinerary. By the time we flew back home, we had spent exactly 2 weeks exploring different regions of India!\""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/TTSOL-en-US-Brian-20260727-181123.mp3",
          "question": "Where is the office?",
          "options": [
            "Opposite the hotel",
            "Next the hotel",
            "Opposite the mall"
          ],
          "correctAnswer": "Opposite the hotel",
          "transcript": "\"If you are coming to drop off your research abstract documents at our translation company today, here are quick directions. Our building is located on the main boulevard downtown. You will pass the grand commercial bank on your right, but do not turn into the shopping mall nearby. Our main office is located directly opposite the hotel, right across the central street with the large glass doors.\""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q9.mp3",
          "question": "Where do they wait for the bus?",
          "options": [
            "By the hotel’s main entrance",
            "Near the school",
            "Outside the station"
          ],
          "correctAnswer": "By the hotel’s main entrance",
          "transcript": "\"Hi everyone, I’m leaving a quick update regarding the tourist shuttle for our city tour this morning. If you were taking the public commuter buses, you would need to walk two blocks down to the central bus station or wait in front of the museum. However, since we are staying here as a group, it is much more convenient for us. The driver will pull up right by the hotel’s main entrance, so please make sure you are waiting outside the front glass doors when the bus arrives.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q10.mp3",
          "question": "What does his wife like to do?",
          "options": [
            "Photography",
            "Cooking",
            "Gardening"
          ],
          "correctAnswer": "Photography",
          "transcript": "\"My wife and I have different ways to relax during our weekend leisure time. While I prefer active exercise like jogging around the local lake or doing gymnastics at the gym, her creative passion lies elsewhere. She doesn't spend much time cooking complicated dishes either. Instead, whenever we travel or go for walks in scenic parks, she always brings her camera along because photography is what she truly loves to do.\""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q11.mp3",
          "question": "What outdoor activities do they do in the afternoon?",
          "options": [
            "Play golf",
            "Play football",
            "Play chess"
          ],
          "correctAnswer": "Play golf",
          "transcript": "\"Welcome to our weekend sports resort! I wanted to give everyone a quick breakdown of our group schedule for today. In the morning, while the weather is nice and cool, we have reserved the outdoor court so everyone can play tennis together. After lunch, instead of taking a swim at the pool, we will move out to the green fairways for our main feature. We’ve organized a friendly tournament where everyone will play golf while enjoying the afternoon sunshine!\""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q12.mp3",
          "question": "A woman is introducing a concert. The concert will end with?",
          "options": [
            "The city’s favorite group",
            "A special guest appearance",
            "A fireworks display"
          ],
          "correctAnswer": "The city’s favorite group",
          "transcript": "\"Good evening, music lovers, and welcome to the annual summer charity festival. We have a fantastic lineup prepared for you tonight. We will open the show with a short speech by the event organizer, followed immediately by a classical solo violin performance on the main stage. Finally, to close out this memorable night on a high note, the concert will end with an energetic performance from the city’s favorite group.\""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%2010%20-%20q13.mp3",
          "question": "What was the writer's first job?",
          "options": [
            "Teacher",
            "Writer",
            "Doctor"
          ],
          "correctAnswer": "Teacher",
          "transcript": "\"Many readers who look up my biography online notice that I spent five years working as a newspaper journalist before publishing my bestselling novels, and that I also worked briefly as a university librarian later on. Because of that, people often assume that journalism was my very first profession after graduating. However, that wasn't the case! Right after leaving university, my very first career was actually working as a teacher, which gave me so many great experiences before I eventually transitioned into writing full-time.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 09 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q1.mp3",
          "question": "How does he feel?",
          "options": [
            "Sick",
            "Happy",
            "Funny"
          ],
          "correctAnswer": "Sick",
          "transcript": "\"I was really looking forward to joining my university friends for a gym workout and a jog around the neighborhood this afternoon, and I felt so excited about it yesterday. However, I woke up with a terrible fever and a severe headache today. It’s a huge shame because I don't just feel tired from studying late; I actually feel quite sick, so I’ll have to stay in bed and miss the session entirely.\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q2.mp3",
          "question": "How long does it take to get to the station?",
          "options": [
            "20 minutes",
            "30 minutes",
            "70 minutes"
          ],
          "correctAnswer": "20 minutes",
          "transcript": "\"Hi everyone, I'm just leaving a quick message to confirm our meeting outside the train station at 6 PM. I was checking the navigation map earlier, and traffic on the main roads looks quite heavy tonight. Normally, if I take the local bus from my house, the journey takes about thirty or forty minutes. Fortunately, I’ve decided to take the new subway line instead, which bypasses all the traffic. It's going to take me exactly 20 minutes to get to the station, so I'll be there right on time!\""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q3.mp3",
          "question": "What did he call to say?",
          "options": [
            "To say thank you",
            "To say goodbye",
            "To say apologize"
          ],
          "correctAnswer": "To say thank you",
          "transcript": "\"Hi Anna, it's David. I'm just leaving a quick voicemail because your line was busy. I already know the way to the French department's new building, so I didn't call to ask for directions, and our meeting for tomorrow is still on. I just wanted to call to say thank you for helping me proofread my scientific research abstract yesterday. Your feedback was incredibly useful, and I really appreciate your time!\""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q4.mp3",
          "question": "Who is coming to visit him this weekend?",
          "options": [
            "His sister and her children",
            "His friends",
            "His parents"
          ],
          "correctAnswer": "His sister and her children",
          "transcript": "\"I'm really looking forward to the upcoming weekend! Most of my university friends are busy studying for their mid-term exams, so we couldn't organize a dinner together. I initially thought my parents were driving down from our hometown, but they had to change their travel schedule at the last minute. Fortunately, I won't be spending the weekend alone at all. My sister and her children are catching the morning train to come to the city, and I'm planning to take my niece and nephew to the public park on Saturday!\""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q5.mp3",
          "question": "What time is the meeting?",
          "options": [
            "2pm",
            "3pm",
            "1pm"
          ],
          "correctAnswer": "2pm",
          "transcript": "\"Good afternoon, team. Please note a quick adjustment to our schedule for the afternoon corporate presentations. The marketing team initially requested to gather at one o'clock, and the notice on the board says we might push it to three o'clock. To clarify, the director has a flight later, so we have locked in the meeting for exactly 2 p.m. sharp. Please ensure you are in the conference hall by then.\""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q6.mp3",
          "question": "Why can't she pick up her child?",
          "options": [
            "Stay late at the office",
            "Her car has broken down",
            "She is stuck in a meeting"
          ],
          "correctAnswer": "Stay late at the office",
          "transcript": "\"Hi honey, I'm leaving a quick message because I need a massive favor this afternoon. My car is running completely fine today, and I've already finished my doctor's appointment earlier this morning. However, my manager just handed me an urgent project report that has to be submitted before midnight. Because of this, I have to stay late at the office to wrap everything up, so I won't be able to collect our daughter from school. Could you please go pick her up for me?\""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-q7.mp3",
          "question": "How much do the cleaning products cost?",
          "options": [
            "One pound fifty",
            "One pound sixty",
            "Two pound fifty"
          ],
          "correctAnswer": "One pound fifty",
          "transcript": "\"Welcome to the local supermarket bargain aisle. Today, we have special discounts on various household goods. Our lavender air fresheners are priced at two pounds fifty, and the large bottles of laundry detergent are on sale for three pounds fifty. If you look right here on the lower shelf, our eco-friendly cleaning products cost exactly one pound fifty this week, which is an excellent price for stocking up.\""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q8.mp3",
          "question": "Where is she going with her family?",
          "options": [
            "The mountains",
            "The waterfall",
            "The museum"
          ],
          "correctAnswer": "The mountains",
          "transcript": "\"My family and I have been discussing our upcoming summer holiday plans for weeks. We initially considered going down to the seaside because the weather is perfect for the beach, and my brother was really keen to tour a historic city to see the ancient architecture. However, my mother prefers a much quieter environment where we can relax closer to nature. In the end, we decided to book a stay up in the Mountains instead, renting a beautiful wooden cabin where we can spend the whole week hiking and enjoying the fresh air.\""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209-%20q9.mp3",
          "question": "What did he usually do last year?",
          "options": [
            "Cycling",
            "Hiking",
            "Biking"
          ],
          "correctAnswer": "Cycling",
          "transcript": "\"My fitness routine has evolved quite a bit over the last few years. Nowadays, I spend most of my free time doing gymnastics at the sports club or jogging around the lake to improve my stamina. However, my routine was quite different last year. I used to be obsessed with long-distance road trips on my bicycle, so cycling was what I usually did every single weekend last year to stay active.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q10.mp3",
          "question": "How many minutes did he have to speak?",
          "options": [
            "15",
            "20",
            "25"
          ],
          "correctAnswer": "15",
          "transcript": "\"My scientific research presentation at the university conference went really well yesterday, though the schedule was extremely tight with so many speakers. The organizers initially told us we would only get ten minutes each, which was barely enough time to explain my research methodology and findings. Fortunately, a few delegates canceled at the last minute, so the chairperson adjusted the timetable and allowed me exactly 15 minutes on stage to deliver my talk!\""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q11.mp3",
          "question": "Who does she live with?",
          "options": [
            "Best friends",
            "Her family",
            "Boy friend"
          ],
          "correctAnswer": "Best friends",
          "transcript": "\"When I first relocated to Ho Chi Minh City to start my university degree, I briefly stayed with my relatives and family in District 3, and I also considered renting a tiny studio apartment to live alone. In the end, I decided that sharing expenses would be much better. I moved into a spacious flat near the campus, and now I live with my best friends from the French department. We get along perfectly and always cook dinner together.\""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q12.mp3",
          "question": "Why does she want to be a writer?",
          "options": [
            "Help people",
            "To earn a living",
            "To express her ideas"
          ],
          "correctAnswer": "Help people",
          "transcript": "\"I've been spending a lot of time drafting short stories, essays, and articles lately, and people often ask what my ultimate career goal is. Becoming a famous author to earn a lot of money isn't my motivation at all, and I don't particularly care about traveling the world for book signings either. The main driving force behind my creative writing is much simpler: I want to write books on nutrition and mental well-being that can offer practical advice and help people improve their daily lives. Knowing that my words can make a positive difference for others is all that truly matters to me.\""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%209%20-%20q13.mp3",
          "question": "Why was the flight canceled?",
          "options": [
            "Poor weather conditions",
            "Technical problem",
            "Not enough passengers"
          ],
          "correctAnswer": "Poor weather conditions",
          "transcript": "\"Attention all passengers waiting at gate number nine for flight VN250 to Paris. We regret to inform you that this service will not be departing today. The airline crew has already resolved the minor technical difficulties with the aircraft engine, and there are no issues with a pilot strike. However, due to a sudden and severe blizzard causing poor weather conditions at our destination airport, the aviation authority has officially canceled the flight for safety reasons.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 08 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q1.mp3",
          "question": "Which room will they study in?",
          "options": [
            "Room 301",
            "Room 303",
            "Room 302"
          ],
          "correctAnswer": "Room 301",
          "transcript": "\"Good morning, language students. Please listen carefully to a quick schedule change regarding the intermediate French lecture today. The class was originally scheduled to be held in the basement laboratory in Room 103, and the notice on the board incorrectly states that we are moving to Room 201. To clarify, those rooms are currently occupied, so you will actually study in Room 301 on the third floor instead. Please head up there now so we can begin on time.\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q2.mp3",
          "question": "What time is the football match?",
          "options": [
            "1pm",
            "3pm",
            "1am"
          ],
          "correctAnswer": "1pm",
          "transcript": "\"Hi everyone, I’m just calling to confirm our plans for heading to the stadium together today. A few people asked if the football match kicks off at eleven in the morning, but those are just the junior league games. The main championship match was originally set for 3:00 p.m., but the organizers decided to move the schedule up to avoid the evening heat. So, please make sure you are in your seats before 1:00 p.m. because that is when the match officially begins.\""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q3.mp3",
          "question": "What is the phone number of the shop?",
          "options": [
            "20 10 30",
            "20 20 30",
            "30 20 10"
          ],
          "correctAnswer": "20 10 30",
          "transcript": "\"Thank you for listening to our local business directory broadcast. If you are looking to contact the new organic grocery market in District 1 to check their stock of fresh spring rolls, please note down their details. Their old service line, which ended in 20, is no longer active. You can reach the front desk directly by dialing twenty, ten, thirty. I repeat, the official hotline for the shop is 20.10.30.\""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q4.mp3",
          "question": "What did they bring for the picnic?",
          "options": [
            "Food",
            "Water",
            "Clothes"
          ],
          "correctAnswer": "Food",
          "transcript": "Man: Hey, did you pack the chess set and those board games for our afternoon picnic in the park? \nWoman: No, I thought the weather was too windy to play games outdoors, so I left them on the table. \nMan: Ah, that's a shame. Did you at least bring some portable speakers so we can listen to some music? \nWoman: I forgot those too, I'm afraid! But don't worry, I made sure to fill the basket with plenty of delicious sandwiches, fresh fruit, and snacks, so we have more than enough food to enjoy."
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q5.mp3",
          "question": "How many copies did he sell?",
          "options": [
            "Over 300000 copies",
            "300000 copies",
            "Under 300000 copies"
          ],
          "correctAnswer": "Over 300000 copies",
          "transcript": "\"When I first published my debut novel about university life, my literary agent told me we would be lucky to clear one hundred thousand copies in the first year. The publisher was slightly more optimistic, setting a target of two hundred thousand. However, the book completely went viral on social media sports magazines and blogs. I am absolutely thrilled to announce that we have officially sold over 300,000 copies worldwide, which is beyond my wildest dreams.\""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/TTSOL-en-US-Aria-20260727-175320.mp3",
          "question": "Where did they go last year?",
          "options": [
            "Camping",
            "Hiking",
            "Biking"
          ],
          "correctAnswer": "Camping",
          "transcript": "\"My family and I are currently planning our upcoming summer holiday. We are considering booking a cozy wooden cabin up in the mountains this time because my mother prefers a proper bed, and we've already been to the beach a couple of times in the past. However, our trip last summer was completely different and quite an adventure. We decided to go camping in the national forest, spending a whole week sleeping in tents under the stars, which was a wonderful experience for all of us.\""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q7.mp3",
          "question": "What do they plan to do together?",
          "options": [
            "Make plans later",
            "Do homework",
            "Go to the museum"
          ],
          "correctAnswer": "Make plans later",
          "transcript": "Man: Hey Mary, are we still going to the cinema to catch that new French documentary tonight, or should we stay home and cook dinner? \nWoman: Honestly, my university research deadline was just moved up, so I’m completely stressed and don't have time for either option right now. \nMan: Oh, I understand completely. Don't worry about it. \nWoman: Thanks for understanding. Let’s just focus on our assignments today and make plans later in the week once we are both completely free."
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q8.mp3",
          "question": "What does the man drink?",
          "options": [
            "Iced tea",
            "Water",
            "Coffee"
          ],
          "correctAnswer": "Iced tea",
          "transcript": "\"I usually start my morning with a very strong cup of black coffee to help me wake up before heading to the office. When I feel stressed in the afternoon, I sometimes switch to hot herbal tea to soothe my throat. However, today the summer weather in the city is incredibly hot and humid, so I need something refreshing. I’ve just ordered a large glass of sweetened iced tea with lemon, and it’s perfect for cooling down.\""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q9.mp3",
          "question": "Who did she take the picture of?",
          "options": [
            "The girl's team",
            "Children",
            "Family"
          ],
          "correctAnswer": "The girl's team",
          "transcript": "\"I brought my professional camera down to the sports complex this morning to cover the events. I initially planned to take photos of the boy's football team during their match, but my sports magazine editor asked me to focus on the regional gymnastics tournament instead. Rather than focusing on individual routines, I spent most of the session capturing the synchronized group performances. In the end, I managed to take some incredible photos of the girl’s team celebration right after they won the gold medal!\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208-%20q10.mp3",
          "question": "Where do they go when they travel to India?",
          "options": [
            "Go to the park",
            "Food",
            "People"
          ],
          "correctAnswer": "Go to the park",
          "transcript": "\"When international tourists book holiday packages to India, most travel guides recommend spending a week relaxing by the sunny beaches in the south, or exploring the massive modern shopping malls in New Delhi. However, if you want a truly authentic and peaceful experience, you should do what the locals do. Whenever my family travels there, we always make sure to go to the park reserves to view the historic monuments and native wildlife in the early mornings.\""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q11.mp3",
          "question": "What is the weather like today?",
          "options": [
            "Cold and wet",
            "Cloudy",
            "Sunny"
          ],
          "correctAnswer": "Cold and wet",
          "transcript": "\"Good morning listeners, and welcome to your local morning weather update. If you were hoping for a bright and sunny sky like we experienced yesterday, I'm afraid you will be disappointed. A heavy low-pressure system has moved in over the city, replacing the warm and windy conditions. You will absolutely need your heavy coats and umbrellas before stepping outside today because it is going to stay cold and wet until midnight.\""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q12.mp3",
          "question": "How did he adjust the meeting?",
          "options": [
            "Having the meeting without him",
            "Changing the time",
            "Moving it online"
          ],
          "correctAnswer": "Having the meeting without him",
          "transcript": "\"Hi everyone, I'm calling to leave an urgent message regarding our budget presentation scheduled for this afternoon. My car completely broke down on the highway, and the mechanic says it will take hours to fix, so I won't be able to make it back to the office today. Since our project deadline is far too tight, I don't want us to postpone the session to tomorrow or try moving it to an online video platform. Instead, please adjust the plan by having the meeting without him. The vice manager has all my presentation notes and can lead the discussion smoothly.\""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%208%20-%20q13.mp3",
          "question": "Which door do they need to take to get to Edinburgh?",
          "options": [
            "Two",
            "One",
            "Four"
          ],
          "correctAnswer": "Two",
          "transcript": "\"Attention all passengers traveling on the northern railway lines. The morning commuter service to London will be boarding through the gates at Door One, and the delayed holiday express to Wales is now open at Door Three. For all travelers holding tickets for the express rail heading directly to Edinburgh, please proceed immediately to the central platform and pass through Door Two to board the train.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 07 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q1.mp3",
          "question": "Where does she walk every night?",
          "options": [
            "The college",
            "The park",
            "The mall"
          ],
          "correctAnswer": "The college",
          "transcript": "\"Living in the city center gives me plenty of scenic routes for exercise. I used to go for a jog around the local lake during the weekends, and sometimes I'd meet my cousins for a stroll in the public park. However, since my evening classes finish quite late and the streets get dark, I prefer to stay within a secure area. Every night, without fail, I spend half an hour walking around the lit paths of the college campus before heading back to my dormitory.\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%207%20-%20q2.mp3",
          "question": "How many chairs do they need to prepare for a meeting?",
          "options": [
            "20",
            "30",
            "60"
          ],
          "correctAnswer": "20",
          "transcript": "\"Hi everyone, I’m calling to update you on the setup for our department presentation in the main conference room this afternoon. We initially sent out invitations to thirty staff members, but half of them are traveling for a research project and sent their apologies, which would have left us with just fifteen attendees. However, our professor and four senior guests from the French department confirmed they will join us at the last minute. Therefore, please make sure you prepare exactly twenty chairs in total before the meeting starts.\""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20%20-%20q3.mp3",
          "question": "Where did she ask the coffee shop to look for her lost item?",
          "options": [
            "In the corner",
            "On the table",
            "Next the door"
          ],
          "correctAnswer": "In the corner",
          "transcript": "\"Hi, I’m calling because I think I left my study folder at your café about an hour ago. I initially sat at the bright table near the window, but the sunlight was too strong, so I moved over to the small table tucked away right in the far corner. Could you please check that specific area for me? It's a blue folder containing my university abstracts, so it shouldn't be too hard to spot.\""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q4.mp3",
          "question": "Where did they meet?",
          "options": [
            "The front entrance",
            "At home",
            "The office"
          ],
          "correctAnswer": "The front entrance",
          "transcript": "Man: Hi Ngoc, I’ve just arrived at the cultural center. The main lobby is incredibly packed today. Should I look for you outside the ticket office? \nWoman: No, it's way too crowded to stand around there. I also noticed the traffic is terrible near the bus stop across the street, so avoid that area too. \nMan: Okay, so where are you standing right now? \nWoman: I’m waiting right by the main glass doors at the front entrance of the building. You can't miss me, I'm wearing a blue jacket!"
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q5.mp3",
          "question": "The daughter is calling her father. What did she buy?",
          "options": [
            "A dress",
            "A hat",
            "A coat"
          ],
          "correctAnswer": "A dress",
          "transcript": "Hi Dad, it's My. I'm just calling to let you know I finished my shopping trip downtown. I spent ages in the footwear store looking at some trainers for my gymnastics class, and I was also tempted by a lovely leather handbag on sale. However, I decided to be practical since I have a university gala next week. In the end, I went to the boutique and bought a beautiful formal dress instead. I think you'll really like it!\""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q6.mp3",
          "question": "There will be a school party soon, what should the teacher prepare?",
          "options": [
            "Order the food",
            "Order the pizza",
            "Order the drink"
          ],
          "correctAnswer": "Order the food",
          "transcript": "Good morning, everyone! I wanted to give you a quick update on our end-of-term school party preparations. The student committee has already taken care of most of the arrangements — all the invitations were emailed to parents last week, and they've already set up the sound system and music playlist in the main hall. The only remaining task for the teaching staff is handling the catering. So, I will be calling the restaurant this morning to officially order the food and refreshments for our fifty guests."
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q7.mp3",
          "question": "When will she need a computer?",
          "options": [
            "Friday",
            "Monday",
            "Thursday"
          ],
          "correctAnswer": "Friday",
          "transcript": "\"Thank you for contacting the university IT service desk. I'd like to rent a laptop for my upcoming mid-term exams. My preparation seminar starts on Wednesday morning, but I can easily use the library desktops for that. My actual exam takes place on Saturday, but the regulations require us to test our software twenty-four hours in advance. Therefore, I will absolutely need the computer delivered to my desk by Friday afternoon.\""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q8.mp3",
          "question": "What country will they study next semester?",
          "options": [
            "France",
            "US",
            "Germany"
          ],
          "correctAnswer": "France",
          "transcript": "\"I really enjoyed our European geography lectures this term, especially learning about the historic cities in England. I was initially curious if the curriculum committee would shift our focus toward North America and Canada for the upcoming term. However, I checked the new syllabus outline yesterday afternoon. Because our department is expanding its language programs, we are going to study the regional culture and history of France instead next semester, which is going to be fantastic for our degree!\""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q9.mp3",
          "question": "What do they need to repair for the building?",
          "options": [
            "Windows",
            "The roof",
            "The heating system"
          ],
          "correctAnswer": "Windows",
          "transcript": "\"Attention all residents of the campus apartment complex. The maintenance crew will be conducting structural upgrades throughout next week. We initially planned to fix the leaks in the main roof, but that project has been delayed until the dry season. The main entrance front door is also in good condition. Instead, the workers will focus entirely on replacing the cracked glass panes and sealing the frames of all the windows across the building to improve energy efficiency.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q10.mp3",
          "question": "What does the actor like to do?",
          "options": [
            "Drawing",
            "Singing",
            "Hiking"
          ],
          "correctAnswer": "Drawing",
          "transcript": "\"Welcome back to the talk show! Today, world-famous actor David Vance shared how he unwinds when he isn't on a movie set. While many of his co-stars love to play video games or go jogging in the park to stay active, David prefers a much quieter, creative hobby. He mentioned that after a busy shoot, he loves spending his quiet afternoons alone in his studio drawing and sketching charcoal portraits to help clear his mind.\""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q11.mp3",
          "question": "What new thing is being built at the school?",
          "options": [
            "A Performance space",
            "A new library",
            "A sport hall"
          ],
          "correctAnswer": "A Performance space",
          "transcript": "\"Good morning students and faculty. The school board is thrilled to announce our new campus expansion fund. While many departments petitioned for a brand-new science laboratory, and the athletics club wanted to upgrade the football field into a massive sports stadium, the budget was allocated elsewhere. The construction crew will break ground next month to build a modern performance space, featuring a grand stage and seats for five hundred people to host our plays and concerts.\""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-q12.mp3",
          "question": "What does he like about Dubai?",
          "options": [
            "He enjoys his job here",
            "People",
            "Food"
          ],
          "correctAnswer": "He enjoys his job here",
          "transcript": "\"Hi everyone, I just wanted to share a quick update on how I'm adjusting to my new life in Dubai. To be honest, the hot weather here is quite intense, so I spend most of my time indoors, and while the modern architecture is impressive, after a few weeks it just feels normal to me. What truly makes the relocation worth it is my career. The company environment is fantastic and I really enjoy my job here - the marketing projects are challenging and my colleagues are wonderful!\""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%207%20-%20q13.mp3",
          "question": "What does he advise young people to do to save money?",
          "options": [
            "Cook for yourself",
            "Avoid unnecessary spending",
            "Save a small amount regularly"
          ],
          "correctAnswer": "Cook for yourself",
          "transcript": "\"As a personal finance advisor, I often talk to university students who are struggling to manage their monthly allowance. A lot of blogs suggest selling your vehicle to use public transit, or buying second-hand clothes, which can save a small amount. However, the biggest financial leak for youth today is dining out. My number one piece of advice if you want to protect your bank account is to cook for yourself. Preparing basic meals at home will instantly cut your food expenses by half.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 06 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q1.mp3",
          "question": "Why did he call his friend?",
          "options": [
            "Suggest a drink",
            "Suggest a job",
            "Suggest a place"
          ],
          "correctAnswer": "Suggest a drink",
          "transcript": "Man: Hey Clara, are you free after your French class this evening? I was thinking we could head downtown to relax.\nWoman: Hi! I don't have any major plans. Did you want to go grab some dinner?\nMan: I've actually already eaten, but I wanted to call and suggest a drink at that new rooftop café near the station. I heard their hot chocolate and fruit juices are fantastic.\nWoman: Oh, that sounds like a lovely way to unwind. Let's do it!"
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q2.mp3",
          "question": "How much does the smallest car cost?",
          "options": [
            "3250 pounds",
            "2530 pounds",
            "1500 pounds"
          ],
          "correctAnswer": "3250 pounds",
          "transcript": "\"Welcome to our regional motors showroom. Today, we have a variety of compact vehicles on promotion. Our mid-sized family hatchbacks are currently priced at five thousand five hundred pounds, and our luxury sports models start at six thousand pounds. However, if you are looking for our most compact and fuel-efficient option, our smallest car on display is on sale today for exactly three thousand two hundred and fifty pounds.\""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q3.mp3",
          "question": "A woman is calling her friend. What did she lose?",
          "options": [
            "Phone",
            "Computer",
            "Glasses"
          ],
          "correctAnswer": "Phone",
          "transcript": "Woman: Hi Mark, it's me. I'm calling from my office desk phone because I have a bit of a crisis. \nMan: Oh dear, what happened? Did you leave your house keys at the gym again? \nWoman: No, I have my keys and my wallet right here in my handbag. But I can't find my mobile phone anywhere! I must have dropped it on the bus this morning, and now I can't check my schedule. \nMan: Don't worry, let me try calling it to see if anyone answers."
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q4.mp3",
          "question": "What did he forget?",
          "options": [
            "Glasses",
            "Key",
            "Clothes"
          ],
          "correctAnswer": "Glasses",
          "transcript": "\"I had a terribly rushed morning today. I made sure to double-check my pockets before leaving the apartment, so I didn't leave my wallet behind, and my car keys were already in my hand. However, as soon as I sat down at my office desk and opened my laptop, the screen was completely blurry. That's when I realized I had left my reading glasses sitting right on the bedside table at home.\""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q5.mp3",
          "question": "How many Americans are there?",
          "options": [
            "One",
            "Two",
            "Three"
          ],
          "correctAnswer": "One",
          "transcript": "Woman: Have the foreign exchange students from the linguistics department arrived at the welcome lounge yet? \nMan: Yes, the delegation is quite diverse. There are three students from Canada and two from the United Kingdom. \nWoman: Oh, I thought we also had a group arriving from the United States today. \nMan: Actually, only one American student registered for this particular research seminar, and he is currently filling out the registration forms at the front desk."
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%83%206%20-%20q6.mp3",
          "question": "Which room is her favourite?",
          "options": [
            "Bathroom",
            "Living room",
            "Bedroom"
          ],
          "correctAnswer": "Bathroom",
          "transcript": "\"I recently finished renovating my new townhouse, and I'm absolutely delighted with the layout. I spend a lot of time cooking in the kitchen, which is very modern, and my bedroom is incredibly cozy and peaceful. However, my absolute favourite area of the house is definitely the master bathroom. I installed a grand freestanding bathtub and large mirrors, making it the perfect place to relax after a long day of jogging and workouts.\""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q7.mp3",
          "question": "Where did they go last year?",
          "options": [
            "Camping",
            "Biking",
            "Hiking"
          ],
          "correctAnswer": "Camping",
          "transcript": "Woman: Hey Huy, where is your family planning to go for the summer holidays this year? Are you heading to the beach again? \nMan: We are actually thinking of booking a cabin up in the mountains this time. \nWoman: Oh, that sounds lovely. Didn't you go camping in the national forest last year? \nMan: Yes, we spent a whole week sleeping in tents under the stars last year, and it was a wonderful experience, but my mother wants a proper bed this time!"
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q8.mp3",
          "question": "What subject does her son like to study?",
          "options": [
            "Art",
            "Math",
            "English"
          ],
          "correctAnswer": "Art",
          "transcript": "\"My son has been doing very well since starting his first year at the local academy. His teachers tell me he is quite capable in science classes, and he works hard to get good marks in history. However, his true passion lies in creative expression. Whenever he gets home from school, he immediately grabs his brushes and sketchbooks because Art is the only subject he truly loves to study.\""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q9.mp3",
          "question": "What does she usually do in her free time?",
          "options": [
            "Go to the theatre and play sports",
            "Read books",
            "Sleep"
          ],
          "correctAnswer": "Go to the theatre and play sports",
          "transcript": "\"I have a pretty busy work schedule, but I always make time for my hobbies on the weekends. In my free time, I love going to the theater to watch new shows, and I also enjoy playing sports like tennis with my friends. Staying active and entertained helps me recharge for the new week.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q10.mp3",
          "question": "What advice do they need for decorating their living room?",
          "options": [
            "Where to buy a new table",
            "Where to buy a new glass",
            "Where to buy a new desk"
          ],
          "correctAnswer": "Where to buy a new table",
          "transcript": "\"My husband and I are currently redecorating our main living room, and we’ve already made most of the major decisions. We easily agreed on which soft blue colors to paint the walls, and we’ve already hired an electrician to install the modern lighting fixtures. However, we are completely stuck trying to find a high-quality wooden coffee table that fits our space, so we really need some advice on where to buy a new table.\""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%206%20-%20q11.mp3",
          "question": "What is his opinion on train travel?",
          "options": [
            "Practical",
            "Comfortable",
            "Expensive"
          ],
          "correctAnswer": "Practical",
          "transcript": "\"Whenever I need to travel between cities, I almost always choose to take the train. Some people complain about the schedule, but for me, it's just very practical. You can work on your laptop, relax, and you don't have to worry about traffic jams or parking.\""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q12.mp3",
          "question": "What is not original?",
          "options": [
            "Furniture",
            "House",
            "Floor"
          ],
          "correctAnswer": "Furniture",
          "transcript": "\"Welcome to today's antique auction. Item number twenty-four is a beautiful nineteenth-century cabinet. I must point out to potential buyers that while the main frame of this wooden furniture is in pristine condition, some restoration work was done. The sliding drawer at the bottom and the side panels are completely authentic, but the front wooden door was heavily damaged by moisture and is not original; it was replaced with matching oak timber last year.\""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%206%20-%20q13.mp3",
          "question": "What number do you press to buy a new computer?",
          "options": [
            "Three",
            "Zero",
            "One"
          ],
          "correctAnswer": "Three",
          "transcript": "\"Thank you for calling our consumer electronics helpline. If you are experiencing technical difficulties with your display screen, please press One to speak with a technician. If you have a question regarding a delivery or want to return a broken printer, please press Two. For customers who want to browse our latest catalogue and purchase a brand-new desktop computer, please press Three to connect straight to our sales team.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 05 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q1.mp3",
          "question": "How much did he pay for the computer?",
          "options": [
            "250 pounds",
            "55 pounds",
            "500 pounds"
          ],
          "correctAnswer": "250 pounds",
          "transcript": "\"I spent all weekend looking for a decent laptop for my university assignments. I initially saw a very basic, second-hand model online for just one hundred and fifty pounds, but the specifications were way too low. I also looked at a brand-new gaming computer that cost three hundred and fifty pounds, which was unfortunately out of my budget. In the end, I found a reliable refurbished desktop and paid exactly two hundred and fifty pounds for it.\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205%20-%20q2.mp3",
          "question": "What did they bring for the picnic?",
          "options": [
            "Food",
            "Milk",
            "Water"
          ],
          "correctAnswer": "Food",
          "transcript": "Man: Hey, did you pack the chess set and those board games for our afternoon picnic in the park? \nWoman: No, I thought the weather was too windy to play games outdoors, so I left them on the table. \nMan: Ah, that's a shame. Did you at least bring some portable speakers so we can listen to some music? \nWoman: I forgot those too, I'm afraid! But don't worry, I made sure to fill the basket with plenty of delicious sandwiches, fresh fruit, and snacks, so we have more than enough food to enjoy."
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q3.mp3",
          "question": "What colour is the teacher's house?",
          "options": [
            "White",
            "Blue",
            "Red"
          ],
          "correctAnswer": "White",
          "transcript": "\"If you are looking for our French professor's house to drop off your research project, listen carefully to these directions. As you drive down the lane, you will pass a bright blue cottage on your left, and right next to it is a large house painted completely yellow. The professor's residence is the modern, two-story building located right at the end of the cul-de-sac, and it is painted entirely white with a dark grey roof.\""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205%20-%20q4.mp3",
          "question": "What time is the football match?",
          "options": [
            "1pm",
            "2pm",
            "7pm"
          ],
          "correctAnswer": "1pm",
          "transcript": "\"Hi everyone, just a quick reminder about our weekend sports schedule. The gates will open early at 11:00 a.m. so fans can get inside and buy snacks. However, the football match itself will officially start at 1:00 p.m. Please make sure you arrive on time so you don't miss kickoff!\""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q5.mp3",
          "question": "What does she do on her holidays?",
          "options": [
            "Walking",
            "Hiking",
            "Biking"
          ],
          "correctAnswer": "Walking",
          "transcript": "\"Whenever the summer break comes around, my university friends usually book flights straight to luxury resorts where they spend all their time swimming in the pool or sunbathing on the sandy beaches. Personally, I find sitting still incredibly boring. I prefer to pack my backpack, put on a sturdy pair of boots, and spend my holidays walking along scenic mountain trails and exploring nature.\""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205%20-%20q6.mp3",
          "question": "Why does she like the manager?",
          "options": [
            "He taught her a lot",
            "He is friendly",
            "He is hard-working"
          ],
          "correctAnswer": "He taught her a lot",
          "transcript": "Man: How are you enjoying your new role as a content creator? Do you get along well with your team lead? \nWoman: I really do! He has a very serious attitude, so he isn't exactly funny, and I haven't received any promotion yet since I just started last month. \nMan: So what makes him a great boss to work with? \nWoman: He has years of experience in digital media and is incredibly patient with me. He taught her a lot about writing engaging copy and structuring campaigns, which has helped me improve my skills immensely."
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q7.mp3",
          "question": "What does he want to be?",
          "options": [
            "Writer",
            "Doctor",
            "Teacher"
          ],
          "correctAnswer": "Writer",
          "transcript": "\"When I first entered university, my parents strongly encouraged me to pursue education so I could become a high school teacher, and I also briefly considered studying medicine to become a doctor. However, my true passion has always been literature and creative storytelling. My ultimate dream is to publish my own novels, and I am working hard every day because I want to be a professional writer.\""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205%20-%20q8.mp3",
          "question": "What does he drink?",
          "options": [
            "Water",
            "Milk",
            "Tea"
          ],
          "correctAnswer": "Water",
          "transcript": "Woman: Hi Huy, can I get you a hot beverage while we wait for our class to start? I'm going to grab a cup of black coffee. \nMan: No, thank you. I'm trying to cut down on caffeine this week because it has been affecting my sleep. \nWoman: Oh, how about a nice cup of chamomile tea instead? It's very relaxing. \nMan: Actually, my throat is quite dry from our presentation earlier. I'll pass on the hot drinks and just stick to a glass of cold water to stay hydrated."
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q9.mp3",
          "question": "What does he remember most about his school days?",
          "options": [
            "History classes",
            "The exams",
            "His teacher"
          ],
          "correctAnswer": "History classes",
          "transcript": "\"When people ask me about my high school years, many expect me to talk about the weekends we spent playing sports on the football field, or the fun times meeting friends in the school yard during recess. While those are fond memories, what stands out the most in my mind is our history classes. The teacher was incredibly passionate, and the way she brought ancient civilizations and historic events to life is something I will never forget.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205%20-%20q10.mp3",
          "question": "What will she do?",
          "options": [
            "Go for a drive",
            "Go to a museum",
            "Go to sleep"
          ],
          "correctAnswer": "Go for a drive",
          "transcript": "It’s a beautiful Saturday morning and I finally have a day off from work. I’m feeling a bit stressed, so I really want to get out of the house and enjoy the fresh air. I’ve decided to take my car and go for a drive around the countryside. It’s always a great way for me to unwind."
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q11.mp3",
          "question": "What does she have in common with her mother?",
          "options": [
            "They have similar interests",
            "They have the same job",
            "They look alike"
          ],
          "correctAnswer": "They have similar interests",
          "transcript": "\"My mother and I have very different career paths, as she is a dedicated pediatrician and I am studying French linguistics at university. Physically, we don't look identical either, since she is quite tall and I take after my father's side. However, we share a very deep bond because we have similar interests. We both absolutely love reading classic literature, watching foreign game shows, and exploring books on nutrition together on weekends.\""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%205-%20q12.mp3",
          "question": "What does he buy at the shop?",
          "options": [
            "A suit for the office",
            "A book",
            "A computer"
          ],
          "correctAnswer": "A suit for the office",
          "transcript": "Woman: Hi, did you find what you were looking for in our menswear section today? We have a great promotion on casual summer T-shirts. \nMan: They look very nice, but I'm shopping for something much more formal. I also saw some heavy winter coats on sale, but it's not the right season for that. \nWoman: Ah, I see. Are you preparing for a special occasion or a new job? \nMan: Yes, I'm starting a corporate position next week, so I need to purchase a smart suit for the office. I'd like to try this dark blue one, please."
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%205%20-%20q13.mp3",
          "question": "What do birds do in winter?",
          "options": [
            "They stay in groups for protection",
            "They migrate to warmer places",
            "They build new nests"
          ],
          "correctAnswer": "They stay in groups for protection",
          "transcript": "\"During the harsh winter months, local bird populations face severe survival challenges due to freezing temperatures and a lack of food. While some species migrate south, those that remain in the region must adapt their behavior. You won't see them building new nests or flying long distances individually at this time. Instead, they stay in groups for protection, huddling together in dense trees to preserve body heat and defend against predators.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 04 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q1.mp3",
          "question": "What time is the meeting?",
          "options": [
            "10.15",
            "11.15",
            "5.15"
          ],
          "correctAnswer": "10.15",
          "transcript": "\"Good morning, everyone. I need to make a quick announcement regarding our schedule for today. The department heads were initially planning to gather for the weekly presentation at a quarter to ten, but the regional director is currently caught in a traffic delay. We also thought about pushing it back to eleven o'clock, but that would clash with our lunch plans. Therefore, we have decided to delay the start by exactly half an hour, so the meeting will now begin at ten fifteen.\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q2.mp3",
          "question": "Why did he call his friend?",
          "options": [
            "Suggest a drink",
            "Suggest a book",
            "Suggest a place"
          ],
          "correctAnswer": "Suggest a drink",
          "transcript": "Man: Hey Sarah, are you free this evening? I was thinking we could head downtown after we finish our shifts. \nWoman: Hi! I'm actually quite tired, but I don't have any major plans. What did you have in mind? \nMan: Well, I wanted to suggest a drink at that new rooftop cafe near the station. I heard their fruit teas and mocktails are amazing. \nWoman: Oh, that sounds lovely and relaxing. Let's do it!"
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q3.mp3",
          "question": "How does he feel?",
          "options": [
            "Sick",
            "Happy",
            "Tired"
          ],
          "correctAnswer": "Sick",
          "transcript": "\"I was really looking forward to attending the photography club exhibition this afternoon because I've spent weeks preparing my portfolio, and I felt so excited about it yesterday. However, I woke up with a terrible fever and a sore throat today. It’s a shame because I don't just feel tired from working late; I actually feel quite sick, so I’ll have to stay in bed and miss the event entirely.\""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q4.mp3",
          "question": "What is the mother asking her daughter to buy?",
          "options": [
            "Eggs",
            "Rice",
            "Books"
          ],
          "correctAnswer": "Eggs",
          "transcript": "Mother: Hi sweetheart, are you still at the supermarket down the street? Daughter: Yes, Mum. I’ve already put a carton of fresh milk and a bag of flour into my shopping basket. Do we need anything else for the pancake recipe? Mother: Oh, thank goodness I caught you! I just checked the fridge and realized we are completely out of eggs. Could you please grab a box of those before you head to the checkout? \nDaughter: Sure thing, I’ll go find them right now."
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q5.mp3",
          "question": "When do they meet?",
          "options": [
            "10.00",
            "11.00",
            "12.00"
          ],
          "correctAnswer": "10.00",
          "transcript": "\"Hi Mark, I received your message about our group study session tomorrow. I know you suggested meeting at nine o'clock because the library is very quiet then, but the building doesn't actually open its doors until an hour after that. Since eleven o'clock is a bit too close to lunchtime, let's aim to get together right when the library opens at ten o'clock sharp. Let me know if that time works for you!\""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q6.mp3",
          "question": "Why can't she pick up her child?",
          "options": [
            "Stay late at the office",
            "Her car has broken down",
            "She is stuck in a meeting"
          ],
          "correctAnswer": "Stay late at the office",
          "transcript": "Woman: Hi honey, I'm calling because I need a massive favor. Could you collect our daughter from school this afternoon? \nMan: Sure, I can do that. Is your car still acting up? I thought you took it to the mechanic this morning. \nWoman: No, the car is running perfectly fine, and I already finished my doctor's appointment. But my manager just handed me an urgent project report that must be submitted tonight, so I have to stay late at the office to wrap it up. \nMan: Don't worry, I'll go pick her up."
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q7.mp3",
          "question": "What movie does she recommend?",
          "options": [
            "Action film",
            "Cartoon",
            "Romantic film"
          ],
          "correctAnswer": "Action film",
          "transcript": "\"If you are looking for something entertaining to watch at the cinema this weekend, there are a few distinct choices. There is a new comedy starring John Myers, but the jokes are quite predictable, and the environmental documentary showing in hall three is a bit dry. If you want something truly engaging, I highly recommend the new action film. The stunts are breathtaking, the pacing is fast, and it will keep you on the edge of your seat the entire time.\""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q8.mp3",
          "question": "A man is calling his friend. Where is he?",
          "options": [
            "A town hall",
            "A shop",
            "An office"
          ],
          "correctAnswer": "A town hall",
          "transcript": "Woman: Hi Jack, where are you? I've been waiting for you near the main entrance of the train station for fifteen minutes. \nMan: I'm so sorry, Clara! I got a bit lost. I walked past the public library and thought I saw you, but it was someone else. \nWoman: Ah, okay. Are you still near that area? \nMan: No, I walked a bit further down. I'm actually standing right in front of the historic town hall with the large clock tower. Can you meet me here? \nWoman: Sure, stay right there, I'll walk over."
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q9.mp3",
          "question": "What means of transport does he use to get to work?",
          "options": [
            "By bus",
            "By car",
            "By motorbike"
          ],
          "correctAnswer": "By bus",
          "transcript": "\"My daily journey to our headquarters downtown has changed a lot recently. I used to drive my car, but finding a parking space in the city center became incredibly expensive and stressful. I also tried taking the commuter train, but the constant delays made me late for meetings. In the end, I decided to stick to the express bus. The route has a dedicated lane, so it's both reliable and budget-friendly for my daily commute.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q10.mp3",
          "question": "What time do experts recommend eating fruit?",
          "options": [
            "In the morning",
            "In the evening",
            "In the afternoon"
          ],
          "correctAnswer": "In the morning",
          "transcript": "\"Many people enjoy eating fruit in the afternoon as a snack, or having a light fruit bowl in the evening after dinner. However, health experts suggest that the best time to eat fresh fruit is in the morning on an empty stomach. Eating it early in the day helps boost your digestion and gives you plenty of energy for the rest of the day.\""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q11.mp3",
          "question": "Why does she wake up early?",
          "options": [
            "To have some quiet time",
            "To do exercise",
            "To do homework"
          ],
          "correctAnswer": "To have some quiet time",
          "transcript": "\"My alarm goes off at 5:00 a.m. every single morning, even on weekends. A lot of my classmates assume I wake up at this hour to study French or go for a jog around the neighborhood to prepare for my fitness tests. While those are productive habits, my real motivation is much simpler. With a busy household, the early morning is the only part of the day when the house is completely silent, and I just want to have some quiet time to sip my coffee in peace.\""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%204%20-%20q12.mp3",
          "question": "Why is he learning to drive?",
          "options": [
            "He has to drive to work",
            "He can travel more easily",
            "He doesn’t have to rely on public transport"
          ],
          "correctAnswer": "He has to drive to work",
          "transcript": "\"I've been taking driving lessons recently. At first, I just dreamed about buying a new car or going on a long road trip with my friends during the summer. But the main reason I’m doing this now is because my company moved to a new location outside the city, so I have to drive to work every day.\""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%204%20-%20q13.mp3",
          "question": "What does he buy directly at the shop?",
          "options": [
            "Clothes",
            "Hat",
            "Coffee"
          ],
          "correctAnswer": "Clothes",
          "transcript": "\"I do almost all of my shopping online nowadays because it is so convenient. I purchase all my university textbooks and nutrition books on the internet, and I even have my fresh groceries and food delivered to my apartment on weekends. However, the one thing I refuse to buy online is clothes. I prefer to go directly to the shop so I can try them on, check the fabric quality, and ensure the fit is absolutely perfect before spending any money.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 02 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q1.mp3",
          "question": "What time do they meet?",
          "options": [
            "6.30pm",
            "5.30pm",
            "7.30pm"
          ],
          "correctAnswer": "6.30pm",
          "transcript": "Hi everyone, I’m calling to update you on our project discussion scheduled for this evening. Our manager initially wanted us to gather in the main office at 5:30 p.m. sharp, but a few team members mentioned they couldn't finish their reports by then. We also considered pushing it back to 7:30 p.m., but that would mean staying too late after office hours. Therefore, we have decided to split the difference and lock in the meeting for half past six instead. See you all there!"
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q2.mp3",
          "question": "What time does she meet her child?",
          "options": [
            "Three o'clock",
            "Four o'clock",
            "Six o'clock"
          ],
          "correctAnswer": "Three o'clock",
          "transcript": "Man: Hi Sarah, are you joining us for the department lunch at 2:00 p.m. today? \nWoman: I’d love to, but I have a very tight schedule this afternoon. The school bus drops my son off early today, and I promised to meet my child right outside the gates at three o'clock sharp. \nMan: Oh, that's a shame. Will you be coming back to the office afterwards? Woman: No, I took the rest of the day off, so I'll be heading straight home with him after 4:00 p.m."
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q3.mp3",
          "question": "What does her sister drink?",
          "options": [
            "Tea",
            "Milk",
            "Water"
          ],
          "correctAnswer": "Tea",
          "transcript": "My sister and I went to that new cafe downtown yesterday. I was feeling quite exhausted, so I ordered a strong iced latte with extra milk to help me wake up. My sister was tempted to try their signature hot chocolate, but since she is trying to avoid sugary drinks this month, she changed her mind. In the end, she just ordered a pot of herbal tea to sip while we caught up on our week."
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q4.mp3",
          "question": "How many buildings will the town have?",
          "options": [
            "2000",
            "5000",
            "6000"
          ],
          "correctAnswer": "2000",
          "transcript": "Woman: Did you read the new urban development report for our local town? The council plans to demolish some old structures. \nMan: Yes, I heard they are removing about one thousand old houses next year. Are they replacing them? \nWoman: Exactly. The grand expansion project states that developers will construct a massive residential zone. By the time the project finishes in 2030, the town will have exactly two thousand new buildings completed. \nMan: Wow, that’s a huge change for our community!"
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q5.mp3",
          "question": "What does she usually do on Saturdays?",
          "options": [
            "Sees her family",
            "Sees her friends",
            "Sees her uncle"
          ],
          "correctAnswer": "Sees her family",
          "transcript": "My weekends are usually quite structured because I have a lot of responsibilities. I usually dedicate my Sundays to cleaning the house and going shopping for groceries to prepare for the upcoming week. However, my routine for the previous day is completely different. Every single week, as soon as Saturday morning arrives, I drive down to the countryside because I always prioritize spending quality time and sees her family for a big lunch."
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q6.mp3",
          "question": "What do they both buy?",
          "options": [
            "Clothes",
            "Pen",
            "Computer"
          ],
          "correctAnswer": "Clothes",
          "transcript": "Man: We spent hours browsing through the retail stores downtown this afternoon. Did you manage to find those running shoes you wanted? \nWoman: No, they didn't have my size left in stock. But I did see a beautiful leather jacket on sale. \nMan: Oh, I saw that too! I actually picked up a couple of formal shirts and a pair of trousers for work. \nWoman: So we both ended up purchasing some new clothes after all, even though we didn't get what we originally went in for! \nMan: Yes, at least the trip wasn't a total waste!"
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q7.mp3",
          "question": "What color shirt did he buy?",
          "options": [
            "Black",
            "White",
            "Blue"
          ],
          "correctAnswer": "Black",
          "transcript": "I went to the department store this morning to find a new outfit for the upcoming corporate gala. The sales assistant strongly recommended a bright blue shirt because it matches my eyes, and I also tried on a classic white shirt which looked very professional. However, I wanted something more elegant and formal for the evening event. In the end, I decided to purchase the plain black shirt instead, as it goes perfectly with my dark grey suit."
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q8.mp3",
          "question": "When is the assignment due?",
          "options": [
            "On Saturday",
            "On Monday",
            "On Friday"
          ],
          "correctAnswer": "On Saturday",
          "transcript": "Hi everyone, just a quick reminder about our History assignment. Originally, I asked you to hand it in on Friday by 5 PM. However, a few students requested some extra time to finish their research. I considered moving the deadline to Sunday, but that doesn't give me enough time to grade your papers before next week's lecture. So, please make sure you upload your work to the student portal by midnight on Saturday at the latest."
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q9.mp3",
          "question": "What did the professor want her to do?",
          "options": [
            "Speak at the conference",
            "Go to the museum",
            "Do homework"
          ],
          "correctAnswer": "Speak at the conference",
          "transcript": "I had a very motivating meeting with my academic advisor yesterday afternoon. I initially thought he called me into his office because he wanted me to write another research paper for his upcoming journal, or perhaps help him grade undergraduate exams. However, he surprised me by praising my recent presentation on linguistics. He told me that my work was outstanding and explicitly requested that I represent the department and speak at a conference in Paris next month."
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q10.mp3",
          "question": "Where did she choose to go on holiday?",
          "options": [
            "The South",
            "The East",
            "The North"
          ],
          "correctAnswer": "The South",
          "transcript": "Choosing a holiday destination this year was tricky! My family really wanted to go to the mountains for some cool air and hiking. I also spent days looking at photos of the north, thinking we could explore the historical sites up there. But in the end, I just really wanted to relax on a warm beach with plenty of sunshine. So, I booked a resort in the south, and we’re all heading there next week!"
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q11.mp3",
          "question": "What is special about the new song?",
          "options": [
            "The words",
            "The rhythm",
            "The sound"
          ],
          "correctAnswer": "The words",
          "transcript": "The local rock band just released their latest single this morning, and it is already getting a lot of attention online. The musical arrangement is quite standard, using the classic combination of electric guitars and drums that they always use, and the melody isn't particularly unique either. However, what truly makes this track stand out is the profound message behind the lyrics. The words are incredibly moving and poetic, reflecting on deep social issues in a way that the band has never done before."
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%202%20-%20q12.mp3",
          "question": "What did she like the most about the movie?",
          "options": [
            "The mountain scenes",
            "The story",
            "The actors’ performances"
          ],
          "correctAnswer": "The mountain scenes",
          "transcript": "Man: What did you think of the new adventure movie we watched last night? I thought the lead actor gave an incredible performance. \nWoman: The acting was decent, though a bit dramatic at times, and the cinematic soundtrack was beautiful too. \nMan: So what was the highlight for you? \nWoman: For me, nothing could beat the breathtaking cinematography. The gorgeous mountain scenes filmed entirely on location in New Zealand were absolutely stunning and made the whole experience unforgettable."
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%202%20-%20q13.mp3",
          "question": "Why did she become a scientist?",
          "options": [
            "A large stone",
            "She enjoyed science",
            "She wanted to help people"
          ],
          "correctAnswer": "A large stone",
          "transcript": "People often ask me what inspired my lifelong passion for geology and chemistry. Many colleagues assume I was influenced by a television documentary I watched as a child, or perhaps an encouraging high school teacher who guided my studies. In reality, it was something much more random. When I was seven years old, I found a large stone embedded with strange, glittering crystals in my backyard. Trying to discover what it was made of is the exact reason I eventually grew up to become a professional scientist."
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 03 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q1.mp3",
          "question": "What time will they meet?",
          "options": [
            "Quarter to ten",
            "Quarter to eight",
            "Quarter to eleven"
          ],
          "correctAnswer": "Quarter to eight",
          "transcript": "\"Hi everyone, I'm just calling to confirm our theater plans for this evening. The main performance doesn't actually start until half past eight, and the doors open at 7:30, but the traffic downtown is expected to be quite heavy around that time. Therefore, to make sure we can find good parking spaces and grab our tickets without rushing, let's aim to gather outside the main entrance at a quarter to eight sharp.\""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203-%20q2.mp3",
          "question": "Where did they meet for the bus home?",
          "options": [
            "marketplace",
            "bus station",
            "nearby park"
          ],
          "correctAnswer": "marketplace",
          "transcript": "Man: Hey Sarah, sorry I'm late. I went to look for you outside the library where the bus usually stops, but you weren't there. \nWoman: Oh, sorry about that! The bus route was temporarily changed today because of the festival. I was waiting near the central park for a bit, but it was way too noisy. \nMan: So where are you standing right now? \nWoman: I walked a block down to the crowded open plaza where the farmers sell fresh produce. Let's just meet here at the marketplace, as the commuter bus home stops right in front of the main gate."
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q3.mp3",
          "question": "How old is Stephanie?",
          "options": [
            "21",
            "22",
            "23"
          ],
          "correctAnswer": "21",
          "transcript": "\"We are having a big family celebration this weekend because my cousin Stephanie is reaching a major milestone. It feels like just yesterday we were celebrating her nineteenth birthday when she first started university, and her parents are already planning a huge trip for when she graduates at twenty-five. But for this upcoming party, she is finally turning twenty-one, so we are throwing a formal dinner to celebrate her officially becoming an adult.\""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203%20-%20q4.mp3",
          "question": "Where is the club near?",
          "options": [
            "A coffee shop",
            "A museum",
            "A park"
          ],
          "correctAnswer": "A park",
          "transcript": "Woman: Hey Alex, do you know where the new photography club holds its weekly meetings? Is it located inside that commercial complex next to the grand shopping mall? \nMan: They actually moved out of that office last month. They briefly rented a small studio right opposite the central train station, but it was far too loud with the tracks nearby. \nWoman: Oh, I see. So where do they gather now? \nMan: They found a lovely, quiet community center situated right next to a large public park, so members can easily walk outside to practice taking landscape photos."
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q5.mp3",
          "question": "What to feed the cat?",
          "options": [
            "Meat",
            "Fish",
            "Chicken"
          ],
          "correctAnswer": "Fish",
          "transcript": "\"Hi Jane, thanks so much for watching my apartment and looking after my pet while I'm away this weekend. I left a few cans of shredded chicken in the pantry, but please don't give her those because she had an allergic reaction to them last week. Also, despite what you see in cartoons, fresh milk will upset her stomach completely. I’ve left a bag of dried seafood biscuits on the kitchen counter, so just stick to feeding her that salmon and fish mix twice a day.\""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203%20-%20q6.mp3",
          "question": "What does this family do most weekends?",
          "options": [
            "has dinner together",
            "plays tennis",
            "goes for a walk"
          ],
          "correctAnswer": "goes for a walk",
          "transcript": "\"On weekends, my family always tries to spend time together. Occasionally, if the weather is really hot, we drive to the beach for a swim, and once in a while, we visit the local museum when there's a new exhibition. However, our usual routine is much simpler. Most weekends, we just go for a long walk in the park near our house to relax and get some fresh air.\""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q7.mp3",
          "question": "What does he need to buy for his sister?",
          "options": [
            "Chocolates",
            "Eggs",
            "Milk"
          ],
          "correctAnswer": "Chocolates",
          "transcript": "\"I'm heading out to the high street to buy a birthday present for my sister, and I'm running a bit out of ideas. I initially considered purchasing an elegant silver watch, but they are a bit out of my budget this month. I also thought about getting a classic bouquet of fresh flowers, but they wither so quickly. In the end, I decided to head to the premium confectionery store to pick up a luxury box of assorted chocolates, as she absolutely loves sweet treats.\""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203%20-%20q8.mp3",
          "question": "The train was delayed. What time does the train leave?",
          "options": [
            "9.30",
            "10.00",
            "11.30"
          ],
          "correctAnswer": "9.30",
          "transcript": "\"This is a station announcement for passengers traveling to London. The service originally scheduled for 8:30 has been delayed due to signaling problems. We initially hoped to have the train depart at 9:00, but engineers are still working on the track. The train is now expected to leave at 9:30. Thank you for your patience.\""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q9.mp3",
          "question": "Which area has the best weather?",
          "options": [
            "In the north",
            "In the east",
            "In the south"
          ],
          "correctAnswer": "In the east",
          "transcript": "\"Welcome to the national weather report. Moving through the country today, we see quite a contrast in conditions. The northern territory will experience severe gales and dropping temperatures, while regional areas in the west will face continuous heavy showers throughout the afternoon. Fortunately, the dark clouds will miss the coastal border completely, leaving residents in the east with beautiful, clear skies and bright sunshine all day long.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203%20-%20q10.mp3",
          "question": "Why was the museum visit cancelled?",
          "options": [
            "Not enough people",
            "The heavy storm",
            "Too many participant"
          ],
          "correctAnswer": "Not enough people",
          "transcript": "\"Hi everyone, I have an update regarding our trip to the city museum this Saturday. I know some of you were worried about the bad weather forecast, but it turns out it’s going to be sunny. I also called ahead to make sure, and thankfully, the museum isn't closed for renovations anymore. However, we needed a minimum of twenty students to book the guided tour, and only ten signed up. So, unfortunately, we had to cancel the trip because there just were not enough people.\""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q11.mp3",
          "question": "Where is the cafe?",
          "options": [
            "Opposite the school",
            "By the river",
            "Opposite the gift shop"
          ],
          "correctAnswer": "Opposite the gift shop",
          "transcript": "\"Welcome to the City Art Gallery! Before you begin exploring the collections, let me give you a quick layout of our facilities. As you walk through the main entrance, you will see the ticket counters immediately on your right. The entrance to the grand exhibition hall is straight ahead of you. If you turn around and look across the hallway, you'll see our souvenir store, and the gallery cafe is located directly opposite the gift shop, serving fresh coffee and pastries.\""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%203%20-%20q12.mp3",
          "question": "Where is the tea served?",
          "options": [
            "The river boat",
            "The yacht",
            "The restaurant"
          ],
          "correctAnswer": "The river boat",
          "transcript": "\"Welcome to the Riverside Hotel. Breakfast is served every morning in the main dining room, and you can enjoy afternoon coffee at our outdoor garden cafe. However, for our afternoon tea service, guests will board our private river boat at 3 PM to enjoy tea and cakes while cruising along the water.\""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%203%20-%20q13.mp3",
          "question": "Which room is the largest in her house?",
          "options": [
            "Living room",
            "Kitchen",
            "Dining room"
          ],
          "correctAnswer": "Kitchen",
          "transcript": "\"I recently moved into a lovely traditional cottage in the suburbs, and the floor plan is quite unique. Most people expect the living room to be the grandest area where everyone gathers, but in my house, it's actually quite cozy and small. My bedroom is slightly larger, allowing plenty of space for a king-sized bed and wardrobes. However, because I absolutely love culinary arts, the developers expanded the cooking area significantly, making the kitchen the absolute largest room in the entire house.\""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 01 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q1.mp3",
          "question": "How much are the eggs?",
          "options": [
            "1.50 pound",
            "2.50 pound",
            "1.70 pound"
          ],
          "correctAnswer": "1.50 pound",
          "transcript": "Good morning, shoppers, and welcome to our organic farm stall. Today, we have a great discount on our dairy products, with a pint of fresh milk priced at just one pound twenty. Our homemade cheddar cheese is also on sale for one pound eighty per pack. If you look over here, our farm-fresh organic eggs are currently priced at exactly one pound fifty for a carton of six, which is a fantastic bargain for breakfast."
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%201%20-%20q2.mp3",
          "question": "What time does the train leave? (for him to go on a business trip)",
          "options": [
            "9.15",
            "9.2",
            "10.45"
          ],
          "correctAnswer": "9.15",
          "transcript": "Woman: Hi honey, have you packed your briefcase for your business trip to the capital city yet? I thought your train was scheduled for a quarter to nine. \nMan: No, that was the express rail, but the company booked me on the regular service instead. The ticket says it departs at nine fifteen. \nWoman: Oh, okay. Do you need a ride to the station? It usually takes about thirty-five minutes, so you'd arrive at ten to ten. \nMan: No need, I'll just take a quick taxi now so I can be there well before 9:15."
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q3.mp3",
          "question": "How does she go to school?",
          "options": [
            "She walks",
            "She drives",
            "She rides a bycicle"
          ],
          "correctAnswer": "She walks",
          "transcript": "My daily commute to the university campus is actually quite active compared to my friends. Most of them catch the morning bus from the station, and a few prefer to ride a bike when the weather is nice. I live close enough to the campus grounds, so I don't need wheels at all. I just put on my comfortable trainers every morning and she walks across the neighborhood park to get to my first lecture."
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%201%20-%20q4.mp3",
          "question": "A woman is calling her husband. What time is lunch ready?",
          "options": [
            "2pm",
            "4pm",
            "5am"
          ],
          "correctAnswer": "2pm",
          "transcript": "Woman: Hi dear, I'm just calling to let you know about our plans today. I know we usually sit down for our midday meal at noon, or at 1:00 pm on weekends. \nMan: Oh, are we running a bit late today? I'm already starting to feel quite hungry. Woman: Yes, the grocery store was packed and the chicken is taking longer to roast than I expected. I promise everything will be perfectly cooked and lunch ready by 2:00 pm sharp. \nMan: Alright, I'll see you at two then!"
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q5.mp3",
          "question": "What does she usually do in the evening?",
          "options": [
            "Go for a walk",
            "Watch TV",
            "Sleep"
          ],
          "correctAnswer": "Go for a walk",
          "transcript": "I have a very busy office routine during the daytime, so my nights are dedicated entirely to unwinding. I sometimes stay in the living room to watch television or listen to music on my headphones, but staying indoors all day makes me feel restless. Instead, as soon as the sun goes down, I prefer to put on my jacket and go for a walk around the local lake to enjoy the cool evening breeze."
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%201%20-%20q6.mp3",
          "question": "Where will they meet?",
          "options": [
            "At the park",
            "At home",
            "At the office"
          ],
          "correctAnswer": "At the park",
          "transcript": "Man: Hey, are we still meeting up outside the cinema before the movie starts tonight? \nWoman: The weather is absolutely beautiful right now, so it seems a shame to wait around inside a crowded lobby or sitting in a noisy coffee shop. \nMan: True. Why don't we gather near the entrance gates of the central park just across the street instead? We can enjoy the sunshine for a bit. \nWoman: That's a fantastic idea! I'll see you at the park in fifteen minutes."
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/mix_30s%20(audio-joiner.com).mp3",
          "question": "What day do they meet?",
          "options": [
            "Tuesday",
            "Monday",
            "Saturday"
          ],
          "correctAnswer": "Tuesday",
          "transcript": "Man: Hi Sarah, I received your message about scheduling our project review session. Monday is completely packed for me because I have client presentations all day. \nWoman: I understand. I’m actually traveling out of town for a conference on Wednesday, so that day is out for me too. \nMan: Well, that leaves us with the day in between. Let's aim to get together in the afternoon on Tuesday instead. \nWoman: Perfect, Tuesday works great for me. Let's lock it in."
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q9.mp3",
          "question": "What career did he choose?",
          "options": [
            "To work in business",
            "A doctor",
            "A teacher"
          ],
          "correctAnswer": "To work in business",
          "transcript": "\"When I graduated from university, my parents really wanted me to go into teaching and build a stable path to work in education, while my sister suggested I train to become a nurse in healthcare. However, I’ve always been drawn to entrepreneurship, economics, and corporate management. In the end, I decided to join a multinational marketing firm, choosing to work in business where I could challenge myself in a fast-paced commercial market.\""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q7.mp3",
          "question": "What does this family do most weekends?",
          "options": [
            "Goes for a walk",
            "Goes to the cinema",
            "Watches TV together"
          ],
          "correctAnswer": "Goes for a walk",
          "transcript": "\"Living near the countryside gives my family plenty of options for weekend activities. When the weather is exceptionally hot in the summer, we occasionally drive down to the coast to swim at the beach, and on rainy winter days, we might visit the local art museum. However, our standard routine throughout the year is much simpler. Almost every Saturday morning, the whole family goes for a walk along the mountain trails to stay healthy and active.\""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%201%20-%20q10.mp3",
          "question": "What course did he take?",
          "options": [
            "Computer",
            "Information Technology",
            "Business Administration"
          ],
          "correctAnswer": "Computer",
          "transcript": "Woman: Hey Mark, I heard you enrolled in an evening adult education program. Are you finally learning a foreign language like you planned? \nMan: I was looking into a French class, and my wife wanted me to take a weekend cooking course with her, but I had to prioritize my career skills. \nWoman: Oh, I see. So what did you choose? \nMan: I signed up for a data analysis and computer programming seminar instead. It’s tough, but understanding software is essential for my new job."
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q11.mp3",
          "question": "A woman is talking about her job. How is being a writer different from other jobs?",
          "options": [
            "She works irregular time",
            "She works at home",
            "She has to meet strict deadlines"
          ],
          "correctAnswer": "She works irregular time",
          "transcript": "People often romanticize my profession, assuming that authors earn a lot more money than standard corporate workers, or that we constantly travel to different countries for book signings. In reality, the financial aspect can be quite tough, and I spend most of my days sitting alone at home. The real contrast lies in my schedule; unlike a traditional 9-to-5 corporate career, being a creative author means she works irregular time, sometimes drafting chapters at 3 AM or taking a Tuesday afternoon completely off."
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%91%E1%BB%81%201%20-%20q12.mp3",
          "question": "Where does she buy food?",
          "options": [
            "At a new shopping centre",
            "At a convenience store",
            "At a mall"
          ],
          "correctAnswer": "At a new shopping centre",
          "transcript": "Well, I used to buy all my fresh vegetables at a local market near my house, but it closed down last month. Since then, I've tried getting my food from a traditional grocery store, but they don't have a wide range of organic products. So yesterday, I went to the new shopping centre downtown, and they had an amazing supermarket section! The prices were reasonable and everything was fresh, so that's where I decided to get all my groceries from now on."
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "https://pub-dd865002e6b244d1bc2f07d61cda70bc.r2.dev/audio/listening/question1_13/%C4%90%E1%BB%81%201%20-%20q13.mp3",
          "question": "What causes air pollution?",
          "options": [
            "Fire from the countryside",
            "Rubbish",
            "Factory and industrial smoke"
          ],
          "correctAnswer": "Fire from the countryside",
          "transcript": "Environmental scientists recently conducted a study on seasonal smog levels in our province. While many citizens blame the daily automobile traffic in the city center or the toxic industrial waste released from local factories, the data revealed a different primary source for this month's poor air quality. The toxic smoke particles floating over the residential zones are actually coming from the massive agricultural fire from the countryside, where farmers are clearing fields for the new crop season."
        }
      ]
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
