import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SEGMENTS = [
  "₹0",
  "₹10",
  "₹0",
  "₹20",
  "₹0",
  "₹50",
  "₹0",
  "₹100",
  "₹0",
  "₹0",
];
const SEGMENT_COUNT = SEGMENTS.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT; // 36 degrees each

// Earthy warm colors alternating
const COLORS = [
  "#c0392b", // deep red
  "#e67e22", // orange
  "#d35400", // burnt orange
  "#f39c12", // amber
  "#922b21", // dark red
  "#ca6f1e", // golden brown
  "#cb4335", // warm red
  "#e59866", // sandy
  "#a04000", // dark brown
  "#f0b27a", // light amber
];

const CURRENT_USER = "PPK";
const ADMIN_USER = "PPK";
const SPIN_COST = 5;

function getBalance(user: string): number {
  return Number.parseFloat(localStorage.getItem(`wallet_${user}`) || "0");
}
function setBalance(user: string, amount: number) {
  localStorage.setItem(`wallet_${user}`, amount.toFixed(2));
}

// Find index of a ₹0 segment to land on -- pick segment index 0 (the first ₹0)
const ZERO_SEGMENT_INDEX = 0; // SEGMENTS[0] = "₹0"
// The center angle of segment at index i: i * SEGMENT_ANGLE + SEGMENT_ANGLE/2
// Pointer is at top (pointing down into wheel at 270deg from east, i.e., 12-o'clock)
// For a segment to be under the top pointer, the segment center must be at 270deg (or -90deg)
// Wheel rotation R means segment originally at angle A appears at angle (A + R)
// We want: segmentCenter + R ≡ 270 (mod 360)
// segmentCenter = ZERO_SEGMENT_INDEX * SEGMENT_ANGLE + SEGMENT_ANGLE/2 = 0*36+18 = 18
// R = 270 - 18 = 252 + 360*k
// We add 5 full rotations for effect: R = 252 + 5*360 = 2052
const ZERO_STOP_OFFSET =
  270 - (ZERO_SEGMENT_INDEX * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
// = 270 - 18 = 252

export default function SpinWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [balance, setBalanceState] = useState(() => getBalance(CURRENT_USER));
  const isAdmin = CURRENT_USER === ADMIN_USER;

  useEffect(() => {
    drawWheel(currentRotation);
  }, [currentRotation]);

  function drawWheel(rotation: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer glow ring
    const grd = ctx.createRadialGradient(
      cx,
      cy,
      radius - 8,
      cx,
      cy,
      radius + 10,
    );
    grd.addColorStop(0, "rgba(230, 126, 34, 0.8)");
    grd.addColorStop(1, "rgba(230, 126, 34, 0)");
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();

    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const startAngle = ((i * SEGMENT_ANGLE + rotation - 90) * Math.PI) / 180;
      const endAngle =
        (((i + 1) * SEGMENT_ANGLE + rotation - 90) * Math.PI) / 180;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(
        ((i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2 + rotation - 90) * Math.PI) /
          180,
      );
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px Arial";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 3;
      ctx.fillText(SEGMENTS[i], radius - 10, 6);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, 2 * Math.PI);
    const centerGrd = ctx.createRadialGradient(cx - 5, cy - 5, 0, cx, cy, 32);
    centerGrd.addColorStop(0, "#f5cba7");
    centerGrd.addColorStop(1, "#e67e22");
    ctx.fillStyle = centerGrd;
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#5d2e0c";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🎡", cx, cy + 5);
  }

  function handleSpin() {
    if (spinning) return;

    if (!isAdmin) {
      const bal = getBalance(CURRENT_USER);
      if (bal < SPIN_COST) {
        toast.error("अपर्याप्त बैलेंस। spin के लिए ₹5 चाहिए");
        return;
      }
      // Deduct ₹5
      const newBal = bal - SPIN_COST;
      setBalance(CURRENT_USER, newBal);
      setBalanceState(newBal);
      // Add ₹5 to admin
      const adminBal = getBalance("admin");
      setBalance("admin", adminBal + SPIN_COST);
    }

    setSpinning(true);

    // Always land on ₹0
    // Calculate final rotation: current + 5 full rotations + offset to land on ₹0
    // We need final rotation such that (finalRot mod 360) gives ₹0 at top pointer
    const fullRotations = 5 * 360;
    // We want: (currentRotation + totalSpin) mod 360 = ZERO_STOP_OFFSET + 360 (to ensure positive)
    const targetRemainder = ((ZERO_STOP_OFFSET % 360) + 360) % 360;
    const currentRemainder = ((currentRotation % 360) + 360) % 360;
    let extraDegrees = targetRemainder - currentRemainder;
    if (extraDegrees <= 0) extraDegrees += 360;
    const totalSpin = fullRotations + extraDegrees;
    const finalRotation = currentRotation + totalSpin;

    // Animate using requestAnimationFrame
    const startTime = performance.now();
    const duration = 3000;
    const startRotation = currentRotation;

    function easeOut(t: number): number {
      return 1 - (1 - t) ** 3;
    }

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const rot = startRotation + easedProgress * totalSpin;
      drawWheel(rot);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentRotation(finalRotation);
        setSpinning(false);
        toast.error("😔 इस बार ₹0 मिले! फिर कोशिश करो!");
      }
    }

    requestAnimationFrame(animate);
  }

  return (
    <div
      className="flex flex-col items-center gap-5 py-4"
      data-ocid="spinwheel.panel"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-foreground">🎡 भाग्य चक्र</h2>
        <p className="text-base text-muted-foreground mt-1">
          घुमाओ और किस्मत आज़माओ!
        </p>
      </div>

      {/* Balance + Admin badge */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div
          className="bg-primary/10 border border-primary/30 rounded-xl px-5 py-2 text-center"
          data-ocid="spinwheel.panel"
        >
          <span className="text-sm text-muted-foreground block">मेरा बैलेंस</span>
          <span className="text-2xl font-black text-primary">
            ₹{balance.toFixed(2)}
          </span>
        </div>
        {isAdmin && (
          <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl px-5 py-2 flex items-center gap-2">
            <span className="text-xl">👑</span>
            <span className="font-black text-amber-700 text-base">
              Admin - Free Spin!
            </span>
          </div>
        )}
        {!isAdmin && (
          <div className="bg-muted/60 border border-border rounded-xl px-5 py-2 text-center">
            <span className="text-sm text-muted-foreground block">
              Spin का खर्च
            </span>
            <span className="text-2xl font-black text-foreground">
              ₹{SPIN_COST}
            </span>
          </div>
        )}
      </div>

      {/* Pointer */}
      <div className="relative">
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: "36px solid #e67e22",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
            position: "absolute",
            top: -10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        />

        {/* Canvas wheel */}
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          style={{
            borderRadius: "50%",
            boxShadow:
              "0 8px 32px rgba(230, 126, 34, 0.5), 0 0 0 6px rgba(230,126,34,0.15)",
            display: "block",
            marginTop: 26,
          }}
        />
      </div>

      {/* Spin button */}
      <button
        type="button"
        onClick={handleSpin}
        disabled={spinning}
        data-ocid="spinwheel.button"
        style={{
          background: spinning
            ? "linear-gradient(135deg, #bdc3c7, #95a5a6)"
            : "linear-gradient(135deg, #e67e22, #c0392b, #e67e22)",
          backgroundSize: "200% 200%",
          animation: spinning ? "none" : "shimmer 2s infinite",
        }}
        className="w-full max-w-xs text-white text-2xl font-black py-5 rounded-2xl shadow-lg disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {spinning ? (
          <span className="flex items-center justify-center gap-2">
            <span
              style={{
                display: "inline-block",
                animation: "spin 1s linear infinite",
              }}
            >
              🎡
            </span>
            घूम रहा है...
          </span>
        ) : (
          "🎡 घुमाओ!"
        )}
      </button>

      {!isAdmin && (
        <p className="text-sm text-muted-foreground text-center">
          हर spin पर ₹5 आपके wallet से कटेंगे
        </p>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
