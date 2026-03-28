import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  type: "user" | "ai";
  text: string;
}

// Word dictionary
const WORD_DICT: Record<
  string,
  { hindi: string; example: string; emoji: string }
> = {
  apple: { hindi: "सेब", example: "I eat an apple every day.", emoji: "🍎" },
  banana: { hindi: "केला", example: "Monkeys love bananas.", emoji: "🍌" },
  mango: { hindi: "आम", example: "Mango is the king of fruits.", emoji: "🥭" },
  orange: { hindi: "संतरा", example: "She drinks orange juice.", emoji: "🍊" },
  grapes: { hindi: "अंगूर", example: "These grapes are sweet.", emoji: "🍇" },
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
  bird: { hindi: "पक्षी", example: "A bird is singing.", emoji: "🐦" },
  fish: { hindi: "मछली", example: "Fish live in water.", emoji: "🐟" },
  red: { hindi: "लाल", example: "She is wearing a red dress.", emoji: "🔴" },
  blue: { hindi: "नीला", example: "The sky is blue.", emoji: "🔵" },
  green: { hindi: "हरा", example: "Leaves are green.", emoji: "🟢" },
  yellow: { hindi: "पीला", example: "The sun is yellow.", emoji: "🌟" },
  white: { hindi: "सफेद", example: "Snow is white.", emoji: "⚪" },
  black: { hindi: "काला", example: "The night is black.", emoji: "⚫" },
  hand: { hindi: "हाथ", example: "Wash your hands.", emoji: "✋" },
  eye: { hindi: "आँख", example: "I have two eyes.", emoji: "👁️" },
  nose: { hindi: "नाक", example: "The nose helps us smell.", emoji: "👃" },
  ear: { hindi: "कान", example: "We hear with our ears.", emoji: "👂" },
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
  happy: { hindi: "खुश", example: "She looks very happy today.", emoji: "😊" },
  sad: { hindi: "उदास", example: "He was sad after the match.", emoji: "😢" },
  big: { hindi: "बड़ा", example: "This is a big house.", emoji: "🏠" },
  small: { hindi: "छोटा", example: "A small ant is walking.", emoji: "🐜" },
  water: { hindi: "पानी", example: "Water is life.", emoji: "💧" },
  sun: { hindi: "सूरज", example: "The sun rises in the east.", emoji: "☀️" },
  moon: { hindi: "चाँद", example: "The moon is bright tonight.", emoji: "🌙" },
  school: { hindi: "स्कूल", example: "I go to school every day.", emoji: "🏫" },
  book: {
    hindi: "किताब",
    example: "This book is very interesting.",
    emoji: "📚",
  },
  pen: { hindi: "कलम", example: "Give me a pen, please.", emoji: "🖊️" },
};

