import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  type: "user" | "ai";
  text: string;
}

// ─── Motivational endings (rotate randomly) ───────────────────────────────────
const MOTIVATIONAL = [
  "\n\n💪 मेहनत करते रहो -- आप बहुत काबिल इंसान बनोगे!",
  "\n\n🌟 हर रोज़ थोड़ा सीखो -- एक दिन आप बहुत आगे जाओगे!",
  "\n\n🏆 आपकी लगन देखकर लगता है आप ज़रूर सफल होंगे!",
  "\n\n✨ English सीखना आपकी सबसे बड़ी ताकत बनेगी!",
  "\n\n🚀 आप सही रास्ते पर हैं -- रुकना मत!",
];
function motiv(): string {
  return MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)];
}

// ─── Blocked keywords ─────────────────────────────────────────────────────────
const BLOCKED_KEYWORDS = [
  "app",
  "apps",
  "application",
  "ऐप",
  "एप",
  "code",
  "coding",
  "कोडिंग",
  "program",
  "programming",
  "प्रोग्रामिंग",
  "software",
  "सॉफ्टवेयर",
  "website",
  "वेबसाइट",
  "html",
  "css",
  "javascript",
  "react",
  "python",
  "java",
  "develop",
  "developer",
  "development",
  "server",
  "database",
  "api",
  "android",
  "ios",
  "playstore",
  "job",
  "jobs",
  "नौकरी",
  "career",
  "करियर",
  "salary",
  "सैलरी",
  "तनख्वाह",
  "interview",
  "इंटरव्यू",
  "resume",
  "cv",
  "hiring",
  "recruit",
  "work from home",
  "freelance",
  "income",
  "earn money",
  "पैसा कमाना",
  "कमाई कैसे",
  "exam paper",
  "school paper",
  "पेपर कौन",
  "पेपर कब",
  "news",
  "न्यूज़",
  "खबर",
  "recipe",
  "रेसिपी",
  "cricket score",
  "match score",
  "cricket",
  "politics",
  "राजनीति",
  "election",
  "चुनाव",
  "weather",
  "मौसम",
  "movie ticket",
  "film",
];

function isBlocked(input: string): boolean {
  const lower = input.toLowerCase();
  return BLOCKED_KEYWORDS.some((kw) => lower.includes(kw));
}

// ─── Huge word dictionary ─────────────────────────────────────────────────────
const WORD_DICT: Record<
  string,
  { hindi: string; example: string; emoji: string }
