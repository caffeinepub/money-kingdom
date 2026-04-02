import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

const HINDI_BIO_OPTIONS = [
  "पैसों की बारिश तब होती है जब मेहनत की धूप निकलती है 🌟",
  "मेरा किंगडम, मेरे सपने, मेरी कमाई 👑",
  "हर सिक्का एक कदम है मेरी मंजिल की तरफ 🪙",
  "राजा वो नहीं जो ताज पहने, राजा वो है जो दिल जीते 💛",
];

const GOLD_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: `gp-${i}`,
  size: 4 + (i % 5) * 2,
  left: (i * 17 + 5) % 100,
  top: (i * 23 + 10) % 100,
  dur: 3 + (i % 4),
  delay: i * 0.3,
}));

const STEP_LABELS = ["step-a", "step-b", "step-c", "step-d"];

const ADMIN_PASSWORD = "princepawankumar";

type Screen =
  | "entry"
  | "admin"
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "location";

interface LoginPageProps {
  onGuestMode: () => void;
  onRegistered?: () => void;
}

export default function LoginPage({
  onGuestMode,
  onRegistered,
}: LoginPageProps) {
  const [screen, setScreen] = useState<Screen>("entry");

  // Admin
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");

  // Step 1
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [step1Error, setStep1Error] = useState("");

  // Step 2
  const [username, setUsername] = useState("");
  const [step2Error, setStep2Error] = useState("");

  // Step 3
  const [photoUrl, setPhotoUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Step 4
  const [bio, setBio] = useState("");

  function handleAdminLogin() {
    if (adminPass === ADMIN_PASSWORD) {
      localStorage.setItem("mk_is_admin", "true");
      localStorage.setItem(
        "mk_user_profile",
        JSON.stringify({
          name: "Prince Pawan Kumar",
          mobile: "0000000000",
          username: "princepawankumar",
          bio: "मनी किंगडम का मालिक 👑",
          isAdmin: true,
          createdAt: new Date().toISOString(),
        }),
      );
      localStorage.setItem("onboardingComplete", "true");
      (onRegistered ?? onGuestMode)();
    } else {
      setAdminError("गलत पासवर्ड");
    }
  }

  function handleStep1() {
    if (!name.trim()) {
      setStep1Error("कृपया अपना नाम लिखें");
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      setStep1Error("10 अंकों का सही मोबाइल नंबर लिखें");
      return;
    }
    setStep1Error("");
    setScreen("step2");
  }

  function handleStep2() {
    if (!username.trim()) {
      setStep2Error("कृपया यूजरनेम लिखें");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setStep2Error("सिर्फ अक्षर, नंबर और _ चलेगा");
      return;
    }
    if (username.trim().length < 3) {
      setStep2Error("कम से कम 3 अक्षर होने चाहिए");
      return;
    }
    setStep2Error("");
    setScreen("step3");
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  }

  function handleStep4Finish() {
    const profile = {
      name: name.trim(),
      mobile: mobile.trim(),
      username: username.trim(),
      bio: bio.trim(),
      photoUrl,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("mk_user_profile", JSON.stringify(profile));
    setScreen("location");
  }

  function handleLocationAllow() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          localStorage.setItem("mk_weather_asked", "granted");
          finishOnboarding();
        },
        () => {
          localStorage.setItem("mk_weather_asked", "denied");
          finishOnboarding();
        },
      );
    } else {
      finishOnboarding();
    }
  }

  function handleLocationSkip() {
    localStorage.setItem("mk_weather_asked", "denied");
    finishOnboarding();
  }

  function finishOnboarding() {
    localStorage.setItem("onboardingComplete", "true");
    (onRegistered ?? onGuestMode)();
  }

  const bgStyle: React.CSSProperties = {
    background:
      "linear-gradient(160deg, oklch(0.10 0.03 55) 0%, oklch(0.14 0.04 50) 50%, oklch(0.10 0.025 58) 100%)",
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={bgStyle}
    >
      {/* Gold particle bg */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        {GOLD_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: "oklch(0.85 0.18 85 / 0.25)",
            }}
            animate={{ opacity: [0.1, 0.5, 0.1], y: [0, -12, 0] }}
            transition={{
              duration: p.dur,
              repeat: Number.POSITIVE_INFINITY,
              delay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto px-4">
        <AnimatePresence mode="wait">
          {/* ─── ENTRY ─── */}
          {screen === "entry" && (
            <motion.div
              key="entry"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Brand */}
              <div className="flex flex-col items-center gap-3">
                <motion.span
                  className="text-6xl"
                  animate={{ rotateY: [0, 360] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 2,
                  }}
                >
                  💰
                </motion.span>
                <h1
                  className="text-4xl font-black text-center gold-shimmer-text"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "oklch(0.88 0.18 82)",
                  }}
                >
                  Money Kingdom
                </h1>
                <p
                  className="text-sm text-center"
                  style={{ color: "oklch(0.72 0.06 68)" }}
                >
                  आपका वित्तीय साम्राज्य शुरू करें
                </p>
              </div>

              {/* Main CTA */}
              <div className="w-full flex flex-col gap-4">
                <motion.button
                  data-ocid="entry.primary_button"
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setScreen("step1")}
                  className="w-full py-4 rounded-2xl text-lg font-black tracking-wide shadow-2xl relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.18 82), oklch(0.72 0.16 72), oklch(0.85 0.20 86))",
                    color: "oklch(0.12 0.02 50)",
                    boxShadow:
                      "0 6px 30px oklch(0.82 0.18 82 / 0.4), 0 2px 8px oklch(0.82 0.18 82 / 0.2)",
                  }}
                >
                  <span className="relative z-10">👑 नया खाता बनाएं</span>
                </motion.button>
              </div>

              {/* Subtle admin link */}
              <button
                data-ocid="entry.admin_link"
                type="button"
                onClick={() => setScreen("admin")}
                className="text-xs opacity-25 hover:opacity-50 transition-opacity mt-4"
                style={{ color: "oklch(0.65 0.05 65)" }}
              >
                मालिक लॉगिन
              </button>
            </motion.div>
          )}

          {/* ─── ADMIN LOGIN ─── */}
          {screen === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">🔐</span>
                <h2
                  className="text-2xl font-black"
                  style={{ color: "oklch(0.88 0.18 82)" }}
                >
                  मालिक लॉगिन
                </h2>
                <p
                  className="text-xs text-center"
                  style={{ color: "oklch(0.55 0.04 65)" }}
                >
                  सिर्फ Prince Pawan Kumar के लिए
                </p>
              </div>

              <div
                className="rounded-2xl p-6 flex flex-col gap-5"
                style={{
                  background: "oklch(0.16 0.025 55)",
                  border: "1px solid oklch(0.82 0.18 82 / 0.25)",
                }}
              >
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="admin-pass"
                    style={{ color: "oklch(0.75 0.08 72)", fontWeight: 600 }}
                  >
                    पासवर्ड
                  </Label>
                  <Input
                    id="admin-pass"
                    data-ocid="admin.input"
                    type="password"
                    placeholder="पासवर्ड डालें"
                    value={adminPass}
                    onChange={(e) => {
                      setAdminPass(e.target.value);
                      setAdminError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                    className="h-12 text-base rounded-xl"
                    style={{
                      background: "oklch(0.12 0.02 52)",
                      borderColor: "oklch(0.82 0.18 82 / 0.3)",
                      color: "oklch(0.90 0.02 72)",
                      fontSize: "16px",
                    }}
                  />
                </div>

                {adminError && (
                  <p
                    className="text-sm text-center font-bold"
                    data-ocid="admin.error_state"
                    style={{ color: "oklch(0.62 0.22 27)" }}
                  >
                    ❌ {adminError}
                  </p>
                )}

                <Button
                  data-ocid="admin.submit_button"
                  className="w-full h-12 text-base font-black rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.18 82), oklch(0.72 0.16 72))",
                    color: "oklch(0.12 0.02 50)",
                  }}
                  onClick={handleAdminLogin}
                >
                  अंदर जाएं 👑
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setScreen("entry")}
                className="text-sm text-center"
                style={{ color: "oklch(0.52 0.04 62)" }}
              >
                ← वापस जाएं
              </button>
            </motion.div>
          )}

          {/* ─── STEP 1 ─── */}
          {screen === "step1" && (
            <StepWrapper
              key="step1"
              step={1}
              total={4}
              onBack={() => setScreen("entry")}
            >
              <div className="flex flex-col items-center gap-1 mb-4">
                <span className="text-3xl">👤</span>
                <h2
                  className="text-xl font-black"
                  style={{ color: "oklch(0.88 0.18 82)" }}
                >
                  अपना परिचय दें
                </h2>
                <p className="text-xs" style={{ color: "oklch(0.55 0.04 65)" }}>
                  आपकी किंगडम की पहचान
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="s1-name"
                    style={{ color: "oklch(0.75 0.08 72)", fontWeight: 600 }}
                  >
                    पूरा नाम
                  </Label>
                  <Input
                    id="s1-name"
                    data-ocid="onboarding.name.input"
                    type="text"
                    placeholder="जैसे: Raj Kumar"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setStep1Error("");
                    }}
                    className="h-12 text-base rounded-xl"
                    style={{
                      background: "oklch(0.12 0.02 52)",
                      borderColor: "oklch(0.82 0.18 82 / 0.3)",
                      color: "oklch(0.90 0.02 72)",
                      fontSize: "16px",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="s1-mobile"
                    style={{ color: "oklch(0.75 0.08 72)", fontWeight: 600 }}
                  >
                    मोबाइल नंबर
                  </Label>
                  <Input
                    id="s1-mobile"
                    data-ocid="onboarding.mobile.input"
                    type="tel"
                    placeholder="10 अंकों का नंबर"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                      setStep1Error("");
                    }}
                    className="h-12 text-base rounded-xl"
                    style={{
                      background: "oklch(0.12 0.02 52)",
                      borderColor: "oklch(0.82 0.18 82 / 0.3)",
                      color: "oklch(0.90 0.02 72)",
                      fontSize: "16px",
                    }}
                  />
                </div>

                {step1Error && (
                  <p
                    className="text-sm text-center"
                    data-ocid="onboarding.step1.error_state"
                    style={{ color: "oklch(0.62 0.22 27)" }}
                  >
                    {step1Error}
                  </p>
                )}

                <GoldButton
                  data-ocid="onboarding.step1.submit_button"
                  onClick={handleStep1}
                >
                  आगे बढ़ें →
                </GoldButton>
              </div>
            </StepWrapper>
          )}

          {/* ─── STEP 2 ─── */}
          {screen === "step2" && (
            <StepWrapper
              key="step2"
              step={2}
              total={4}
              onBack={() => setScreen("step1")}
            >
              <div className="flex flex-col items-center gap-1 mb-4">
                <span className="text-3xl">🏷️</span>
                <h2
                  className="text-xl font-black"
                  style={{ color: "oklch(0.88 0.18 82)" }}
                >
                  @यूजरनेम चुनें
                </h2>
                <p className="text-xs" style={{ color: "oklch(0.55 0.04 65)" }}>
                  यह आपकी किंगडम में पहचान होगी
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="s2-user"
                    style={{ color: "oklch(0.75 0.08 72)", fontWeight: 600 }}
                  >
                    यूजरनेम
                  </Label>
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 font-bold"
                      style={{ color: "oklch(0.82 0.18 82)" }}
                    >
                      @
                    </span>
                    <Input
                      id="s2-user"
                      data-ocid="onboarding.username.input"
                      type="text"
                      placeholder="jaise: king_rahul"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value.replace(/\s/g, ""));
                        setStep2Error("");
                      }}
                      className="h-12 text-base rounded-xl pl-8"
                      style={{
                        background: "oklch(0.12 0.02 52)",
                        borderColor: "oklch(0.82 0.18 82 / 0.3)",
                        color: "oklch(0.90 0.02 72)",
                        fontSize: "16px",
                      }}
                    />
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.50 0.03 62)" }}
                  >
                    सिर्फ अक्षर, नंबर और _ चलेगा। कोई खाली जगह नहीं।
                  </p>
                </div>

                {step2Error && (
                  <p
                    className="text-sm text-center"
                    data-ocid="onboarding.step2.error_state"
                    style={{ color: "oklch(0.62 0.22 27)" }}
                  >
                    {step2Error}
                  </p>
                )}

                <GoldButton
                  data-ocid="onboarding.step2.submit_button"
                  onClick={handleStep2}
                >
                  आगे बढ़ें →
                </GoldButton>
              </div>
            </StepWrapper>
          )}

          {/* ─── STEP 3 ─── */}
          {screen === "step3" && (
            <StepWrapper
              key="step3"
              step={3}
              total={4}
              onBack={() => setScreen("step2")}
            >
              <div className="flex flex-col items-center gap-1 mb-4">
                <span className="text-3xl">📸</span>
                <h2
                  className="text-xl font-black"
                  style={{ color: "oklch(0.88 0.18 82)" }}
                >
                  प्रोफाइल फोटो
                </h2>
                <p className="text-xs" style={{ color: "oklch(0.55 0.04 65)" }}>
                  अपना शाही फोटो लगाएं
                </p>
              </div>

              <div className="flex flex-col items-center gap-5">
                {/* Avatar preview */}
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileRef.current?.click()}
                  className="cursor-pointer relative"
                >
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      border: "3px solid oklch(0.82 0.18 82)",
                      boxShadow: "0 0 20px oklch(0.82 0.18 82 / 0.4)",
                      background: photoUrl
                        ? "transparent"
                        : "oklch(0.18 0.03 55)",
                    }}
                  >
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">👤</span>
                    )}
                  </div>
                  <div
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: "oklch(0.82 0.18 82)",
                      color: "oklch(0.12 0.02 50)",
                    }}
                  >
                    ✏️
                  </div>
                </motion.div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  data-ocid="onboarding.upload_button"
                />

                <GoldButton
                  data-ocid="onboarding.step3.submit_button"
                  onClick={() => fileRef.current?.click()}
                >
                  📷 फोटो चुनें
                </GoldButton>

                <button
                  data-ocid="onboarding.step3.skip_button"
                  type="button"
                  onClick={() => setScreen("step4")}
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.50 0.04 62)" }}
                >
                  अभी नहीं → आगे बढ़ें
                </button>

                {photoUrl && (
                  <GoldButton
                    data-ocid="onboarding.step3.continue_button"
                    onClick={() => setScreen("step4")}
                  >
                    आगे बढ़ें →
                  </GoldButton>
                )}
              </div>
            </StepWrapper>
          )}

          {/* ─── STEP 4 ─── */}
          {screen === "step4" && (
            <StepWrapper
              key="step4"
              step={4}
              total={4}
              onBack={() => setScreen("step3")}
            >
              <div className="flex flex-col items-center gap-1 mb-4">
                <span className="text-3xl">✍️</span>
                <h2
                  className="text-xl font-black"
                  style={{ color: "oklch(0.88 0.18 82)" }}
                >
                  अपना परिचय लिखें
                </h2>
                <p className="text-xs" style={{ color: "oklch(0.55 0.04 65)" }}>
                  या नीचे से कोई शायरी चुनें
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Textarea
                  data-ocid="onboarding.bio.textarea"
                  placeholder="अपने बारे में कुछ लिखें..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="text-sm rounded-xl resize-none"
                  style={{
                    background: "oklch(0.12 0.02 52)",
                    borderColor: "oklch(0.82 0.18 82 / 0.3)",
                    color: "oklch(0.90 0.02 72)",
                    fontSize: "15px",
                  }}
                />

                <div className="flex flex-col gap-2">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "oklch(0.65 0.08 72)" }}
                  >
                    ✨ शायरी चुनें:
                  </p>
                  <div className="flex flex-col gap-2">
                    {HINDI_BIO_OPTIONS.map((opt, i) => (
                      <motion.button
                        key={opt}
                        data-ocid={`onboarding.bio.item.${i + 1}`}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setBio(opt)}
                        className="text-left text-xs px-3 py-2.5 rounded-xl transition-all"
                        style={{
                          background:
                            bio === opt
                              ? "oklch(0.82 0.18 82 / 0.2)"
                              : "oklch(0.16 0.025 54)",
                          border: `1px solid ${bio === opt ? "oklch(0.82 0.18 82 / 0.6)" : "oklch(0.28 0.03 56)"}`,
                          color: "oklch(0.78 0.06 68)",
                        }}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <GoldButton
                  data-ocid="onboarding.step4.submit_button"
                  onClick={handleStep4Finish}
                >
                  पूरा करें ✅
                </GoldButton>
              </div>
            </StepWrapper>
          )}

          {/* ─── LOCATION PERMISSION ─── */}
          {screen === "location" && (
            <motion.div
              key="location"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.span
                className="text-6xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                🌦️
              </motion.span>

              <div className="text-center">
                <h2
                  className="text-2xl font-black mb-2"
                  style={{ color: "oklch(0.88 0.18 82)" }}
                >
                  किंगडम का मौसम
                </h2>
                <p className="text-sm" style={{ color: "oklch(0.65 0.05 65)" }}>
                  मौसम की जानकारी के लिए अपना शहर बताएं
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.45 0.03 60)" }}
                >
                  आपके शहर का असली मौसम ऐप के बैकग्राउंड में दिखेगा 🌈
                </p>
              </div>

              <div
                className="w-full rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "oklch(0.16 0.025 55)",
                  border: "1px solid oklch(0.82 0.18 82 / 0.2)",
                }}
              >
                <GoldButton
                  data-ocid="location.allow_button"
                  onClick={handleLocationAllow}
                >
                  📍 हाँ, मौसम दिखाओ
                </GoldButton>
                <button
                  data-ocid="location.skip_button"
                  type="button"
                  onClick={handleLocationSkip}
                  className="w-full py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: "oklch(0.20 0.02 54)",
                    color: "oklch(0.60 0.04 62)",
                  }}
                >
                  बाद में
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {screen === "entry" && (
        <p
          className="absolute bottom-4 text-center text-xs"
          style={{ color: "oklch(0.35 0.02 55)" }}
        >
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      )}
    </div>
  );
}

