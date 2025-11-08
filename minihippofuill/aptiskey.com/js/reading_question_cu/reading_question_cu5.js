document.addEventListener('DOMContentLoaded', function() {

// ===============================================================================================================
// ////////////// DANH SÁCH CÂU HỎI ///////////////
// ===============================================================================================================


// 5. Câu 5
const options_1 = [
    '',
    'The custom of coffee drinking begins to spread',
    'Coffee encourages',
    'A habit that has become a big economy',
    'Problems of coffee economy',
    'A remedy of unjust revenue distribution',
    'Health risks versus health benefits debate',
    'The ancient origin of coffee'
    
];
const paragraph_question5_1 = [
    'The custom of coffee drinking began to spread The custom of drinking coffee has been around for a long time, perhaps as long as 1500 years ago. There were times when drinking coffee was banned in many places. At that time, coffee houses were opened in some places in Egypt and Ethiopia. Later, the custom of drinking coffee spread to Italy and all over Europe. Not long after that, the Dutch introduced coffee to Asia. Later, the habit of drinking coffee became popular all over the world.',
    'Coffee was first used in Africa but Europe is known as the largest coffee consuming region in the world. In the 18th century, many people from different professions such as writers, philosophers and politicians used coffee to stay awake during discussions and meetings. Coffee houses became meeting places for people to share ideas and debate hot topics in society. These places made it easy for people to share their intellectual thoughts and played an important role in business and society at that time.',
    'Nowadays, many people have the habit of drinking coffee in the morning to wake up, or going to coffee shops in the evening to meet and socialize with each other. Coffee shops are popping up everywhere, providing places for people to relax and talk to each other. Coffee has become a global business, with personal coffee makers even appearing in households. Famous global coffee brands have become giant companies, using their brands and communication strategies to attract millions of coffee lovers around the world.',
    'Coffee consumption in Europe accounts for about 90% of global coffee production, making it the largest market in the world. Meanwhile, some other countries in Africa, such as Egypt and Ethiopia, rely heavily on coffee exports to sustain their economies. However, there is a problem of injustice: workers in these African countries face terrible living and working conditions, with incomes as low as $1 a day. While wealthy European countries make huge profits from coffee, people in coffee growing countries do not receive a fair share of their efforts and hard work.',
    'To address this injustice, certification schemes for agricultural production have been introduced. If coffee meets certain certification standards, it can be sold at fair prices, preventing growers from having to sell at rock bottom prices. However, there are problems with this solution. In reality, only about 5% of coffee meets the standards. Many small coffee producers in developing countries are too poor to pay the certification fees, leaving them even further behind in the global coffee market.',
    'There is much debate about the effects of coffee on human health. It is true that coffee can help many people stay awake and concentrate. It contains antioxidants, which can help prevent diseases. But while drinking coffee, people often add sugar and milk and these can be harmful to your health. This can easily cause diseases such as diabetes or obesity for those who use it.',
    'There is a legend about coffee. In the past, a monk observed that birds became more active and lively when they ate a small fruit. The monk then drank the juice from the fruit and stayed awake praying and talking until late at night. So it can be said that thanks to these birds, people knew about the coffee plant.',
];

const question5_keyword_1 = 'Mẹo nhớ Keyword: to spread → encourages → big economy → Problems → A remedy → health → origin.';
const question5_meo_1 = 'Nhớ theo đoạn văn: Cà phê được sử dụng rộng rãi (<strong>to spread</strong>) ví nó thúc đẩy (<strong>encourages</strong>) nền kinh tế lớn (<strong>big economy</strong>). Tuy nhiên, vẫn còn vấn đề (<strong>Problems</strong>) bất công với người trồng cà phê ở châu Phi. Một giải pháp (<strong>A remedy</strong>) đã được đưa ra, và nếu dùng đúng cách, cà phê còn có lợi cho sức khỏe (<strong>health</strong>) như giá trị ban đầu của nó (<strong>origin</strong>).';


// 5. Câu 5
const options_2 = [
    '',
    'Symbol of privilege and wealth', 
    'Opening the door for everyone', 
    'Away from amusement towards instruction', 
    'Away from enclosure towards greater freedom', 
    'A different set of values', 
    'A new mission of conversation', 
    'A modern day alternative'
];

const paragraph_question5_2 = [
    'Long time ago, zoos were reserved exclusively for monarchs and aristocrats, showcasing a grand collection of rare and exotic animals as symbols of their richness and social status. These animals served not only as a display of wealth but also as diplomatic tools, where animals were exchanged as prestigious gifts among the wealthy elite. Kings and emperors delighted in possessing the most diverse and extraordinary creatures from faraway lands, reflecting their dominion over nature and their realm.', 
    'It wasn’t until the reign of England’s King John, in the early 13th century, that the concept of the zoo shifted dramatically. King John, a progressive ruler, opened the royal animal exhibit at the Tower of London to the public. This groundbreaking decision marked a turning point, as zoos gradually transitioned from being exclusive enclaves of royalty to inclusive spaces accessible to people from all walks of life. Zoos transformed into places where the general public could enjoy leisure and explore the wonders of the animal kingdom.', 
    'As societal beliefs progressed, zoos took on a more educational role. Conservation efforts gained strength, and zoos began to focus on raising awareness about endangered species and the importance of preserving biodiversity. The purpose of zoos extended beyond entertainment to provide valuable learning experiences. Modern zoos now prioritize animal welfare, creating environments that mimic natural habitats to ensure the well-being of their residents. Educational programs are designed to inform visitors about wildlife conservation, fostering a deeper appreciation for the natural world.', 
    'In the 19th century, there was a significant change in how zoos treated animals, thanks to the pioneering work of Carl Hagenbeck, a renowned German animal dealer and zoo founder. Hagenbeck completely transformed the way zoos were designed. Instead of confining animals in small cages and enclosures, he introduced the concept of open enclosures. In these more naturalistic environments, animals had greater freedom to move around and express their natural behaviors. The shift from confinement to freedom not only improved the animals’ quality of life but also allowed visitors to observe animals in a more authentic setting.', 
    'As culture and ethics evolve, zoos are reevaluating their beliefs. Instead of solely showcasing rare and exotic animals, modern zoos are now stressing the significance of protecting biodiversity and the environment. Their goal is to encourage visitors to appreciate and care for all forms of life on Earth. Zoos are now working towards practices that prioritize animal welfare and conservation, encouraging a stronger sense of responsibility towards our planet.', 
    'As climate change and habitat destruction pose significant threats to wildlife, zoos have embraced a new mission – protecting animals on the brink of extinction. They play a crucial role in species recovery and act as sanctuaries for critically endangered creatures. Through dedicated conservation programs, zoos work tirelessly to ensure the survival and well-being of these vulnerable species. By taking a lead in conservation efforts, zoos aim to inspire visitors and the wider community to recognize the urgency of protecting our fragile ecosystems and the species that inhabit them.', 
    'While zoos have evolved to prioritize conservation and education, the question arises: Do modern humans still need zoos to learn about animals? Zoos aim to strike a delicate balance, simultaneously educating people, protecting animals, and ensuring their well-being. To achieve this, some zoos are exploring innovative approaches, such as virtual reality experiences and augmented reality exhibits, to offer visitors an immersive and educational experience without physical enclosures. By embracing these modern-life alternatives, zoos can effectively fulfill their educational objectives while also emphasizing the importance of animal welfare and freedom in their mission to protect and preserve wildlife.'
];


const question5_keyword_2 = '<strong>Mẹo nhớ Keyword:</strong> Symbol – Opening – instruction – freedom – different – new – modern.';
const question5_meo_2 = '<strong>Nhớ theo đoạn văn:</strong> Sở thú là biểu tượng (<strong>symbol</strong>) của vua chúa thời xưa, ngày nay thì mở cửa (<strong>openning</strong>) cho tất cả mọi người, không những giải trí mà còn mang tính chất giáo dục (<strong>Instruction</strong>) để hướng đến sự tự do (<strong>freedom</strong>) và còn mang một nhiệm vụ khác (<strong>different</strong>) là đem sự đổi mới (<strong>new</strong>) cho sự phát triển hiện đại (<strong>modern</strong>)';


// 5. Câu 5
const options_3 = [
    '',
    'Making things last longer',
    'A temporary experiment',
    'The reason of secrecy',
    'Still relevant to our times',
    'The difficulty of being generous',
    'Reason to reach a compromise',
    'Important lessons for all of us',
];

const paragraph_question5_3 = [
        'This has not always been the case. Only a few generations ago, the number of possessions that most people owned was far fewer than those accumulated by the average person in a developed country today. For example, shoes were expected to be worn for many years; a working man in the early twentieth century may only have owned five or six pairs in his lifetime. When necessary, they would be repaired rather than discarded, as fashion was regarded as a luxury. If you were lucky enough to have a telephone, the same machine might be expected to be in use for a lifetime.',
        'In the face of modern consumerism, journalist Judith Levine decided to make a radical change to her lifestyle: she and her husband Paul would reduce their spending to a minimum. For a whole year, they would only buy essential items, such as food and things they needed for work. They would mend anything that broke or was old, and they would avoid going out to the cinema, or visiting cafes and restaurants. Although they would save money, this was not the main point of the exercise. As a writer, she planned to document the entire year with the aim of publishing her findings as a book.',
        'In order to make the experiment as authentic as possible, the couple did not tell people why they were no longer buying things. If they had told them, their friends might have offered to pay for them, which would defeat the purpose. Judith Levine wanted to experience and observe the effects of stepping off the consumer treadmill, to see how practical it was, and to see how it affected her own mental state and her relationships with friends, family and strangers. She wanted to know how it would feel to live outside the modern consumerist age.',
        'Published in 2006, the book was called Not Buying It. Reading it more than ten years later, it is interesting to see how Levine predicted many of today’s concerns, such as plastic waste and excessive screen time. She realized how much waste she was generating as a result of shopping. Being forced to keep and re-use things meant she had far less packaging to recycle. Added to this, she became more local in her shopping habits, which again seems to be a current trend. She also anticipated the growing interest in adopting a minimalist lifestyle in relation to possessions.',
        'One of the more interesting problems the Levines encountered was giving gifts. As they were not allowed to buy unnecessary things, they decided that the best option was to make them. However, as neither of them had any particular artistic skills, their attempts at making a gift for a friend’s graduation looked rather cheap, and they decided it would not be appropriate to give it to her. Luckily, Paul had an inspiration; he suggested that his wife should choose something that she loved. This turned out to be a piece of family jewelry, which proved to be the perfect gift.',
        'A more serious issue concerned meetings for work. In New York, where Judith was based, it was common for journalists to meet their sources and contacts in cafes to discuss the stories they were working on. This was not an option for Judith, as she did not want to rely on others to pay. She didn’t have an office, and meeting at her home seemed inappropriate. This was a real problem, and in the end she decided to continue visiting cafes, as they were necessary to her work. When working alone, however, Judith found public libraries very convenient.',
        'Overall, the year proved to be a fascinating experiment, and reading about it makes you realise how dependent on shopping most of us are. Being more mindful of what we buy is vital for our planet, as resources are rapidly diminishing. On a more personal level, as well as the obvious economic benefits, there are health benefits from cutting out unnecessary food and drinks and switching from car use to cycling and walking. It forces you to use your imagination to come up with ways to live with fewer things. It was certainly an eye-opening insight for this reader.',
];


const question5_keyword_3 = '<strong>Mẹo nhớ Keyword:</strong> last longer → temporary experiment → secrecy → relevant → difficulty → compromise → lessons.';

const question5_meo_3 = '<strong>Nhớ theo đoạn văn:</strong> Ngày trước (<strong>last longer</strong>) cuộc sống rất giản dị. Nhà báo Levine đã tiến hành một thử nghiệm tạm thời (<strong>temporary experiment</strong>) và giấu kín (<strong>secrecy</strong>) nó. Thử nghiệm này vẫn sẽ liên quan đến hiện tại (<strong>relevant</strong>). Một trong những khó khăn (<strong>difficulty</strong>) khi thử nghiệm là làm quà tặng cho bạn bè, cô còn phải thỏa hiệp (<strong>compromise</strong>) với bạn bè để đi uống cà phê. Thí nghiệm này là bài học quan trọng (<strong>lessons</strong>) cho chúng ta hiện tại.';

// 5. Câu 5
const options_4 = [
    '',
    'An alternative history of settlement',
    'Natural barrier to resettlement',
    "Technology helps uncover the ocean's secret",
    'A Journey made by stages',
    'A new evidence that leads to speculation',
    'Lack of knowledge and skills',
    'Determination of the explorers through the ages',   
];

const paragraph_question5_4 = [
    'The history of early Australians stretches back much further than previously believed, with evidence suggesting human presence on the Australian continent dating back approximately 65,000 years. This timeline challenges traditional views held by historians regarding the first human settlers in Australia. Carbon analysis of archaeological sites has provided different results, leading to alternative hypotheses about the early inhabitants of the land Down Under. The findings shed new light on the ancient origins and rich cultural heritage of the Indigenous people who have inhabited the continent for millennia.',
    'Recent discoveries have revealed that the settlement of Australia was not a singular event. In addition to the early settlers, scientists have uncovered traces of two other human groups that migrated to the continent. The presence of multiple groups suggests a complex history of human migration and interaction. However, reaching the isolated continent would have posed significant challenges for ancient humans, as they would have needed to traverse vast stretches of open sea, a feat seemingly impossible with the technology available to them at the time.',
    'The aid of advanced equipment and techniques has allowed scientists to identify a series of small islands closely connected, forming a continuous pathway leading to Australia. Remote sensing technology has helped researchers identify and map small islands and potential migration routes. Geographic Information Systems (GIS) have integrated various data sets, to discover about the past migration corridors. This discovery provides insight into the probable routes taken by ancient migrants as they ventured across the vast expanse of the sea, providing a deeper understanding of the complex migration patterns that shaped the early history of the continent.',
    'The migration patterns of early Australians reveal a gradual journey to the continent. Archaeological evidence points to the likelihood of different tribes arriving in Australia through a series of island-hopping journeys. Each island served as a resting point and a source of food, allowing them to continue their voyage. This gradual movement indicates an adaptive and resourceful approach taken by these ancient tribes, who navigated the challenges of the terrain to ultimately settle in Australia.',
    'Scientists can only speculate about the exact number of individuals required to undertake such a migration, which could have ranged from a small group to several thousand people. The uncertainty stems from various factors, including the limitations of available archaeological evidence and the complexities of ancient human migration. The lack of exact statistics makes it challenging to determine the scale and composition of these early human journeys accurately. However, ongoing research and technological advancements may offer more insights in the future.',
    'Some skeptics argue that ancient humans didn’t have enough the intellectual capacity, knowledge, and skills needed to undertake such journeys. They question whether early humans possessed the navigational and maritime expertise to traverse vast stretches of ocean. Critics contend that without advanced tools or navigational aids, navigating through open seas would have been beyond the capabilities of ancient civilizations. However, it is crucial to acknowledge that human ingenuity and adaptability have proven remarkable throughout history, enabling our ancestors to overcome various challenges and achieve extraordinary feats.',
    'History has demonstrated the unwavering determination and resilience of human explorers in the past. From deep-sea expeditions in ancient times to modern space travel, humans have showcased their resolve to explore and conquer the unknown. The same determination might have driven the early Australians to embark on perilous journeys across treacherous waters. While the challenges they faced were undoubtedly immense, the spirit of human curiosity and the desire to discover new lands and opportunities likely motivated these ancient explorers, leaving a remarkable legacy in the annals of history.',
];


const question5_keyword_4 = '<strong>Mẹo nhớ Keyword:</strong> history → Natural → Technology → stages → A new evidence → skills → explorers';

const question5_meo_4 = '<strong>Nhớ theo đoạn văn:</strong> Lịch sử (<strong>history</strong>) hình thành nước Úc diễn ra một cách tự nhiên (<strong>Natural</strong>) qua thời gian. Nhờ sự phát triển của công nghệ (<strong>Technology</strong>), con người đã khám phá ra nước Úc qua nhiều giai đoạn (<strong>stages</strong>). Những phát hiện mới (<strong>A new evidence</strong>) này không chỉ mở rộng hiểu biết mà còn giúp chúng ta học thêm các kỹ năng (<strong>skills</strong>) về thám hiểm và tìm tòi thế giới xung quanh (<strong>explorers</strong>).';

// 5. Câu 5
const options_5 = [
    '',
    'Dickens for our time',
    'Difficulties for modern readers',
    'Keeping the readers guessing',
    'The influence of media',
    "Dickens's early success",
    'Trying to protect his property',
    'Bring the books to life',
];

const paragraph_question5_5 = [
    "The popularity of Dickens's works in our time remains a global phenomenon. Although he wrote his novels in the 19th century, his works have had a global impact. In addition, these masterpieces helped connect Renaissance drama to the multimedia revolution. Many readers find the characters and themes surprisingly modern.",
    "Shakespeare's plays are difficult to understand and sometimes require the reader to struggle or think twice to figure out the character's thoughts. Sometimes the dialogue tends to be emotional without any connection to the context of the story. There are many passages that are a confusing mess of single words and old classical vocabulary.",
    "Hamlet is a Renaissance tragedy written by Shakespeare. The play is very long and has plot twists that keep the reader guessing. Dickens had a special interest in the work. He told his daughter to keep an eye on Hamlet. For Dickens' novels, he sometimes created serial editions, with new chapters released monthly, keeping readers eagerly awaiting the next issue.",
    "Dickens's legacy is undeniable. His works have been translated and used in over 100 countries and are studied by most schoolchildren in the world. It has even been said that Dickens’ legacy belongs not to one era but to all times. It is easy to see that Dickens lives on in society and culture through his language and through his enduring influence on education and the media.",
    'Dickens achieved success at a young age. His first novel, The Pickwick Papers, was published when he was only 24 and became a bestseller. His success increased throughout the 1590s. He was honored as a member of the Lord Chamber Men - those lucky enough to perform for the Queen of England on many occasions. Alongside his novels and plays, he also published many poems in his own style.',
    "As Dickens's reputation grew, the question arose whether to preserve his legacy and make it live on. Dickens himself was always keen to make his mark and to maintain his uniqueness. He even attempted to break the dominance of the popular comedies of the time with a series of dramatic plays.",
    "To mark the 400th anniversary of Dickens's death, there will be a number of events to help readers, and especially students, better understand his works. There will be videos detailing the content of each of his works to help people excitedly explore the pinnacle of language and the meaning his works bring to our daily lives.",
];


const question5_keyword_5 = '<strong>Mẹo nhớ Keyword:</strong> Dickens → Difficulties → Guessing → Media → Success → Protect → Life.';

const question5_meo_5 = '<strong>Nhớ theo đoạn văn:</strong> Dickens là nhà văn nổi tiếng với các bài văn rất khó hiểu (<strong>Difficulties</strong>) luôn làm cho người đọc phải đoán (<strong>guessing</strong>) phần tiếp theo, nhờ truyền thông (<strong>media</strong>) mà ông sớm thành công (<strong>success</strong>), ông luôn luôn bảo vệ (<strong>protect</strong>) phong cách viết của bản thân, các tác phẩm của ông sống mãi (<strong>life</strong>) với chúng ta ngày này.';

// 5. Câu 5
const options_6 = [
    '',
    "The economy during the Golden Age",
    "Coming into fashion",
    "An object of trade",
    "Different types of tulip",
    "Trade mechanics",
    "Trade across Europe",
    "An unexpected turn of events",
];

const paragraph_question5_6 = [
    "During the period of the Dutch Golden Age, the port of Manchester was one of the wealthiest in all of Europe. This prosperity was in part due to the trade connections established by the Dutch East India Company, which transported luxury and exotic goods to Europe from Asia and beyond. Among the imported items, tulip bulbs made their way to Europe and quickly captured public attention, especially after their arrival in the bustling ports of the Netherlands. Tulips, with their striking colors and exotic appeal, soon became a symbol of status and luxury in Europe, especially as they gained popularity through trade at the prominent Manchester port.",
    "In 1593, studies conducted at Dutch universities revealed that tulips could survive the cold European climate, an insight that fueled the flower’s popularity. Their vibrant and diverse colors stood out against the more subdued tones of European flora, making tulips a unique spectacle. As they gained popularity, tulips became a symbol of wealth and status, particularly in the Netherlands. This popularity spread quickly across Europe, establishing tulips as a highly desirable commodity and solidifying their reputation as a status symbol among the European elite.",
    "The demand for tulips surged, with collectors and merchants eagerly seeking the most colorful and unique blooms. Because tulips only bloomed during a limited season, from September to November, those who wanted tulips outside this window had to place orders in advance. This created a system of advance sales and pre-purchases, giving rise to a speculative market. This practice of pre-ordering tulips and trading contracts for their future delivery resembled modern-day options and futures trading in the financial markets, laying the groundwork for a complex market around these rare and exotic flowers.",
    'Tulip values varied greatly, depending on their rarity and color. Multi-colored tulips, especially those with striking patterns, commanded higher prices than solid-colored varieties. Of particular interest were tulips affected by a viral infection that caused beautiful flame-like patterns on the petals, known as "broken" tulips. These rare blooms were highly valued for their unique appearance and sold for premium prices. Since tulips were also susceptible to disease, their fragility and exclusivity made them a prized commodity, as any remaining tulips became even more desirable.',
    "As the tulip market grew, prices skyrocketed. Merchants often held onto their bulbs, waiting to sell at inflated prices. Between 1634 and 1637, the value of certain tulips rose by up to sixty times their original price. Speculators poured increasing amounts of money into tulips, driven by the hope of reselling them at even higher prices. The speculative nature of the market led to an economic bubble, where the price of tulips continued to rise without any intrinsic reason beyond collective belief in their value.",
    "Tulip prices reached such extreme heights that they began to be traded on exchanges and even listed on stock markets. The general public, hoping to partake in the lucrative trade, flocked to purchase tulip bulbs. This speculative frenzy drew in a wide range of people, from merchants to commoners, all vying for a piece of what seemed like a guaranteed profitable investment. The tulip market became a cultural and economic phenomenon, with people from all backgrounds willing to invest their savings into tulips, expecting substantial returns.",
    "However, this bustling tulip market eventually reached its breaking point. As with many speculative bubbles, the tulip craze was unsustainable, and prices eventually began to plummet. Once people realized that tulip prices had risen far beyond reasonable levels, panic selling ensued, and the market collapsed. The dramatic fall in prices left many investors in financial ruin, as the value of tulips dwindled to a fraction of their peak. The tulip mania became one of history’s most famous economic bubbles, offering a cautionary tale about the dangers of speculation and the risks inherent in market bubbles.",
];


const question5_keyword_6 = '<strong>Mẹo nhớ Keyword:</strong> Golden → Fashion → Object of trade → Different types → Mechanics → Europe → Unexpected.';

const question5_meo_6 = '<strong>Nhớ theo đoạn văn:</strong> Hoa tulip từng có thời kỳ hoàng kim (<strong>Golden</strong>), trở thành biểu tượng thời trang (<strong>fashion</strong>) và được coi là vật phẩm để trao đổi (<strong>object of trade</strong>). Vì có nhiều loại khác nhau (<strong>Different types</strong>), việc trồng và buôn bán tulip cần đến máy móc (<strong>mechanics</strong>). Thị trường tulip lan rộng khắp châu Âu (<strong>Europe</strong>), nhưng cuối cùng bong bóng cũng vỡ (<strong>unexpected</strong>), và giá trị trở về thực tế.';

// 5. Câu 5
const options_7 = [
    '',
    "The origins of chinese food",
    "The influence of philosophy",
    "Regional variations",
    "Cooking methods",
    "The style of eating",
    "Changes in the Chinese diets",
    "Effects of a changing diet",
];

const paragraph_question5_7 = [
    "The story of this cuisine stretches back thousands of years, shaped by local farming and customs. Early diets were simple, relying on grains and ingredients from nearby sources. Over time, different areas began to create their own flavors influenced by unique resources and historical events. Key foods, such as rice and noodles, became staples, adding depth to a rich culinary history that continues to evolve.",
    "Ancient ideas play a significant role in shaping attitudes toward food and meals. Concepts like balance and harmony are often reflected in how dishes are prepared and enjoyed, guiding choices in cooking. This backdrop helps create an environment where meals are not just about sustenance but also about connection and community, enriching the overall dining experience.",
    "The diverse geography of the country results in a wide range of culinary styles. Each area showcases distinct flavors based on local ingredients and traditions. For instance, the bold tastes found in one region can be quite different from the lighter fare in another. These variations highlight the richness of the culinary landscape, influenced by both local practices and cultural exchanges.",
    "A variety of cooking techniques are used that enhance the flavors of the ingredients. Quick methods, like stir-frying, keep vegetables crisp and fresh, while steaming helps maintain the natural taste and nutrients of food. Each technique serves to improve the overall eating experience, showing how versatile and innovative cooking can be.",
    "Dining is often approached as a communal experience, emphasizing sharing and togetherness. Meals are usually served in a way that allows everyone to sample different dishes, fostering conversation and connection among diners. The use of chopsticks adds an element of culture, making the act of eating feel more intentional and connected to tradition.",
    "Recent years have seen shifts in eating habits, influenced by modern lifestyles and global trends. While traditional foods remain important, there's a growing interest in fast food and snacks, reflecting a blend of old and new practices. This evolution illustrates how culinary choices can change while still holding onto some aspects of the past.",
    "The shift in dietary habits carries various implications for health and cultural practices. Increased consumption of processed foods and sugary drinks has raised concerns, challenging long-held eating traditions. As younger generations lean towards convenience, there’s a risk of losing valuable culinary knowledge. Balancing contemporary choices with traditional practices is essential for maintaining cultural integrity and promoting healthier lifestyles.",
];


const question5_keyword_7 = '<strong>Mẹo nhớ Keyword:</strong> Chinese food → Influence of philosophy → Regional → Methods → Style → Changes → Effects.';
const question5_meo_7 = '<strong>Nhớ theo đoạn văn:</strong> Nguồn gốc của ẩm thực trung quốc (<strong>origins of chinese food</strong>) chịu ảnh hưởng của triết học khổng tử (<strong>philosophy</strong>), sự khác biệt vùng miền (<strong>Regional</strong>) tạo nên nhiều phương pháp (<strong>methods</strong>) nấu ăn với phong cách (<strong>style</strong>) khác nhau. Sự hay đổi (<strong>Changes</strong>) chế độ ăn sẽ tạo ảnh hưởng (<strong>Effects</strong>) rất mạnh mẽ đến sức khỏe của chúng ta.';

// 5. Câu 5
const options_8 = [
    '',
    "Factors contributing to inactivity",
    "The situation have the potential of being worst",
    "The success of a simple idea",
    "The wider effects of regular activity",
    "Ways in which environment can influence behavior",
    "A design for exercise and for study",
    "Achieving the right balance",
];

const paragraph_question5_8 = [
    "Not anymore, if the statistics are to be believed. For the majority of children in developed countries, there is an increasing volume of evidence that fewer and fewer hours are spent getting exercise outside, and more and more time is spent lying on a sofa, hanging around inside with friends, or more likely, looking at a screen, however, it isn't just screens that are to blame, urbanization restricts children's access to green spaces, fears over their safety keep parents from giving them the freedom to roam, and pressure from schools for children to do hours of homework all contribute.",
    "Is this trend reversible? Technological change is happening at such a rate that it is difficult to make accurate predictions. Nevertheless, it seems certain that laptops and smartphones will continue to prove irresistible, and this is likely to exacerbate the current behavior of the young. The fact that the issue has become an increasing claim is evident from the ongoing debate in the media, as well as in journals of medicine and psychology. As a society, we seem to be recognising the problem, and, in the search for possible solutions, there is a will to prevent it from becoming a full-blown crisis.",
    'One of the more interesting solutions originated in a school in Scotland, which pioneered a scheme to ensure that all its pupils walk or run a mile every day. The initiative was widely praised and won several awards. The subsequent media attention was instrumental in helping to promote the scheme, which in some form or other has been adopted by over 3.600 schools in 35 countries A recent university study compared two schools one a member of the "Daily Mile" scheme, the other not-and found evidence that participation led to improved fitness and body composition',
    "The scheme have reported improvements in the pupils' ability to focus, their alertness and even their classroom behaviour. Recent experiments in psychology and neuroscience have found evidence that these can be consequences of physical activity, although the precise mechanisms are not yet fully understood. The old saying a healthy mind in a healthy body is, it appears, supported by science.",
    "Another means of combatting the problem of lack of exercise comes from the world of architecture. Architectural design not only enables people to live in a particular way, it can also affect the way people go about their lives. For example, carefully designed retail outlets can even have an impact on people's shopping habits. Workplaces can be made more productive through design, and homes can be built that encourage greater communication. Now it seems that a carefully designed school can directly contribute to the amount of exercise children do, not only in exercise or sports classes but also in their normal, day-to-day activities.",
    'Japanese architect Takaharu Tezuka created a kindergarten in Tokyo in which the layout functions as a giant playground. The oval-shaped roof acts as both a play area and a running track. Tezuka recalls the emotional moment when the first pupils started interacting with the architecture. "It was simple," he said. "They just started running" He did not want to impose physical boundaries on the children so created a continuous open space. As an architect, he believes that traditional classrooms do not create a positive learning environment. The free plan of his award winning kindergarten encourages both independence and collaboration.',
    "The two initiatives cited above the 'Daily Mile' and the Japanese kindergarten- occupy two ends of the economic spectrum. The former requires very little in terms of resources and can be easily adapted at no great cost The latter, however, involves a significant investment of both time and money To solve the global problem of inactivity amongst the young will require a variety of responses. Local conditions, including the availability of space and budgetary considerations, will dramatically affect how local authorities and educational institutions respond to the issue, and it will be their responsibility to find a happy medium.",    
];


const question5_keyword_8 = '<strong>Mẹo nhớ Keyword:</strong> Factors → Situation → A simple idea → Effects → Ways → A design → Balance.';
const question5_meo_8 = '<strong>Nhớ theo đoạn văn:</strong> Có nhiều yếu tố (<strong>factors</strong>) tạo nên tình trạng (<strong> situation</strong>) trẻ em ngày nay ngày càng lười vận động. Tuy nhiên, một ý tưởng đơn giản (<strong>a simple idea</strong>) có thể tạo ra ảnh hưởng (<strong>effects</strong>) tích cực đến trẻ. Và cách (<strong>Ways</strong>) Đó là thiết kế (<strong>a design</strong>) một phòng tập phù hợp tạo nên sự cân bằng (<strong>balance</strong>) giữa học tập và rèn luyện sức khỏe cho trẻ.';

// 5. Câu 5
const options_9 = [
    '',
    "Who is in charge?",
    "First step on the ice",
    "Where is the end of the Earth?",
    "Hidden geography",
    "Race to the Pole",
    "Less effort needed",
    "Why is it so cold?",
];

const paragraph_question5_9 = [
    "This continent is governed by an international agreement known as the Antarctic Treaty System, established in 1961. This treaty ensures that the region is utilized for peaceful purposes and encourages global scientific collaboration. While no nation officially owns this land, several countries—Argentina, Australia, Chile, France, New Zealand, Norway, and the United Kingdom—assert territorial claims. The treaty forbids military activity, resource extraction, and nuclear tests, designating the area for research and conservation efforts. As a result, scientists from various countries gather to study this unique environment, sharing their discoveries for the benefit of humanity.",
    "Setting foot on Antarctica is a significant event for any explorer or scientist. The journey typically begins in South America, where travelers board a ship or a plane to cross the Drake Passage. Once they arrive, the first step on the ice is both exhilarating and daunting. Visitors are immediately struck by the vast expanse of white, the crisp, cold air, and the breathtaking scenery. The sound of crunching ice underfoot serves as a reminder of the remote and untouched nature of this continent, a place where human footprints are few and far between.",
    "Positioned around the South Pole, Antarctica represents the southernmost point on the planet. The continent's remoteness contributes to its mystique, drawing adventurers and researchers alike. The harsh conditions, including bitter cold and relentless winds, create a sense of otherworldliness. In many ways, it feels like the last frontier on Earth, where the landscape remains largely unspoiled and the natural world thrives in its purest form.",
    "Beneath the massive ice sheets lies a concealed landscape that reveals much about the planet’s geological history. This region hosts the largest ice mass globally, covering approximately 98 percent of its area. The ice conceals a variety of geological features, including mountains and valleys. Researchers analyze ice cores extracted from deep within the layers to uncover details about past climates and atmospheric conditions. These investigations provide vital information for understanding global climate change and its potential implications for our world.",
    "The pursuit of the southernmost point in the early 20th century captivated many. Adventurers such as Robert Falcon Scott and Roald Amundsen undertook perilous journeys to achieve this milestone. Amundsen's successful expedition in 1911 marked a significant achievement in exploration, while Scott's tragic story underscored the risks associated with such endeavors. These tales of courage and ambition continue to inspire modern explorers, highlighting the fascination that this harsh terrain holds.",
    "Recent advancements in technology have made reaching this icy expanse easier than in the past. Modern icebreakers and advanced aircraft enable safer and more efficient travel. This accessibility has led to a rise in interest for tourism, allowing more people to experience the breathtaking beauty of the landscape. However, the increase in visitors raises concerns about the potential environmental impact, emphasizing the necessity for sustainable practices to safeguard this delicate ecosystem.",
    "The extreme low temperatures in this region result mainly from its high elevation and geographic positioning. Being located over the South Pole means it receives minimal direct sunlight, especially during the prolonged winter months of darkness. Average temperatures can plummet below -60°C (-76°F), with summer still remaining quite frigid. The reflective nature of ice further contributes to the chilling climate. Understanding these climatic influences is crucial for scientists studying global weather systems and shifts in climate patterns.",
];


const question5_keyword_9 = '<strong>Mẹo nhớ Keyword:</strong> Who → First → End of the earth → Hidden geography → Race → Needed → So cold.';
const question5_meo_9 = '<strong>Nhớ theo đoạn văn:</strong> Ai (<strong>Who</strong>) là người đầu tiên (<strong>First</strong>) phát hiện ra nam cực? Đây được xem là nơi tận cùng của Trái Đất (<strong>End of the earth</strong>), ẩn chứa nhiều đặc điểm địa lý (<strong>Hidden geography</strong>) thú vị. Do đó cuộc đua (<strong>Race</strong>) chinh phục Cực Nam rất quyết liệt. Tuy nhiên, tôi nghĩ không cần thiết (<strong>needed</strong>), vì nơi đây quá lạnh (<strong>so cold</strong>) và khắc nghiệt.';

// 5. Câu 5
const options_10 = [
    '',
    "The easiest way to travel",
    "Result of a lucky escape",
    "Origins of what the winner receives",
    "A need for change",
    "Earning a reputation",
    "Generations of champions",
    "Not in it for the money",
];

const paragraph_question5_10 = [
    "Thomas Doggett, an Irish actor and comedian who managed Drury Lane Theatre, created the race. He relied heavily on Thames watermen, who were vital for transportation at the time. With poor roads and crowded city streets, the Thames served as the primary highway. Doggett frequently commuted via the river between his London work locations and his home in Chelsea.",
    "A popular story suggests that Doggett was saved by a waterman after falling into the Thames in 1715. To show his gratitude, he organized a race for six young watermen, offering a prize for the fastest rower on a 7.4-km course between two pubs named “The Swan” in London Bridge and Chelsea.",
    "Unlike typical prizes, Doggett awarded a traditional red waterman's coat with a silver badge inscribed with “Liberty.” This badge commemorated the coronation of George I of the House of Hanover on August 1, 1714. Doggett chose August 1 for the annual race to honor this event. The badge today still includes “Liberty” and an image of the Hanover horse. Doggett managed the race and financed it himself until his death in 1721.",
    "After Doggett's death, the Fishmongers's Company of London continued the race as specified in his will. However, the event now runs with the incoming tide, and competitors use racing boats instead of commercial vessels. In 1988, due to a decline in watermen, the Fishmongers' Company allowed competitors three chances to win the race.",
    "The winner's prize remains the traditional red waterman's coat along with a silver badge featuring a horse and the word “Liberty.” Additionally, all competitors who finish the race receive a miniature version of Doggett's badge for their collars at a ceremony held at Watermen's Hall. The winner receives a silver badge, while other participants receive bronze ones. Historically, winning the Doggett's Coat and Badge in the 18th and 19th centuries helped bring in more business for the successful waterman. Although this practical advantage is now somewhat outdated, achieving the Doggett's Coat and Badge remains a highly respected honor.",
    "In 2012, six rowers competed, and the race was won by 23-year-old waterman Merlin Dwan. Dwan comes from a family of watermen; his father won the Doggett's Coat and Badge in 1977, and his uncle and two cousins have also won the race. However, the Dwan family doesn't hold the record for the most wins—that title goes to the Phelps family, with ten victories.",
    "The tradition of families winning the Doggett's Coat and Badge highlights its enduring significance. Nowadays, being a waterman is likely viewed less as a career and more as a means of preserving a centuries-old family tradition. This heritage is upheld further by the exclusive group of watermen known as the Royal Watermen. Queen Elizabeth employs 24 watermen to accompany her on ceremonial occasions along the Thames. Each waterman earns a modest annual sum of £3.50 for this role, but the prestige of wearing the iconic red jacket and silver badge on important state occasions is invaluable.",
];


const question5_keyword_10 = '<strong>Mẹo nhớ Keyword:</strong> Easiest way → Lucky escape → Winner receives → Change → Earning → Champions → Money.';
const question5_meo_10 = "<strong>Nhớ theo đoạn văn:</strong> Ngày xưa thì cách tốt nhất (<strong>easiest way</strong>) để di chuyển là đi thuyền, chuyện kể rằng ông Doggett hay đi thuyền và có lần ông rơi xuống sông nhưng may mắn thoát được (<strong>Lucky escape</strong>), từ đó ông tổ chức cuộc đua mang tên (<strong>Doggett's coat and badge</strong>), người chiến thắng sẽ nhận được (<strong>winner receives</strong>) chiếc áo Doggett's coat. Sau này tính chất cuộc thi thay đổi (<strong>change</strong>) thiên về kiếm (<strong>Earning</strong>) tiền nhiều hơn, do đó các nhà vô địch (<strong>champions</strong>) sẽ kiếm được rất nhiều tiền (<strong>money</strong>) từ cuộc thi.";

// 5. Câu 5
const options_11 = [
    '',
    "Types of vegetarian",
    "Various explanations",
    "Possible to happen",
    "Factory farming is harmful",
    "Respect the life",
    "Health gets better with diet",
    "Our responsibilities with global",
];

const paragraph_question5_11 = [
    "There are several types of vegetarian diets. Some people avoid all animal products, like vegans, while others, like lacto-vegetarians, eat dairy. Others, like ovo-vegetarians, include eggs. Many people also follow a pescatarian diet, which includes fish but no other meat. Each of these diets offers a variety of meals rich in fruits, vegetables, grains, and plant-based proteins.",
    "The reasons behind dietary choices can be as diverse as the individuals making them. Many people opt for a vegetarian lifestyle due to ethical concerns, environmental awareness, or health considerations. Some may be motivated by cultural traditions or personal beliefs, while others seek new culinary experiences. Understanding these motivations fosters respectful discussions about food choices and their implications, promoting a more inclusive dialogue around dietary preferences.",
    "As the global population continues to grow, concerns about food security and sustainability intensify. The increasing demand for resources puts immense pressure on agricultural systems, leading to potential shortages and rising prices. Without significant changes in our consumption patterns and food production methods, we may face a considerable crisis soon. This reality underscores the need for diverse dietary choices, including vegetarian options, which can alleviate some of the pressure on our food systems.",
    "The industrial approach to livestock production raises numerous ethical and environmental questions. Large-scale operations often prioritize efficiency over animal welfare, resulting in cramped living conditions and the overuse of antibiotics. This practice not only impacts the lives of animals but contributes to pollution and greenhouse gas emissions. As awareness of these issues grows, many advocates push for more humane and sustainable farming practices, which align better with the ethical motivations of those choosing plant-based diets.",
    "In an interconnected world, our food consumption choices carry significant weight. Each individual's decisions can influence broader societal impacts, affecting everything from environmental sustainability to animal welfare. Embracing a sense of stewardship encourages us to consider how our eating habits impact not just our health, but also the health of the planet. By making conscious choices, such as incorporating more plant-based meals, we can collectively work towards a more equitable and sustainable future for all.",
    "Opting for a diet rich in plant-based foods offers numerous advantages for overall well-being. Research suggests that a variety of fruits, vegetables, whole grains, and legumes can lower the risk of chronic diseases such as heart disease and diabetes. These foods are often high in essential nutrients and low in unhealthy fats. Embracing a more plant-centered way of eating not only supports personal health but also aligns with global sustainability efforts, enhancing vitality and energy levels for everyone.",
    "Recognizing the intrinsic value of all living beings is essential for fostering a compassionate world. This perspective encourages reflection on our interactions with nature and other creatures, promoting empathy and kindness. By cultivating a mindset of respect, we can appreciate the interconnectedness of life and acknowledge the importance of coexisting harmoniously with all beings. Such an approach inspires actions that contribute to a more peaceful and sustainable planet, ultimately benefiting both individuals and society as a whole.",
];


const question5_keyword_11 = '<strong>Mẹo nhớ Keyword:</strong> Types → Explanations → Possible → Farming Factory → Life → Health → Responsibilities.';
const question5_meo_11 = "<strong>Nhớ theo đoạn văn:</strong> Có nhiều kiểu (<strong>types</strong>) ăn chay khác nhau, điều này giải thích (<strong>explanations</strong>) rằng ăn chay có thể thực hiện được (<strong>possible</strong>) cho cả mọi người. Thực phẩm chay thường được cung cấp bởi các nông trại (<strong>farming factory</strong>), và việc ăn chay góp phần bảo vệ cuộc sống (<strong>life</strong>) và sức khỏe (<strong>health</strong>) để chúng ta có trách nhiệm (<strong>responsibilities</strong>) hơn với thế giới.";

// 5. Câu 5
const options_12 = [
    '',
    "A physically demanding activity",
    "A good way to boost your memory",
    "A great opportunity to broaden your social circle",
    "A way to learn discipline and the importance of routine",
    "A creative outlet for expressing emotions",
    "Enhanced sensitivity to other people's feelings",
    "Develop a greater sense of well-being",
];

const paragraph_question5_12 = [
    "Research indicates that children who play an instrument experience various positive effects. They become more engaged in school, leading to improved academic performance, especially in comprehension and math. Learning to play music also enhances their fine and gross motor skills and coordination. It can positively impact mental health and well-being and help with memory and social interactions. Moreover, playing an instrument fosters a sense of accomplishment, boosts confidence, and allows for self-expression in children. These benefits make learning music a wonderful experience for your child.",
    "Learning and playing music has been linked to enhanced memory function. Memorizing sheet music, chords, and melodies exercises the brain, improving memory and cognitive abilities. The process of learning new pieces and practicing them regularly helps strengthen neural connections, leading to improved memory retention and recall in other areas of life as well.",
    "Playing an instrument isn’t only good for your brain, it’s also a fantastic opportunity to connect with other like-minded individuals. Joining a band, orchestra, or music group allows musicians to collaborate, share experiences, and develop friendships. Music also has a universal language, making it easier to communicate and connect with people from diverse backgrounds and cultures.",
    "Unless you’re an out-of-this-world child prodigy, learning to play an instrument isn’t a skill you can master overnight. Learning music takes time and effort, and helps children understand that if they want to be good at something, they’ll need to put in the hours and organize their time effectively.This disciplined approach fosters a strong work ethic, patience, and perseverance that can be applied to other areas of life.",
    "Music serves as a channel for individuals to express themselves and communicate in special ways. When kids learn to play an instrument, they can explore their inner world and share thoughts uniquely, even when they struggle to do so verbally. Additionally, playing music can be a form of stress relief. The act of playing an instrument requires concentration and focus, which can help children relax and unwind. It can also provide a healthy way to channel their emotions and energy.",
    "Being a musician in a five-minute song requires physical and mental involvement, but emotional connection is even more crucial. It's not just about the music's mood but also our own feelings. Music develops focus, which helps in life. Research shows that music education improves emotional intelligence, understanding our emotions and others'. Musicians learn to listen and cooperate with others, being attentive and adaptable. This fosters better appreciation of others' emotions and viewpoints.",
    "Playing a musical instrument has been shown to help mental health by reducing stress, anxiety, and depression. It requires all of your attention, allowing you an escape from day-to-day stresses and creating a feeling of mindfulness and calm. Music releases dopamine, the feel-good chemical in the brain, so playing an instrument makes people happy! Factor in the sense of achievement you'll feel when you learn a new note or master a piece, and you'll never have felt better.",
];


const question5_keyword_12 = "<strong>Mẹo nhớ Keyword:</strong> Activity → Memory → Social Circle → Way to Learn → Creative → Other People's Feelings → Develop.";
const question5_meo_12 = "<strong>Nhớ theo đoạn văn:</strong> Nghe nhạc là một hoạt động (<strong>activity</strong>) giúp cải thiện trí nhớ (<strong>memory</strong>) và mở rộng mối quan hệ xã hội (<strong>social circle</strong>). Đây là một cách hay để học (<strong>way to learn</strong>) và sáng tạo (<strong>creative</strong>) ra cảm xúc của người khác (<strong>other people's feelings</strong>), đồng thời giúp phát triển bản thân (<strong>develop</strong>) tốt hơn.";

// 5. Câu 5
const options_13 = [
    '',
    "A sensible financial choice",
    "The price of convenience may be high",
    "The importance of planning in advance",
    "The impact of lack of freedom",
    "The benefits of living with less",
    "The advantages of having your own space",
    "A competitive business",
];

const paragraph_question5_13 = [
    "In today's world, many individuals are opting to live in hotels because it is more affordable than renting a house. The cost of renting a hotel covers all expenses, including water, electricity, and even meals, often surpassing what traditional homes offer. Moreover, residents have the opportunity to negotiate long-term stays with hotel managers, making hotel living more cost-effective compared to renting a house.",
    "While it may seem convenient to have meals readily available with private chefs in hotel restaurants, there are potential downsides to consider. Reliance on outside food options can impact health. Hotel meals often prioritize convenience over nutrition, which can lead to an unhealthy diet. This, in turn, may result in weight gain and nutrient deficiencies, leading to various health issues. As a result, you can suffer from medical bills in the long term - if you use the food in the restaurant cooked by chef.",
    "Moving to a hotel for an extended period requires careful planning and preparation. It’s not a decision that can be made overnight. Individuals need to consider what belongings to bring, how to transport them, and how to organize their new living space. It's important to prioritize essential items and leave behind what is not necessary. By planning ahead, individuals can ensure a smooth transition to hotel living, avoiding unnecessary stress and disruptions.",
    "Living in a hotel comes with certain rules and regulations that residents must follow. They have to adapt to the hotel's policies and accommodate different lifestyles of fellow residents. This can sometimes mean compromising personal preferences to maintain harmony within the hotel environment. While there may be a loss of certain freedoms compared to living in a house, the trade-off is the convenience and services provided by the hotel.",
    "Choosing to live in a hotel instead of renting a house often means downsizing and living with fewer possessions. This can bring various benefits, such as reduced clutter, easier maintenance, and a simplified lifestyle. Living with less can also lead to greater flexibility and mobility, as individuals are not tied down to a specific location or burdened with extensive belongings. Embracing a minimalist approach can enhance a sense of freedom and offer a more streamlined living experience.",
    "Adjusting to hotel living can be tough, but it brings fresh outlooks. Living with less in a smaller space allows residents to focus on experiences instead of stuff, leading to a simpler and more flexible lifestyle. Plus, being in a hotel exposes people to different cultures and diverse individuals, broadening their minds and promoting openness. This change in perspective encourages personal growth, adaptability, and a deeper appreciation for the transient nature of life.",
    "As the trend of living in hotels becomes increasingly popular, the hotel industry faces growing competition. Hotels must continually enhance their offerings and services to attract guests and secure their position in the market. The future of hotel living is predicted to be a competitive arena, as establishments strive to captivate customers and meet their evolving needs and preferences. This competition benefits consumers, as it fosters innovation and ensures a diverse range of hotel options to choose from.",
];


const question5_keyword_13 = "<strong>Mẹo nhớ Keyword:</strong> hoice → Price → Importance → Freedom → Live → Own Space → Competitive Business.";
const question5_meo_13 = "<strong>Nhớ theo đoạn văn:</strong> Việc lựa chọn (<strong>choice</strong>) một khách sạn với mức giá cả (<strong>price</strong>) hợp lý là yếu tố rất quan trọng (<strong>importance</strong>), giúp thuê được phòng mang lại sự tự do (<strong>freedom</strong>) để sống (<strong>live</strong>) trong không gian riêng (<strong>own space</strong>) của mình. Điều này tạo sự cạnh tranh trong kinh doanh (<strong>competitive business</strong>) của các khách sạn.";

// 5. Câu 5
const options_14 = [
    '',
    "Live in a small scale",
    "Motivated",
    "Advantages",
    "Homes too big",
    "Sharing skills",
    "Making a small impact",
    "The lasting change",
];

const paragraph_question5_14 = [
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
];


const question5_keyword_14 = '<strong>Mẹo nhớ Keyword:</strong> Live in a small scale → Motivated → Advantages → Homes too big → Sharing skills → Making a small impact → Lasting change.';
const question5_meo_14 = "<strong>Nhớ theo đoạn văn:</strong> Tiny House là cách sống trong không gian nhỏ (<strong>Live in a small scale</strong>), bắt nguồn từ động lực (<strong>Motivated</strong>) sống đơn giản. Nó mang nhiều lợi ích (<strong>Advantages</strong>) như chi phí thấp, tiết kiệm năng lượng. Trong khi nhiều ngôi nhà quá lớn (<strong>Homes too big</strong>) gây lãng phí. Người ở tiny house thường chia sẻ kỹ năng (<strong>Sharing skills</strong>) và cùng nhau tạo tác động nhỏ (<strong>Making a small impact</strong>) đến môi trường. Đây là một sự thay đổi lâu dài (<strong>lasting change</strong>) trong lối sống hiện đại.";





// 5. Câu 5
const options_15 = [
    '',
    "an unsatisfactory",
    "a soft currency is",
    "an old currency used today",
    "the creation",
    "arise",
    "the politics",
    "international",
];


const paragraph_question5_15 = [
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
    "This lesson doesn't have any text, you just need to memorize the key points -  Bài này không có đoạn văn, bạn học thuộc key là được.",
];


const question5_keyword_15 = '<strong>Mẹo nhớ Keyword:</strong> Unsatisfactory → Soft currency → Old currency → Creation → Arise → Politics → International.';
const question5_meo_15 = "<strong>Nhớ theo đoạn văn:</strong> Nhà máy sản xuất (<strong>unsatisfactory</strong>) (có từ factory) tiền mềm (<strong>soft currency</strong>) và tiền cũ (<strong>old currency</strong>) đã tạo nên (<strong>creation</strong>) sự tăng trưởng (<strong>arise</strong>) về an toàn chính trị (<strong>politics</strong>) trên toàn thế giới (<strong>international</strong>).";




const options = [options_1, options_2, options_3, options_4, options_5, 
    options_6, options_7, options_8, options_9, options_10, options_11, 
    options_12, options_13, options_14,options_15,
];

const paragraph_question5 = [
  paragraph_question5_1, paragraph_question5_2, paragraph_question5_3, paragraph_question5_4, paragraph_question5_5, 
  paragraph_question5_6, paragraph_question5_7, paragraph_question5_8, paragraph_question5_9, paragraph_question5_10, 
  paragraph_question5_11, paragraph_question5_12, paragraph_question5_13, paragraph_question5_14, paragraph_question5_15

];


const meohoc1 = [question5_keyword_1, question5_meo_1];
const meohoc2 = [question5_keyword_2, question5_meo_2];
const meohoc3 = [question5_keyword_3, question5_meo_3];
const meohoc4 = [question5_keyword_4, question5_meo_4];
const meohoc5 = [question5_keyword_5, question5_meo_5];
const meohoc6 = [question5_keyword_6, question5_meo_6];
const meohoc7 = [question5_keyword_7, question5_meo_7];
const meohoc8 = [question5_keyword_8, question5_meo_8];
const meohoc9 = [question5_keyword_9, question5_meo_9];
const meohoc10 = [question5_keyword_10, question5_meo_10];
const meohoc11 = [question5_keyword_11, question5_meo_11];
const meohoc12 = [question5_keyword_12, question5_meo_12];
const meohoc13 = [question5_keyword_13, question5_meo_13];
const meohoc14 = [question5_keyword_14, question5_meo_14];
const meohoc15 = [question5_keyword_15, question5_meo_15];


const meohoc = [meohoc1, meohoc2, meohoc3, meohoc4, meohoc5, 
    meohoc6, meohoc7, meohoc8, meohoc9, meohoc10, meohoc11, 
    meohoc12, meohoc13, meohoc14, meohoc15
];



const topic_name = {
    topic_1: "THE COFFEE", 
    topic_2: "THE ZOO", 
    topic_3: "CONSUMER AGE", 
    topic_4: "Early Australia",
    topic_5: "Charles Dickens", 
    topic_6: "The Tulips", 
    topic_7: "Eating in China", 
    topic_8: "Children and exercises", 
    topic_9: "Antarctica - Frozen land", 
    topic_10: "Doggett's coat and badge", 
    topic_11: "Meatless diet", 
    topic_12: "The Music", 
    topic_13: "The Hotel", 
    topic_14: "Tiny house",
    topic_15: "Currency",
};




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