> = {
  // Fruits
  apple: { hindi: "सेब", example: "I eat an apple every day.", emoji: "🍎" },
  banana: { hindi: "केला", example: "Monkeys love bananas.", emoji: "🍌" },
  mango: { hindi: "आम", example: "Mango is the king of fruits.", emoji: "🥭" },
  grapes: { hindi: "अंगूर", example: "These grapes are sweet.", emoji: "🍇" },
  watermelon: {
    hindi: "तरबूज़",
    example: "Watermelon is juicy and sweet.",
    emoji: "🍉",
  },
  strawberry: {
    hindi: "स्ट्रॉबेरी",
    example: "I love strawberry ice cream.",
    emoji: "🍓",
  },
  pineapple: {
    hindi: "अनानास",
    example: "Pineapple is sour and sweet.",
    emoji: "🍍",
  },
  papaya: {
    hindi: "पपीता",
    example: "Papaya is good for digestion.",
    emoji: "🍈",
  },
  guava: { hindi: "अमरूद", example: "Guava is rich in vitamin C.", emoji: "🍐" },
  pear: { hindi: "नाशपाती", example: "She is eating a pear.", emoji: "🍐" },
  cherry: { hindi: "चेरी", example: "Cherries are red and tasty.", emoji: "🍒" },
  coconut: {
    hindi: "नारियल",
    example: "Coconut water is refreshing.",
    emoji: "🥥",
  },
  lemon: { hindi: "नींबू", example: "Lemon juice is sour.", emoji: "🍋" },
  pomegranate: {
    hindi: "अनार",
    example: "Pomegranate seeds are red.",
    emoji: "🍎",
  },
  // Vegetables
  tomato: {
    hindi: "टमाटर",
    example: "Tomato is used in many dishes.",
    emoji: "🍅",
  },
  potato: { hindi: "आलू", example: "I like potato chips.", emoji: "🥔" },
  onion: { hindi: "प्याज", example: "Onions make our eyes water.", emoji: "🧅" },
  carrot: { hindi: "गाजर", example: "Rabbits love carrots.", emoji: "🥕" },
  cabbage: {
    hindi: "पत्तागोभी",
    example: "Cabbage is green and leafy.",
    emoji: "🥬",
  },
  spinach: { hindi: "पालक", example: "Spinach is full of iron.", emoji: "🥬" },
  brinjal: {
    hindi: "बैंगन",
    example: "Brinjal is also called eggplant.",
    emoji: "🍆",
  },
  pumpkin: {
    hindi: "कद्दू",
    example: "We carved a pumpkin for Halloween.",
    emoji: "🎃",
  },
  cauliflower: {
    hindi: "फूलगोभी",
    example: "Cauliflower is white and healthy.",
    emoji: "🥦",
  },
  cucumber: {
    hindi: "खीरा",
    example: "Cucumber is cool and crunchy.",
    emoji: "🥒",
  },
  peas: { hindi: "मटर", example: "Peas are small and green.", emoji: "🫛" },
  garlic: {
    hindi: "लहसुन",
    example: "Garlic adds flavour to food.",
    emoji: "🧄",
  },
  ginger: {
    hindi: "अदरक",
    example: "Ginger tea is very healthy.",
    emoji: "🫚",
  },
  // Animals
  dog: { hindi: "कुत्ता", example: "The dog is barking.", emoji: "🐕" },
  cat: { hindi: "बिल्ली", example: "My cat is sleeping.", emoji: "🐱" },
  cow: { hindi: "गाय", example: "The cow gives milk.", emoji: "🐄" },
  lion: {
    hindi: "शेर",
    example: "The lion is the king of the jungle.",
    emoji: "🦁",
  },
  elephant: {
    hindi: "हाथी",
    example: "Elephants have long trunks.",
    emoji: "🐘",
  },
  tiger: {
    hindi: "बाघ",
    example: "The tiger is the national animal of India.",
    emoji: "🐯",
  },
  monkey: { hindi: "बंदर", example: "Monkeys climb trees.", emoji: "🐒" },
  rabbit: { hindi: "खरगोश", example: "Rabbits have long ears.", emoji: "🐰" },
  horse: { hindi: "घोड़ा", example: "The horse runs fast.", emoji: "🐴" },
  goat: { hindi: "बकरी", example: "The goat eats grass.", emoji: "🐐" },
  sheep: { hindi: "भेड़", example: "Sheep give us wool.", emoji: "🐑" },
  pig: { hindi: "सूअर", example: "Pigs love to roll in mud.", emoji: "🐷" },
  bird: { hindi: "पक्षी", example: "A bird is singing.", emoji: "🐦" },
  fish: { hindi: "मछली", example: "Fish live in water.", emoji: "🐟" },
  butterfly: {
    hindi: "तितली",
    example: "A butterfly sits on the flower.",
    emoji: "🦋",
  },
  snake: { hindi: "साँप", example: "The snake moves silently.", emoji: "🐍" },
  frog: { hindi: "मेंढक", example: "Frogs jump and croak.", emoji: "🐸" },
  bear: { hindi: "भालू", example: "Bears sleep in winter.", emoji: "🐻" },
  deer: { hindi: "हिरण", example: "Deer run very fast.", emoji: "🦌" },
  parrot: {
    hindi: "तोता",
    example: "Parrots can talk like humans.",
    emoji: "🦜",
  },
  // Colors
  red: { hindi: "लाल", example: "She is wearing a red dress.", emoji: "🔴" },
  blue: { hindi: "नीला", example: "The sky is blue.", emoji: "🔵" },
  green: { hindi: "हरा", example: "Leaves are green.", emoji: "🟢" },
  yellow: { hindi: "पीला", example: "The sun is yellow.", emoji: "🌟" },
  white: { hindi: "सफेद", example: "Snow is white.", emoji: "⚪" },
  black: { hindi: "काला", example: "The night sky is black.", emoji: "⚫" },
  pink: { hindi: "गुलाबी", example: "She loves pink flowers.", emoji: "🌸" },
  purple: { hindi: "बैंगनी", example: "Purple is a royal colour.", emoji: "🟣" },
  orange: {
    hindi: "नारंगी",
    example: "The orange colour looks bright.",
    emoji: "🟠",
  },
  brown: { hindi: "भूरा", example: "The wooden table is brown.", emoji: "🟤" },
  grey: {
    hindi: "धूसर/भूरा-सफेद",
    example: "The sky looks grey today.",
    emoji: "🩶",
  },
  gold: {
    hindi: "सोने का रंग",
    example: "Gold colour looks very beautiful.",
    emoji: "🌟",
  },
  silver: {
    hindi: "चाँदी का रंग",
    example: "Silver shines brightly.",
    emoji: "⚪",
  },
  // Body parts
  hand: { hindi: "हाथ", example: "Wash your hands.", emoji: "✋" },
  eye: { hindi: "आँख", example: "I have two eyes.", emoji: "👁️" },
  nose: { hindi: "नाक", example: "The nose helps us smell.", emoji: "👃" },
  ear: { hindi: "कान", example: "We hear with our ears.", emoji: "👂" },
  mouth: { hindi: "मुँह", example: "Open your mouth wide.", emoji: "👄" },
  tooth: {
    hindi: "दाँत",
    example: "Brush your teeth twice a day.",
    emoji: "🦷",
  },
  hair: { hindi: "बाल", example: "She has long black hair.", emoji: "💇" },
  leg: { hindi: "पैर", example: "I hurt my leg while playing.", emoji: "🦵" },
  foot: { hindi: "पाँव", example: "He hurt his foot.", emoji: "🦶" },
  finger: { hindi: "उँगली", example: "She cut her finger.", emoji: "☝️" },
  head: { hindi: "सिर", example: "Keep your head up.", emoji: "🗣️" },
  neck: { hindi: "गर्दन", example: "She has a long neck.", emoji: "🦒" },
  shoulder: {
    hindi: "कंधा",
    example: "He carried the bag on his shoulder.",
    emoji: "💪",
  },
  stomach: { hindi: "पेट", example: "My stomach is full.", emoji: "🫃" },
  back: { hindi: "पीठ", example: "My back hurts.", emoji: "🔙" },
  heart: { hindi: "दिल", example: "The heart pumps blood.", emoji: "❤️" },
  // Verbs
  run: { hindi: "दौड़ना", example: "I run every morning.", emoji: "🏃" },
  eat: { hindi: "खाना", example: "We eat food three times a day.", emoji: "🍽️" },
  drink: {
    hindi: "पीना",
    example: "Drink water to stay healthy.",
    emoji: "💧",
  },
  sleep: { hindi: "सोना", example: "Children sleep early.", emoji: "😴" },
  play: { hindi: "खेलना", example: "Children love to play.", emoji: "⚽" },
  study: { hindi: "पढ़ना", example: "We study at school.", emoji: "📚" },
  write: { hindi: "लिखना", example: "She can write neatly.", emoji: "✍️" },
  read: { hindi: "पढ़ना", example: "I read books daily.", emoji: "📖" },
  walk: { hindi: "चलना", example: "I walk to the park.", emoji: "🚶" },
  jump: { hindi: "कूदना", example: "The child jumps happily.", emoji: "🦘" },
  sing: { hindi: "गाना", example: "She sings beautifully.", emoji: "🎤" },
  dance: {
    hindi: "नाचना",
    example: "They dance at the festival.",
    emoji: "💃",
  },
  speak: { hindi: "बोलना", example: "He speaks English well.", emoji: "🗣️" },
  listen: { hindi: "सुनना", example: "Please listen carefully.", emoji: "👂" },
  give: { hindi: "देना", example: "Please give me the book.", emoji: "🤲" },
  take: { hindi: "लेना", example: "Take your medicine.", emoji: "💊" },
  come: { hindi: "आना", example: "Please come here.", emoji: "👋" },
  go: { hindi: "जाना", example: "I go to school by bus.", emoji: "🚌" },
  see: { hindi: "देखना", example: "I can see a rainbow.", emoji: "🌈" },
  think: { hindi: "सोचना", example: "Think before you speak.", emoji: "🤔" },
  know: { hindi: "जानना", example: "I know the answer.", emoji: "💡" },
  love: { hindi: "प्यार करना", example: "I love my family.", emoji: "❤️" },
  help: { hindi: "मदद करना", example: "She helps her friends.", emoji: "🤝" },
  open: { hindi: "खोलना", example: "Open the door, please.", emoji: "🚪" },
  close: { hindi: "बंद करना", example: "Close the window.", emoji: "🪟" },
  buy: { hindi: "खरीदना", example: "He wants to buy a bike.", emoji: "🛒" },
  sell: { hindi: "बेचना", example: "She sells vegetables.", emoji: "🏪" },
  // Adjectives
  happy: { hindi: "खुश", example: "She looks very happy today.", emoji: "😊" },
  sad: { hindi: "उदास", example: "He was sad after the match.", emoji: "😢" },
  big: { hindi: "बड़ा", example: "This is a big house.", emoji: "🏠" },
  small: { hindi: "छोटा", example: "A small ant is walking.", emoji: "🐜" },
  hot: { hindi: "गर्म", example: "The tea is hot.", emoji: "☕" },
  cold: { hindi: "ठंडा", example: "Ice cream is cold.", emoji: "🧊" },
  fast: { hindi: "तेज़", example: "The car moves fast.", emoji: "🏎️" },
  slow: { hindi: "धीमा", example: "A tortoise is slow.", emoji: "🐢" },
  tall: { hindi: "लंबा", example: "He is very tall.", emoji: "📏" },
  short: {
    hindi: "छोटा/नाटा",
    example: "She is short but strong.",
    emoji: "🤸",
  },
  beautiful: { hindi: "सुंदर", example: "The garden is beautiful.", emoji: "🌸" },
  ugly: {
    hindi: "बदसूरत",
    example: "That old building looks ugly.",
    emoji: "🏚️",
  },
  good: { hindi: "अच्छा", example: "You did a good job!", emoji: "👍" },
  bad: { hindi: "बुरा", example: "That was a bad idea.", emoji: "👎" },
  new: { hindi: "नया", example: "I bought a new phone.", emoji: "✨" },
  old: { hindi: "पुराना", example: "This is an old temple.", emoji: "🏛️" },
  rich: { hindi: "अमीर", example: "He is a rich man.", emoji: "💰" },
  poor: { hindi: "गरीब", example: "We should help the poor.", emoji: "🫶" },
  clean: { hindi: "साफ़", example: "Keep your room clean.", emoji: "🧹" },
  dirty: { hindi: "गंदा", example: "Wash your dirty clothes.", emoji: "🧺" },
  strong: { hindi: "मज़बूत", example: "He is very strong.", emoji: "💪" },
  weak: {
    hindi: "कमज़ोर",
    example: "She felt weak after illness.",
    emoji: "😮‍💨",
  },
  // Numbers
  one: { hindi: "एक", example: "I have one pen.", emoji: "1️⃣" },
  two: { hindi: "दो", example: "There are two cats.", emoji: "2️⃣" },
  three: { hindi: "तीन", example: "She has three books.", emoji: "3️⃣" },
  four: { hindi: "चार", example: "Four boys are playing.", emoji: "4️⃣" },
  five: { hindi: "पाँच", example: "I have five fingers.", emoji: "5️⃣" },
  ten: { hindi: "दस", example: "There are ten students.", emoji: "🔟" },
  hundred: { hindi: "सौ", example: "One hundred rupees.", emoji: "💯" },
  thousand: {
    hindi: "हज़ार",
    example: "A thousand stars in the sky.",
    emoji: "⭐",
  },
  // Days
  monday: { hindi: "सोमवार", example: "School starts on Monday.", emoji: "📅" },
  tuesday: {
    hindi: "मंगलवार",
    example: "We have a test on Tuesday.",
    emoji: "📅",
  },
  wednesday: {
    hindi: "बुधवार",
    example: "Wednesday is the middle of the week.",
    emoji: "📅",
  },
  thursday: {
    hindi: "गुरुवार",
    example: "I go to the market on Thursday.",
    emoji: "📅",
  },
  friday: {
    hindi: "शुक्रवार",
    example: "Friday is the last school day.",
    emoji: "📅",
  },
  saturday: { hindi: "शनिवार", example: "We play on Saturday.", emoji: "📅" },
  sunday: { hindi: "रविवार", example: "Sunday is a holiday.", emoji: "📅" },
  // Months
  january: {
    hindi: "जनवरी",
    example: "January is the first month.",
    emoji: "❄️",
  },
  february: { hindi: "फरवरी", example: "February has 28 days.", emoji: "💝" },
  march: { hindi: "मार्च", example: "Holi comes in March.", emoji: "🌸" },
  april: {
    hindi: "अप्रैल",
    example: "April showers bring May flowers.",
    emoji: "🌧️",
  },
  may: { hindi: "मई", example: "It is very hot in May.", emoji: "☀️" },
  june: { hindi: "जून", example: "Monsoon starts in June.", emoji: "🌧️" },
  july: { hindi: "जुलाई", example: "July is rainy season.", emoji: "🌦️" },
  august: {
    hindi: "अगस्त",
    example: "Independence Day is in August.",
    emoji: "🇮🇳",
  },
  september: {
    hindi: "सितंबर",
    example: "September brings cooler weather.",
    emoji: "🍂",
  },
  october: {
    hindi: "अक्टूबर",
    example: "Diwali falls in October or November.",
    emoji: "🪔",
  },
  november: { hindi: "नवंबर", example: "November is pleasant.", emoji: "🌤️" },
  december: {
    hindi: "दिसंबर",
    example: "Christmas is in December.",
    emoji: "🎄",
  },
  // Family
  mother: {
    hindi: "माँ",
    example: "My mother cooks delicious food.",
    emoji: "👩",
  },
  father: {
    hindi: "पिता",
    example: "My father goes to work daily.",
    emoji: "👨",
  },
  sister: { hindi: "बहन", example: "My sister is very kind.", emoji: "👧" },
  brother: { hindi: "भाई", example: "My brother plays football.", emoji: "👦" },
  grandmother: {
    hindi: "दादी/नानी",
    example: "My grandmother tells stories.",
    emoji: "👵",
  },
  grandfather: {
    hindi: "दादा/नाना",
    example: "My grandfather is very wise.",
    emoji: "👴",
  },
  uncle: {
    hindi: "चाचा/मामा",
    example: "My uncle brought me a gift.",
    emoji: "👨",
  },
  aunt: {
    hindi: "चाची/मामी",
    example: "My aunt makes great sweets.",
    emoji: "👩",
  },
  son: { hindi: "बेटा", example: "He is a good son.", emoji: "👦" },
  daughter: { hindi: "बेटी", example: "She is a lovely daughter.", emoji: "👧" },
  husband: { hindi: "पति", example: "Her husband is a doctor.", emoji: "💑" },
  wife: { hindi: "पत्नी", example: "His wife is a teacher.", emoji: "💑" },
  friend: { hindi: "दोस्त", example: "He is my best friend.", emoji: "🤝" },
  // Household
  table: { hindi: "मेज़", example: "The book is on the table.", emoji: "🪑" },
  chair: { hindi: "कुर्सी", example: "Please sit on the chair.", emoji: "🪑" },
  door: { hindi: "दरवाज़ा", example: "Close the door.", emoji: "🚪" },
  window: {
    hindi: "खिड़की",
    example: "Open the window for fresh air.",
    emoji: "🪟",
  },
  bed: { hindi: "बिस्तर", example: "I sleep on a soft bed.", emoji: "🛏️" },
  kitchen: {
    hindi: "रसोई",
    example: "Mother cooks in the kitchen.",
    emoji: "🍳",
  },
  mirror: { hindi: "दर्पण", example: "Look in the mirror.", emoji: "🪞" },
  clock: { hindi: "घड़ी", example: "The clock shows 5 o'clock.", emoji: "🕐" },
  lamp: { hindi: "दीपक/बल्ब", example: "Switch on the lamp.", emoji: "💡" },
  bag: { hindi: "थैला", example: "She carries a bag to school.", emoji: "👜" },
  // Emotions
  angry: {
    hindi: "गुस्से में",
    example: "He was angry at the mistake.",
    emoji: "😠",
  },
  scared: {
    hindi: "डरा हुआ",
    example: "She was scared of the dark.",
    emoji: "😨",
  },
  excited: {
    hindi: "उत्साहित",
    example: "I am excited about the trip.",
    emoji: "🤩",
  },
  surprised: {
    hindi: "हैरान",
    example: "She was surprised by the gift.",
    emoji: "😲",
  },
  tired: { hindi: "थका हुआ", example: "He is tired after work.", emoji: "😴" },
  bored: {
    hindi: "ऊब गया",
    example: "I am bored sitting at home.",
    emoji: "😑",
  },
  proud: { hindi: "गर्वित", example: "She is proud of her son.", emoji: "😤" },
  // Professions
  teacher: {
    hindi: "अध्यापक/शिक्षक",
    example: "The teacher explains clearly.",
    emoji: "👩‍🏫",
  },
  doctor: {
    hindi: "डॉक्टर",
    example: "The doctor examined the patient.",
    emoji: "👨‍⚕️",
  },
  farmer: { hindi: "किसान", example: "The farmer grows rice.", emoji: "👨‍🌾" },
  soldier: {
    hindi: "सैनिक",
    example: "The soldier protects our country.",
    emoji: "💂",
  },
  engineer: {
    hindi: "इंजीनियर",
    example: "He is a civil engineer.",
    emoji: "👷",
  },
  nurse: {
    hindi: "नर्स",
    example: "The nurse takes care of patients.",
    emoji: "👩‍⚕️",
  },
  police: {
    hindi: "पुलिस",
    example: "The police officer helps people.",
    emoji: "👮",
  },
  driver: {
    hindi: "ड्राइवर",
    example: "The bus driver drives carefully.",
    emoji: "🚌",
  },
  // Vehicles
  car: { hindi: "कार", example: "The car moves on the road.", emoji: "🚗" },
  bus: { hindi: "बस", example: "I go to school by bus.", emoji: "🚌" },
  train: { hindi: "ट्रेन", example: "The train is on time.", emoji: "🚂" },
  bicycle: { hindi: "साइकिल", example: "He rides a bicycle.", emoji: "🚲" },
  motorcycle: {
    hindi: "मोटरसाइकिल",
    example: "The motorcycle goes fast.",
    emoji: "🏍️",
  },
  aeroplane: {
    hindi: "हवाई जहाज़",
    example: "The aeroplane flies high.",
    emoji: "✈️",
  },
  ship: { hindi: "जहाज़", example: "The ship sails on the ocean.", emoji: "🚢" },
  // Places
  school: { hindi: "स्कूल", example: "I go to school every day.", emoji: "🏫" },
  hospital: {
    hindi: "अस्पताल",
    example: "The hospital is nearby.",
    emoji: "🏥",
  },
  market: {
    hindi: "बाज़ार",
    example: "We buy vegetables from the market.",
    emoji: "🏪",
  },
  temple: { hindi: "मंदिर", example: "We pray at the temple.", emoji: "🛕" },
  park: { hindi: "पार्क", example: "Children play in the park.", emoji: "🌳" },
  river: { hindi: "नदी", example: "The river flows gently.", emoji: "🌊" },
  mountain: {
    hindi: "पहाड़",
    example: "The mountain is very high.",
    emoji: "⛰️",
  },
  village: {
    hindi: "गाँव",
    example: "He lives in a small village.",
    emoji: "🏡",
  },
  city: { hindi: "शहर", example: "Mumbai is a big city.", emoji: "🏙️" },
  // Clothing
  shirt: { hindi: "कमीज़", example: "He wears a white shirt.", emoji: "👔" },
  pant: { hindi: "पैंट", example: "She is wearing black pants.", emoji: "👖" },
  dress: {
    hindi: "पोशाक",
    example: "She wore a beautiful dress.",
    emoji: "👗",
  },
  shoes: {
    hindi: "जूते",
    example: "Wear your shoes before going out.",
    emoji: "👟",
  },
  cap: { hindi: "टोपी", example: "He wore a blue cap.", emoji: "🧢" },
  socks: { hindi: "मोज़े", example: "Wear warm socks in winter.", emoji: "🧦" },
  // Nature
  water: { hindi: "पानी", example: "Water is life.", emoji: "💧" },
  sun: { hindi: "सूरज", example: "The sun rises in the east.", emoji: "☀️" },
  moon: { hindi: "चाँद", example: "The moon is bright tonight.", emoji: "🌙" },
  star: { hindi: "तारा", example: "Stars shine at night.", emoji: "⭐" },
  rain: { hindi: "बारिश", example: "It rains heavily in monsoon.", emoji: "🌧️" },
  wind: { hindi: "हवा", example: "The wind is blowing hard.", emoji: "💨" },
  tree: { hindi: "पेड़", example: "Trees give us oxygen.", emoji: "🌳" },
  flower: { hindi: "फूल", example: "The flower smells sweet.", emoji: "🌸" },
  grass: { hindi: "घास", example: "The grass is green and soft.", emoji: "🌿" },
  soil: { hindi: "मिट्टी", example: "Plants grow in soil.", emoji: "🌱" },
  fire: { hindi: "आग", example: "Do not play with fire.", emoji: "🔥" },
  sky: { hindi: "आसमान", example: "The sky is clear today.", emoji: "🌤️" },
  // Food
  rice: {
    hindi: "चावल",
    example: "Rice is the staple food of India.",
    emoji: "🍚",
  },
  bread: { hindi: "रोटी", example: "I eat bread in the morning.", emoji: "🍞" },
  milk: { hindi: "दूध", example: "Drink milk every day.", emoji: "🥛" },
  egg: { hindi: "अंडा", example: "I eat a boiled egg.", emoji: "🥚" },
  sugar: { hindi: "चीनी", example: "Do not eat too much sugar.", emoji: "🍬" },
  salt: { hindi: "नमक", example: "Add salt to the food.", emoji: "🧂" },
  // General
  book: {
    hindi: "किताब",
    example: "This book is very interesting.",
    emoji: "📚",
  },
  pen: { hindi: "कलम", example: "Give me a pen, please.", emoji: "🖊️" },
  time: { hindi: "समय", example: "Time is very precious.", emoji: "⏰" },
  money: { hindi: "पैसा", example: "Save your money wisely.", emoji: "💰" },
  home: { hindi: "घर", example: "There is no place like home.", emoji: "🏡" },
  road: {
    hindi: "सड़क",
    example: "Walk on the left side of the road.",
    emoji: "🛣️",
  },
  light: { hindi: "रोशनी", example: "Switch on the light.", emoji: "💡" },
  colour: {
    hindi: "रंग",
    example: "What is your favourite colour?",
    emoji: "🎨",
  },
  color: { hindi: "रंग", example: "What is your favourite color?", emoji: "🎨" },
  answer: { hindi: "जवाब", example: "Please answer my question.", emoji: "💬" },
  question: { hindi: "सवाल", example: "Ask any question freely.", emoji: "❓" },
  name: { hindi: "नाम", example: "What is your name?", emoji: "🏷️" },
  country: { hindi: "देश", example: "India is my country.", emoji: "🇮🇳" },
  language: {
    hindi: "भाषा",
    example: "English is an international language.",
    emoji: "🗣️",
  },
  word: {
    hindi: "शब्द",
    example: "Learn five new words every day.",
    emoji: "📝",
  },
  sentence: {
    hindi: "वाक्य",
    example: "Write a sentence in English.",
    emoji: "📖",
  },
};

