// Web Audio API based sound effects - no external files needed

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  gainValue = 0.3,
  delay = 0,
) {
  try {
    const ctx = getAudioCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(
      gainValue,
      ctx.currentTime + delay + 0.01,
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + delay + duration,
    );

    oscillator.start(ctx.currentTime + delay);
    oscillator.stop(ctx.currentTime + delay + duration);
  } catch {
    // silently ignore if audio context fails
  }
}

export function playLikeSound() {
  // Happy double-beep: high-pitched cheerful
  playTone(880, 0.12, "sine", 0.25, 0);
  playTone(1100, 0.15, "sine", 0.2, 0.1);
}

export function playCommentSound() {
  // Soft notification chime: two notes
  playTone(660, 0.15, "sine", 0.2, 0);
  playTone(880, 0.18, "sine", 0.18, 0.12);
}

export function playShareSound() {
  // Whoosh-like ascending tones
  playTone(440, 0.1, "sine", 0.2, 0);
  playTone(660, 0.1, "sine", 0.2, 0.08);
  playTone(880, 0.12, "sine", 0.18, 0.16);
}

export function playFollowSound() {
  // Celebratory 3-note jingle
  playTone(523, 0.12, "sine", 0.25, 0);
  playTone(659, 0.12, "sine", 0.25, 0.1);
  playTone(784, 0.2, "sine", 0.25, 0.2);
}
