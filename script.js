// 🔗 ELEMENTS
const lights = document.getElementById("lights");
const musicBtn = document.getElementById("music");
const celebrate = document.getElementById("celebrate");
const voice = document.getElementById("voice");
const gift = document.getElementById("gift");
const cake = document.getElementById("cake");
const flame = document.getElementById("flame");
const message = document.getElementById("message");
const song = document.getElementById("song");

// Hide start elements
gift.style.display = "none";
cake.style.display = "none";
message.style.display = "none";
voice.style.display = "none";
celebrate.style.display = "none";

// 🌟 Loader
window.onload = () => {
  document.querySelector(".loading").style.display = "none";
};

// 🌌 STARS
for (let i = 0; i < 120; i++) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * 100 + "vw";
  star.style.top = Math.random() * 100 + "vh";
  document.querySelector(".stars").appendChild(star);
}

// 🎆 FIREWORKS
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

function bigFireworkBurst() {
  const x = canvas.width / 2;
  const y = canvas.height / 3;
  for (let i = 0; i < 120; i++) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${Math.random() * 360},100%,60%)`;
    ctx.fill();
  }
  setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 600);
}

// 🎛 BUTTONS
// lights.onclick = () => {
//   document.body.style.background = "#FFDAB9";
//   lights.innerText = "Lights On";
//   celebrate.style.display = "inline";
// };
let lightsOn = false;

lights.onclick = () => {

  lightsOn = !lightsOn;   // toggle state

  if (lightsOn) {
    // 💡 LIGHTS ON
    document.body.style.background = "#FFDAB9";
    lights.innerText = "Turn Off Lights";
    celebrate.style.display = "inline";

    // Optional glow effect
    document.querySelectorAll(".bulb").forEach(b => {
      b.style.filter = "drop-shadow(0 0 10px gold)";
    });

  } else {
    // 🌙 LIGHTS OFF
    document.body.style.background = "#000";
    lights.innerText = "Turn On Lights";
    celebrate.style.display = "none";

    document.querySelectorAll(".bulb").forEach(b => {
      b.style.filter = "none";
    });
  }
};


musicBtn.onclick = () => {
  if (song.paused) {
    song.play();
    musicBtn.innerText = "Pause Music";
  } else {
    song.pause();
    musicBtn.innerText = "Resume Music";
  }
};

celebrate.onclick = () => {
  gift.style.display = "block";
  voice.style.display = "inline";
};

// 🎁 GIFT → 🎂 CAKE + MESSAGE
gift.onclick = async () => {
  gift.style.display = "none";
  cake.style.display = "block";

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioCtx = new AudioContext();
  const mic = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  mic.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);

  function detectBlow() {
    analyser.getByteFrequencyData(data);
    const volume = data.reduce((a, b) => a + b) / data.length;

    if (volume > 50) {
      flame.classList.add("out");
      message.style.display = "block";
      showMessageStory(messageLines, message);
      bigFireworkBurst();
      setTimeout(() => {
        document.querySelector(".sunrise").classList.add("show");
      }, 15000);
      return;
    }

    requestAnimationFrame(detectBlow);
  }

  detectBlow();
};

// 💌 STORY MESSAGE
const messageLines = [
"Today feels as beautiful as any other day, but it shines differently because it’s your day, Vishnupriya.",
"Another year has passed so quickly, yet every moment with you has filled my life with more love, meaning, and happiness.",
"You are not just my wife, you are my comfort, my strength, and the most precious part of my life.",
"I wish you peace in your heart, a smile that never fades, and success in everything you dream of.",
"May this year bring you closer to all your wishes and fill your days with laughter and love.",
"No matter what life brings, I am always by your side.",
"Happy Birthday, my dear Vishnupriya ❤️🎂✨"
];

function showMessageStory(lines, element) {
  let i = 0;

  function showNext() {
    if (i >= lines.length) return;

    // Set text
    element.innerHTML = lines[i];
    element.style.opacity = "0";

    // Fade in
    setTimeout(() => {
      element.style.transition = "opacity 1s";
      element.style.opacity = "1";
    }, 100);

    // Stay visible → then fade out → next
    setTimeout(() => {
      element.style.opacity = "0";
      i++;
      setTimeout(showNext, 1000); // wait for fade out
    }, 4000); // time text stays
  }

  showNext();
}


// 🎙 VOICE

let currentSpeech = null;
let musicWasPlaying = false;
let voiceState = "idle"; // idle | speaking | paused

voice.onclick = () => {

  // 🎙 If voice is speaking → pause
  if (voiceState === "speaking") {
    speechSynthesis.pause();
    voice.innerText = "Resume Voice";
    voiceState = "paused";
    return;
  }

  // ▶ If paused → resume
  if (voiceState === "paused") {
    speechSynthesis.resume();
    voice.innerText = "Pause Voice";
    voiceState = "speaking";
    return;
  }

  // 🆕 Start new voice
  musicWasPlaying = !song.paused;
  song.pause();

  currentSpeech = new SpeechSynthesisUtterance(
    "Happy Birthday my love. May your life be filled with happiness, smiles, and beautiful moments."
  );

  // Load voices safely
  const voices = speechSynthesis.getVoices();
  if (voices.length > 0) currentSpeech.voice = voices[0];

  currentSpeech.onend = () => {
    voice.innerText = "Voice Message";
    voiceState = "idle";
    if (musicWasPlaying) song.play();
  };

  currentSpeech.onerror = () => {
    voice.innerText = "Voice Message";
    voiceState = "idle";
  };

  speechSynthesis.speak(currentSpeech);
  voice.innerText = "Pause Voice";
  voiceState = "speaking";
};