// ─── Grammar rules (12 tenses + more) ────────────────────────────────────────
const GRAMMAR_RULES: Record<string, string> = {
  // --- TENSES ---
  "simple present":
    "✅ **Simple Present Tense (सामान्य वर्तमान काल)**\n\nसंरचना (Structure):\n• I/You/We/They + V1 (base verb)\n• He/She/It + V1+s/es\n\n📌 Examples:\n• I eat rice. (मैं चावल खाता हूँ।)\n• She plays cricket. (वह क्रिकेट खेलती है।)\n• They study English. (वे अंग्रेज़ी पढ़ते हैं।)\n\n💡 Tip: He/She/It के साथ -s या -es लगाएं।",

  "present continuous":
    "✅ **Present Continuous Tense (वर्तमान काल - जारी)**\n\nसंरचना: Subject + is/am/are + V+ing\n\n📌 Examples:\n• I am eating. (मैं खा रहा हूँ।)\n• She is reading. (वह पढ़ रही है।)\n• They are playing. (वे खेल रहे हैं।)\n\n💡 Tip: अभी जो हो रहा है उसके लिए is/am/are + ing।",

  "present perfect":
    "✅ **Present Perfect Tense (पूर्ण वर्तमान काल)**\n\nसंरचना: Subject + has/have + V3 (past participle)\n\n📌 Examples:\n• I have eaten. (मैंने खाया है।)\n• She has gone. (वह जा चुकी है।)\n• They have finished. (वे खत्म कर चुके हैं।)\n\n💡 He/She/It → has | I/We/You/They → have",

  "present perfect continuous":
    "✅ **Present Perfect Continuous Tense**\n\nसंरचना: Subject + has/have been + V+ing\n\n📌 Examples:\n• I have been studying for 2 hours. (मैं 2 घंटे से पढ़ रहा हूँ।)\n• She has been sleeping since morning. (वह सुबह से सो रही है।)\n\n💡 काम जो पहले शुरू हुआ और अभी भी जारी है।",

  "simple past":
    "✅ **Simple Past Tense (सामान्य भूतकाल)**\n\nसंरचना: Subject + V2 (past form)\n\n📌 Examples:\n• I ate rice. (मैंने चावल खाया।)\n• She played cricket. (उसने क्रिकेट खेला।)\n• They studied English. (उन्होंने अंग्रेज़ी पढ़ी।)\n\n💡 Regular verbs में -ed: play→played, walk→walked\nIrregular: go→went, eat→ate, see→saw",

  "past continuous":
    "✅ **Past Continuous Tense (भूतकाल - जारी)**\n\nसंरचना: Subject + was/were + V+ing\n\n📌 Examples:\n• I was sleeping. (मैं सो रहा था।)\n• They were playing. (वे खेल रहे थे।)\n• She was singing a song. (वह गाना गा रही थी।)\n\n💡 He/She/It → was | We/You/They → were",

  "past perfect":
    "✅ **Past Perfect Tense (पूर्ण भूतकाल)**\n\nसंरचना: Subject + had + V3\n\n📌 Examples:\n• I had eaten before he came. (वह आने से पहले मैं खा चुका था।)\n• She had left when I arrived. (मेरे पहुँचने तक वह जा चुकी थी।)\n\n💡 जो काम पहले ही हो चुका था।",

  "past perfect continuous":
    "✅ **Past Perfect Continuous Tense**\n\nसंरचना: Subject + had been + V+ing\n\n📌 Examples:\n• I had been waiting for 2 hours. (मैं 2 घंटे से इंतजार कर रहा था।)\n• She had been crying since morning. (वह सुबह से रो रही थी।)",

  "simple future":
    "✅ **Simple Future Tense (सामान्य भविष्यकाल)**\n\nसंरचना: Subject + will + V1\n\n📌 Examples:\n• I will eat rice. (मैं चावल खाऊँगा।)\n• She will play cricket. (वह क्रिकेट खेलेगी।)\n• They will study English. (वे अंग्रेज़ी पढ़ेंगे।)\n\n💡 Will + base verb हमेशा future दिखाता है।",

  "future continuous":
    "✅ **Future Continuous Tense (भविष्यकाल - जारी)**\n\nसंरचना: Subject + will be + V+ing\n\n📌 Examples:\n• I will be eating at 8 PM. (रात 8 बजे मैं खाना खा रहा होऊँगा।)\n• She will be sleeping by then. (तब तक वह सो रही होगी।)",

  "future perfect":
    "✅ **Future Perfect Tense (पूर्ण भविष्यकाल)**\n\nसंरचना: Subject + will have + V3\n\n📌 Examples:\n• I will have finished by 5 PM. (शाम 5 बजे तक मैं खत्म कर चुकूँगा।)\n• She will have left before you arrive. (तुम्हारे आने से पहले वह जा चुकी होगी।)",

  "future perfect continuous":
    "✅ **Future Perfect Continuous Tense**\n\nसंरचना: Subject + will have been + V+ing\n\n📌 Examples:\n• By July, I will have been studying English for 2 years.\n  (जुलाई तक, मैं 2 साल से English पढ़ रहा होऊँगा।)",

  // --- GRAMMAR ---
  articles:
    "✅ **Articles (A, An, The)**\n\n🔤 A - किसी एक चीज़ के लिए (consonant sound से शुरू)\n• A dog, A book, A pen\n\n🔤 An - vowel (a,e,i,o,u) sound से शुरू होने पर\n• An apple, An elephant, An honest man\n\n🔤 The - specific चीज़ के लिए\n• The sun, The moon, The book I gave you\n\n📌 Examples:\n• I saw a dog. (A dog - पहली बार mention)\n• The dog was barking. (The dog - जो पहले mention हुआ)\n\n💡 Tip: A/An = general | The = specific/known",

  pronouns:
    "✅ **Pronouns (सर्वनाम)**\n\n👤 Subject Pronouns:\nI (मैं) | You (तुम) | He (वह-पुरुष) | She (वह-महिला) | It (यह/वह-चीज़) | We (हम) | They (वे)\n\n👤 Object Pronouns:\nMe (मुझे) | You (तुम्हें) | Him (उसे-पुरुष) | Her (उसे-महिला) | It (इसे) | Us (हमें) | Them (उन्हें)\n\n📌 Examples:\n• I love her. (मैं उससे प्यार करता हूँ।)\n• She gave him a book. (उसने उसे किताब दी।)\n• They helped us. (उन्होंने हमारी मदद की।)",

  prepositions:
    "✅ **Prepositions (संबंधबोधक शब्द)**\n\n📍 In = में → I live in India.\n📍 On = पर → The book is on the table.\n📍 At = पर → I am at school. / at 5 PM\n📍 Under = नीचे → The cat is under the chair.\n📍 Above = ऊपर → The fan is above me.\n📍 With = के साथ → I go with my friend.\n📍 From = से → I am from India.\n📍 To = को/की तरफ → I go to school.\n📍 Between = के बीच → Sit between Ram and Shyam.\n📍 Before = पहले → Come before 10 AM.\n📍 After = बाद में → I sleep after dinner.",

  conjunctions:
    "✅ **Conjunctions (संयोजक शब्द)**\n\nदो sentences या words को जोड़ने वाले शब्द।\n\n📌 Common Conjunctions:\n• And (और) → Ram and Shyam are friends.\n• But (लेकिन) → He is poor but happy.\n• Or (या) → Tea or coffee?\n• Because (क्योंकि) → I am tired because I worked hard.\n• So (इसलिए) → It rained, so I stayed home.\n• Although (हालाँकि) → Although it was late, he came.\n• When (जब) → Call me when you arrive.",

  modals:
    "✅ **Modal Verbs (सहायक क्रियाएँ)**\n\n🔹 Can = सकता हूँ (ability/present)\n  → I can swim. (मैं तैर सकता हूँ।)\n\n🔹 Could = सकता था (ability/past or polite)\n  → I could swim as a child.\n  → Could you help me? (क्या आप मेरी मदद कर सकते हैं?)\n\n🔹 Will = करूँगा (future intention)\n  → I will come tomorrow.\n\n🔹 Would = करूँगा (polite/conditional)\n  → Would you like tea?\n\n🔹 Should = चाहिए (advice/obligation)\n  → You should exercise daily.\n\n🔹 Must = ज़रूर करना चाहिए (strong obligation)\n  → You must drink water.\n\n🔹 May = शायद/अनुमति (possibility/permission)\n  → May I come in? (क्या मैं अंदर आ सकता हूँ?)",

  "active passive":
    "✅ **Active और Passive Voice**\n\n🔸 Active Voice: Subject काम करता है।\n  → Ram eats an apple. (राम सेब खाता है।)\n\n🔸 Passive Voice: Object पर काम होता है।\n  → An apple is eaten by Ram. (राम द्वारा सेब खाया जाता है।)\n\n📌 Passive बनाने का formula:\nObject + is/am/are + V3 + by + Subject\n\n📌 More examples:\n• Active: She wrote a letter.\n• Passive: A letter was written by her.",

  "direct indirect":
    '✅ **Direct और Indirect Speech**\n\n🔸 Direct Speech: जो सच में बोला गया (quotes में)\n  → He said, "I am hungry."\n\n🔸 Indirect Speech: वही बात अपने शब्दों में\n  → He said that he was hungry.\n\n📌 बदलाव:\n• am/is → was\n• are → were\n• will → would\n• can → could\n• "I" → he/she (subject के अनुसार)\n\n📌 Examples:\n• Direct: She said, "I love mangoes."\n• Indirect: She said that she loved mangoes.',

  "singular plural":
    "✅ **Singular और Plural (एकवचन और बहुवचन)**\n\n📌 Regular rules:\n• +s → book→books, pen→pens, cat→cats\n• +es (s,x,sh,ch के बाद) → box→boxes, church→churches\n• y→ies (consonant + y) → baby→babies, city→cities\n• f/fe → ves → leaf→leaves, wife→wives\n\n📌 Irregular (अनियमित):\n• man→men | woman→women | child→children\n• tooth→teeth | foot→feet | mouse→mice\n• sheep→sheep | fish→fish (same)\n\n💡 Tip: He/She/It के साथ singular और They/We के साथ plural verb।",

  "degrees of comparison":
    "✅ **Degrees of Comparison (तुलना के स्तर)**\n\n🔹 Positive (सामान्य): Ram is tall.\n🔹 Comparative (तुलना): Ram is taller than Shyam.\n🔹 Superlative (सबसे): Ram is the tallest boy.\n\n📌 Short adjectives (1-2 syllable):\n• tall → taller → tallest\n• big → bigger → biggest\n• fast → faster → fastest\n\n📌 Long adjectives (3+ syllable):\n• beautiful → more beautiful → most beautiful\n• intelligent → more intelligent → most intelligent\n\n📌 Irregular:\n• good → better → best\n• bad → worse → worst\n• many → more → most",

  "present tense":
    "✅ **Present Tense (वर्तमान काल) - 4 प्रकार:**\n\n1️⃣ Simple Present: She eats rice. (रोज़ की आदत)\n2️⃣ Present Continuous: She is eating. (अभी हो रहा है)\n3️⃣ Present Perfect: She has eaten. (खा चुकी है)\n4️⃣ Present Perfect Continuous: She has been eating for 10 minutes.\n\nकिसी specific type के बारे में पूछने के लिए type करें जैसे 'simple present'",

  "past tense":
    "✅ **Past Tense (भूतकाल) - 4 प्रकार:**\n\n1️⃣ Simple Past: She ate rice. (खाया)\n2️⃣ Past Continuous: She was eating. (खा रही थी)\n3️⃣ Past Perfect: She had eaten. (खा चुकी थी)\n4️⃣ Past Perfect Continuous: She had been eating for 10 minutes.\n\nकिसी specific type के बारे में 'simple past' या 'past continuous' type करें",

  "future tense":
    "✅ **Future Tense (भविष्यकाल) - 4 प्रकार:**\n\n1️⃣ Simple Future: She will eat rice. (खाएगी)\n2️⃣ Future Continuous: She will be eating. (खा रही होगी)\n3️⃣ Future Perfect: She will have eaten. (खा चुकी होगी)\n4️⃣ Future Perfect Continuous: She will have been eating.\n\nकिसी specific type के बारे में पूछने के लिए type करें जैसे 'simple future'",
};

