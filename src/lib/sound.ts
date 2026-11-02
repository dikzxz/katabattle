"use client";

type SoundName = "tick" | "correct" | "wrong" | "opponent" | "hint" | "win" | "lose";

let context: AudioContext | null = null;
let muted = false;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    context = new AudioContextClass();
  }
  return context;
}

export async function unlockAudio(): Promise<void> {
  if (typeof window === "undefined") return;
  const savedMute = window.localStorage.getItem("katabattle-muted");
  muted = savedMute === "true";
  const audio = getContext();
  if (audio?.state === "suspended") await audio.resume();
}

export function isMuted(): boolean {
  if (typeof window !== "undefined") muted = window.localStorage.getItem("katabattle-muted") === "true";
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  if (typeof window !== "undefined") window.localStorage.setItem("katabattle-muted", String(value));
}

function tone(frequency: number, duration: number, wave: OscillatorType = "sine", delay = 0, volume = 0.12): void {
  const audio = getContext();
  if (!audio || muted) return;
  const now = audio.currentTime + delay;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

export function playSound(name: SoundName, step = 0): void {
  switch (name) {
    case "tick": tone(340 + Math.min(step, 12) * 24, 0.075, "sine", 0, 0.07); break;
    case "correct": tone(660, 0.2, "sine", 0, 0.12); tone(880, 0.28, "sine", 0.13, 0.11); break;
    case "wrong": tone(155, 0.19, "triangle", 0, 0.09); break;
    case "opponent": tone(520, 0.12, "sine", 0, 0.07); tone(700, 0.13, "sine", 0.08, 0.06); break;
    case "hint": tone(740, 0.12, "sine", 0, 0.07); tone(1100, 0.2, "sine", 0.1, 0.06); break;
    case "win": tone(523, 0.28, "triangle", 0, 0.1); tone(659, 0.28, "triangle", 0.16, 0.1); tone(784, 0.4, "triangle", 0.32, 0.11); break;
    case "lose": tone(440, 0.22, "triangle", 0, 0.08); tone(330, 0.34, "triangle", 0.17, 0.08); break;
  }
}