const GRAMMAR_RULES: Record<string, string> = {
  "present tense":
    "✅ **Present Tense (वर्तमान काल)**\n\nHindi: जो अभी हो रहा है।\nStructure: Subject + verb (s/es for he/she/it)\n\n📌 Examples:\n• I eat rice. (मैं चावल खाता हूँ।)\n• She plays cricket. (वह क्रिकेट खेलती है।)\n• They study English. (वे अंग्रेज़ी पढ़ते हैं।)\n\n💡 Tip: He/She/It के साथ verb में -s या -es लगाएं।",
  "past tense":
    "✅ **Past Tense (भूतकाल)**\n\nHindi: जो पहले हो चुका है।\nStructure: Subject + verb (past form)\n\n📌 Examples:\n• I ate rice. (मैंने चावल खाया।)\n• She played cricket. (उसने क्रिकेट खेला।)\n• They studied English. (उन्होंने अंग्रेज़ी पढ़ी।)\n\n💡 Tip: Regular verbs में -ed लगाएं: play→played, walk→walked",
  "future tense":
    "✅ **Future Tense (भविष्यकाल)**\n\nHindi: जो आगे होगा।\nStructure: Subject + will + verb\n\n📌 Examples:\n• I will eat rice. (मैं चावल खाऊँगा।)\n• She will play cricket. (वह क्रिकेट खेलेगी।)\n• They will study English. (वे अंग्रेज़ी पढ़ेंगे।)\n\n💡 Tip: Will + verb (base form) हमेशा future दिखाता है।",
  articles:
    "✅ **Articles (A, An, The)**\n\n🔤 A - किसी एक चीज़ के लिए (consonant sound से शुरू)\n• A dog (एक कुत्ता), A book (एक किताब)\n\n🔤 An - vowel sound (a,e,i,o,u) से शुरू होने पर\n• An apple (एक सेब), An elephant (एक हाथी)\n\n🔤 The - किसी specific चीज़ के लिए\n• The sun (सूरज), The book I gave you (वह किताब जो मैंने दी)\n\n💡 Tip: A/An = पहली बार, The = जब पता हो",
  pronouns:
    "✅ **Pronouns (सर्वनाम)**\n\n👤 I = मैं | You = तुम/आप\n👥 He = वह (पुरुष) | She = वह (महिला)\n🌟 It = यह/वह (चीज़/जानवर)\n👨‍👩‍👧 We = हम | They = वे\n\n📌 Examples:\n• I am a student. (मैं एक छात्र हूँ।)\n• She is my teacher. (वह मेरी teacher हैं।)\n• They play football. (वे फुटबॉल खेलते हैं।)",
  prepositions:
    "✅ **Prepositions (संबंधबोधक शब्द)**\n\n📍 In = में → The pen is in the box.\n📍 On = पर → The book is on the table.\n📍 Under = नीचे → The cat is under the chair.\n📍 At = पर/में → I am at school.\n📍 With = के साथ → I go with my friend.\n📍 From = से → I am from India.\n\n💡 इन शब्दों से चीज़ों की जगह या रिश्ता पता चलता है।",
};

const PHRASES: Record<string, string> = {
  "good morning":
    "🌅 Good Morning = सुप्रभात\n\nUse: जब सुबह किसी से मिलें।\n• Good morning, teacher! (सुप्रभात, गुरुजी!)\n• Good morning, everyone! (सुप्रभात, सभी को!)",
  "good night":
    "🌙 Good Night = शुभ रात्रि\n\nUse: रात को सोने से पहले।\n• Good night, Mom! (शुभ रात्रि, माँ!)\n• Good night, sleep tight! (शुभ रात्रि, अच्छी नींद लो!)",
  "thank you":
    "🙏 Thank You = धन्यवाद / शुक्रिया\n\nExamples:\n• Thank you for your help. (मदद के लिए धन्यवाद।)\n• Thank you very much! (बहुत-बहुत धन्यवाद!)",
  please:
    "😊 Please = कृपया\n\nExamples:\n• Please sit down. (कृपया बैठ जाएं।)\n• Please give me water. (कृपया मुझे पानी दीजिए।)",
  sorry:
    "😔 Sorry = माफ़ करना / खेद है\n\nExamples:\n• I am sorry for being late. (देर से आने के लिए माफ़ करना।)\n• Sorry, I didn't understand. (माफ़ करना, मैं समझा नहीं।)",
  "how are you":
    "👋 How are you? = आप कैसे हैं?\n\nResponses:\n• I am fine, thank you. (मैं ठीक हूँ, धन्यवाद।)\n• I am doing well. (मैं अच्छा हूँ।)",
};

const OFF_TOPIC_KEYWORDS = [
  "app",
  "code",
  "coding",
  "program",
  "software",
  "website",
  "html",
  "css",
  "javascript",
  "react",
  "build",
  "develop",
  "technology",
  "tech",
  "computer",
  "internet",
  "server",
  "database",
  "api",
  "function",
  "variable",
  "python",
  "java",
  "mobile",
  "android",
  "ios",
];