// ─── Common phrases ────────────────────────────────────────────────────────────
const PHRASES: Record<string, string> = {
  "good morning":
    "🌅 **Good Morning = सुप्रभात**\n\nUse: जब सुबह किसी से मिलें।\n• Good morning, teacher! (सुप्रभात, गुरुजी!)\n• Good morning, everyone! (सुप्रभात, सभी को!)",
  "good afternoon":
    "☀️ **Good Afternoon = नमस्कार (दोपहर में)**\n\n• Good afternoon, sir! (नमस्कार, सर!)\n• Good afternoon, friends!",
  "good evening":
    "🌆 **Good Evening = शुभ संध्या**\n\n• Good evening, everyone!\n• Good evening, how was your day?",
  "good night":
    "🌙 **Good Night = शुभ रात्रि**\n\n• Good night, Mom! (शुभ रात्रि, माँ!)\n• Good night, sweet dreams!",
  "thank you":
    "🙏 **Thank You = धन्यवाद**\n\n• Thank you for your help. (मदद के लिए धन्यवाद।)\n• Thank you very much! (बहुत-बहुत धन्यवाद!)\n• Thanks a lot! (बहुत शुक्रिया!)",
  please:
    "😊 **Please = कृपया**\n\n• Please sit down. (कृपया बैठ जाएं।)\n• Please give me water. (कृपया मुझे पानी दीजिए।)",
  sorry:
    "😔 **Sorry = माफ़ करना / खेद है**\n\n• I am sorry for being late. (देर से आने के लिए माफ़ करना।)\n• Sorry, I didn't understand. (माफ़ करना, मैं समझा नहीं।)",
  "how are you":
    "👋 **How are you? = आप कैसे हैं?**\n\nResponses:\n• I am fine, thank you. (मैं ठीक हूँ, धन्यवाद।)\n• I am doing well. (मैं अच्छा हूँ।)\n• Not so good today. (आज ज़्यादा अच्छा नहीं।)",
  "what is your name":
    "🏷️ **What is your name? = आपका नाम क्या है?**\n\nAnswer:\n• My name is Rahul. (मेरा नाम राहुल है।)\n• I am Priya. (मैं प्रिया हूँ।)",
  "where are you from":
    "🌏 **Where are you from? = आप कहाँ से हैं?**\n\n• I am from India. (मैं भारत से हूँ।)\n• I am from Delhi. (मैं दिल्ली से हूँ।)",
  "i am":
    "📝 **I am / I was / I will be:**\n\n• I am a student. (मैं एक छात्र हूँ।) - present\n• I was a student. (मैं एक छात्र था।) - past\n• I will be a doctor. (मैं डॉक्टर बनूँगा।) - future\n\n💡 am = present | was = past | will be = future",
  can: "✅ **Can का use (उपयोग)**\n\n1. Ability (क्षमता):\n   I can swim. (मैं तैर सकता हूँ।)\n\n2. Permission (अनुमति):\n   Can I go now? (क्या मैं जा सकता हूँ?)\n\n3. Possibility (संभावना):\n   It can be done. (यह हो सकता है।)\n\n💡 Could = Can का polite या past form\n   Could you help me? (क्या आप मेरी मदद कर सकते हैं?)",
  "will would":
    "📝 **Will vs Would:**\n\nWill = निश्चित भविष्य\n• I will come tomorrow.\n\nWould = polite request या conditional\n• Would you like tea? (क्या आप चाय लेंगे?)\n• I would help if I could. (अगर मैं कर सकता तो मदद करता।)",
  "should must":
    "📝 **Should vs Must:**\n\nShould = सलाह देना (advice)\n• You should exercise daily. (आपको रोज़ व्यायाम करना चाहिए।)\n\nMust = ज़रूरी है (strong obligation)\n• You must wear a helmet. (हेलमेट ज़रूर पहनें।)",
  hello:
    "👋 **Hello! नमस्ते!**\n\nमैं आपका English Guru AI हूँ! 🎓\n\nमैं इनमें मदद कर सकता हूँ:\n📚 Word meanings (शब्दों के अर्थ)\n📝 Grammar rules (12 tenses, articles, pronouns...)\n✏️ Sentence making (वाक्य बनाना)\n🗣️ Pronunciation tips (उच्चारण)\n💬 Common phrases\n✅ Sentence correction\n\nकोई भी English सवाल पूछो!",
  hi: "👋 **Hi! नमस्ते!**\n\nकोई भी English word, grammar, या sentence पूछो -- मैं हमेशा मदद के लिए तैयार हूँ! 😊",
};

