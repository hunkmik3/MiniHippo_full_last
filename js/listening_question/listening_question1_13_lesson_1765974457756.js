(function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================

window.listeningQuestions1 = [
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "What does her sister drink?",
    options: ["Tea", "Water", "Coffee"],
    correctAnswer: "Tea",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "What is the population of this village?",
    options: ["10.000", "40.000", "20.000"],
    correctAnswer: "10.000",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "Where does he want to go tomorrow?",
    options: ["The town hall", "The cinema", "The park"],
    correctAnswer: "The town hall",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "What floor is the office on?",
    options: ["On the first floor", "On the second floor", "On the third floor"],
    correctAnswer: "On the first floor",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "Cost of bus",
    options: ["2.5", "5.5", "3.5"],
    correctAnswer: "2.5",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "When can they play football at school?",
    options: ["Wednesday afternoon", "Thursday afternoon", "Sunday afternoon"],
    correctAnswer: "Wednesday afternoon",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "Where is the office?",
    options: ["Opposite the hotel", "Opposite the park", "Opposite the hospital"],
    correctAnswer: "Opposite the hotel",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "A man is calling his wife. Where did they meet?",
    options: ["Outside a shop", "At a café", "In a park"],
    correctAnswer: "Outside a shop",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "What time does he have dinner these days?",
    options: ["7 o\'clock", "6 o\'clock", "1 o\'clock"],
    correctAnswer: "7 o\'clock",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "What does he do after work?",
    options: ["Play football", "Play badminton", "Play volleyball"],
    correctAnswer: "Play football",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "What did they both like about the movie?",
    options: ["The ending", "The actor", "The theme song"],
    correctAnswer: "The ending",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "What area is he describing?",
    options: ["A university area", "A mall", "A sport hall"],
    correctAnswer: "A university area",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "A man wants to buy a new house. What is his biggest problem?",
    options: ["Persuading his family", "Finding enough money", "Choosing the right location"],
    correctAnswer: "Persuading his family",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "What was his last job?",
    options: ["An electrician", "A teacher", "A doctor"],
    correctAnswer: "An electrician",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "What did she lose?",
    options: ["A bag", "A hat", "A coat"],
    correctAnswer: "A bag",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "Who is his favourite teacher?",
    options: ["Miss Brown", "Miss Andy", "Mr Brown"],
    correctAnswer: "Miss Brown",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "Why does the woman return the dress?",
    options: ["Because of its size", "Because of its color", "Because it was damaged"],
    correctAnswer: "Because of its size",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "What is his opinion about that restaurant?",
    options: ["The service is slow", "He finds it too expensive", "He doesn’t like the food there"],
    correctAnswer: "The service is slow",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "Where are the students now?",
    options: ["In a townhouse", "Library", "Sport hall"],
    correctAnswer: "In a townhouse",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "When will Anna meet her friend?",
    options: ["9 a.m. on Sunday", "9 a.m. on Saturday", "9 a.m. on Monday"],
    correctAnswer: "9 a.m. on Sunday",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "Which button should the man press to buy a new computer?",
    options: ["Three", "Two", "Six"],
    correctAnswer: "Three",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "How many pages of the assignment?",
    options: ["4", "5", "8"],
    correctAnswer: "4",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "What is his opinion about sea transport?",
    options: ["The use of technology will increase", "It is slow but reliable", "It is environmentally friendly"],
    correctAnswer: "The use of technology will increase",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "What is not working?",
    options: ["The computer", "TV", "The mouse"],
    correctAnswer: "The computer",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "What did he leave in the yard?",
    options: ["Shoes", "Hat", "Coat"],
    correctAnswer: "Shoes",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "What did the two people buy?",
    options: ["Trousers", "Computer", "Shirt"],
    correctAnswer: "Trousers",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "Why did he call his friend?",
    options: ["Suggest a drink", "Suggest a food", "Suggest a shirt"],
    correctAnswer: "Suggest a drink",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "When did they decide to meet?",
    options: ["9am on Sunday", "10am on Sunday", "9am on Saturday"],
    correctAnswer: "9am on Sunday",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "A girl is calling her mother. Which dress does she want?",
    options: ["Long and red", "Long and black", "Short and red"],
    correctAnswer: "Long and red",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "What day is the new appointment?",
    options: ["Thursday 13th", "Friday 13th", "Thursday 15th"],
    correctAnswer: "Thursday 13th",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "A man is calling his wife. Where did they meet?",
    options: ["Outside a shop", "Outside an office", "At home"],
    correctAnswer: "Outside a shop",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "What did she do last weekend?",
    options: ["Stayed at home", "Watched a movie", "Went out with her friends"],
    correctAnswer: "Stayed at home",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "How many weeks have they been in India?",
    options: ["2 weeks", "3 weeks", "1 weeks"],
    correctAnswer: "2 weeks",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "Where is the office?",
    options: ["Opposite the hotel", "Next the hotel", "Opposite the mall"],
    correctAnswer: "Opposite the hotel",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "Where do they wait for the bus?",
    options: ["By the hotel’s main entrance", "Near the school", "Outside the station"],
    correctAnswer: "By the hotel’s main entrance",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "What does his wife like to do?",
    options: ["Photography", "Cooking", "Gardening"],
    correctAnswer: "Photography",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "What outdoor activities do they do in the afternoon?",
    options: ["Play golf", "Play football", "Play chess"],
    correctAnswer: "Play golf",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "A woman is introducing a concert. The concert will end with?",
    options: ["The city’s favorite group", "A special guest appearance", "A fireworks display"],
    correctAnswer: "The city’s favorite group",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "What was the writer\'s first job?",
    options: ["Teacher", "Writer", "Doctor"],
    correctAnswer: "Teacher",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "How does he feel?",
    options: ["Sick", "Happy", "Funny"],
    correctAnswer: "Sick",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "How long does it take to get to the station?",
    options: ["20 minutes", "30 minutes", "70 minutes"],
    correctAnswer: "20 minutes",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "What did he call to say?",
    options: ["To say thank you", "To say goodbye", "To say apologize"],
    correctAnswer: "To say thank you",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "Who is coming to visit him this weekend?",
    options: ["His sister and her children", "His friends", "His parents"],
    correctAnswer: "His sister and her children",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "What time is the meeting?",
    options: ["2pm", "3pm", "1pm"],
    correctAnswer: "2pm",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "Why can\'t she pick up her child?",
    options: ["Stay late at the office", "Her car has broken down", "She is stuck in a meeting"],
    correctAnswer: "Stay late at the office",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "How much do the cleaning products cost?",
    options: ["One pound fifty", "One pound sixty", "Two pound fifty"],
    correctAnswer: "One pound fifty",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "Where is she going with her family?",
    options: ["The mountains", "The waterfall", "The museum"],
    correctAnswer: "The mountains",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "What did he usually do last year?",
    options: ["Cycling", "Hiking", "Biking"],
    correctAnswer: "Cycling",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "How many minutes did he have to speak?",
    options: ["15", "20", "25"],
    correctAnswer: "15",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "Who does she live with?",
    options: ["Best friends", "Her family", "Boy friend"],
    correctAnswer: "Best friends",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "Why does she want to be a writer?",
    options: ["Help people", "To earn a living", "To express her ideas"],
    correctAnswer: "Help people",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "Why was the flight canceled?",
    options: ["Poor weather conditions", "Technical problem", "Not enough passengers"],
    correctAnswer: "Poor weather conditions",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "Which room will they study in?",
    options: ["Room 301", "Room 303", "Room 302"],
    correctAnswer: "Room 301",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "What time is the football match?",
    options: ["1pm", "3pm", "1am"],
    correctAnswer: "1pm",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "What is the phone number of the shop?",
    options: ["20 10 30", "20 20 30", "30 20 10"],
    correctAnswer: "20 10 30",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "What did they bring for the picnic?",
    options: ["Food", "Water", "Clothes"],
    correctAnswer: "Food",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "How many copies did he sell?",
    options: ["Over 300000 copies", "300000 copies", "Under 300000 copies"],
    correctAnswer: "Over 300000 copies",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "Where did they go last year?",
    options: ["Camping", "Hiking", "Biking"],
    correctAnswer: "Camping",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "What do they plan to do together?",
    options: ["Make plans later", "Do homework", "Go to the museum"],
    correctAnswer: "Make plans later",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "What does the man drink?",
    options: ["Iced tea", "Water", "Coffee"],
    correctAnswer: "Iced tea",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "Who did she take the picture of?",
    options: ["The girl\'s team", "Children", "Family"],
    correctAnswer: "The girl\'s team",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "Where do they go when they travel to India?",
    options: ["Go to the park", "Food", "People"],
    correctAnswer: "Go to the park",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "What is the weather like today?",
    options: ["Cold and wet", "Cloudy", "Sunny"],
    correctAnswer: "Cold and wet",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "How did he adjust the meeting?",
    options: ["Having the meeting without him", "Changing the time", "Moving it online"],
    correctAnswer: "Having the meeting without him",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "Which door do they need to take to get to Edinburgh?",
    options: ["Two", "One", "Four"],
    correctAnswer: "Two",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "Where does she walk every night?",
    options: ["The college", "The park", "The mall"],
    correctAnswer: "The college",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "How many chairs do they need to prepare for a meeting?",
    options: ["20", "30", "60"],
    correctAnswer: "20",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "Where did she ask the coffee shop to look for her lost item?",
    options: ["In the corner", "On the table", "Next the door"],
    correctAnswer: "In the corner",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "Where did they meet?",
    options: ["The front entrance", "At home", "The office"],
    correctAnswer: "The front entrance",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "The daughter is calling her father. What did she buy?",
    options: ["A dress", "A hat", "A coat"],
    correctAnswer: "A dress",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "There will be a school party soon, what should the teacher prepare?",
    options: ["Order the food", "Order the pizza", "Order the drink"],
    correctAnswer: "Order the food",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "When will she need a computer?",
    options: ["Friday", "Monday", "Thursday"],
    correctAnswer: "Friday",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "What country will they study next semester?",
    options: ["France", "US", "Germany"],
    correctAnswer: "France",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "What do they need to repair for the building?",
    options: ["Windows", "The roof", "The heating system"],
    correctAnswer: "Windows",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "What does the actor like to do?",
    options: ["Drawing", "Singing", "Hiking"],
    correctAnswer: "Drawing",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "What new thing is being built at the school?",
    options: ["A Performance space", "A new library", "A sport hall"],
    correctAnswer: "A Performance space",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "What does he like about Dubai?",
    options: ["He enjoys his job here", "People", "Food"],
    correctAnswer: "He enjoys his job here",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "What does he advise young people to do to save money?",
    options: ["Cook for yourself", "Avoid unnecessary spending", "Save a small amount regularly"],
    correctAnswer: "Cook for yourself",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "Why did he call his friend?",
    options: ["Suggest a drink", "Suggest a job", "Suggest a place"],
    correctAnswer: "Suggest a drink",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "How much does the smallest car cost?",
    options: ["3250 pounds", "2530 pounds", "1500 pounds"],
    correctAnswer: "3250 pounds",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "A woman is calling her friend. What did she lose?",
    options: ["Phone", "Computer", "Glasses"],
    correctAnswer: "Phone",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "What did he forget?",
    options: ["Glasses", "Key", "Clothes"],
    correctAnswer: "Glasses",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "How many Americans are there?",
    options: ["One", "Two", "Three"],
    correctAnswer: "One",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "Which room is her favourite?",
    options: ["Bathroom", "Living room", "Bedroom"],
    correctAnswer: "Bathroom",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "Where did they go last year?",
    options: ["Camping", "Biking", "Hiking"],
    correctAnswer: "Camping",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "What subject does her son like to study?",
    options: ["Art", "Math", "English"],
    correctAnswer: "Art",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "What does she usually do in her free time?",
    options: ["Go to the theatre and play sports", "Read books", "Sleep"],
    correctAnswer: "Go to the theatre and play sports",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "What advice do they need for decorating their living room?",
    options: ["Where to buy a new table", "Where to buy a new glass", "Where to buy a new desk"],
    correctAnswer: "Where to buy a new table",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "What is his opinion on train travel?",
    options: ["Practical", "Comfortable", "Expensive"],
    correctAnswer: "Practical",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "What is not original?",
    options: ["Furniture", "House", "Floor"],
    correctAnswer: "Furniture",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "What number do you press to buy a new computer?",
    options: ["Three", "Zero", "One"],
    correctAnswer: "Three",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "How much did he pay for the computer?",
    options: ["250 pounds", "55 pounds", "500 pounds"],
    correctAnswer: "250 pounds",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "What did they bring for the picnic?",
    options: ["Food", "Milk", "Water"],
    correctAnswer: "Food",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "What colour is the teacher\'s house?",
    options: ["White", "Blue", "Red"],
    correctAnswer: "White",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "What time is the football match?",
    options: ["1pm", "2pm", "7pm"],
    correctAnswer: "1pm",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "What does she do on her holidays?",
    options: ["Walking", "Hiking", "Biking"],
    correctAnswer: "Walking",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "Why does she like the manager?",
    options: ["He taught her a lot", "He is friendly", "He is hard-working"],
    correctAnswer: "He taught her a lot",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "What does he want to be?",
    options: ["Writer", "Doctor", "Teacher"],
    correctAnswer: "Writer",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "What does he drink?",
    options: ["Water", "Milk", "Tea"],
    correctAnswer: "Water",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "What does he remember most about his school days?",
    options: ["History classes", "The exams", "His teacher"],
    correctAnswer: "History classes",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "What will she do?",
    options: ["Go for a drive", "Go to a museum", "Go to sleep"],
    correctAnswer: "Go for a drive",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "What does she have in common with her mother?",
    options: ["They have similar interests", "They have the same job", "They look alike"],
    correctAnswer: "They have similar interests",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "What does he buy at the shop?",
    options: ["A suit for the office", "A book", "A computer"],
    correctAnswer: "A suit for the office",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "What do birds do in winter?",
    options: ["They stay in groups for protection", "They migrate to warmer places", "They build new nests"],
    correctAnswer: "They stay in groups for protection",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "What time is the meeting?",
    options: ["10.15", "11.15", "5.15"],
    correctAnswer: "10.15",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "Why did he call his friend?",
    options: ["Suggest a drink", "Suggest a book", "Suggest a place"],
    correctAnswer: "Suggest a drink",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "How does he feel?",
    options: ["Sick", "Happy", "Tired"],
    correctAnswer: "Sick",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "What is the mother asking her daughter to buy?",
    options: ["Eggs", "Rice", "Books"],
    correctAnswer: "Eggs",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "When do they meet?",
    options: ["10.00", "11.00", "12.00"],
    correctAnswer: "10.00",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "Why can\'t she pick up her child?",
    options: ["Stay late at the office", "Her car has broken down", "She is stuck in a meeting"],
    correctAnswer: "Stay late at the office",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "What movie does she recommend?",
    options: ["Action film", "Cartoon", "Romantic film"],
    correctAnswer: "Action film",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "A man is calling his friend. Where is he?",
    options: ["A town hall", "A shop", "An office"],
    correctAnswer: "A town hall",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "What means of transport does he use to get to work?",
    options: ["By bus", "By car", "By motorbike"],
    correctAnswer: "By bus",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "What time do experts recommend eating fruit?",
    options: ["In the morning", "In the evening", "In the afternoon"],
    correctAnswer: "In the morning",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "Why does she wake up early?",
    options: ["To have some quiet time", "To do exercise", "To do homework"],
    correctAnswer: "To have some quiet time",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "Why is he learning to drive?",
    options: ["He has to drive to work", "He can travel more easily", "He doesn’t have to rely on public transport"],
    correctAnswer: "He has to drive to work",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "What does he buy directly at the shop?",
    options: ["Clothes", "Hat", "Coffee"],
    correctAnswer: "Clothes",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "What time do they meet?",
    options: ["6.30pm", "5.30pm", "7.30pm"],
    correctAnswer: "6.30pm",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "What time does she meet her child?",
    options: ["Three o\'clock", "Four o\'clock", "Six o\'clock"],
    correctAnswer: "Three o\'clock",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "What does her sister drink?",
    options: ["Tea", "Milk", "Water"],
    correctAnswer: "Tea",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "How many buildings will the town have?",
    options: ["2000", "5000", "6000"],
    correctAnswer: "2000",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "What does she usually do on Saturdays?",
    options: ["Sees her family", "Sees her friends", "Sees her uncle"],
    correctAnswer: "Sees her family",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "What do they both buy?",
    options: ["Clothes", "Pen", "Computer"],
    correctAnswer: "Clothes",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "What color shirt did he buy?",
    options: ["Black", "White", "Blue"],
    correctAnswer: "Black",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "When is the assignment due?",
    options: ["On Saturday", "On Monday", "On Friday"],
    correctAnswer: "On Saturday",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "What did the professor want her to do?",
    options: ["Speak at the conference", "Go to the museum", "Do homework"],
    correctAnswer: "Speak at the conference",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "Where did she choose to go on holiday?",
    options: ["The South", "The East", "The North"],
    correctAnswer: "The South",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "What is special about the new song?",
    options: ["The words", "The rhythm", "The sound"],
    correctAnswer: "The words",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "What did she like the most about the movie?",
    options: ["The mountain scenes", "The story", "The actors’ performances"],
    correctAnswer: "The mountain scenes",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "Why did she become a scientist?",
    options: ["A large stone", "She enjoyed science", "She wanted to help people"],
    correctAnswer: "A large stone",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "audio/question1_13/audio_q1.mp3",
    question: "What time will they meet?",
    options: ["Quarter to ten", "Quarter to eight", "Quarter to eleven"],
    correctAnswer: "Quarter to eight",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "audio/question1_13/audio_q2.mp3",
    question: "Where did they meet for the bus home?",
    options: ["marketplace", "bus station", "nearby park"],
    correctAnswer: "marketplace",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "audio/question1_13/audio_q3.mp3",
    question: "How old is Stephanie?",
    options: ["21", "22", "23"],
    correctAnswer: "21",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "audio/question1_13/audio_q4.mp3",
    question: "Where is the club near?",
    options: ["A coffee shop", "A museum", "A park"],
    correctAnswer: "A park",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "What to feed the cat?",
    options: ["Meat", "Fish", "Chicken"],
    correctAnswer: "Fish",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "What does this family do most weekends?",
    options: ["has dinner together", "plays tennis", "goes for a walk"],
    correctAnswer: "goes for a walk",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "What does he need to buy for his sister?",
    options: ["Chocolates", "Eggs", "Milk"],
    correctAnswer: "Chocolates",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "The train was delayed. What time does the train leave?",
    options: ["9.30", "10.00", "11.30"],
    correctAnswer: "9.30",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "Which area has the best weather?",
    options: ["In the north", "In the east", "In the south"],
    correctAnswer: "In the east",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "Why was the museum visit cancelled?",
    options: ["Not enough people", "The heavy storm", "Too many participant"],
    correctAnswer: "Not enough people",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "Where is the cafe?",
    options: ["Opposite the school", "By the river", "Opposite the gift shop"],
    correctAnswer: "Opposite the gift shop",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "Where is the tea served?",
    options: ["The river boat", "The yacht", "The restaurant"],
    correctAnswer: "The river boat",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "Which room is the largest in her house?",
    options: ["Living room", "Kitchen", "Dining room"],
    correctAnswer: "Kitchen",
    transcript: ""
  },
  {
    heading: "Question 1 of 13",
    audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question1_13/vn-11134207-7ras8-m4sr6sq6fx3r8d.mp3?token=BAH2M3LYJ7HTFDFZVB2J4HLJIJYDI",
    question: "How much are the eggs?",
    options: ["1.50 pound", "2.50 pound", "1.70 pound"],
    correctAnswer: "1.50 pound",
    transcript: ""
  },
  {
    heading: "Question 2 of 13",
    audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question1_13/minihippofuill_aptiskey.com_audio_listening_question1_13_vn-11134207-7ras8-m4sr6sq6fx3r8d%20(1).mp3",
    question: "What time does the train leave? (for him to go on a business trip)",
    options: ["9.15", "9.30", "10.45"],
    correctAnswer: "9.15",
    transcript: ""
  },
  {
    heading: "Question 3 of 13",
    audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question1_13/audio_q1%20(1).mp3",
    question: "How does she go to school?",
    options: ["She walks", "She drives", "She rides a bycicle"],
    correctAnswer: "She walks",
    transcript: ""
  },
  {
    heading: "Question 4 of 13",
    audioUrl: "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question1_13/audiode5.mp3",
    question: "A woman is calling her husband. What time is lunch ready?",
    options: ["2pm", "4pm", "5am"],
    correctAnswer: "2pm",
    transcript: ""
  },
  {
    heading: "Question 5 of 13",
    audioUrl: "audio/question1_13/audio_q5.mp3",
    question: "What does she usually do in the evening?",
    options: ["Go for a walk", "Watch TV", "Sleep"],
    correctAnswer: "Go for a walk",
    transcript: ""
  },
  {
    heading: "Question 6 of 13",
    audioUrl: "audio/question1_13/audio_q6.mp3",
    question: "Where will they meet?",
    options: ["At the park", "At home", "At the office"],
    correctAnswer: "At the park",
    transcript: ""
  },
  {
    heading: "Question 7 of 13",
    audioUrl: "audio/question1_13/audio_q7.mp3",
    question: "What day do they meet?",
    options: ["Tuesday", "Monday", "Saturday"],
    correctAnswer: "Tuesday",
    transcript: ""
  },
  {
    heading: "Question 8 of 13",
    audioUrl: "audio/question1_13/audio_q8.mp3",
    question: "What career did he choose?",
    options: ["To work in business", "A doctor", "A teacher"],
    correctAnswer: "To work in business",
    transcript: ""
  },
  {
    heading: "Question 9 of 13",
    audioUrl: "audio/question1_13/audio_q9.mp3",
    question: "What does this family do most weekends?",
    options: ["Goes for a walk", "Goes to the cinema", "Watches TV together"],
    correctAnswer: "Goes for a walk",
    transcript: ""
  },
  {
    heading: "Question 10 of 13",
    audioUrl: "audio/question1_13/audio_q10.mp3",
    question: "What course did he take?",
    options: ["Computer", "Information Technology", "Business Administration"],
    correctAnswer: "Computer",
    transcript: ""
  },
  {
    heading: "Question 11 of 13",
    audioUrl: "audio/question1_13/audio_q11.mp3",
    question: "A woman is talking about her job. How is being a writer different from other jobs?",
    options: ["She works irregular time", "She works at home", "She has to meet strict deadlines"],
    correctAnswer: "She works irregular time",
    transcript: ""
  },
  {
    heading: "Question 12 of 13",
    audioUrl: "audio/question1_13/audio_q12.mp3",
    question: "Where does she buy food?",
    options: ["At a new shopping centre", "At a convenience store", "At a mall"],
    correctAnswer: "At a new shopping centre",
    transcript: ""
  },
  {
    heading: "Question 13 of 13",
    audioUrl: "audio/question1_13/audio_q13.mp3",
    question: "What causes air pollution?",
    options: ["Fire from the countryside", "Rubbish", "Factory and industrial smoke"],
    correctAnswer: "Fire from the countryside",
    transcript: ""
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

  document.getElementById("question1_13_id").innerText = data.heading;

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
      "title": "LISTENING ĐỀ 12 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "What does her sister drink?",
          "options": [
            "Tea",
            "Water",
            "Coffee"
          ],
          "correctAnswer": "Tea",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "What is the population of this village?",
          "options": [
            "10.000",
            "40.000",
            "20.000"
          ],
          "correctAnswer": "10.000",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "Where does he want to go tomorrow?",
          "options": [
            "The town hall",
            "The cinema",
            "The park"
          ],
          "correctAnswer": "The town hall",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "What floor is the office on?",
          "options": [
            "On the first floor",
            "On the second floor",
            "On the third floor"
          ],
          "correctAnswer": "On the first floor",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "Cost of bus",
          "options": [
            "2.5",
            "5.5",
            "3.5"
          ],
          "correctAnswer": "2.5",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "When can they play football at school?",
          "options": [
            "Wednesday afternoon",
            "Thursday afternoon",
            "Sunday afternoon"
          ],
          "correctAnswer": "Wednesday afternoon",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "Where is the office?",
          "options": [
            "Opposite the hotel",
            "Opposite the park",
            "Opposite the hospital"
          ],
          "correctAnswer": "Opposite the hotel",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "A man is calling his wife. Where did they meet?",
          "options": [
            "Outside a shop",
            "At a café",
            "In a park"
          ],
          "correctAnswer": "Outside a shop",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "What time does he have dinner these days?",
          "options": [
            "7 o'clock",
            "6 o'clock",
            "1 o'clock"
          ],
          "correctAnswer": "7 o'clock",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "What does he do after work?",
          "options": [
            "Play football",
            "Play badminton",
            "Play volleyball"
          ],
          "correctAnswer": "Play football",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "What did they both like about the movie?",
          "options": [
            "The ending",
            "The actor",
            "The theme song"
          ],
          "correctAnswer": "The ending",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "What area is he describing?",
          "options": [
            "A university area",
            "A mall",
            "A sport hall"
          ],
          "correctAnswer": "A university area",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "A man wants to buy a new house. What is his biggest problem?",
          "options": [
            "Persuading his family",
            "Finding enough money",
            "Choosing the right location"
          ],
          "correctAnswer": "Persuading his family",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 11 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "What was his last job?",
          "options": [
            "An electrician",
            "A teacher",
            "A doctor"
          ],
          "correctAnswer": "An electrician",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "What did she lose?",
          "options": [
            "A bag",
            "A hat",
            "A coat"
          ],
          "correctAnswer": "A bag",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "Who is his favourite teacher?",
          "options": [
            "Miss Brown",
            "Miss Andy",
            "Mr Brown"
          ],
          "correctAnswer": "Miss Brown",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "Why does the woman return the dress?",
          "options": [
            "Because of its size",
            "Because of its color",
            "Because it was damaged"
          ],
          "correctAnswer": "Because of its size",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "What is his opinion about that restaurant?",
          "options": [
            "The service is slow",
            "He finds it too expensive",
            "He doesn’t like the food there"
          ],
          "correctAnswer": "The service is slow",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "Where are the students now?",
          "options": [
            "In a townhouse",
            "Library",
            "Sport hall"
          ],
          "correctAnswer": "In a townhouse",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "When will Anna meet her friend?",
          "options": [
            "9 a.m. on Sunday",
            "9 a.m. on Saturday",
            "9 a.m. on Monday"
          ],
          "correctAnswer": "9 a.m. on Sunday",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "Which button should the man press to buy a new computer?",
          "options": [
            "Three",
            "Two",
            "Six"
          ],
          "correctAnswer": "Three",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "How many pages of the assignment?",
          "options": [
            "4",
            "5",
            "8"
          ],
          "correctAnswer": "4",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "What is his opinion about sea transport?",
          "options": [
            "The use of technology will increase",
            "It is slow but reliable",
            "It is environmentally friendly"
          ],
          "correctAnswer": "The use of technology will increase",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "What is not working?",
          "options": [
            "The computer",
            "TV",
            "The mouse"
          ],
          "correctAnswer": "The computer",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "What did he leave in the yard?",
          "options": [
            "Shoes",
            "Hat",
            "Coat"
          ],
          "correctAnswer": "Shoes",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "What did the two people buy?",
          "options": [
            "Trousers",
            "Computer",
            "Shirt"
          ],
          "correctAnswer": "Trousers",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 10 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "Why did he call his friend?",
          "options": [
            "Suggest a drink",
            "Suggest a food",
            "Suggest a shirt"
          ],
          "correctAnswer": "Suggest a drink",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "When did they decide to meet?",
          "options": [
            "9am on Sunday",
            "10am on Sunday",
            "9am on Saturday"
          ],
          "correctAnswer": "9am on Sunday",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "A girl is calling her mother. Which dress does she want?",
          "options": [
            "Long and red",
            "Long and black",
            "Short and red"
          ],
          "correctAnswer": "Long and red",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "What day is the new appointment?",
          "options": [
            "Thursday 13th",
            "Friday 13th",
            "Thursday 15th"
          ],
          "correctAnswer": "Thursday 13th",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "A man is calling his wife. Where did they meet?",
          "options": [
            "Outside a shop",
            "Outside an office",
            "At home"
          ],
          "correctAnswer": "Outside a shop",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "What did she do last weekend?",
          "options": [
            "Stayed at home",
            "Watched a movie",
            "Went out with her friends"
          ],
          "correctAnswer": "Stayed at home",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "How many weeks have they been in India?",
          "options": [
            "2 weeks",
            "3 weeks",
            "1 weeks"
          ],
          "correctAnswer": "2 weeks",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "Where is the office?",
          "options": [
            "Opposite the hotel",
            "Next the hotel",
            "Opposite the mall"
          ],
          "correctAnswer": "Opposite the hotel",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "Where do they wait for the bus?",
          "options": [
            "By the hotel’s main entrance",
            "Near the school",
            "Outside the station"
          ],
          "correctAnswer": "By the hotel’s main entrance",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "What does his wife like to do?",
          "options": [
            "Photography",
            "Cooking",
            "Gardening"
          ],
          "correctAnswer": "Photography",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "What outdoor activities do they do in the afternoon?",
          "options": [
            "Play golf",
            "Play football",
            "Play chess"
          ],
          "correctAnswer": "Play golf",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "A woman is introducing a concert. The concert will end with?",
          "options": [
            "The city’s favorite group",
            "A special guest appearance",
            "A fireworks display"
          ],
          "correctAnswer": "The city’s favorite group",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "What was the writer's first job?",
          "options": [
            "Teacher",
            "Writer",
            "Doctor"
          ],
          "correctAnswer": "Teacher",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 09 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "How does he feel?",
          "options": [
            "Sick",
            "Happy",
            "Funny"
          ],
          "correctAnswer": "Sick",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "How long does it take to get to the station?",
          "options": [
            "20 minutes",
            "30 minutes",
            "70 minutes"
          ],
          "correctAnswer": "20 minutes",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "What did he call to say?",
          "options": [
            "To say thank you",
            "To say goodbye",
            "To say apologize"
          ],
          "correctAnswer": "To say thank you",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "Who is coming to visit him this weekend?",
          "options": [
            "His sister and her children",
            "His friends",
            "His parents"
          ],
          "correctAnswer": "His sister and her children",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "What time is the meeting?",
          "options": [
            "2pm",
            "3pm",
            "1pm"
          ],
          "correctAnswer": "2pm",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "Why can't she pick up her child?",
          "options": [
            "Stay late at the office",
            "Her car has broken down",
            "She is stuck in a meeting"
          ],
          "correctAnswer": "Stay late at the office",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "How much do the cleaning products cost?",
          "options": [
            "One pound fifty",
            "One pound sixty",
            "Two pound fifty"
          ],
          "correctAnswer": "One pound fifty",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "Where is she going with her family?",
          "options": [
            "The mountains",
            "The waterfall",
            "The museum"
          ],
          "correctAnswer": "The mountains",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "What did he usually do last year?",
          "options": [
            "Cycling",
            "Hiking",
            "Biking"
          ],
          "correctAnswer": "Cycling",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "How many minutes did he have to speak?",
          "options": [
            "15",
            "20",
            "25"
          ],
          "correctAnswer": "15",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "Who does she live with?",
          "options": [
            "Best friends",
            "Her family",
            "Boy friend"
          ],
          "correctAnswer": "Best friends",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "Why does she want to be a writer?",
          "options": [
            "Help people",
            "To earn a living",
            "To express her ideas"
          ],
          "correctAnswer": "Help people",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "Why was the flight canceled?",
          "options": [
            "Poor weather conditions",
            "Technical problem",
            "Not enough passengers"
          ],
          "correctAnswer": "Poor weather conditions",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 08 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "Which room will they study in?",
          "options": [
            "Room 301",
            "Room 303",
            "Room 302"
          ],
          "correctAnswer": "Room 301",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "What time is the football match?",
          "options": [
            "1pm",
            "3pm",
            "1am"
          ],
          "correctAnswer": "1pm",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "What is the phone number of the shop?",
          "options": [
            "20 10 30",
            "20 20 30",
            "30 20 10"
          ],
          "correctAnswer": "20 10 30",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "What did they bring for the picnic?",
          "options": [
            "Food",
            "Water",
            "Clothes"
          ],
          "correctAnswer": "Food",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "How many copies did he sell?",
          "options": [
            "Over 300000 copies",
            "300000 copies",
            "Under 300000 copies"
          ],
          "correctAnswer": "Over 300000 copies",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "Where did they go last year?",
          "options": [
            "Camping",
            "Hiking",
            "Biking"
          ],
          "correctAnswer": "Camping",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "What do they plan to do together?",
          "options": [
            "Make plans later",
            "Do homework",
            "Go to the museum"
          ],
          "correctAnswer": "Make plans later",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "What does the man drink?",
          "options": [
            "Iced tea",
            "Water",
            "Coffee"
          ],
          "correctAnswer": "Iced tea",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "Who did she take the picture of?",
          "options": [
            "The girl's team",
            "Children",
            "Family"
          ],
          "correctAnswer": "The girl's team",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "Where do they go when they travel to India?",
          "options": [
            "Go to the park",
            "Food",
            "People"
          ],
          "correctAnswer": "Go to the park",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "What is the weather like today?",
          "options": [
            "Cold and wet",
            "Cloudy",
            "Sunny"
          ],
          "correctAnswer": "Cold and wet",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "How did he adjust the meeting?",
          "options": [
            "Having the meeting without him",
            "Changing the time",
            "Moving it online"
          ],
          "correctAnswer": "Having the meeting without him",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "Which door do they need to take to get to Edinburgh?",
          "options": [
            "Two",
            "One",
            "Four"
          ],
          "correctAnswer": "Two",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 07 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "Where does she walk every night?",
          "options": [
            "The college",
            "The park",
            "The mall"
          ],
          "correctAnswer": "The college",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "How many chairs do they need to prepare for a meeting?",
          "options": [
            "20",
            "30",
            "60"
          ],
          "correctAnswer": "20",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "Where did she ask the coffee shop to look for her lost item?",
          "options": [
            "In the corner",
            "On the table",
            "Next the door"
          ],
          "correctAnswer": "In the corner",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "Where did they meet?",
          "options": [
            "The front entrance",
            "At home",
            "The office"
          ],
          "correctAnswer": "The front entrance",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "The daughter is calling her father. What did she buy?",
          "options": [
            "A dress",
            "A hat",
            "A coat"
          ],
          "correctAnswer": "A dress",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "There will be a school party soon, what should the teacher prepare?",
          "options": [
            "Order the food",
            "Order the pizza",
            "Order the drink"
          ],
          "correctAnswer": "Order the food",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "When will she need a computer?",
          "options": [
            "Friday",
            "Monday",
            "Thursday"
          ],
          "correctAnswer": "Friday",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "What country will they study next semester?",
          "options": [
            "France",
            "US",
            "Germany"
          ],
          "correctAnswer": "France",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "What do they need to repair for the building?",
          "options": [
            "Windows",
            "The roof",
            "The heating system"
          ],
          "correctAnswer": "Windows",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "What does the actor like to do?",
          "options": [
            "Drawing",
            "Singing",
            "Hiking"
          ],
          "correctAnswer": "Drawing",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "What new thing is being built at the school?",
          "options": [
            "A Performance space",
            "A new library",
            "A sport hall"
          ],
          "correctAnswer": "A Performance space",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "What does he like about Dubai?",
          "options": [
            "He enjoys his job here",
            "People",
            "Food"
          ],
          "correctAnswer": "He enjoys his job here",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "What does he advise young people to do to save money?",
          "options": [
            "Cook for yourself",
            "Avoid unnecessary spending",
            "Save a small amount regularly"
          ],
          "correctAnswer": "Cook for yourself",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 06 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "Why did he call his friend?",
          "options": [
            "Suggest a drink",
            "Suggest a job",
            "Suggest a place"
          ],
          "correctAnswer": "Suggest a drink",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "How much does the smallest car cost?",
          "options": [
            "3250 pounds",
            "2530 pounds",
            "1500 pounds"
          ],
          "correctAnswer": "3250 pounds",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "A woman is calling her friend. What did she lose?",
          "options": [
            "Phone",
            "Computer",
            "Glasses"
          ],
          "correctAnswer": "Phone",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "What did he forget?",
          "options": [
            "Glasses",
            "Key",
            "Clothes"
          ],
          "correctAnswer": "Glasses",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "How many Americans are there?",
          "options": [
            "One",
            "Two",
            "Three"
          ],
          "correctAnswer": "One",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "Which room is her favourite?",
          "options": [
            "Bathroom",
            "Living room",
            "Bedroom"
          ],
          "correctAnswer": "Bathroom",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "Where did they go last year?",
          "options": [
            "Camping",
            "Biking",
            "Hiking"
          ],
          "correctAnswer": "Camping",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "What subject does her son like to study?",
          "options": [
            "Art",
            "Math",
            "English"
          ],
          "correctAnswer": "Art",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "What does she usually do in her free time?",
          "options": [
            "Go to the theatre and play sports",
            "Read books",
            "Sleep"
          ],
          "correctAnswer": "Go to the theatre and play sports",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "What advice do they need for decorating their living room?",
          "options": [
            "Where to buy a new table",
            "Where to buy a new glass",
            "Where to buy a new desk"
          ],
          "correctAnswer": "Where to buy a new table",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "What is his opinion on train travel?",
          "options": [
            "Practical",
            "Comfortable",
            "Expensive"
          ],
          "correctAnswer": "Practical",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "What is not original?",
          "options": [
            "Furniture",
            "House",
            "Floor"
          ],
          "correctAnswer": "Furniture",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "What number do you press to buy a new computer?",
          "options": [
            "Three",
            "Zero",
            "One"
          ],
          "correctAnswer": "Three",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 05 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "How much did he pay for the computer?",
          "options": [
            "250 pounds",
            "55 pounds",
            "500 pounds"
          ],
          "correctAnswer": "250 pounds",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "What did they bring for the picnic?",
          "options": [
            "Food",
            "Milk",
            "Water"
          ],
          "correctAnswer": "Food",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "What colour is the teacher's house?",
          "options": [
            "White",
            "Blue",
            "Red"
          ],
          "correctAnswer": "White",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "What time is the football match?",
          "options": [
            "1pm",
            "2pm",
            "7pm"
          ],
          "correctAnswer": "1pm",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "What does she do on her holidays?",
          "options": [
            "Walking",
            "Hiking",
            "Biking"
          ],
          "correctAnswer": "Walking",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "Why does she like the manager?",
          "options": [
            "He taught her a lot",
            "He is friendly",
            "He is hard-working"
          ],
          "correctAnswer": "He taught her a lot",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "What does he want to be?",
          "options": [
            "Writer",
            "Doctor",
            "Teacher"
          ],
          "correctAnswer": "Writer",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "What does he drink?",
          "options": [
            "Water",
            "Milk",
            "Tea"
          ],
          "correctAnswer": "Water",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "What does he remember most about his school days?",
          "options": [
            "History classes",
            "The exams",
            "His teacher"
          ],
          "correctAnswer": "History classes",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "What will she do?",
          "options": [
            "Go for a drive",
            "Go to a museum",
            "Go to sleep"
          ],
          "correctAnswer": "Go for a drive",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "What does she have in common with her mother?",
          "options": [
            "They have similar interests",
            "They have the same job",
            "They look alike"
          ],
          "correctAnswer": "They have similar interests",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "What does he buy at the shop?",
          "options": [
            "A suit for the office",
            "A book",
            "A computer"
          ],
          "correctAnswer": "A suit for the office",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "What do birds do in winter?",
          "options": [
            "They stay in groups for protection",
            "They migrate to warmer places",
            "They build new nests"
          ],
          "correctAnswer": "They stay in groups for protection",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 04 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "What time is the meeting?",
          "options": [
            "10.15",
            "11.15",
            "5.15"
          ],
          "correctAnswer": "10.15",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "Why did he call his friend?",
          "options": [
            "Suggest a drink",
            "Suggest a book",
            "Suggest a place"
          ],
          "correctAnswer": "Suggest a drink",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "How does he feel?",
          "options": [
            "Sick",
            "Happy",
            "Tired"
          ],
          "correctAnswer": "Sick",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "What is the mother asking her daughter to buy?",
          "options": [
            "Eggs",
            "Rice",
            "Books"
          ],
          "correctAnswer": "Eggs",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "When do they meet?",
          "options": [
            "10.00",
            "11.00",
            "12.00"
          ],
          "correctAnswer": "10.00",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "Why can't she pick up her child?",
          "options": [
            "Stay late at the office",
            "Her car has broken down",
            "She is stuck in a meeting"
          ],
          "correctAnswer": "Stay late at the office",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "What movie does she recommend?",
          "options": [
            "Action film",
            "Cartoon",
            "Romantic film"
          ],
          "correctAnswer": "Action film",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "A man is calling his friend. Where is he?",
          "options": [
            "A town hall",
            "A shop",
            "An office"
          ],
          "correctAnswer": "A town hall",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "What means of transport does he use to get to work?",
          "options": [
            "By bus",
            "By car",
            "By motorbike"
          ],
          "correctAnswer": "By bus",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "What time do experts recommend eating fruit?",
          "options": [
            "In the morning",
            "In the evening",
            "In the afternoon"
          ],
          "correctAnswer": "In the morning",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "Why does she wake up early?",
          "options": [
            "To have some quiet time",
            "To do exercise",
            "To do homework"
          ],
          "correctAnswer": "To have some quiet time",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "Why is he learning to drive?",
          "options": [
            "He has to drive to work",
            "He can travel more easily",
            "He doesn’t have to rely on public transport"
          ],
          "correctAnswer": "He has to drive to work",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "What does he buy directly at the shop?",
          "options": [
            "Clothes",
            "Hat",
            "Coffee"
          ],
          "correctAnswer": "Clothes",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 02 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "What time do they meet?",
          "options": [
            "6.30pm",
            "5.30pm",
            "7.30pm"
          ],
          "correctAnswer": "6.30pm",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "What time does she meet her child?",
          "options": [
            "Three o'clock",
            "Four o'clock",
            "Six o'clock"
          ],
          "correctAnswer": "Three o'clock",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "What does her sister drink?",
          "options": [
            "Tea",
            "Milk",
            "Water"
          ],
          "correctAnswer": "Tea",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "How many buildings will the town have?",
          "options": [
            "2000",
            "5000",
            "6000"
          ],
          "correctAnswer": "2000",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "What does she usually do on Saturdays?",
          "options": [
            "Sees her family",
            "Sees her friends",
            "Sees her uncle"
          ],
          "correctAnswer": "Sees her family",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "What do they both buy?",
          "options": [
            "Clothes",
            "Pen",
            "Computer"
          ],
          "correctAnswer": "Clothes",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "What color shirt did he buy?",
          "options": [
            "Black",
            "White",
            "Blue"
          ],
          "correctAnswer": "Black",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "When is the assignment due?",
          "options": [
            "On Saturday",
            "On Monday",
            "On Friday"
          ],
          "correctAnswer": "On Saturday",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "What did the professor want her to do?",
          "options": [
            "Speak at the conference",
            "Go to the museum",
            "Do homework"
          ],
          "correctAnswer": "Speak at the conference",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "Where did she choose to go on holiday?",
          "options": [
            "The South",
            "The East",
            "The North"
          ],
          "correctAnswer": "The South",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "What is special about the new song?",
          "options": [
            "The words",
            "The rhythm",
            "The sound"
          ],
          "correctAnswer": "The words",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "What did she like the most about the movie?",
          "options": [
            "The mountain scenes",
            "The story",
            "The actors’ performances"
          ],
          "correctAnswer": "The mountain scenes",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "Why did she become a scientist?",
          "options": [
            "A large stone",
            "She enjoyed science",
            "She wanted to help people"
          ],
          "correctAnswer": "A large stone",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 03 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "",
          "question": "What time will they meet?",
          "options": [
            "Quarter to ten",
            "Quarter to eight",
            "Quarter to eleven"
          ],
          "correctAnswer": "Quarter to eight",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "",
          "question": "Where did they meet for the bus home?",
          "options": [
            "marketplace",
            "bus station",
            "nearby park"
          ],
          "correctAnswer": "marketplace",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "",
          "question": "How old is Stephanie?",
          "options": [
            "21",
            "22",
            "23"
          ],
          "correctAnswer": "21",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "",
          "question": "Where is the club near?",
          "options": [
            "A coffee shop",
            "A museum",
            "A park"
          ],
          "correctAnswer": "A park",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "What to feed the cat?",
          "options": [
            "Meat",
            "Fish",
            "Chicken"
          ],
          "correctAnswer": "Fish",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "What does this family do most weekends?",
          "options": [
            "has dinner together",
            "plays tennis",
            "goes for a walk"
          ],
          "correctAnswer": "goes for a walk",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "What does he need to buy for his sister?",
          "options": [
            "Chocolates",
            "Eggs",
            "Milk"
          ],
          "correctAnswer": "Chocolates",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "The train was delayed. What time does the train leave?",
          "options": [
            "9.30",
            "10.00",
            "11.30"
          ],
          "correctAnswer": "9.30",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "Which area has the best weather?",
          "options": [
            "In the north",
            "In the east",
            "In the south"
          ],
          "correctAnswer": "In the east",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "Why was the museum visit cancelled?",
          "options": [
            "Not enough people",
            "The heavy storm",
            "Too many participant"
          ],
          "correctAnswer": "Not enough people",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "Where is the cafe?",
          "options": [
            "Opposite the school",
            "By the river",
            "Opposite the gift shop"
          ],
          "correctAnswer": "Opposite the gift shop",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "Where is the tea served?",
          "options": [
            "The river boat",
            "The yacht",
            "The restaurant"
          ],
          "correctAnswer": "The river boat",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "Which room is the largest in her house?",
          "options": [
            "Living room",
            "Kitchen",
            "Dining room"
          ],
          "correctAnswer": "Kitchen",
          "transcript": ""
        }
      ]
    },
    {
      "title": "LISTENING ĐỀ 01 - Question 1-13",
      "part": "1_13",
      "questions": [
        {
          "heading": "Question 1 of 13",
          "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question1_13/vn-11134207-7ras8-m4sr6sq6fx3r8d.mp3?token=BAH2M3LYJ7HTFDFZVB2J4HLJIJYDI",
          "question": "How much are the eggs?",
          "options": [
            "1.50 pound",
            "2.50 pound",
            "1.70 pound"
          ],
          "correctAnswer": "1.50 pound",
          "transcript": ""
        },
        {
          "heading": "Question 2 of 13",
          "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question1_13/minihippofuill_aptiskey.com_audio_listening_question1_13_vn-11134207-7ras8-m4sr6sq6fx3r8d%20(1).mp3",
          "question": "What time does the train leave? (for him to go on a business trip)",
          "options": [
            "9.15",
            "9.30",
            "10.45"
          ],
          "correctAnswer": "9.15",
          "transcript": ""
        },
        {
          "heading": "Question 3 of 13",
          "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question1_13/audio_q1%20(1).mp3",
          "question": "How does she go to school?",
          "options": [
            "She walks",
            "She drives",
            "She rides a bycicle"
          ],
          "correctAnswer": "She walks",
          "transcript": ""
        },
        {
          "heading": "Question 4 of 13",
          "audioUrl": "https://raw.githubusercontent.com/hunkmik3/MiniHippo_full_last/main/minihippofuill/aptiskey.com/audio/listening/question1_13/audiode5.mp3",
          "question": "A woman is calling her husband. What time is lunch ready?",
          "options": [
            "2pm",
            "4pm",
            "5am"
          ],
          "correctAnswer": "2pm",
          "transcript": ""
        },
        {
          "heading": "Question 5 of 13",
          "audioUrl": "",
          "question": "What does she usually do in the evening?",
          "options": [
            "Go for a walk",
            "Watch TV",
            "Sleep"
          ],
          "correctAnswer": "Go for a walk",
          "transcript": ""
        },
        {
          "heading": "Question 6 of 13",
          "audioUrl": "",
          "question": "Where will they meet?",
          "options": [
            "At the park",
            "At home",
            "At the office"
          ],
          "correctAnswer": "At the park",
          "transcript": ""
        },
        {
          "heading": "Question 7 of 13",
          "audioUrl": "",
          "question": "What day do they meet?",
          "options": [
            "Tuesday",
            "Monday",
            "Saturday"
          ],
          "correctAnswer": "Tuesday",
          "transcript": ""
        },
        {
          "heading": "Question 8 of 13",
          "audioUrl": "",
          "question": "What career did he choose?",
          "options": [
            "To work in business",
            "A doctor",
            "A teacher"
          ],
          "correctAnswer": "To work in business",
          "transcript": ""
        },
        {
          "heading": "Question 9 of 13",
          "audioUrl": "",
          "question": "What does this family do most weekends?",
          "options": [
            "Goes for a walk",
            "Goes to the cinema",
            "Watches TV together"
          ],
          "correctAnswer": "Goes for a walk",
          "transcript": ""
        },
        {
          "heading": "Question 10 of 13",
          "audioUrl": "",
          "question": "What course did he take?",
          "options": [
            "Computer",
            "Information Technology",
            "Business Administration"
          ],
          "correctAnswer": "Computer",
          "transcript": ""
        },
        {
          "heading": "Question 11 of 13",
          "audioUrl": "",
          "question": "A woman is talking about her job. How is being a writer different from other jobs?",
          "options": [
            "She works irregular time",
            "She works at home",
            "She has to meet strict deadlines"
          ],
          "correctAnswer": "She works irregular time",
          "transcript": ""
        },
        {
          "heading": "Question 12 of 13",
          "audioUrl": "",
          "question": "Where does she buy food?",
          "options": [
            "At a new shopping centre",
            "At a convenience store",
            "At a mall"
          ],
          "correctAnswer": "At a new shopping centre",
          "transcript": ""
        },
        {
          "heading": "Question 13 of 13",
          "audioUrl": "",
          "question": "What causes air pollution?",
          "options": [
            "Fire from the countryside",
            "Rubbish",
            "Factory and industrial smoke"
          ],
          "correctAnswer": "Fire from the countryside",
          "transcript": ""
        }
      ]
    }
  ]
}
MINI_HIPPO_LESSON_DATA_END */
