import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
import { useState } from "react";
import MoneyRain from "./MoneyRain";

interface LoginPageProps {
  onGuestMode: () => void;
  onRegistered?: () => void;
}

export default function LoginPage({
  onGuestMode,
  onRegistered,
}: LoginPageProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("कृपया अपना नाम लिखें");
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      setError("कृपया 10 अंकों का सही मोबाइल नंबर लिखें");
      return;
    }
    const profile = {
      name: name.trim(),
      mobile: mobile.trim(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("mk_user_profile", JSON.stringify(profile));
    if (onRegistered) {
      onRegistered();
    } else {
      onGuestMode();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "oklch(0.97 0.02 68)" }}
    >
      <MoneyRain />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm mx-auto px-4 flex flex-col items-center gap-6"
      >
        {/* Brand */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <span className="text-5xl coin-spin" aria-hidden="true">
            💰
          </span>
          <h1
            className="text-4xl font-black gold-shimmer-text text-center"
            style={{ color: "oklch(0.62 0.09 66)" }}
          >
            Money Kingdom
          </h1>
          <p
            className="text-base text-center"
            style={{ color: "oklch(0.5 0.07 66)" }}
          >
            आपका वित्तीय साम्राज्य शुरू करें
          </p>
        </div>

        {/* Registration Card */}
        <div
          className="w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
          style={{
            background: "white",
            border: "1.5px solid oklch(0.88 0.04 68)",
          }}
          data-ocid="onboarding.panel"
        >
          <h2
            className="text-xl font-bold text-center"
            style={{ color: "oklch(0.35 0.07 66)" }}
          >
            अपना खाता बनाएं
          </h2>

          {/* Name field */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="reg-name"
              style={{
                color: "oklch(0.45 0.07 66)",
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              आपका नाम
            </Label>
            <Input
              id="reg-name"
              type="text"
              placeholder="जैसे: Raj Kumar"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="h-12 text-base rounded-lg"
              style={{ borderColor: "oklch(0.75 0.07 68)", fontSize: "16px" }}
              data-ocid="onboarding.input"
            />
          </div>

          {/* Mobile field */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="reg-mobile"
              style={{
                color: "oklch(0.45 0.07 66)",
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              मोबाइल नंबर
            </Label>
            <Input
              id="reg-mobile"
              type="tel"
              placeholder="10 अंकों का मोबाइल नंबर"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                setError("");
              }}
              className="h-12 text-base rounded-lg"
              style={{ borderColor: "oklch(0.75 0.07 68)", fontSize: "16px" }}
              data-ocid="onboarding.input"
            />
          </div>

          {error && (
            <p
              className="text-sm text-red-600 text-center"
              data-ocid="onboarding.error_state"
            >
              {error}
            </p>
          )}

          <Button
            className="w-full h-12 text-lg font-bold rounded-xl text-white mt-1"
            style={{ background: "oklch(0.62 0.09 66)" }}
            onClick={handleSubmit}
            data-ocid="onboarding.submit_button"
          >
            शुरू करें →
          </Button>
        </div>

        <p
          className="text-center text-sm"
          style={{ color: "oklch(0.6 0.05 66)" }}
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
      </motion.div>
    </div>
  );
}