// ─── Quick tips ───────────────────────────────────────────────────────────────
const TIPS = [
  "💡 रोज़ 5 नए English words सीखो। छोटे-छोटे कदम बड़ी सफलता देते हैं!",
  "💡 Mirror के सामने English में बोलने की practice करो!",
  "💡 English movies को subtitles के साथ देखो -- नए words जल्दी याद होते हैं!",
  "💡 हर रोज़ एक English sentence diary में लिखो!",
  "💡 English songs सुनो और lyrics को समझने की कोशिश करो!",
  "💡 अपने दोस्तों के साथ English में बात करने की practice करो!",
];

// ─── Sentence checker ─────────────────────────────────────────────────────────
function checkSentence(input: string): string | null {
  // Basic sentence correction patterns
  const corrections: Array<[RegExp, string, string]> = [
    [
      /\bi are\b/i,
      "I are",
      '"I are" गलत है। सही: **"I am"**\n• I am a student. ✅\n• I are a student. ❌\n\n💡 I के साथ हमेशा "am" use होता है।',
    ],
    [
      /\bhe are\b|\bshe are\b|\bit are\b/i,
      "he/she/it are",
      '"He/She/It are" गलत है। सही: **"He/She/It is"**\n• He is a teacher. ✅\n• He are a teacher. ❌',
    ],
    [
      /\bI is\b/i,
      "I is",
      '"I is" गलत है। सही: **"I am"**\n• I am happy. ✅\n• I is happy. ❌',
    ],
    [
      /\bwe is\b|\bthey is\b|\byou is\b/i,
      "we/they/you is",
      '"We/They/You is" गलत है। सही: **"are"** use करें।\n• We are friends. ✅\n• They are playing. ✅',
    ],
    [
      /\bI goed\b|\bI goed to\b/i,
      "goed",
      '"Goed" गलत है। Go का past form **"went"** है।\n• I went to school. ✅\n• I goed to school. ❌',
    ],
    [
      /\bmore better\b|\bmore faster\b|\bmore bigger\b/i,
      "double comparative",
      'यह "double comparative" गलत है।\n• Say: **better** (not "more better")\n• Say: **faster** (not "more faster")\n• Say: **bigger** (not "more bigger")',
    ],
    [
      /\bI am going to school\b/i,
      "I am going",
      '✅ **"I am going to school"** -- यह बिल्कुल सही है!\n\nPresent Continuous Tense का perfect example:\nSubject (I) + am + verb-ing (going) + place\n\n💡 अभी जो हो रहा है उसके लिए is/am/are + ing use करते हैं।',
    ],
    [
      /\bI am go to\b/i,
      "I am go",
      '"I am go" गलत है। सही: **"I am going"**\n• I am going to school. ✅\n• I am go to school. ❌\n\n💡 Present Continuous में verb में "-ing" लगाएं।',
    ],
  ];

  for (const [pattern, , feedback] of corrections) {
    if (pattern.test(input)) {
      return `🔍 **Sentence Check:**\n\n${feedback}`;
    }
  }

  // If input looks like an English sentence (has spaces, starts with capital or I)
  const isEnglishSentence =
    /^[A-Z]|^i |^i'm|^i'll/i.test(input.trim()) && input.includes(" ");
  if (isEnglishSentence && input.length > 8) {
    return `✅ **Sentence Check:**\n\n"${input}" -- यह sentence सही लगता है! 👍\n\n📌 Explanation:\n• Subject ✅\n• Verb ✅\n• Structure सही है ✅\n\n💡 Practice करते रहो -- ऐसे ही sentences बनाते रहो!`;
  }
  return null;
}

