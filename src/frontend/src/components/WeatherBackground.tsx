import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type WeatherType =
  | "clear_day"
  | "clear_night"
  | "cloudy"
  | "rain"
  | "heavy_rain"
  | "snow"
  | "thunderstorm"
  | "fog";

const WEATHER_KEY = "mk_weather_cache";
const WEATHER_TTL = 30 * 60 * 1000; // 30 min

function isNight(): boolean {
  const h = new Date().getHours();
  return h >= 20 || h < 6;
}

function codeToType(code: number): WeatherType {
  const night = isNight();
  if (code === 0 || code === 1) return night ? "clear_night" : "clear_day";
  if (code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "heavy_rain";
  if (code >= 95) return "thunderstorm";
  return night ? "clear_night" : "clear_day";
}

async function fetchWeather(
  lat: number,
  lon: number,
): Promise<WeatherType | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}&current_weather=true`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const code: number = data?.current_weather?.weathercode ?? 0;
    return codeToType(code);
  } catch {
    return null;
  }
}

function loadCached(): { type: WeatherType; ts: number } | null {
  try {
    const raw = localStorage.getItem(WEATHER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveCache(type: WeatherType) {
  try {
    localStorage.setItem(WEATHER_KEY, JSON.stringify({ type, ts: Date.now() }));
  } catch {}
}

// --- Particle helpers ---
const RAIN_DROPS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 2,
  dur: 0.6 + Math.random() * 0.6,
}));

const SNOW_FLAKES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 4,
  dur: 3 + Math.random() * 3,
  size: 6 + Math.random() * 8,
}));

const STARS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  top: Math.random() * 55,
  left: Math.random() * 100,
  delay: Math.random() * 3,
  size: 2 + Math.random() * 3,
}));

export default function WeatherBackground() {
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [_askedPermission, setAskedPermission] = useState(false);
  const [denied, setDenied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Check cache first
    const cached = loadCached();
    if (cached && Date.now() - cached.ts < WEATHER_TTL) {
      setWeather(cached.type);
      return;
    }

    // Check if already asked
    const asked = localStorage.getItem("mk_weather_asked");
    if (asked === "denied") {
      setDenied(true);
      return;
    }
    if (asked === "granted") {
      requestLocation();
      return;
    }

    // Show prompt to user
    setShowPrompt(true);
  }, []);

  function requestLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        localStorage.setItem("mk_weather_asked", "granted");
        setAskedPermission(true);
        const type = await fetchWeather(
          pos.coords.latitude,
          pos.coords.longitude,
        );
        if (type) {
          setWeather(type);
          saveCache(type);
        }
      },
      () => {
        localStorage.setItem("mk_weather_asked", "denied");
        setDenied(true);
        setShowPrompt(false);
      },
    );
  }

  function handleAllow() {
    setShowPrompt(false);
    setAskedPermission(true);
    requestLocation();
  }

  function handleDeny() {
    setShowPrompt(false);
    localStorage.setItem("mk_weather_asked", "denied");
    setDenied(true);
  }

  return (
    <>
      {/* Permission prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            key="weather-prompt"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9990] bg-card border border-border rounded-2xl shadow-2xl px-5 py-4 max-w-xs w-full mx-4 text-center"
          >
            <div className="text-3xl mb-2">🌤️</div>
            <p className="text-sm font-bold text-foreground mb-1">
              किंगडम का मौसम दिखाएं?
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              आपके शहर का असली मौसम ऐप के बैकग्राउंड में दिखेगा
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDeny}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-muted text-muted-foreground"
              >
                नहीं
              </button>
              <button
                type="button"
                onClick={handleAllow}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-primary text-primary-foreground"
              >
                हाँ, दिखाओ 🌦️
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather overlay - fixed behind content */}
      {weather && !denied && (
        <div
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Clear day - golden sun glow */}
          {weather === "clear_day" && (
            <>
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.90 0.15 80), transparent 70%)",
                  transform: "translate(20%, -20%)",
                }}
              />
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.12, 0.18, 0.12] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute top-2 right-2 text-4xl select-none"
              >
                ☀️
              </motion.div>
            </>
          )}

          {/* Clear night - moon + stars */}
          {weather === "clear_night" && (
            <>
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="absolute top-3 right-4 text-3xl select-none"
              >
                🌙
              </motion.div>
              {STARS.map((s) => (
                <motion.div
                  key={s.id}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5 + s.delay,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: s.delay,
                  }}
                  className="absolute rounded-full bg-white"
                  style={{
                    top: `${s.top}%`,
                    left: `${s.left}%`,
                    width: s.size,
                    height: s.size,
                  }}
                />
              ))}
            </>
          )}

          {/* Cloudy */}
          {weather === "cloudy" && (
            <motion.div
              animate={{ x: [-10, 10, -10] }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute top-3 right-3 text-4xl select-none opacity-50"
            >
              ⛅
            </motion.div>
          )}

          {/* Fog */}
          {weather === "fog" && (
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(200,200,200,0.5) 0%, transparent 60%)",
              }}
            />
          )}

          {/* Rain */}
          {(weather === "rain" || weather === "heavy_rain") && (
            <>
              <div className="absolute top-2 right-3 text-3xl select-none">
                🌧️
              </div>
              {RAIN_DROPS.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: "100vh", opacity: [0, 0.6, 0] }}
                  transition={{
                    duration: d.dur,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: d.delay,
                    ease: "linear",
                  }}
                  className="absolute top-0"
                  style={{
                    left: `${d.left}%`,
                    width: weather === "heavy_rain" ? 2 : 1,
                    height: weather === "heavy_rain" ? 18 : 12,
                    background:
                      "linear-gradient(180deg, transparent, rgba(100,160,255,0.7))",
                    borderRadius: 2,
                  }}
                />
              ))}
            </>
          )}

          {/* Snow */}
          {weather === "snow" && (
            <>
              <div className="absolute top-2 right-3 text-3xl select-none">
                ❄️
              </div>
              {SNOW_FLAKES.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ y: -20, opacity: 0, x: 0 }}
                  animate={{
                    y: "100vh",
                    opacity: [0, 0.8, 0],
                    x: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: f.dur,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: f.delay,
                    ease: "linear",
                  }}
                  className="absolute top-0 text-white select-none"
                  style={{ left: `${f.left}%`, fontSize: f.size }}
                >
                  ❄
                </motion.div>
              ))}
            </>
          )}

          {/* Thunderstorm */}
          {weather === "thunderstorm" && (
            <>
              <div className="absolute top-2 right-3 text-3xl select-none">
                ⛈️
              </div>
              {RAIN_DROPS.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: "100vh", opacity: [0, 0.7, 0] }}
                  transition={{
                    duration: d.dur * 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: d.delay,
                    ease: "linear",
                  }}
                  className="absolute top-0"
                  style={{
                    left: `${d.left}%`,
                    width: 2,
                    height: 20,
                    background:
                      "linear-gradient(180deg, transparent, rgba(80,120,255,0.8))",
                    borderRadius: 2,
                  }}
                />
              ))}
              <motion.div
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{
                  duration: 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 4,
                }}
                className="absolute inset-0"
                style={{ background: "rgba(200,210,255,0.15)" }}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