const TIPS = [
  "💡 रोज़ 5 नए English words सीखो। छोटे-छोटे कदम बड़ी सफलता देते हैं! 🌟",
  "💡 Mirror के सामने English में बोलने की practice करो। यह बहुत helpful है! 😊",
  "💡 English movies को subtitles के साथ देखो। नए words जल्दी याद होते हैं! 🎬",
  "💡 हर रोज़ एक English sentence diary में लिखो। Writing से memory strong होती है! 📔",
  "💡 English songs सुनो और lyrics को समझने की कोशिश करो! 🎵",
  "💡 अपने दोस्तों के साथ English में बात करने की practice करो! 👫",
];

function generateResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  // Off-topic check
  if (OFF_TOPIC_KEYWORDS.some((kw) => lower.includes(kw))) {
    return "मैं सिर्फ English सीखने में मदद करता हूँ! कोई English शब्द, grammar, या sentence पूछें। 😊\n\nExample questions:\n• 'apple का मतलब क्या है?'\n• 'past tense क्या होता है?'\n• 'good morning कब बोलते हैं?'";
  }

  // Word meaning queries
  const meaningMatch = lower.match(
    /([a-z]+)\s*(का मतलब|ka matlab|meaning|मतलब|का अर्थ)/i,
  );
  if (meaningMatch) {
    const word = meaningMatch[1].toLowerCase();
    const entry = WORD_DICT[word];
    if (entry) {
      return `${entry.emoji} **${word.charAt(0).toUpperCase() + word.slice(1)}** = ${entry.hindi}\n\n📌 Example sentence:\n"${entry.example}"\n\n🇮🇳 Hindi: ${entry.hindi} - जब हम ${word} की बात करते हैं तो यह word use करते हैं।\n\nKeep learning! 🌟`;
    }
  }

  // Direct word lookup
  for (const [word, entry] of Object.entries(WORD_DICT)) {
    if (
      lower.includes(word) &&
      (lower.includes("मतलब") ||
        lower.includes("meaning") ||
        lower.includes("matlab") ||
        lower.includes("अर्थ") ||
        lower === word)
    ) {
      return `${entry.emoji} **${word.charAt(0).toUpperCase() + word.slice(1)}** = ${entry.hindi}\n\n📌 Example: "${entry.example}"\n\nGreat question! अब इस word को एक sentence में use करके देखो! 😊`;
    }
  }

  // Grammar topics
  for (const [topic, explanation] of Object.entries(GRAMMAR_RULES)) {
    if (
      lower.includes(topic) ||
      (topic.includes("tense") && lower.includes(topic.split(" ")[0]))
    ) {
      return `${explanation}\n\n🌟 Practice: ऊपर दिए examples को खुद से लिखकर देखो!`;
    }
  }

  // Tense shortcuts
  if (lower.includes("tense") || lower.includes("टेंस")) {
    if (lower.includes("present") || lower.includes("वर्तमान"))
      return GRAMMAR_RULES["present tense"];
    if (lower.includes("past") || lower.includes("भूत"))
      return GRAMMAR_RULES["past tense"];
    if (lower.includes("future") || lower.includes("भविष्य"))
      return GRAMMAR_RULES["future tense"];
    return "📚 **Tenses (काल) - 3 प्रकार:**\n\n1️⃣ Present Tense (वर्तमान) - अभी हो रहा है\n   Example: I play cricket.\n\n2️⃣ Past Tense (भूतकाल) - पहले हुआ\n   Example: I played cricket.\n\n3️⃣ Future Tense (भविष्यकाल) - आगे होगा\n   Example: I will play cricket.\n\nकिसी specific tense के बारे में पूछो! 😊";
  }

  // Article questions
  if (
    lower.includes("article") ||
    lower.includes("a ") ||
    lower.includes(" an ") ||
    lower.includes(" the ") ||
    lower.includes("आर्टिकल")
  ) {
    return GRAMMAR_RULES.articles;
  }

  // Pronoun questions
  if (
    lower.includes("pronoun") ||
    lower.includes("सर्वनाम") ||
    lower.includes("i, you") ||
    lower.includes("he she")
  ) {
    return GRAMMAR_RULES.pronouns;
  }

  // Preposition questions
  if (
    lower.includes("preposition") ||
    lower.includes("संबंधबोधक") ||
    lower.includes("in, on") ||
    lower.includes("on the")
  ) {
    return GRAMMAR_RULES.prepositions;
  }

  // Common phrases
  for (const [phrase, response] of Object.entries(PHRASES)) {
    if (lower.includes(phrase)) {
      return response;
    }
  }

  // Sentence making help
  if (
    lower.includes("sentence") ||
    lower.includes("वाक्य") ||
    lower.includes("बनाओ") ||
    lower.includes("बनाना")
  ) {
    return "✏️ **Sentence बनाने का तरीका:**\n\n📐 Basic Structure:\nSubject + Verb + Object\n(कौन) + (क्या करता है) + (किसे/क्या)\n\n📌 Examples:\n• I (मैं) + eat (खाता हूँ) + mango (आम) = I eat mango.\n• She (वह) + reads (पढ़ती है) + book (किताब) = She reads a book.\n• They (वे) + play (खेलते हैं) + cricket (क्रिकेट) = They play cricket.\n\n💡 Tip: पहले Hindi में सोचो, फिर English में translate करो! 🌟";
  }

  // Pronunciation help
  if (
    lower.includes("pronunciation") ||
    lower.includes("उच्चारण") ||
    lower.includes("pronounce") ||
    lower.includes("bolna") ||
    lower.includes("बोलना")
  ) {
    return `🗣️ **Pronunciation Tips (उच्चारण):**\n\n🔤 Vowels (स्वर): A, E, I, O, U\n• A = आ (Apple, Ant)\n• E = ई/ए (Egg, Elephant)\n• I = इ/ऐ (Ice, In)\n• O = ओ (Orange, Open)\n• U = उ/यू (Umbrella, Unit)\n\n🔤 Silent letters:\n• Know - 'k' silent है → 'noh'\n• Write - 'w' silent है → 'rait'\n\n💡 Tip: English words को syllables में तोड़कर बोलो!\n• El-e-phant, But-ter-fly, Beau-ti-ful 🦋`;
  }

  // Hello/Greeting
  if (
    lower.includes("hello") ||
    lower.includes("hi ") ||
    lower === "hi" ||
    lower.includes("नमस्ते")
  ) {
    return "👋 Hello! नमस्ते!\n\nमैं आपका English Guru हूँ! 🎓\n\nमैं इन चीज़ों में मदद कर सकता हूँ:\n📚 Word meanings (शब्दों के अर्थ)\n📝 Grammar rules (व्याकरण)\n✏️ Sentence making (वाक्य बनाना)\n🗣️ Pronunciation tips (उच्चारण)\n💬 Common phrases (आम बोलचाल)\n\nकोई भी English सवाल पूछो! 😊";
  }

  // Random helpful tip
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  return `🤔 आपका सवाल समझ नहीं आया, लेकिन यह tip ज़रूर काम आएगी:\n\n${tip}\n\n📌 आप ये पूछ सकते हैं:\n• 'dog का मतलब क्या है?'\n• 'present tense क्या होता है?'\n• 'I love you का sentence बनाओ'\n• 'thank you कब बोलते हैं?'`;
}

export default function EnglishGuruAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: "ai",
      text: "👋 नमस्ते! मैं English Guru AI हूँ! 🎓\n\nमैं आपको English सिखाने में मदद करूंगा:\n📚 शब्दों के अर्थ (Word Meanings)\n📝 Grammar Rules (व्याकरण)\n✏️ Sentences बनाना\n🗣️ Pronunciation Tips\n\nकोई भी English सवाल पूछें! 😊",
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
        {["apple का मतलब", "past tense", "articles", "good morning"].map(
          (suggestion) => (
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
          ),
        )}
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