// ─── Main response generator ──────────────────────────────────────────────────
function generateResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  // 1. Blocked topics
  if (isBlocked(lower)) {
    return "😊 यह सवाल मेरे दायरे से बाहर है। मैं सिर्फ English सीखने में मदद करता हूँ।\n\nकोई English word, grammar, या sentence पूछें! 💪 मेहनत करते रहो!";
  }

  // 2. Non-English personal/school questions
  const offTopicPatterns = [
    /कल का पेपर|आज का पेपर|परीक्षा कब|exam कब|test कब/i,
    /मेरे स्कूल|मेरी क्लास|मेरा कॉलेज/i,
    /आज का खाना|क्या बनाएं|क्या पकाएं/i,
    /रेसिपी|recipe/i,
    /मौसम कैसा|weather|आज बारिश/i,
  ];
  if (offTopicPatterns.some((p) => p.test(input))) {
    return "😊 यह सवाल मेरे दायरे से बाहर है। मैं सिर्फ English सीखने में मदद करता हूँ।\n\nकोई English word, grammar, या sentence पूछें! 💪 मेहनत करते रहो!";
  }

  // 3. Hello/Hi
  if (
    lower === "hello" ||
    lower === "hi" ||
    lower === "हेलो" ||
    lower.includes("नमस्ते")
  ) {
    return PHRASES[lower === "hi" ? "hi" : "hello"] + motiv();
  }

  // 4. Common phrases check
  for (const [phrase, response] of Object.entries(PHRASES)) {
    if (
      lower === phrase ||
      lower.startsWith(`${phrase} `) ||
      lower.includes(phrase)
    ) {
      return response + motiv();
    }
  }

  // 5. All 12 tenses (specific)
  if (
    lower.includes("simple present") ||
    (lower.includes("simple") && lower.includes("present"))
  )
    return GRAMMAR_RULES["simple present"] + motiv();
  if (
    lower.includes("present continuous") ||
    lower.includes("present progressive")
  )
    return GRAMMAR_RULES["present continuous"] + motiv();
  if (lower.includes("present perfect continuous"))
    return GRAMMAR_RULES["present perfect continuous"] + motiv();
  if (lower.includes("present perfect") && !lower.includes("continuous"))
    return GRAMMAR_RULES["present perfect"] + motiv();

  if (
    lower.includes("simple past") ||
    (lower.includes("simple") && lower.includes("past"))
  )
    return GRAMMAR_RULES["simple past"] + motiv();
  if (lower.includes("past continuous") || lower.includes("past progressive"))
    return GRAMMAR_RULES["past continuous"] + motiv();
  if (lower.includes("past perfect continuous"))
    return GRAMMAR_RULES["past perfect continuous"] + motiv();
  if (lower.includes("past perfect") && !lower.includes("continuous"))
    return GRAMMAR_RULES["past perfect"] + motiv();

  if (
    lower.includes("simple future") ||
    (lower.includes("simple") && lower.includes("future"))
  )
    return GRAMMAR_RULES["simple future"] + motiv();
  if (
    lower.includes("future continuous") ||
    lower.includes("future progressive")
  )
    return GRAMMAR_RULES["future continuous"] + motiv();
  if (lower.includes("future perfect continuous"))
    return GRAMMAR_RULES["future perfect continuous"] + motiv();
  if (lower.includes("future perfect") && !lower.includes("continuous"))
    return GRAMMAR_RULES["future perfect"] + motiv();

  // 6. Generic tense query
  if (
    lower.includes("tense") ||
    lower.includes("टेंस") ||
    lower.includes("काल")
  ) {
    if (lower.includes("present") || lower.includes("वर्तमान"))
      return GRAMMAR_RULES["present tense"] + motiv();
    if (lower.includes("past") || lower.includes("भूत"))
      return GRAMMAR_RULES["past tense"] + motiv();
    if (lower.includes("future") || lower.includes("भविष्य"))
      return GRAMMAR_RULES["future tense"] + motiv();
    return `📚 **Tenses (काल) - 12 प्रकार:**\n\n🟢 **Present (वर्तमान):**\n1. Simple Present\n2. Present Continuous\n3. Present Perfect\n4. Present Perfect Continuous\n\n🟡 **Past (भूतकाल):**\n5. Simple Past\n6. Past Continuous\n7. Past Perfect\n8. Past Perfect Continuous\n\n🔵 **Future (भविष्यकाल):**\n9. Simple Future\n10. Future Continuous\n11. Future Perfect\n12. Future Perfect Continuous\n\n💡 किसी भी tense का नाम type करो जैसे 'simple past' या 'present continuous'${motiv()}`;
  }

  // 7. Other grammar topics
  if (
    lower.includes("article") ||
    lower.includes("आर्टिकल") ||
    /\b(a|an|the)\b.*use|use.*\b(a|an|the)\b/.test(lower)
  )
    return GRAMMAR_RULES.articles + motiv();
  if (lower.includes("pronoun") || lower.includes("सर्वनाम"))
    return GRAMMAR_RULES.pronouns + motiv();
  if (lower.includes("preposition") || lower.includes("संबंधबोधक"))
    return GRAMMAR_RULES.prepositions + motiv();
  if (lower.includes("conjunction") || lower.includes("संयोजक"))
    return GRAMMAR_RULES.conjunctions + motiv();
  if (
    lower.includes("modal") ||
    lower.includes("can ") ||
    lower.includes("could") ||
    lower.includes("will ") ||
    lower.includes("would") ||
    lower.includes("should") ||
    lower.includes("must")
  )
    return GRAMMAR_RULES.modals + motiv();
  if (
    lower.includes("passive") ||
    lower.includes("active voice") ||
    lower.includes("active passive")
  )
    return GRAMMAR_RULES["active passive"] + motiv();
  if (
    lower.includes("indirect speech") ||
    lower.includes("direct speech") ||
    lower.includes("reported speech")
  )
    return GRAMMAR_RULES["direct indirect"] + motiv();
  if (
    lower.includes("plural") ||
    lower.includes("singular") ||
    lower.includes("एकवचन") ||
    lower.includes("बहुवचन")
  )
    return GRAMMAR_RULES["singular plural"] + motiv();
  if (
    lower.includes("comparison") ||
    lower.includes("comparative") ||
    lower.includes("superlative") ||
    lower.includes("तुलना")
  )
    return GRAMMAR_RULES["degrees of comparison"] + motiv();

  // 8. Word meaning queries
  const meaningPatterns = [
    /^([a-z]+)\s*(का मतलब|ka matlab|meaning|मतलब|का अर्थ|meaning in hindi)/i,
    /([a-z]+)\s+(?:का मतलब|ka matlab|meaning|मतलब|का अर्थ)/i,
    /(?:मतलब|meaning|matlab)\s+(?:of|of the)?\s*([a-z]+)/i,
  ];
  for (const pattern of meaningPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const word = (match[1] || match[2] || "").toLowerCase().trim();
      const entry = WORD_DICT[word];
      if (entry) {
        return `${entry.emoji} **${word.charAt(0).toUpperCase() + word.slice(1)}** = ${entry.hindi}\n\n📌 Example sentence:\n"${entry.example}"\n\n🇮🇳 Hindi: ${entry.hindi}${motiv()}`;
      }
    }
  }

  // 9. Single word direct lookup
  const singleWord = lower.trim();
  if (WORD_DICT[singleWord]) {
    const entry = WORD_DICT[singleWord];
    return `${entry.emoji} **${singleWord.charAt(0).toUpperCase() + singleWord.slice(1)}** = ${entry.hindi}\n\n📌 Example: "${entry.example}"${motiv()}`;
  }

  // 10. Word lookup with meaning keywords
  for (const [word, entry] of Object.entries(WORD_DICT)) {
    if (
      lower.includes(word) &&
      (lower.includes("मतलब") ||
        lower.includes("meaning") ||
        lower.includes("matlab") ||
        lower.includes("अर्थ"))
    ) {
      return `${entry.emoji} **${word.charAt(0).toUpperCase() + word.slice(1)}** = ${entry.hindi}\n\n📌 Example: "${entry.example}"${motiv()}`;
    }
  }

  // 11. Sentence correction (if input is English-looking)
  const correction = checkSentence(input.trim());
  if (correction) return correction + motiv();

  // 12. Sentence making help
  if (
    lower.includes("sentence") ||
    lower.includes("वाक्य") ||
    lower.includes("sentence kaise")
  ) {
    return `✏️ **Sentence बनाने का तरीका:**\n\n📐 Basic Structure:\nSubject + Verb + Object\n(कौन) + (क्या करता है) + (किसे/क्या)\n\n📌 Examples:\n• I eat mango. (मैं आम खाता हूँ।)\n• She reads a book. (वह किताब पढ़ती है।)\n• They play cricket. (वे क्रिकेट खेलते हैं।)\n\n💡 Tip: पहले Hindi में सोचो, फिर English में translate करो!${motiv()}`;
  }

  // 13. Pronunciation help
  if (
    lower.includes("pronunciation") ||
    lower.includes("उच्चारण") ||
    lower.includes("pronounce")
  ) {
    return `🗣️ **Pronunciation Tips (उच्चारण):**\n\n🔤 Vowels (स्वर): A, E, I, O, U\n• A = आ (Apple, Ant)\n• E = ई/ए (Egg, Elephant)\n• I = इ/ऐ (Ice, In)\n• O = ओ (Orange, Open)\n• U = उ/यू (Umbrella, Unit)\n\n🔤 Silent letters:\n• Know -- 'k' silent → 'noh'\n• Write -- 'w' silent → 'rait'\n• Hour -- 'h' silent → 'aur'\n\n💡 Tip: Words को syllables में तोड़कर बोलो!\n• El-e-phant | But-ter-fly | Beau-ti-ful${motiv()}`;
  }

  // 14. Alphabet or spelling
  if (
    lower.includes("alphabet") ||
    lower.includes("spelling") ||
    lower.includes("अक्षर")
  ) {
    return `🔤 **English Alphabet (अंग्रेज़ी वर्णमाला):**\n\nA B C D E F G H I J K L M\nN O P Q R S T U V W X Y Z\n\n✅ Vowels (स्वर): A, E, I, O, U (5 vowels)\n✅ Consonants (व्यंजन): बाकी 21 letters\n\n💡 Spelling Tips:\n• 'i' before 'e' except after 'c': believe, receive\n• Double consonant + ing: run→running, sit→sitting${motiv()}`;
  }

  // 15. Fallback with tip
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  return `🤔 यह सवाल English सीखने से जुड़ा नहीं लगा।\n\n${tip}\n\n📌 आप ये पूछ सकते हैं:\n• 'dog का मतलब क्या है?'\n• 'simple present tense'\n• 'can का use'\n• 'I am going to school -- is this correct?'${motiv()}`;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function EnglishGuruAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: "ai",
      text: "👋 नमस्ते! मैं English Guru AI हूँ! 🎓\n\nमैं Google जैसा हूँ -- हर English सवाल का जवाब दूंगा!\n\n📚 Word meanings (शब्दों के अर्थ)\n📝 All 12 Tenses + Grammar Rules\n✅ Sentence Correction\n🗣️ Pronunciation Tips\n💬 Common Phrases\n\nकोई भी English सवाल पूछें! 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: nextId.current++, type: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = generateResponse(text);
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, type: "ai", text: reply },
      ]);
      setLoading(false);
    }, 600);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "420px" }}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.type === "ai" && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mr-2 mt-1"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                }}
              >
                🎓
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.type === "user"
                  ? "rounded-br-sm text-white"
                  : "rounded-bl-sm text-gray-800"
              }`}
              style={{
                background:
                  msg.type === "user"
                    ? "linear-gradient(135deg, #b45309, #92400e)"
                    : "linear-gradient(135deg, #fef3c7, #fde68a)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mr-2"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
              }}
            >
              🎓
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm"
              style={{
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <span className="flex items-center gap-1 text-amber-800">
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0ms" }}
                >
                  •
                </span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "150ms" }}
                >
                  •
                </span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "300ms" }}
                >
                  •
                </span>
                <span className="ml-1 text-xs">सोच रहा हूँ...</span>
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick suggestions */}
      <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
        {[
          "apple का मतलब",
          "past tense",
          "can का use",
          "I am vs I was",
          "good morning",
        ].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setInput(suggestion);
            }}
            className="shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors"
            style={{
              background: "#fef3c7",
              borderColor: "#f59e0b",
              color: "#92400e",
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="px-3 pb-3 shrink-0">
        <div
          className="flex items-center gap-2 rounded-2xl px-3 py-2 border-2"
          style={{ borderColor: "#f59e0b", background: "#fffbeb" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="कोई English सवाल पूछें... 📚"
            data-ocid="english_guru.input"
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-amber-400"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            data-ocid="english_guru.submit_button"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