// ─── Helper components ───

function StepWrapper({
  children,
  step,
  total,
  onBack,
}: {
  children: React.ReactNode;
  step: number;
  total: number;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm"
            style={{ color: "oklch(0.52 0.04 62)" }}
          >
            ← वापस
          </button>
          <span
            className="text-xs font-bold"
            style={{ color: "oklch(0.65 0.06 68)" }}
          >
            {step}/{total}
          </span>
        </div>
        <div className="flex gap-1.5">
          {STEP_LABELS.slice(0, total).map((label, i) => (
            <div
              key={label}
              className="flex-1 h-1.5 rounded-full transition-all duration-500"
              style={{
                background:
                  i < step ? "oklch(0.82 0.18 82)" : "oklch(0.24 0.03 55)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "oklch(0.16 0.025 55)",
          border: "1px solid oklch(0.82 0.18 82 / 0.2)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

function GoldButton({
  children,
  onClick,
  "data-ocid": dataOcid,
}: {
  children: React.ReactNode;
  onClick: () => void;
  "data-ocid"?: string;
}) {
  return (
    <motion.button
      type="button"
      data-ocid={dataOcid}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full py-3.5 rounded-xl text-sm font-black tracking-wide"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.82 0.18 82), oklch(0.72 0.16 72))",
        color: "oklch(0.12 0.02 50)",
        boxShadow: "0 4px 20px oklch(0.82 0.18 82 / 0.35)",
      }}
    >
      {children}
    </motion.button>
  );
}
